const bcrypt = require('bcryptjs');

const Account = require('../models/Account');
const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');

class ApiController{
    // [POST] /api/login
    login(req, res, next){
        Account.findOne({
            email: req.body.email,
        })
            .then(account => {
                if(!account) {
                    res.send({message: false});return;
                };

                let isValid =  bcrypt.compareSync(req.body.password, account.password);
                if(!isValid) {
                    res.send({message: false});return;
                }

                res.send({
                    _id: account._id,
                    name: account.fullname,
                    token: account.token,
                    message: true
                });
            })
            .catch(next)
    }
}
module.exports = new ApiController;