const express = require('express');
const router = express.Router();
const homeController = require('../controllers/HomeController');
const userController = require('../controllers/UserController');

// router on two params
router.get('/payment/success', homeController.showPaymentSuccess);
router.get('/active/:key', userController.activeUser);
// router.get('/profile/:slug', homeController.showProfile);
router.get('/:categori/:slug', homeController.show);
// router on one params
router.get('/cart', homeController.showCart);
router.get('/payment', homeController.showPayment);
router.get('/', homeController.index);
// router on all params
router.get('*', homeController.show404);



module.exports = router;