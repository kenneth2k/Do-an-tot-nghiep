const express = require('express');
const router = express.Router();
const adminController = require('../controllers/Admin/AdminController');

router.get('/', adminController.index);
router.get('/home', adminController.home);
router.get('/*', adminController.notfound);

module.exports = router;