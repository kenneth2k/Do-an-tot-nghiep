const Warehouse = require('../../models/Warehouse');
const Product = require('../../models/Product');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { multipleMongooseToObject, singleMongooseToObject, multipleMongooseToObjectOnLimit } = require('../../../util/mongoose');

class AdminWarehouseController {
    // [GET] /admin/warehouse/search
    search(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            let page = parseInt(req.query.page) || 1;

            let skip = (page - 1) * process.env.LIMIT_DOS;
            let limit = parseInt(process.env.LIMIT_DOS);

            Promise.all([
                    Warehouse.aggregate(
                        [{
                            $match: {
                                createdAt: {
                                    $gte: new Date(`${req.query.dateBefore}T00:00:00+00:00`),
                                    $lte: new Date(`${req.query.dateAfter}T23:59:59+00:00`)
                                },

                            }
                        }, {
                            $lookup: {
                                from: "products",
                                localField: "slugProduct",
                                foreignField: "slug",
                                as: "product"
                            }
                        }])
                    .skip(skip)
                    .limit(limit),
                    Warehouse.aggregate(
                        [{
                            $match: {
                                createdAt: {
                                    $gte: new Date(`${req.query.dateBefore}T00:00:00+00:00`),
                                    $lte: new Date(`${req.query.dateAfter}T23:59:59+00:00`)
                                },

                            }
                        }])
                ])
                .then(([warehouse, sumWarehouse]) => {
                    let pageMax = Math.ceil((sumWarehouse.length / limit));
                    let pagePre = ((page > 0) ? page - 1 : 0);
                    let pageNext = ((page < pageMax) ? page + 1 : page);
                    return res.send({
                        warehouseList: warehouse,
                        STT: (((page - 1) * process.env.LIMIT_DOS) + 1),
                        pagePre,
                        pageActive: page,
                        pageNext,
                        pageMax,
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
    // [POST] /admin/warehouse/create
    create(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            let create = async() => {
                var product = await Product.findOne({ _id: req.body.id });
                // lấy key trong object
                let keyData = Object.keys(req.body);
                // Duyệt và cộng thêm số lượng mới trong sản phẩm
                var oldColors = [];

                for (let i = 0; i < keyData.length; i++) {
                    if (keyData[i] == 'id') break;
                    for (let j = 0; j < product.colors.length; j++) {
                        if (keyData[i] == product.colors[j]._id) {
                            oldColors.push({
                                quantity: parseInt(product.colors[j].quantity)
                            });
                            product.colors[j].quantity = parseInt(product.colors[j].quantity) + parseInt(req.body[`${keyData[i]}`]);
                        }
                    }
                }
                //Màu sản phẩm khi đã được thay đổi số lượng
                let colors = [];
                for (let k = 0; k < product.colors.length; k++) {
                    colors.push({
                        _id: product.colors[k]._id,
                        name: product.colors[k].name,
                        quantityBefore: parseInt(oldColors[k].quantity),
                        quantityPlus: parseInt(req.body[`${product.colors[k]._id}`]),
                        sum: parseInt(oldColors[k].quantity) + parseInt(req.body[`${product.colors[k]._id}`])
                    })
                }
                let warehouse = new Warehouse({
                    slugProduct: product.slug,
                    colors: colors
                });
                let updateWarehouse = await warehouse.save();
                let updateOneProduct = await Product.updateOne({ _id: req.body.id }, product);
                return Promise.all([product, updateOneProduct, updateWarehouse]);
            }
            create()
                .then(([product, updateOneProduct, updateWarehouse]) => {
                    return res.send({
                        status: true,
                        message: "Thêm số lượng sản phẩm thành công!",
                    })
                })
                .catch(function(err) {
                    return res.send({
                        status: false,
                        message: "Thêm số lượng sản phẩm thất bại"
                    })
                })
        } catch (e) {
            return res.send({
                status: false,
                message: e
            })
        }
    };
}
module.exports = new AdminWarehouseController;