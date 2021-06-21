const express = require('express');
const router = express.Router();
const ApiUserController = require('../controllers/ApiUserController');
const apiHomeController = require('../controllers/ApiHomeController');
const apiController = require('../controllers/ApiHomeController');

router.get('/menu', apiHomeController.menu);
router.get('/searchName', apiHomeController.searchName);
router.get('/checkLogin', ApiUserController.checkLogin);
router.get('/getProfile', ApiUserController.getProfile);
router.get('/mutipleSearch', apiHomeController.mutipleSearch);

router.post('/login', ApiUserController.login);
router.post('/register', ApiUserController.register);
router.post('/checkEmail', ApiUserController.checkEmail);
router.post('/createAddress', ApiUserController.createAddress);

router.put('/sendNewPassword', ApiUserController.sendNewPassword);
router.put('/updateProfile', ApiUserController.updateProfile);

router.get('/search/:search', apiController.showSearch);

router.put('/getProfile/changePassword', ApiUserController.changePassword);
router.put('/updateAddress/:id', ApiUserController.updateAddress);

// // get country vietnam
// router.get('/menu', apiHomeController.getMenu);
// router.get('/city', apiHomeController.getCity);
// router.get('/city/:city/district', apiHomeController.getDistrict);
// router.get('/district/:ward/ward', apiHomeController.getWard);

module.exports = router;