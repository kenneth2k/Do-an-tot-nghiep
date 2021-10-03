const Banner = require('../../models/Banner');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { multipleMongooseToObject, singleMongooseToObject , multipleMongooseToObjectOnLimit} = require('../../../util/mongoose');

class AdminBannerController {
    // [GET] /admin/banner
    index(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Promise.all([
                Banner.find({}).sort({createdAt: -1}),
                Banner.countDocuments({}).sort({createdAt: -1}),
                Banner.countDocumentsDeleted({}).sort({createdAt: -1})
            ])
                .then(([banner, countActive, countDelete]) => {
                    return res.send({
                        bannerList: banner,
                        countActive,
                        countDelete
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
    // [GET] /admin/banner/delete
    deleteList(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');

            let page = parseInt(req.query.page) || 1;

            let skip = (page - 1) * process.env.LIMIT_DOS;
            Promise.all([
                Banner.findDeleted({}).sort({createdAt: -1}),
                Banner.countDocumentsDeleted({}).sort({createdAt: -1})
            ])
                .then(([banner, sumBanner]) => {
                    let pageMax = Math.ceil((banner.length / process.env.LIMIT_DOS));
                    let pagePre = ((page > 0)? page - 1 : 0);
                    let pageNext = ((page < pageMax)? page + 1: page);
                    return res.send({
                        bannerList: multipleMongooseToObjectOnLimit(banner, process.env.LIMIT_DOS , skip),
                        sumDeleted: sumBanner,
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
    // [GET] /admin/banner/delete/search?q=&page=
    deleteListSearch(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');

            let page = parseInt(req.query.page) || 1;

            let skip = (page - 1) * process.env.LIMIT_DOS;
            Promise.all([
                Banner.findDeleted({ title: { $regex: new RegExp((req.query.q ? req.query.q : ''), "i") } }).sort({createdAt: -1}),
                Banner.countDocumentsDeleted({ title: { $regex: new RegExp((req.query.q ? req.query.q : ''), "i") } }).sort({createdAt: -1})
            ])
                .then(([banner, sumBanner]) => {
                    let pageMax = Math.ceil((banner.length / process.env.LIMIT_DOS));
                    let pagePre = ((page > 0)? page - 1 : 0);
                    let pageNext = ((page < pageMax)? page + 1: page);
                    return res.send({
                        bannerList: multipleMongooseToObjectOnLimit(banner, process.env.LIMIT_DOS , skip),
                        sumDeleted: sumBanner,
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
    // [POST] /admin/banner/create
    create(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            let banner = new Banner({
                title: req.body.title,
                content: req.body.content,
                images: req.file.filename
            });
            banner.save()
                .then((banner) => {
                    return res.send({ banner });
                })
                .catch((e) => {
                    return res.send({ banner });
                })
        } catch (e) {
            return res.send({
                message: e
            })
        }
    };
    // [GET] /admin/banner/:id/edit
    edit(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Banner.findOne({ _id: req.params.id })
                .then((banner) => {
                    return res.send(banner);
                })
                .catch((err) => {
                    throw new Error('FIND NOT FOUND!');
                })
        } catch (e) {
            return res.send({
                message: e
            })
        }
    };
    // [DELETE] /admin/banner/:id/update
    update(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Banner.findOne({ _id: req.params.id })
                .then((banner) => {
                    banner.title = req.body.title;
                    banner.content = req.body.content;
                    if (req.file !== undefined) {
                        try {
                            fs.unlinkSync(path.join(__dirname, `../../../public/images/background/${banner.images}`));
                        } catch (e) {

                        }
                        banner.images = req.file.filename;
                    }
                    Banner.updateOne({ _id: req.params.id }, banner)
                        .then(() => {
                            return res.send({
                                message: 'Cập nhật ảnh bìa thành công!'
                            });
                        })
                        .catch((err) => {
                            throw new Error('UPDATE FAILURE!');
                        })
                })
                .catch((err) => {
                    throw new Error('FIND NOT FOUND!');
                })
        } catch (e) {
            return res.send({
                message: e
            })
        }
    }
    // [PUT] /admin/banner/:id/delete
    delete(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Banner.delete({ _id: req.params.id })
                .then((banner) => {
                    return res.send({
                        message: 'Xóa ảnh bìa thành công!'
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
    }
}
module.exports = new AdminBannerController;