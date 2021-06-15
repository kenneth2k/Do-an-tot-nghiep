const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { sendCodeMail, sendWelcomeMail, sendNewPasswordMail, sendActiveMail } = require('../../util/email/email');
const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');
const { randomToBetween, randomCharacter } = require('../../helper/random');

class ApiUserController {
    // [GET] /api/checkLogin
    checkLogin(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            User.findOne({ slug: decoded._id, token: token })
                .then(account => {
                    if (account != null) {
                        return res.send({ resetLogin: false });
                    } else {
                        return res.send({ resetLogin: true });
                    }
                })
                .catch(next)
        } catch (e) {
            return res.send({ resetLogin: true })
        }
    }

    // [POST] /api/login
    login(req, res, next) {
        User.findOneWithDeleted({
                email: req.body.email,
            })
            .then(user => {
                try {
                    if (!user) {
                        return res.send({ login: false, message: "Tài khoản chưa đăng ký!" });
                    } else if (!user.active) {
                        user.activeToken = Date.now() + randomCharacter(16);
                        User.updateOne({ slug: user.slug }, user, function(err, res) {
                            if (err) {
                                throw new Error(err);
                            }
                        });
                        sendActiveMail(user.email, user.activeToken);
                        return res.send({ login: false, message: "Tài khoản của bạn chưa được kích hoạt, vui lòng kiểm tra email để kích hoạt tài khoản!" });
                    } else if (user.deleted) {
                        return res.send({ login: false, message: "Tài khoản của bạn bị khóa, vui lòng liên hệ Admin để hổ trợ!" });
                    } else if (user) {
                        let isValid = bcrypt.compareSync(req.body.password, user.password);
                        if (!isValid) {
                            return res.send({ login: false, message: "Tài khoản hoặc mật khẩu không chính xác!" });
                        } else if (user.decentralization == 1) {
                            return res.send({
                                _slug: user.slug,
                                type: 'user',
                                name: user.fullname,
                                token: "Bearer " + user.token,
                                login: true,
                                message: "Đăng nhập thành công!"
                            });
                        } else if (user.decentralization == 2) {
                            return res.send({
                                _slug: user.slug,
                                type: 'admin',
                                name: user.fullname,
                                token: "Bearer " + user.token,
                                login: true,
                                message: "Đăng nhập thành công!"
                            });
                        }
                    }
                } catch (err) {
                    return res.send({ login: false, message: err.message });
                }
            })
            .catch(next)
    };
    // [POST] /api/register
    register(req, res, next) {
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
                    req.body.password = bcrypt.hashSync(req.body.password, 8);
                    let tempAddress = [];
                    tempAddress.push({
                        address: req.body.address,
                        phone: req.body.phone,
                        name: req.body.fullname,
                        active: true
                    });
                    const user = new User({
                        fullname: req.body.fullname,
                        email: req.body.email,
                        phone: req.body.phone,
                        addresses: tempAddress,
                        password: req.body.password
                    });
                    user.save()
                        .then((user) => {
                            user.token = jwt.sign({ _id: user.slug }, process.env.EPHONE_STORE_PRIMARY_KEY);
                            user.activeToken = Date.now() + '.' + randomCharacter(16);
                            return user.save();
                        })
                        .then((user) => {
                            Promise.all([
                                    sendWelcomeMail(user.email, user.fullname),
                                    sendActiveMail(user.email, user.activeToken)
                                ])
                                .then((welcome, active) => {
                                    return res.send({
                                        message: "Đăng ký thành công, vui lòng kiểm tra email để kích hoạt tài khoản!",
                                        register: true,
                                    });
                                })
                                .catch(next)
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
                    user.token = jwt.sign({ _id: user.slug }, process.env.EPHONE_STORE_PRIMARY_KEY);
                    User.updateOne({ _id: user._id }, user)
                        .then(() => {
                            try {
                                sendCodeMail(user.email, user.otp);
                                return res.send({
                                    checkEmail: true,
                                    message: "Đã gửi mã OTP, vui lòng kiểm tra email!"
                                });
                            } catch (e) {
                                throw new Error(e)
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
    // [PUT] /api/sendNewPassword
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
                        user.token = jwt.sign({ _id: user.slug }, process.env.EPHONE_STORE_PRIMARY_KEY);
                        User.updateOne({ _id: user._id }, user)
                            .then(() => {
                                sendNewPasswordMail(user.email, newPassword);
                                return res.send({
                                    newPassword: true,
                                    message: "Đã gửi mật khẩu mới, vui lòng kiểm tra email!"
                                });
                            })
                            .catch(next)
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
    // [PUT] /api/getProfile/changePassword
    changePassword(req, res, next) {
        //const token = jwt.sign({_id: "nguyen_van_trong"}, "electroStore")
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            User.findOne({ slug: decoded._id, token: token })
                .then(account => {
                    var isPass = bcrypt.compareSync(req.body.oldPassword, account.password);
                    var objPass = {
                        oldPassword: req.body.oldPassword,
                        passwordNew: req.body.passwordNew,
                        passwordConfirm: req.body.passwordConfirm,
                    }
                    if (isPass) {
                        if (objPass.passwordNew === objPass.passwordConfirm && objPass.passwordNew.length > 2) {
                            const hash = bcrypt.hashSync(objPass.passwordNew, 8);
                            account.password = hash;
                            User.updateOne({ _id: account._id }, account)
                                .then(() => {
                                    return res.send({
                                        changePassword: true,
                                        message: 'Cập nhật mật khẩu mới thành công!'
                                    });
                                })
                                .catch(next)
                        }
                    } else {
                        return res.send({
                            changePassword: false,
                            message: 'Mật khẩu cũ không chính xác!'
                        });
                    }
                    return res.send({
                        changePassword: false,
                        message: 'Cập nhật mật khẩu thất bại!'
                    });
                })
                .catch(next)
        } catch (e) {
            res.send({ passwordNew: false })
        }
    };
    // [GET] /api/getProfile
    getProfile(req, res, next) {
        //const token = jwt.sign({_id: "nguyen_van_trong"}, "electroStore")
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            User.findOne({ slug: decoded._id, token: token })
                .then(account => {
                    let idx = account.addresses.findIndex((item) => {
                        return item.active === true;
                    });
                    return res.send({
                        slug: account.slug,
                        fullname: account.fullname,
                        addresses: account.addresses[idx]
                    });
                })
                .catch(next)
        } catch (e) {
            res.send({ message: false })
        }

    };
    // [PUT] /api/updateProfile
    updateProfile(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            User.findOne({ slug: decoded._id, token: token })
                .then(account => {
                    try {
                        if (account) {
                            account.fullname = req.body.fullName;
                            account.phone = req.body.phone;
                            account.gender = req.body.gender;
                            account.dateOfBirth = req.body.dateOfBirth;
                            User.updateOne({ _id: account._id }, account, function(err, res) {
                                if (err) throw new Error(err);
                            });
                            return res.send({
                                message: "Cập nhật tài khoản thành công!",
                                updated: true,
                            });
                        }
                        throw new Error("Account not found!");
                    } catch (e) {
                        return res.send({
                            message: "Cập nhật tài khoản thất bại!",
                            updated: false,
                        });
                    }
                })
                .catch(next)
        } catch (e) {
            return res.send({
                message: "Cập nhật tài khoản thất bại!",
                updated: false,
            });
        }

    };
}
module.exports = new ApiUserController;