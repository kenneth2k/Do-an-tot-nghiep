const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/Admin/AdminController');
const adminBannerController = require('../controllers/Admin/AdminBannerController');
const adminProducerController = require('../controllers/Admin/AdminProducerController');

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
router.get('/banner/delete', adminBannerController.deleteList);
router.get('/banner/delete/search', adminBannerController.deleteListSearch);
router.put('/banner/:id/restore', adminBannerController.restore);
router.delete('/banner/:id/destroy', adminBannerController.destroy);
// Producers
router.get('/producer/search', adminProducerController.search);
router.get('/producer/:id/edit', adminProducerController.edit);
router.put('/producer/:id/update', adminProducerController.update);


router.get('/*', adminController.notfound);

module.exports = router;