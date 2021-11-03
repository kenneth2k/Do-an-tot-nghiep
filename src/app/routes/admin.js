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
const adminProductController = require('../controllers/Admin/AdminProductController');
const adminCategoryController = require('../controllers/Admin/AdminCategoryController');
const adminWarehouseController = require('../controllers/Admin/AdminWarehouseController');

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
//Product
var storageProduct = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../../public/images/products'));
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
var uploadProduct = multer({
    storage: storageProduct,
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
//Order
router.get('/order/:status/search', adminOrderController.search);
router.get('/statistical/:status/search', adminOrderController.searchStatistical);
router.get('/order/:id/edit', adminOrderController.edit);
router.put('/order/:id/update', adminOrderController.update);
//Product
router.get('/product/search', adminProductController.search);
router.get('/product/delete/search', adminProductController.searchDeleted);
router.delete('/product/:id/delete', adminProductController.delete);
router.post('/product/images', uploadProduct.single('upload'), adminProductController.updateImages);
router.get('/product/create', adminProductController.createGet);
router.post('/product/create', uploadProduct.fields([{ name: 'images1', maxCount: 4 }, { name: 'images2', maxCount: 4 }]), adminProductController.create);
router.get('/product/:id/edit', adminProductController.edit);
router.put('/product/:id/update', uploadProduct.fields([{ name: 'images1', maxCount: 4 }, { name: 'images2', maxCount: 4 }]), adminProductController.update);
router.put('/product/:id/restore', adminProductController.restore);
//category
router.get('/category/search', adminCategoryController.search);
router.delete('/category/:id/delete', adminCategoryController.delete);
router.get('/category/delete/search', adminCategoryController.searchDeleted);
router.put('/category/:id/restore', adminCategoryController.restore);
router.get('/category/:id/edit', adminCategoryController.edit);
router.put('/category/:id/update', adminCategoryController.update);
router.post('/category/create', adminCategoryController.create);
//Warehouse
router.get('/warehouse/search', adminWarehouseController.search);
router.post('/warehouse/create', adminWarehouseController.create);

router.get('/*', adminController.notfound);

module.exports = router;