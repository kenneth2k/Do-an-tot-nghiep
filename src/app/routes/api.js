const express = require('express');
const router = express.Router();
const ApiUserController = require('../controllers/ApiUserController');
const apiHomeController = require('../controllers/ApiHomeController');


router.post('/login', ApiUserController.login);
router.post('/register', ApiUserController.register);
router.post('/checkEmail', ApiUserController.checkEmail);
router.post('/sendNewPassword', ApiUserController.sendNewPassword);
// router.post('/checkLogin', ApiUserController.checkLogin);
// router.post('/getProfile', ApiUserController.getProfile);
// router.put('/getProfile/changePassword', ApiUserController.changePassword);


// // get country vietnam
// router.get('/menu', apiHomeController.getMenu);
// router.get('/city', apiHomeController.getCity);
// router.get('/city/:city/district', apiHomeController.getDistrict);
// router.get('/district/:ward/ward', apiHomeController.getWard);

module.exports = router;