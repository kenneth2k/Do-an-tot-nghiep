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
                try {
                    if (user != null) {
                        user.active = true;
                        user.activeToken = null;
                        User.updateOne({ slug: user.slug }, user, function(err, res) {
                            if (err) {
                                throw new Error(err);
                            }
                        });
                        return res.render('home/active', { layout: false });
                    }
                    throw new Error("Active user not found");
                } catch (err) {
                    return res.render('home/notfound', { layout: false });
                }
            })
            .catch(next)
    };
}
module.exports = new UserController;