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
            if (ObjectId.isValid(req.query.q)) {
                arrSearch.push({ _id: req.query.q });
            }
            Promise.all([
                    Product.find({
                        categori: (req.query.categori == 'all') ? new RegExp((''), "i") : req.query.categori,
                        $or: arrSearch
                    }).sort({ createdAt: -1 }),
                    Category.find({ slug: { $nin: ['', 'lien-he'] } }),
                    Product.countDocuments({}).sort({ createdAt: -1 }),
                    Product.countDocumentsDeleted({})
                ])
                .then(([products, categories, sumProduct, sumDeleted]) => {
                    let pageMax = Math.ceil((products.length / limit));
                    let pagePre = ((page > 0) ? page - 1 : 0);
                    let pageNext = ((page < pageMax) ? page + 1 : page);
                    return res.send({
                        productsList: multipleMongooseToObjectOnLimit(products, limit, skip),
                        STT: (((page - 1) * limit) + 1),
                        sumProduct,
                        sumDeleted,
                        pagePre,
                        pageActive: page,
                        pageNext,
                        limit: process.env.LIMIT_DOS,
                        categories
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
    // [GET] /admin/product/delete/search
    searchDeleted(req, res, next) {
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
                    Product.findDeleted({
                        categori: (req.query.categori == 'all') ? new RegExp((''), "i") : req.query.categori,
                        $or: arrSearch
                    }).sort({ createdAt: -1 }),
                    Category.find({ slug: { $nin: ['', 'lien-he'] } }),
                    Product.countDocuments({}).sort({ createdAt: -1 }),
                    Product.countDocumentsDeleted({})
                ])
                .then(([products, categories, sumProduct, sumDeleted]) => {
                    let pageMax = Math.ceil((products.length / limit));
                    let pagePre = ((page > 0) ? page - 1 : 0);
                    let pageNext = ((page < pageMax) ? page + 1 : page);
                    return res.send({
                        productsList: multipleMongooseToObjectOnLimit(products, limit, skip),
                        STT: (((page - 1) * limit) + 1),
                        sumProduct,
                        sumDeleted,
                        pagePre,
                        pageActive: page,
                        pageNext,
                        limit: process.env.LIMIT_DOS,
                        categories
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
            Product.delete({ _id: req.params.id })
                .then((product) => {
                    return res.send({
                        message: 'Xóa sản phẩm thành công!'
                    });
                })
                .catch((err) => {
                    throw new Error(err.message);
                })
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
            if (typeof req.body.reducers === 'string') {
                reducers.push({ _id: req.body.reducers });
            } else {
                req.body.reducers.forEach((val) => {
                    reducers.push({ _id: val });
                });
            }
            req.files.images1.forEach((val) => {
                images1.push(val.filename);
            })

            let colors = [];
            colors.push({
                name: req.body.nameColor1,
                bigImg: req.files.images1[0].filename,
                secImg: images1,
            });
            if (req.files.images2) {
                req.files.images2.forEach((val) => {
                    images2.push(val.filename);
                })
                colors.push({
                    name: req.body.nameColor2,
                    bigImg: req.files.images2[0].filename,
                    secImg: images2,
                });
            };
            let product = new Product({
                name: req.body.name,
                price: req.body.price,
                sreen: req.body.sreen,
                HDH: req.body.HDH,
                CameraAfter: req.body.CameraAfter,
                CameraBefore: req.body.CameraBefore,
                CPU: req.body.CPU,
                RAM: req.body.RAM,
                MemoryIn: req.body.MemoryIn,
                SIM: req.body.SIM,
                Battery: req.body.Battery,
                categori: req.body.categori,
                content: req.body.textContent[1],
                reducers: reducers,
                colors: colors,
                sale: req.body.sale,
                hot: req.body.hot ? true : false,
            });
            product.save()
                .then((pro) => {
                    return res.send({
                        status: true,
                        message: "Thêm sản phẩm thành công"
                    })
                })
                .catch((e) => {
                    return res.send({
                        status: false,
                        message: "Thêm sản phẩm thất bại"
                    })
                });

        } catch (e) {
            return res.send({
                status: false,
                message: "Thêm sản phẩm thất bại"
            })
        }
    };

    // [GET] /admin/product/:id/edit
    edit(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Promise.all([
                    Product.findOne({ _id: req.params.id }),
                    Category.find({ slug: { $nin: ['', 'lien-he'] } }),
                    Producer.find({})
                ])
                .then(([product, categori, producer]) => {
                    let selectProducer = [],
                        selectCategori = [];
                    producer.forEach((item) => {
                        selectProducer.push({
                            _id: item._id,
                            name: item.name,
                            checked: false
                        })
                        product.reducers.forEach((val) => {
                            if (item._id == val._id) {
                                selectProducer[selectProducer.length - 1].checked = true;
                            }
                        })
                    });
                    categori.forEach((item) => {
                        selectCategori.push({
                            _id: item._id,
                            name: item.name,
                            slug: item.slug,
                            checked: ((item.slug == product.categori) ? true : false)
                        })
                    });
                    return res.send({
                        product,
                        selectProducer,
                        selectCategori
                    });
                })
                .catch((err) => {
                    throw new Error(err.message);
                })
        } catch (e) {
            return res.send({
                message: e
            })
        }
    };
    // [PUT] /admin/product/:id/update
    update(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            let editer = async() => {
                let product = await Product.findOne({ _id: req.params.id });
                let reducers = [],
                    images1 = [],
                    images2 = [];
                if (typeof req.body.reducers === 'string') {
                    reducers.push({ _id: req.body.reducers });
                } else {
                    req.body.reducers.forEach((val) => {
                        reducers.push({ _id: val });
                    });
                }
                let colors = [];
                if (req.files.images1) {
                    req.files.images1.forEach((val) => {
                        images1.push(val.filename);
                    })
                    colors.push({
                        name: req.body.nameColor1,
                        bigImg: req.files.images1[0].filename,
                        secImg: images1,
                    });
                } else {
                    product.colors[0].name = req.body.nameColor1;
                    colors.push(product.colors[0]);
                }
                if (req.files.images2) {
                    req.files.images2.forEach((val) => {
                        images2.push(val.filename);
                    })
                    colors.push({
                        name: req.body.nameColor2,
                        bigImg: req.files.images2[0].filename,
                        secImg: images2,
                    });
                } else if (product.colors.length > 1) {
                    product.colors[1].name = req.body.nameColor2;
                    colors.push(product.colors[1]);
                }

                product.name = req.body.name;
                product.price = req.body.price;
                product.sreen = req.body.sreen;
                product.HDH = req.body.HDH;
                product.CameraAfter = req.body.CameraAfter;
                product.CameraBefore = req.body.CameraBefore;
                product.CPU = req.body.CPU;
                product.RAM = req.body.RAM;
                product.MemoryIn = req.body.MemoryIn;
                product.SIM = req.body.SIM;
                product.Battery = req.body.Battery;
                product.categori = req.body.categori;
                product.content = req.body.textContent[1];
                product.reducers = reducers;
                product.colors = colors;
                product.sale = req.body.sale;
                product.hot = req.body.hot ? true : false;
                let updateOneProduct = Product.updateOne({ _id: req.params.id }, product);
                return Promise.all([product, updateOneProduct]);
            };
            editer()
                .then(([product, updateOneProduct]) => {
                    return res.send({
                        status: true,
                        message: 'Cập nhật sản phẩm thành công!'
                    });
                })
                .catch(err => {
                    throw new Error(err.message);
                })
        } catch (e) {
            return res.send({
                status: true,
                message: 'Cập nhật sản phẩm thất bại!',
                error: e
            });
        }
    };
    // [PUT] /admin/product/:id/restore
    restore(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Product.restore({ _id: req.params.id })
                .then((product) => {
                    return res.send({
                        status: true,
                        message: 'Khôi phục sản phẩm thành công!'
                    });
                })
                .catch((err) => {
                    return res.send({
                        status: false,
                        message: 'Khôi phục sản phẩm thất bại!'
                    });
                })
        } catch (e) {
            return res.send({
                status: false,
                message: e
            });
        }
    };
}
module.exports = new AdminProductController;