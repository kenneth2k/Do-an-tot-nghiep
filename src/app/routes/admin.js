const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');

router.get('/', adminController.index);
router.get('/*', adminController.notfound);

module.exports = router;