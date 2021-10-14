const Order = require('../../models/Order');
const jwt = require('jsonwebtoken');
const { multipleMongooseToObject, singleMongooseToObject, multipleMongooseToObjectOnLimit } = require('../../../util/mongoose');

class AdminOrderController {
    // [GET] /admin/oder/search
    search(req, res, next) {
        try {
            console.log("vào")
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            let page = parseInt(req.query.page) || 1;

            let skip = (page - 1) * process.env.LIMIT_DOS;
            let searchID = (req.query.q) ? { status: 2, _id: req.query.q } : { status: 2 };
            Promise.all([
                    Order.find(searchID).sort({ createdAt: -1 }),
                    Order.countDocuments({ status: 1 }).sort({ createdAt: -1 }),
                    Order.countDocuments({ status: 2 }).sort({ createdAt: -1 }),
                    Order.countDocuments({ status: 3 }).sort({ createdAt: -1 }),
                    Order.countDocuments({ status: 0 }).sort({ createdAt: -1 })
                ])
                .then(([orderNew, countOrderFinished, countOrderWarning, countOrderSuccess, countOrderFailed]) => {

                    let pageMax = Math.ceil((orderNew.length / process.env.LIMIT_DOS));
                    let pagePre = ((page > 0) ? page - 1 : 0);
                    let pageNext = ((page < pageMax) ? page + 1 : page);
                    return res.send({
                        orderNewList: multipleMongooseToObjectOnLimit(orderNew, process.env.LIMIT_DOS, skip),
                        STT: (((page - 1) * process.env.LIMIT_DOS) + 1),
                        countOrderFinished,
                        countOrderWarning,
                        countOrderSuccess,
                        countOrderFailed,
                        pagePre,
                        pageActive: page,
                        pageNext,
                        limit: process.env.LIMIT_DOS
                    })
                })
                .catch((err) => {
                    throw new Error('Error connecting DB!');
                })
        } catch (e) {
            return res.send({
                message: e
            })
        }
    };
}
module.exports = new AdminOrderController;