const express = require('express');
const router = express.Router();
const apiAccountController = require('../controllers/ApiAccountController');
const apiHomeController = require('../controllers/ApiHomeController');


router.post('/login', apiAccountController.login);
router.post('/checkLogin', apiAccountController.checkLogin);
router.post('/getProfile', apiAccountController.getProfile);
router.put('/getProfile/changePassword', apiAccountController.changePassword);


// get country vietnam
router.get('/city', apiHomeController.getCity);
router.get('/city/:city/district', apiHomeController.getDistrict);
router.get('/district/:ward/ward', apiHomeController.getWard);

module.exports = router;