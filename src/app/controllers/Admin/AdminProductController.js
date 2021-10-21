const Product = require('../../models/Product');
const Category = require('../../models/Category');
const Producer = require('../../models/Producer');
const ObjectId = require('mongodb').ObjectId;
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { multipleMongooseToObject, singleMongooseToObject, multipleMongooseToObjectOnLimit } = require('../../../util/mongoose');

class AdminProductController {
    // [GET] /admin/product/search
    search(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            let page = parseInt(req.query.page) || 1;

            let skip = (page - 1) * process.env.LIMIT_DOS;
            let limit = parseInt(process.env.LIMIT_DOS);

            let arrSearch = [{ name: new RegExp((req.query.q ? req.query.q : ''), "i") }];
            if (((req.query.q) != undefined) && ((req.query.q) != '') && (req.query.q.length == 24)) {
                arrSearch.push({ _id: req.query.q });
            }
            Promise.all([
                    Product.find({
                        $or: arrSearch
                    }).sort({ createdAt: -1 }),
                    Product.countDocuments({
                        $or: arrSearch
                    }).sort({ createdAt: -1 }),
                    Product.countDocumentsDeleted({})
                ])
                .then(([products, sumProduct, sumDeleted]) => {
                    let pageMax = Math.ceil((products.length / process.env.LIMIT_DOS));
                    let pagePre = ((page > 0) ? page - 1 : 0);
                    let pageNext = ((page < pageMax) ? page + 1 : page);
                    return res.send({
                        productsList: multipleMongooseToObjectOnLimit(products, process.env.LIMIT_DOS, skip),
                        STT: (((page - 1) * process.env.LIMIT_DOS) + 1),
                        sumProduct,
                        sumDeleted,
                        pagePre,
                        pageActive: page,
                        pageNext,
                        limit: process.env.LIMIT_DOS
                    })
                })
                .catch((err) => {
                    throw new Error(err.message);
                })

        } catch (e) {
            let err = (e.message) ? e.message : e;
            return res.send({
                message: err
            })
        }
    };
    // [DELETE] /admin/product/:id/delete
    delete(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');

        } catch (e) {
            return res.send({
                message: e
            })
        }
    };
    // [POST] /admin/product/images
    updateImages(req, res, next) {
        try {
            if (req.file === undefined) throw new Error('Tải ảnh thất bại!');
            let fileName = req.file.filename;
            let url = '/public/images/products/' + fileName;
            let msg = 'Tải ảnh thành công!';
            let funcNum = req.query.CKEditorFuncNum;
            res.status(201).send("<script>window.parent.CKEDITOR.tools.callFunction('" + funcNum + "','" + url + "','" + msg + "');</script>");
        } catch (e) {
            res.send("<script>window.parent.CKEDITOR.tools.callFunction('','','" + e.message + "');</script>");
        }

    };
    // [GET] /admin/product/create
    createGet(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');

            Promise.all([
                    Category.find({ slug: { $nin: ['', 'lien-he'] } }),
                    Producer.find({})
                ])
                .then(([categori, producer]) => {
                    return res.send({
                        categori: categori,
                        producer: producer
                    })
                })
                .catch((e) => {
                    throw new Error(e.message);
                });

        } catch (e) {
            return res.send({
                message: e
            })
        }
    };
    // [POST] /admin/product/create
    create(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');

            let reducers = [],
                images1 = [],
                images2 = [];
            req.body.reducers.forEach((val) => {
                reducers.push({ _id: val });
            });
            req.files.images1.forEach((val) => {
                images1.push(val.filename);
            })
            req.files.images2.forEach((val) => {
                images2.push(val.filename);
            })
            let colors = [{
                name: req.body.nameColor1,
                bigImg: req.files.images1[0].filename,
                secImg: images1,
            }, {
                name: req.body.nameColor2,
                bigImg: req.files.images2[0].filename,
                secImg: images2,
            }];
            let product = new Product({
                name: req.body.name,
                price: req.body.price,
                sreen: req.body.sreen,
                HDH: req.body.HDH,
                CameraAfter: req.body.CameraAfter,
                CamereBefore: req.body.CamereBefore,
                CPU: req.body.CPU,
                RAM: req.body.RAM,
                MemoryIn: req.body.MemoryIn,
                SIM: req.body.SIM,
                Battery: req.body.Battery,
                categori: req.body.categori,
                content: req.body.content,
                reducers: reducers,
                colors: colors,
                sale: req.body.sale
            })
            product.save()
                .then((pro) => {
                    return res.send({
                        body: req.body,
                        message: "Thêm sản phẩm thành công"
                    })
                })
                .catch((e) => {
                    throw new Error(e.message);
                });

        } catch (e) {
            return res.send({
                message: e
            })
        }
    };
}
module.exports = new AdminProductController;