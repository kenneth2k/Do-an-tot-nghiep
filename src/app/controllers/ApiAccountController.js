const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Account = require('../models/Account');
const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');

class ApiAccountController{
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
                        dateOfBirth: account.dateOfBirth,
                    })
                })
                .catch(next)
        }
        catch(e){
            res.send({message : false})
        }
       
    }
}
module.exports = new ApiAccountController;