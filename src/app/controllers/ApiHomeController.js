const jwt = require('jsonwebtoken');
const axios = require('axios');

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { multipleMongooseToObject, singleMongooseToObject, multipleMongooseToObjectOnLimit } = require('../../util/mongoose');

class ApiHomeController {
    // [GET] /search/:search
    showSearch(req, res, next) {
        Product.find({ name: { $regex: new RegExp(req.params.search, "i") } }).limit(5).skip(0)
            .then(products => {
                return res.send({
                    products: multipleMongooseToObject(products)
                })
            })
            .catch(next)
    };
    // [GET] /mutipleSearch
    mutipleSearch(req, res, next) {
        let maxProduct = 12;
        let skipPage = (req.query.page - 1) * maxProduct;
        Product.find({ name: { $regex: new RegExp(req.query.q, "i") } }).sort({
                price: -1
            })
            .then(products => {
                return res.send({
                    productViewed: skipPage + multipleMongooseToObjectOnLimit(products, maxProduct, skipPage).length,
                    totalProduct: products.length,
                    products: multipleMongooseToObjectOnLimit(products, maxProduct, skipPage)
                })
            })
            .catch(next)
    };
    // [GET] /menu
    menu(req, res, next) {
        Category.find({})
            .then(categories => {
                return res.status(200).json({ categories: categories });
            })
            .catch(next);
    };
}
module.exports = new ApiHomeController;