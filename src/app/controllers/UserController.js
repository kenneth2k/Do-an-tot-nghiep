const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

class UserController {
    // [POST] /active/:key
    activeUser(req, res, next) {
        User.findOne({
                active: false,
                activeToken: req.params.key
            })
            .then(user => {
                if (user) {
                    user.active = true;
                    user.activeToken = null;
                    var temp = new User(user);
                    temp.save();
                    return res.render('home/active', { layout: false });
                }
                return res.render('home/notfound', { layout: false });
            })
            .catch(next)
    };
}
module.exports = new UserController;