const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const User = require('../models/User');
const Raiting = require('../models/Raiting');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Banner = require('../models/Banner');
const { sendOrderSuccessMail, sendCancelOrderMail } = require('../../util/email/email');
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
                }).limit(12).skip(0),
                Banner.find({})
            ])
            .then(([products, productsHot, banners]) => {
                res.render('home/index', {
                    banners: multipleMongooseToObject(banners),
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
                ]).sort({ createdAt: -1 })
            ])
            .then(([phone, phones, raitings]) => {
                if (phone) {
                    res.render('home/detail', {
                        phone: singleMongooseToObject(phone),
                        productsHot: multipleMongooseToObject(phones),
                        raitings: raitings,
                    });
                } else {
                    next();
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
                    Category.find({ slug: { $nin: ['', 'lien-he'] } }),
                    Product.find({}).sort({ qtySeller: -1 })
                ])
                .then(([products, categories, productsSeller]) => {
                    return res.render('home/search', {
                        categories: multipleMongooseToObject(categories),
                        totalProduct: products.length,
                        products: multipleMongooseToObjectOnLimit(products, maxProduct, 0),
                        productsSeller: multipleMongooseToObjectOnLimit(productsSeller, 10)
                    });
                })
                .catch(next)
        } else {
            Promise.all([
                    Product.find({ categori: req.params.search }).sort({
                        price: -1
                    }),
                    Category.find({ slug: { $nin: ['', 'lien-he'] } }),
                    Product.find({}).sort({ qtySeller: -1 })
                ])
                .then(([products, categories, productsSeller]) => {
                    return res.render('home/search', {
                        categories: multipleMongooseToObject(categories),
                        totalProduct: products.length,
                        products: multipleMongooseToObjectOnLimit(products, maxProduct, 0),
                        productsSeller: multipleMongooseToObjectOnLimit(productsSeller, 10)
                    });
                })
        }
    }

    // [GET] /profile/:slug
    showProfile(req, res, next) {
        Promise.all([
                User.findOne({
                    slug: req.params.slug
                }),
                Order.findWithDeleted({
                    slugUser: req.params.slug,
                    status: 2
                }).sort({ createdAt: -1 }),
                Order.findWithDeleted({
                    slugUser: req.params.slug,
                    status: { $ne: 2 }
                }).sort({ createdAt: -1 })
            ])
            .then(([account, ordering, orderFinished]) => {
                account.addresses.sort((a, b) => (a.active > b.active) ? -1 : ((b.active > a.active) ? 1 : 0));
                res.render('home/profile', {
                    account: singleMongooseToObject(account),
                    orders: multipleMongooseToObject(ordering.concat(orderFinished))
                });
            })
            .catch(next)
    };
    // [POST] /payment/success
    showPaymentSuccess(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            let searchSlug = [];
            let productSearch = [];
            let productBody = req.body.products;
            req.body.products.forEach(value => {
                if (searchSlug.includes(value.slug)) {
                    return;
                }
                searchSlug.push(value.slug);
            });
            Product.find({ slug: { $in: searchSlug } })
                .then(products => {
                    // duyệt qua sản phẩm
                    products.forEach((pro, index) => {
                        // duyệt qua màu của 1 sản phẩm
                        pro.colors.forEach((color, index) => {
                            // kiểm tra màu và id sản phẩm
                            productBody.forEach((body, index) => {
                                if (pro.slug == body.slug && color._id == body.colorId) {
                                    // chuyển đổi sang vùng nhớ mới
                                    let temp = JSON.parse(JSON.stringify(pro));
                                    temp.colors = JSON.parse(JSON.stringify(color));
                                    temp.qtyOrder = JSON.parse(JSON.stringify(body.quantity));
                                    // Lưu mảng mới cho từng color của sản phẩm
                                    productSearch.push(temp);
                                }
                            });
                        });
                    });
                    let sumQuantity = 0;
                    let productTemp = [];
                    let totalPrice = productSearch.reduce((accumulator, currentValue) => {
                        // Chi tiết của giỏ hàng
                        productTemp.push({
                            slug: currentValue.slug,
                            colorId: currentValue.colors._id,
                            colorName: currentValue.colors.name,
                            productName: currentValue.name,
                            quantity: currentValue.qtyOrder,
                            price: (currentValue.price - (currentValue.price * (currentValue.sale / 100))),
                            sale: currentValue.sale,
                        });
                        // Số lượng tất cả sản phẩm được order
                        sumQuantity += Number.parseInt(currentValue.qtyOrder);
                        // Giá của tất cả sản phẩm được order
                        let price = (Number.parseInt(currentValue.qtyOrder) * (currentValue.price - (currentValue.price * (currentValue.sale / 100))));
                        return accumulator + price;
                    }, 0);
                    User.findOne({ slug: decoded._id })
                        .then((user) => {
                            // vị trí address active
                            let idx = user.addresses.findIndex(address => address.active === true);
                            let order = new Order({
                                userName: user.addresses[idx].name,
                                userPhone: user.addresses[idx].phone,
                                userAddress: user.addresses[idx].address,
                                slugUser: decoded._id,
                                sumQuantity: sumQuantity,
                                sumPrice: totalPrice,
                                details: productTemp,
                            });
                            return Promise.all([user, order.save()])
                        })
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
    };
    //[GET] /order/detail
    orderDetail(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            Order.findOne({
                    _id: req.params.id
                })
                .then(order => {
                    return res.send({
                        status: 200,
                        order: singleMongooseToObject(order)
                    });
                })
                .catch(next)
        } catch (e) {
            return res.send({
                status: 404,
                error: e.message
            });
        }
    };
    // [PUT] /cancel/order/:id
    cancelOrder(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            let emailUser = null,
                idOder = null;
            Promise.all([
                    User.findOne({ slug: decoded._id, token: token }),
                    Order.findOne({ _id: req.params.id })
                ])
                .then(([user, order]) => {
                    if (user !== null && order !== null) {
                        emailUser = user.email;
                        idOder = order._id;
                        order.status = 0;
                        return Order.updateOne({ _id: order._id }, order);
                    }
                    throw new Error('User and Order undefined');
                })
                .then(() => {
                    sendCancelOrderMail(emailUser, idOder);
                    return res.send({
                        cancel: true,
                        message: 'Đã hủy'
                    });
                })
                .catch(next)
        } catch (err) {
            return res.send({
                cancel: false,
            });
        }
    };
    show404(req, res, next) {
        res.render('home/notfound', { layout: false });
    }
}
module.exports = new HomeController;