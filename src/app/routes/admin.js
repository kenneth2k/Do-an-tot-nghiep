const express = require('express');
const router = express.Router();
const adminController = require('../controllers/Admin/AdminController');
const adminBannerController = require('../controllers/Admin/AdminBannerController');

router.get('/', adminController.index);
router.get('/home', adminController.home);
router.get('/banner', adminBannerController.index);
router.get('/*', adminController.notfound);

module.exports = router;