const Product = require('../../models/Product');
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
}
module.exports = new AdminProductController;