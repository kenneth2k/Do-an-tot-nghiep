const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/Admin/AdminController');
const adminBannerController = require('../controllers/Admin/AdminBannerController');

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images/background'));
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
var upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
});

router.get('/', adminController.index);
router.get('/home', adminController.home);
// Banner
router.get('/banner', adminBannerController.index);
router.post('/banner/create', upload.single('images'), adminBannerController.create);
router.get('/banner/:id/edit', adminBannerController.edit);
router.put('/banner/:id/update', upload.single('images'), adminBannerController.update);
router.delete('/banner/:id/delete', adminBannerController.delete);

router.get('/*', adminController.notfound);

module.exports = router;