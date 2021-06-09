const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { sendCodeMail, sendWelcomeMail, sendNewPasswordMail, sendActiveMail } = require('../../util/email/email');
const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');
const { randomToBetween, randomCharacter } = require('../../helper/random');

class ApiUserController {
    // // [POST] /api/checkLogin
    // checkLogin(req, res, next){
    //     const token = req.header('Authorization').replace("Bearer ", "");
    //     try{
    //         const decoded = jwt.verify(token, "electroStore");
    //         Account.findOne({slug: decoded._id, token: token})
    //             .then(account => {
    //                 if(account != null){
    //                     res.send({message : true})
    //                 }
    //                 else{
    //                     res.send({message : false})
    //                 }
    //             })
    //             .catch(next)
    //     }
    //     catch(e){
    //         res.send({message : false})
    //     }
    // }

    // [POST] /api/login
    login(req, res, next) {
        User.findOneWithDeleted({
                email: req.body.email,
            })
            .then(user => {
                if (!user) {
                    return res.send({ login: false, message: "Tài khoản chưa đăng ký!" });
                };
                if (!user.active) {
                    let temp = new User(user);
                    temp.activeToken = Date.now() + randomCharacter(16);
                    temp.save();
                    sendActiveMail(user.email, temp.activeToken);
                    return res.send({ login: false, message: "Tài khoản của bạn chưa được kích hoạt, vui lòng kiểm tra email để kích hoạt tài khoản!" });
                }
                if (user.deleted) {
                    return res.send({ login: false, message: "Tài khoản của bạn bị khóa, vui lòng liên hệ Admin để hổ trợ!" });
                }
                let isValid = bcrypt.compareSync(req.body.password, user.password);
                if (!isValid) {
                    return res.send({ login: false, message: "Tài khoản hoặc mật khẩu không chính xác!" });
                }
                if (user.decentralization == 1) {
                    return res.send({
                        _slug: user.slug,
                        type: 'user',
                        name: user.fullname,
                        token: "Bearer " + user.token,
                        login: true,
                        message: "Đăng nhập thành công!"
                    });
                } else {
                    return res.send({
                        _slug: user.slug,
                        type: 'admin',
                        name: user.fullname,
                        token: "Bearer " + user.token,
                        login: true,
                        message: "Đăng nhập thành công!"
                    });
                }
            })
            .catch(next)
    };
    // [POST] /api/register
    register(req, res, next) {
        const formData = req.body;
        Promise.all([
                User.findOneWithDeleted({ email: req.body.email }),
                User.findOneWithDeleted({ phone: req.body.phone }),
            ])
            .then(([userEmail, userPhone]) => {
                let validate = {};
                if (userEmail !== null) {
                    validate.userEmail = false;
                    validate.messageEmail = "Email này đã đăng ký!"
                }
                if (userPhone !== null) {
                    validate.userPhone = false;
                    validate.messagePhone = "Số điện thoại này đã đăng ký!"
                }
                if (Object.keys(validate).length > 0) {
                    validate.userEmail = (validate.userEmail === false) ? validate.userEmail : true;
                    validate.userPhone = (validate.userPhone === false) ? false : true;
                    validate.register = false;
                    return res.send(validate);
                } else {
                    formData.password = bcrypt.hashSync(req.body.password, 8);
                    const user = new User(req.body);
                    user.save()
                        .then((user) => {
                            user.token = jwt.sign({ _id: user.slug }, "electroStore");
                            user.activeToken = Date.now() + '.' + randomCharacter(16);
                            return user.save();
                        })
                        .then((user) => {
                            sendWelcomeMail(user.email, user.fullname);
                            sendActiveMail(user.email, user.activeToken);
                            return res.send({
                                message: "Đăng ký thành công, vui lòng kiểm tra email để kích hoạt tài khoản!",
                                register: true,
                            });
                        })
                        .catch(next)
                }
            })
            .catch(next)
    };
    // [POST] /api/checkEmail
    checkEmail(req, res, next) {
        User.findOneWithDeleted({ email: req.body.email })
            .then(user => {
                if (user !== null) {
                    user.otp = randomToBetween(process.env.RANDOM_MIN, process.env.RANDOM_MAX);
                    user.token = jwt.sign({ _id: user.slug }, "electroStore");
                    User.updateOne({ _id: user._id }, user)
                        .then(() => {
                            try {
                                sendCodeMail(user.email, user.otp);
                                return res.send({
                                    checkEmail: true,
                                    message: "Đã gửi mã OTP, vui lòng kiểm tra email!"
                                });
                            } catch (e) {
                                console.log(e)
                            }
                        })
                } else {
                    return res.send({
                        checkEmail: false,
                        message: "Email chưa đăng ký!"
                    });
                }
            })
            .catch(next)
    };
    // [POST] /api/sendNewPassword
    sendNewPassword(req, res, next) {
        User.findOneWithDeleted({ email: req.body.email })
            .then(user => {
                if (user !== null) {
                    if (user.otp == null || user.otp == "null") {
                        return res.send({
                            newPassword: false,
                            message: "Vui lòng lấy mã OTP!"
                        });
                    } else if (user.otp != req.body.otp) {
                        return res.send({
                            newPassword: false,
                            message: "Mã OTP không chính xác!"
                        });
                    } else {
                        let newPassword = randomCharacter(10);
                        user.password = bcrypt.hashSync(newPassword, 8);
                        user.otp = null;
                        user.token = jwt.sign({ _id: user.slug }, "electroStore");
                        User.updateOne({ _id: user._id }, user)
                            .then(() => {
                                try {
                                    sendNewPasswordMail(user.email, newPassword);
                                    return res.send({
                                        newPassword: true,
                                        message: "Đã gửi mật khẩu mới, vui lòng kiểm tra email!"
                                    });
                                } catch (e) {
                                    console.log(e)
                                }
                            })
                    }
                } else {
                    return res.send({
                        newPassword: false,
                        message: "Email chưa đăng ký!"
                    });
                }
            })
            .catch(next)
    };
    // // [POST] /api/getProfile/changePassword
    // changePassword(req, res, next){
    //     const token = req.header('Authorization').replace("Bearer ", "");
    //     //const token = jwt.sign({_id: "nguyen_van_trong"}, "electroStore")
    //     try{
    //         const decoded = jwt.verify(token, "electroStore");
    //         Account.findOne({slug: decoded._id, token: token})
    //             .then(account => {
    //                 var isPass = bcrypt.compareSync(req.body.oldPassword, account.password);
    //                 var objPass = {
    //                     oldPassword: req.body.oldPassword,
    //                     passwordNew: req.body.passwordNew,
    //                     passwordConfirm: req.body.passwordConfirm,
    //                 }
    //                 if(isPass){
    //                     if(objPass.passwordNew === objPass.passwordConfirm && objPass.passwordNew.length > 2){
    //                         const hash = bcrypt.hashSync(objPass.passwordNew, 8);
    //                         account.password = hash;
    //                         account.save();
    //                         return res.send({message : true});
    //                     }
    //                 }
    //                 return res.send({message : false})
    //             })
    //             .catch(next)
    //     }
    //     catch(e){
    //         res.send({message : false})
    //     }
    // }
    // [GET] /api/getProfile
    getProfile(req, res, next) {
            const token = req.header('Authorization').replace("Bearer ", "");
            //const token = jwt.sign({_id: "nguyen_van_trong"}, "electroStore")
            try {
                const decoded = jwt.verify(token, "electroStore");
                User.findOne({ slug: decoded._id, token: token })
                    .then(account => {
                        return res.send({
                            fullname: account.fullname,
                            address: account.address,
                            email: account.email,
                            phone: account.phone
                        });
                    })
                    .catch(next)
            } catch (e) {
                res.send({ message: false })
            }

        }
        // getAddress(req, res, next){
        //     res.send({message: false})
        // }
        // setAddress(req, res, next){
        //     res.send({message: false})
        // }
}
module.exports = new ApiUserController;