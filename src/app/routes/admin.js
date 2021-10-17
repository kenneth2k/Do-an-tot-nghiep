const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const adminController = require('../controllers/Admin/AdminController');
const adminBannerController = require('../controllers/Admin/AdminBannerController');
const adminProducerController = require('../controllers/Admin/AdminProducerController');
const adminRaitingController = require('../controllers/Admin/AdminRaitingController');
const adminUserController = require('../controllers/Admin/AdminUserController');
const adminOrderController = require('../controllers/Admin/AdminOrderController');

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
router.post('/producer/create', adminProducerController.create);
router.get('/producer/:id/edit', adminProducerController.edit);
router.put('/producer/:id/update', adminProducerController.update);
router.delete('/producer/:id/delete', adminProducerController.delete);
router.get('/producer/delete/search', adminProducerController.searchDeleted);
router.put('/producer/:id/restore', adminProducerController.restore);
router.delete('/producer/:id/destroy', adminProducerController.destroy);
//Raitings
router.get('/raiting/search', adminRaitingController.search);
router.delete('/raiting/:id/delete', adminRaitingController.delete);
//User
router.get('/user/search', adminUserController.search);
router.delete('/user/:id/delete', adminUserController.delete);
router.get('/user/delete/search', adminUserController.searchDeleted);
router.put('/user/:id/restore', adminUserController.restore);
//Oder
router.get('/order/:status/search', adminOrderController.search);
router.get('/order/:id/edit', adminOrderController.edit);
router.put('/order/:id/update', adminOrderController.update);

router.get('/*', adminController.notfound);

module.exports = router;