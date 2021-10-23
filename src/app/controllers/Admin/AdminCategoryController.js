const Category = require('../../models/Category');
const jwt = require('jsonwebtoken');
const { multipleMongooseToObject, singleMongooseToObject, multipleMongooseToObjectOnLimit } = require('../../../util/mongoose');

class AdminCategoryController {
    // [GET] /admin/category/search
    search(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            let page = parseInt(req.query.page) || 1;

            let skip = (page - 1) * process.env.LIMIT_DOS;

            Promise.all([
                    Category.find({ name: { $regex: new RegExp((req.query.q ? req.query.q : ''), "i") } }).sort({ createdAt: -1 }),
                    Category.countDocuments({}),
                    Category.countDocumentsDeleted({})
                ])
                .then(([category, sumCategory, sumDeleted]) => {
                    let pageMax = Math.ceil((category.length / process.env.LIMIT_DOS));
                    let pagePre = ((page > 0) ? page - 1 : 0);
                    let pageNext = ((page < pageMax) ? page + 1 : page);
                    return res.send({
                        categoryList: multipleMongooseToObjectOnLimit(category, process.env.LIMIT_DOS, skip),
                        STT: (((page - 1) * process.env.LIMIT_DOS) + 1),
                        sumCategory,
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
            return res.send({
                status: false,
                message: e
            })
        }
    };
    // [GET] /admin/category/delete/search
    searchDeleted(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            let page = parseInt(req.query.page) || 1;

            let skip = (page - 1) * process.env.LIMIT_DOS;

            Category.findDeleted({ name: { $regex: new RegExp((req.query.q ? req.query.q : ''), "i") } }).sort({ createdAt: -1 })
                .then((category) => {
                    let pageMax = Math.ceil((category.length / process.env.LIMIT_DOS));
                    let pagePre = ((page > 0) ? page - 1 : 0);
                    let pageNext = ((page < pageMax) ? page + 1 : page);
                    return res.send({
                        categoryList: multipleMongooseToObjectOnLimit(category, process.env.LIMIT_DOS, skip),
                        STT: (((page - 1) * process.env.LIMIT_DOS) + 1),
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
            return res.send({
                message: e
            })
        }
    };
    // [DELETE] /admin/category/:id/delete
    delete(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Category.delete({ _id: req.params.id })
                .then((category) => {
                    return res.send({
                        message: 'Cập nhật danh mục thành công!'
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
    // [PUT] /admin/category/:id/restore
    restore(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Category.restore({ _id: req.params.id })
                .then((category) => {
                    return res.send({
                        message: 'Khôi phục danh mục thành công!'
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
    // [POST] /admin/category/create
    create(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            let category = new Category({
                name: req.body.name,
            });
            category.save()
                .then((category) => {
                    return res.send({
                        message: 'Thêm danh mục thành công!'
                    });
                })
                .catch((e) => {
                    throw new Error('CREATE FAILUARE!');
                })
        } catch (e) {
            return res.send({
                message: e
            })
        }
    };
    // [GET] /admin/category/:id/edit
    edit(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Category.findOne({ _id: req.params.id })
                .then((category) => {
                    return res.send(category);
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
    // [PUT] /admin/category/:id/update
    update(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Category.findOne({ _id: req.params.id })
                .then((category) => {
                    category.name = req.body.name;
                    return Category.updateOne({ _id: req.params.id }, category)
                })
                .then((category) => {
                    return res.send({
                        status: true,
                        message: 'Cập nhật danh mục thành công!'
                    });
                })
                .catch((err) => {
                    throw new Error(err.message);
                })
        } catch (e) {
            return res.send({
                status: true,
                message: 'Cập nhật danh mục thất bại!',
                error: e
            });
        }
    };
}
module.exports = new AdminCategoryController;