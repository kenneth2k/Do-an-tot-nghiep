const Product = require('../models/Product');
const User = require('../models/User');

class AdminController {
    // [GET] /admin
    index(req, res, next) {
        res.render('admin/index', { layout: 'admin.hbs' });
    };
    // [GET] /admin/*
    notfound(req, res, next) {
        res.render('admin/notfound', { layout: false });
    };
}
module.exports = new AdminController;