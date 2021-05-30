const Product = require('../models/Product');
const User = require('../models/User');

class AdminController {
    // [GET] /admin
    index(req, res, next) {
        res.render('admin/index', { layout: 'admin.hbs' });
    }
}
module.exports = new AdminController;