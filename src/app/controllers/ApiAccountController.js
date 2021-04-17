const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Account = require('../models/Account');
const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');

class ApiAccountController{

    // [POST] /api/checkLogin
    checkLogin(req, res, next){
        const token = req.header('Authorization').replace("Bearer ", "");
        try{
            const decoded = jwt.verify(token, "electroStore");
            Account.findOne({slug: decoded._id, token: token})
                .then(account => {
                    if(account != null){
                        res.send({message : true})
                    }
                    else{
                        res.send({message : false})
                    }
                })
                .catch(next)
        }
        catch(e){
            res.send({message : false})
        }
    }

    // [POST] /api/login
    login(req, res, next){
        Account.findOne({
            email: req.body.email,
        })
            .then(account => {
                if(!account) {
                    return res.send({message: false});
                };

                let isValid =  bcrypt.compareSync(req.body.password, account.password);
                if(!isValid) {
                    return res.send({message: false});
                }
                res.send({
                    _slug: account.slug,
                    name: account.fullname,
                    token: "Bearer " + account.token,
                    message: true
                });
            })
            .catch(next)
    }
    // [POST] /api/getProfile/changePassword
    changePassword(req, res, next){
        const token = req.header('Authorization').replace("Bearer ", "");
        //const token = jwt.sign({_id: "nguyen_van_trong"}, "electroStore")
        try{
            const decoded = jwt.verify(token, "electroStore");
            Account.findOne({slug: decoded._id, token: token})
                .then(account => {
                    var isPass = bcrypt.compareSync(req.body.oldPassword, account.password);
                    var objPass = {
                        oldPassword: req.body.oldPassword,
                        passwordNew: req.body.passwordNew,
                        passwordConfirm: req.body.passwordConfirm,
                    }
                    if(isPass){
                        if(objPass.passwordNew === objPass.passwordConfirm && objPass.passwordNew.length > 2){
                            const hash = bcrypt.hashSync(objPass.passwordNew, 8);
                            account.password = hash;
                            account.save();
                            return res.send({message : true});
                        }
                    }
                    return res.send({message : false})
                })
                .catch(next)
        }
        catch(e){
            res.send({message : false})
        }
    }
    // [POST] /api/getProfile
    getProfile(req, res, next){
        const token = req.header('Authorization').replace("Bearer ", "");
        //const token = jwt.sign({_id: "nguyen_van_trong"}, "electroStore")
        try{
            const decoded = jwt.verify(token, "electroStore");
            Account.findOne({slug: decoded._id, token: token})
                .then(account => {
                    res.send({
                        fullname: account.fullname,
                        gender: account.gender,
                        phone: account.phone,
                        address: account.address[0],
                        dateOfBirth: account.dateOfBirth.getFullYear() + '-' + (account.dateOfBirth.getMonth() + 1) + '-' + account.dateOfBirth.getDate(),
                    })
                })
                .catch(next)
        }
        catch(e){
            res.send({message : false})
        }
       
    }
    getAddress(req, res, next){
        res.send({message: false})
    }
    setAddress(req, res, next){
        res.send({message: false})
    }
    
}
module.exports = new ApiAccountController;