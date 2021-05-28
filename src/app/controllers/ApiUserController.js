const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');

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
        User.findOne({
                email: req.body.email,
            })
            .then(user => {
                if (!user) {
                    return res.send({ login: false, message: "Tài khoản chưa đăng ký!" });
                };
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

        User.findOne({ email: req.body.email })
            .then(user => {
                if (user !== null) {
                    console.log(user)
                    return res.send({
                        register: false,
                        message: "Email này đã đăng ký!"
                    })
                } else {
                    formData.password = bcrypt.hashSync(req.body.password, 8);
                    const user = new User(req.body);
                    user.save()
                        .then((user) => {
                            user.token = jwt.sign({ _id: user.slug }, "electroStore");
                            return user.save();
                        })
                        .then((user) => {
                            return res.send({
                                _slug: user.slug,
                                type: 'user',
                                name: user.fullname,
                                token: "Bearer " + user.token,
                                message: "Đăng ký thành công!",
                                register: true,
                            });
                        })
                        .catch(next)
                }
            })
            .catch(next);
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
    // // [POST] /api/getProfile
    // getProfile(req, res, next){
    //     const token = req.header('Authorization').replace("Bearer ", "");
    //     //const token = jwt.sign({_id: "nguyen_van_trong"}, "electroStore")
    //     try{
    //         const decoded = jwt.verify(token, "electroStore");
    //         Account.findOne({slug: decoded._id, token: token})
    //             .then(account => {
    //                 res.send({
    //                     fullname: account.fullname,
    //                     gender: account.gender,
    //                     phone: account.phone,
    //                     address: account.address[0],
    //                     dateOfBirth: account.dateOfBirth.getFullYear() + '-' + (account.dateOfBirth.getMonth() + 1) + '-' + account.dateOfBirth.getDate(),
    //                 })
    //             })
    //             .catch(next)
    //     }
    //     catch(e){
    //         res.send({message : false})
    //     }

    // }
    // getAddress(req, res, next){
    //     res.send({message: false})
    // }
    // setAddress(req, res, next){
    //     res.send({message: false})
    // }
}
module.exports = new ApiUserController;