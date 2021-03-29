const jwt = require('jsonwebtoken');
const axios = require('axios');

const Account = require('../models/Account');
const Menu = require('../models/Menu');
const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');

class ApiHomeController{
    // [POST] /api/getMenu
    getMenu(req, res, next){
        Menu.find({})
            .then(menus => res.send({menus}))
            .catch(next)
    }
    // [POST] /api/getCity
    getCity(req, res, next){
        axios.get('https://thongtindoanhnghiep.co/api/city')
            .then(function (response) {
                var isValid = response.data ? res.send({
                    city: response.data,
                    message: true,
                }) : res.send({message: false});
            })
            .catch(next)
    }
    // [POST] /api/:city/getDistrict/
    getDistrict(req, res, next){
        var apiDistrict = "https://thongtindoanhnghiep.co/api/city/" + req.params.city + "/district";
        axios.get(apiDistrict)
            .then(function (response) {
                var isValid = response.data ? res.send({
                    city: response.data,
                    message: true,
                }) : res.send({message: false});
            })
            .catch(next)
    }
    // [POST] /api/:district/getWard
    getWard(req, res, next){
        var apiWard = "https://thongtindoanhnghiep.co/api/district/" + req.params.ward + "/ward";
        axios.get(apiWard)
            .then(function (response) {
                var isValid = response.data ? res.send({
                    city: response.data,
                    message: true,
                }) : res.send({message: false});
            })
            .catch(next)
    }
}
module.exports = new ApiHomeController;