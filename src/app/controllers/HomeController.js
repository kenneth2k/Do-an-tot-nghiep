const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const User = require('../models/User');
const Raiting = require('../models/Raiting');
const Category = require('../models/Category');
const Order = require('../models/Order');
const { sendOrderSuccessMail } = require('../../util/email/email');
const { multipleMongooseToObject, singleMongooseToObject, multipleMongooseToObjectOnLimit } = require('../../util/mongoose');
const { randomToBetween } = require('../../helper/random');
class HomeController {
    // [GET] /
    index(req, res, next) {
        var count = 0;
        Product.find({})
            .then(products => {
                count = products.length;
            });
        Promise.all([
                Product.find({}).limit(15).skip(randomToBetween(0, ((count > 20) ? (count - 10) : 1))),
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
                }).limit(12).skip(0),
                Raiting.aggregate([{
                        $lookup: {
                            from: 'users',
                            localField: 'userSlug',
                            foreignField: 'slug',
                            as: 'userdetails'
                        }
                    },
                    { $match: { proSlug: req.params.slug } }
                ])
            ])
            .then(([phone, phones, raitings]) => {
                if (phone) {
                    res.render('home/detail', {
                        phone: singleMongooseToObject(phone),
                        productsHot: multipleMongooseToObject(phones),
                        raitings: raitings,
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

    // [GET] /payment
    showPayment(req, res, next) {
        res.render('home/payment');
    }

    // [GET] /search
    showSearch(req, res, next) {
        if (['lien-he'].includes(req.params.search)) {
            return res.render('home/contact');
        }
        let maxProduct = 12;
        if (['all'].includes(req.params.search)) {
            Promise.all([
                    Product.find({ name: { $regex: new RegExp((req.query.q ? req.query.q : ''), "i") } }).sort({
                        price: -1
                    }),
                    Category.find({ slug: { $nin: ['', 'lien-he'] } })
                ])
                .then(([products, categories]) => {
                    return res.render('home/search', {
                        categories: multipleMongooseToObject(categories),
                        totalProduct: products.length,
                        products: multipleMongooseToObjectOnLimit(products, maxProduct, 0)
                    });
                })
                .catch(next)
        } else {
            Promise.all([
                    Product.find({ categori: req.params.search }).sort({
                        price: -1
                    }),
                    Category.find({ slug: { $nin: ['', 'lien-he'] } })
                ])
                .then(([products, categories]) => {
                    return res.render('home/search', {
                        categories: multipleMongooseToObject(categories),
                        totalProduct: products.length,
                        products: multipleMongooseToObjectOnLimit(products, maxProduct, 0)
                    });
                })
        }
    }

    // [GET] /profile/:slug
    showProfile(req, res, next) {

        User.findOne({
                slug: req.params.slug
            })
            .then(account => {
                res.render('home/profile', {
                    account: singleMongooseToObject(account),
                });
            })
            .catch(next)
    };
    // [POST] /payment/success
    showPaymentSuccess(req, res, next) {
        const token = req.header('Authorization').replace("Bearer ", "");
        try {
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            let searchSlug = [];
            req.body.products.forEach(value => {
                searchSlug.push(value.slug);
            });
            Product.find({ slug: { $in: searchSlug } })
                .then(products => {
                    let sumQuantity = 0;
                    let productTemp = [];
                    let totalPrice = products.reduce((accumulator, currentValue, currentIndex) => {
                        let idxProductsOrder = null;
                        let idxDiscount = currentValue.colors.findIndex((item) => {
                            idxProductsOrder = req.body.products.findIndex((item) => {
                                return currentValue.slug === item.slug;
                            });
                            return item._id == req.body.products[idxProductsOrder].colorId;
                        });

                        let discount = (currentValue.colors[idxDiscount].quantity / 100);
                        sumQuantity += Number.parseInt(req.body.products[idxProductsOrder].quantity);

                        let price = ((currentValue.price - (currentValue.price * discount))) * Number.parseInt(req.body.products[idxProductsOrder].quantity);
                        req.body.products[idxProductsOrder].price = (currentValue.price - (currentValue.price * discount));
                        req.body.products[idxProductsOrder].colorName = currentValue.colors[idxDiscount].name;
                        productTemp.push({
                            name: currentValue.name,
                            color: currentValue.colors[idxDiscount].name,
                            quantity: Number.parseInt(req.body.products[idxProductsOrder].quantity),
                            price: (currentValue.price - (currentValue.price * discount))
                        });

                        return accumulator + price;
                    }, 0);
                    if (req.body.products.length != products.length) {
                        throw new Error("Find products failed");
                    }

                    let order = new Order({
                        slugUser: decoded._id,
                        sumQuantity: sumQuantity,
                        sumPrice: totalPrice,
                        details: req.body.products,
                    });
                    Promise.all([
                            User.findOne({ slug: decoded._id }),
                            order.save()
                        ])
                        .then(([user, order]) => {
                            sendOrderSuccessMail(order, user, productTemp);
                            return res.send({
                                status: 200,
                                _id: order._id
                            });
                        })
                        .catch(next)
                })
                .catch(next)
        } catch (e) {
            return res.send({
                status: 404,
                error: e.message
            });
        }
    }
    show404(req, res, next) {
        res.render('home/notfound', { layout: false });
    }
}
module.exports = new HomeController;