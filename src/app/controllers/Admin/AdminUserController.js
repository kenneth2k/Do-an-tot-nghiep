const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { multipleMongooseToObject, singleMongooseToObject, multipleMongooseToObjectOnLimit } = require('../../../util/mongoose');

class AdminUserController {
    // [GET] /admin/user/search
    search(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            let page = parseInt(req.query.page) || 1;

            let skip = (page - 1) * process.env.LIMIT_DOS;

            Promise.all([
                    User.find({ fullname: { $regex: new RegExp((req.query.q ? req.query.q : ''), "i") }, decentralization: 1 }).sort({ createdAt: -1 }),
                    User.countDocuments({ fullname: { $regex: new RegExp((req.query.q ? req.query.q : ''), "i") }, decentralization: 1 }).sort({ createdAt: -1 }),
                    User.countDocumentsDeleted({})
                ])
                .then(([user, sumUser, sumDeleted]) => {
                    let pageMax = Math.ceil((user.length / process.env.LIMIT_DOS));
                    let pagePre = ((page > 0) ? page - 1 : 0);
                    let pageNext = ((page < pageMax) ? page + 1 : page);
                    return res.send({
                        userList: multipleMongooseToObjectOnLimit(user, process.env.LIMIT_DOS, skip),
                        STT: (((page - 1) * process.env.LIMIT_DOS) + 1),
                        sumUser,
                        sumDeleted,
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

    // [DELETE] /admin/user/:id/delete
    delete(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            User.delete({ _id: req.params.id })
                .then((user) => {
                    return res.send({
                        message: 'Khóa người dùng thành công!'
                    });
                })
                .catch((err) => {
                    throw new Error('DELETE FAILUARE!');
                })
        } catch (e) {
            return res.send({
                message: e
            })
        }
    };
}
module.exports = new AdminUserController;