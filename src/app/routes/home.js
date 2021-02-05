const express = require('express');
const router = express.Router();
const homeController = require('../controllers/HomeController');

router.get('/:slug1/:slug2', homeController.show);

router.get('/', homeController.index);

module.exports = router;