const Warehouse = require('../../models/Warehouse');
const Product = require('../../models/Product');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { multipleMongooseToObject, singleMongooseToObject, multipleMongooseToObjectOnLimit } = require('../../../util/mongoose');

class AdminWarehouseController {
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
                        quantityAfter: parseInt(oldColors[k].quantity),
                        quantityPlus: parseInt(req.body[`${product.colors[k]._id}`]),
                        sum: parseInt(oldColors[k].quantity) + parseInt(req.body[`${product.colors[k]._id}`])
                    })
                }
                let warehouse = new Warehouse({
                    idProduct: req.body.id,
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