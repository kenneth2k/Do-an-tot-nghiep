const express = require('express');
const router = express.Router();
const apiAccountController = require('../controllers/ApiAccountController');


router.post('/login', apiAccountController.login);
router.post('/getProfile', apiAccountController.getProfile);
module.exports = router;