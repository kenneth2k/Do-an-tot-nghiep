const Product = require('../models/Product');
const User = require('../models/User');
const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');
const { randomToBetween } = require('../../helper/random');
class HomeController {
    // [GET] /
    index(req, res, next) {
        // Product.delete({
        //     _id: '60b4a850f120fc15a67df174'
        // }).then((err, result) => {
        //     console.log("products result", result);
        // })
        var count = 0;
        Product.find({})
            .then(products => {
                count = products.length;
            });
        Promise.all([
                Product.find({}).limit(8).skip(randomToBetween(0, ((count > 20) ? (count - 10) : 1))),
                Product.find({
                    hot: true
                }).limit(12).skip(0)
            ])
            .then(([products, productsHot]) => {
                res.render('home/index', {
                    products: multipleMongooseToObject(products),
                    productsHot: multipleMongooseToObject(productsHot),
                });
            })
            .catch(next)
    }

    // [GET] /:categori/:slug
    show(req, res, next) {
        Promise.all([
                Product.findOne({
                    slug: req.params.slug,
                    categori: req.params.categori
                }),
                Product.find({
                    categori: req.params.categori
                }).limit(12).skip(0)
            ])
            .then(([phone, phones]) => {
                if (phone) {
                    res.render('home/detail', {
                        phone: singleMongooseToObject(phone),
                        productsHot: multipleMongooseToObject(phones),
                    });
                } else {
                    res.redirect('/');
                }
            })
            .catch(next)
    }

    // [GET] /cart
    showCart(req, res, next) {
        res.render('home/cart');
    }

    // // [GET] /payment
    // showPayment(req, res, next) {
    //     res.render('home/payment');
    // }

    // // [GET] /payment/success
    // showPaymentSuccess(req, res, next) {
    //     res.render('home/paymentsuccess');
    // }

    // // [GET] /search
    // showSearch(req, res, next) {
    //     res.render('home/search');
    // }

    // // [GET] /profile/:slug
    // showProfile(req, res, next) {

    //     User.findOne({
    //             slug: req.params.slug
    //         })
    //         .then(account => {
    //             res.render('home/profile', {
    //                 account: singleMongooseToObject(account),
    //             });
    //         })
    //         .catch(next)
    // }

    show404(req, res, next) {
        res.render('home/notfound', { layout: false });
    }
}
module.exports = new HomeController;