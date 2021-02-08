const express = require('express');
const router = express.Router();
const homeController = require('../controllers/HomeController');


router.get('/profile/:slug', homeController.showProfile);
router.get('/:slug1/:slug2', homeController.show);
router.get('/cart', homeController.showCart);
router.get('/search', homeController.showSearch);
router.get('/', homeController.index);

module.exports = router;