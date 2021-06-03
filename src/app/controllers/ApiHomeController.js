const jwt = require('jsonwebtoken');
const axios = require('axios');

const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');

class ApiHomeController {
    // // [POST] /api/getCategory
    // getCategory(req, res, next) {
    //         Category.find({})
    //             .then(menus => res.send({ menus }))
    //             .catch(next)
    //     }
    //     // [POST] /api/getCity
    // getCity(req, res, next) {
    //         axios.get('https://vapi.vnappmob.com/api/province')
    //             .then(function(response) {
    //                 var isValid = response.data.results ? res.send({
    //                     city: response.data.results,
    //                     message: true,
    //                 }) : res.send({ message: false });
    //             })
    //             .catch(next)
    //     }
    //     // [POST] /api/:city/getDistrict/
    // getDistrict(req, res, next) {

    //         var apiDistrict = "https://vapi.vnappmob.com/api/province/district/" + req.params.city;
    //         axios.get(apiDistrict)
    //             .then(function(response) {
    //                 var isValid = response.data.results ? res.send({
    //                     city: response.data.results,
    //                     message: true,
    //                 }) : res.send({ message: false });
    //             })
    //             .catch(next)
    //     }
    //     // [POST] /api/:district/getWard
    // getWard(req, res, next) {
    //     var apiWard = "https://vapi.vnappmob.com/api/province/ward/" + req.params.ward;
    //     axios.get(apiWard)
    //         .then(function(response) {
    //             var isValid = response.data.results ? res.send({
    //                 city: response.data.results,
    //                 message: true,
    //             }) : res.send({ message: false });
    //         })
    //         .catch(next)
    // }
    // [GET] /search/:search
    showSearch(req, res, next) {
        Product.find({ name: { $regex: new RegExp(req.params.search, "i") } }).limit(5).skip(0)
            .then(products => {
                return res.send({
                    products: multipleMongooseToObject(products)
                })
            })
            .catch(next)
    }
}
module.exports = new ApiHomeController;