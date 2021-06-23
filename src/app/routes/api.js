const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const ApiUserController = require('../controllers/ApiUserController');
const apiHomeController = require('../controllers/ApiHomeController');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images/comments'));
    },
    filename: function(req, file, cb) {
        cb(null, 'coment' + '-' + req.body.userSlug + '-' + Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
});

router.get('/menu', apiHomeController.menu);
router.get('/searchName', apiHomeController.searchName);
router.get('/checkLogin', ApiUserController.checkLogin);
router.get('/getProfile', ApiUserController.getProfile);
router.get('/mutipleSearch', apiHomeController.mutipleSearch);

router.post('/login', ApiUserController.login);
router.post('/register', ApiUserController.register);
router.post('/checkEmail', ApiUserController.checkEmail);
router.post('/createAddress', ApiUserController.createAddress);
router.post('/raiting', upload.array('images', 3), apiHomeController.raiting);

router.put('/sendNewPassword', ApiUserController.sendNewPassword);
router.put('/updateProfile', ApiUserController.updateProfile);

router.get('/search/:search', apiHomeController.showSearch);

router.put('/getProfile/changePassword', ApiUserController.changePassword);
router.put('/updateAddress/:id', ApiUserController.updateAddress);

// // get country vietnam
// router.get('/menu', apiHomeController.getMenu);
// router.get('/city', apiHomeController.getCity);
// router.get('/city/:city/district', apiHomeController.getDistrict);
// router.get('/district/:ward/ward', apiHomeController.getWard);

module.exports = router;