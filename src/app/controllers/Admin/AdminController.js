const Product = require('../../models/Product');
const User = require('../../models/User');
const Order = require('../../models/Order');
const jwt = require('jsonwebtoken');

class AdminController {
    // [GET] /admin
    index(req, res, next) {
        res.render('admin/index', { layout: 'admin.hbs' });
    };
    // [GET] /admin/home
    home(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Promise.all([
                    Order.countDocumentsWithDeleted({ status: 1 }),
                    Order.countDocumentsWithDeleted({ status: 2 }),
                    Order.countDocumentsWithDeleted({ status: 3 }),
                    Order.countDocumentsWithDeleted({ status: 0 }),
                    Order.countDocumentsWithDeleted({}),
                    User.countDocumentsWithDeleted({}),
                ])
                .then(([
                    orderFinished,
                    orderWarning,
                    orderSuccess,
                    orderFailed,
                    sumOrder,
                    sumUser
                ]) => {
                    return res.send({
                        orderFinished,
                        orderWarning,
                        orderSuccess,
                        orderFailed,
                        sumOrder,
                        sumUser
                    })
                })
                .catch((err) => {
                    throw new Error('Error connecting DB!');
                })
        } catch (e) {
            return res.send({
                message: e
            })
        }
    };
    // [GET] /admin/*
    notfound(req, res, next) {
        res.render('admin/notfound', { layout: false });
    };
}
module.exports = new AdminController;