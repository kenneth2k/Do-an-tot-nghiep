const Phone = require('../models/Phone');
const Account = require('../models/Account');
const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');

class HomeController {
    // [GET] /
    index(req, res, next) {

        Phone.find({})
            .then(phones => {
                res.render('home/index', { phones: multipleMongooseToObject(phones) });
            })
            .catch(next)

    }

    // [GET] /:categori/:slug
    show(req, res, next) {
        Promise.all([Phone.findOne({
            slug: req.params.slug,
            categori: req.params.categori
        }), Phone.find({})])
            .then(([phone, phones]) => {
                if (phone) {
                    res.render('home/detail', {
                        phone: singleMongooseToObject(phone),
                        phones: multipleMongooseToObject(phones),
                    });
                }
                else {
                    res.redirect('/')
                }
            })
            .catch(next)
    }

    // [GET] /cart
    showCart(req, res, next) {
        res.render('home/cart');
    }

    // [GET] /payment
    showPayment(req, res, next) {
        res.render('home/payment');
    }

    // [GET] /payment/success
    showPaymentSuccess(req, res, next) {
        res.render('home/paymentsuccess');
    }

    // [GET] /search
    showSearch(req, res, next) {
        res.render('home/search');
    }

    // [GET] /profile/:slug
    showProfile(req, res, next) {

        Account.findOne({
            slug: req.params.slug
        })
            .then(account => {
                res.render('home/profile', {
                    account: singleMongooseToObject(account),
                });
            })
            .catch(next)
    }

    show404(req, res, next) {
        res.render('home/notfound');
    }
}
module.exports = new HomeController;