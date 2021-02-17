const Phone = require('../models/Phone');
const { multipleMongooseToObject, singleMongooseToObject } = require('../../util/mongoose');

class HomeController{
    // [GET] /
    index(req, res, next){
        
        Phone.find({})
            .then(phones => {
                res.render('home/index', { phones : multipleMongooseToObject(phones) });
            })
            .catch(next)
        
    }

    // [GET] /:categori/:slug
    show(req, res, next){

        Phone.findOne({
            slug: req.params.slug,
            categori: req.params.categori
        })
            .then(phone => {
                if(phone){
                    res.render('home/detail', { phone : singleMongooseToObject(phone)});
                }
                else{
                    res.redirect('/')
                }
            })
            .catch(next)
    }
    
    // [GET] /cart
    showCart(req, res, next){
        res.render('home/cart');
    }

    // [GET] /search
    showSearch(req, res, next){
        res.render('home/search');
    }

    // [GET] /profile/:slug
    showProfile(req, res, next){
        res.render('home/profile');
    }

    show404(req, res, next){
        res.render('home/notfound');
    }
}
module.exports = new HomeController;