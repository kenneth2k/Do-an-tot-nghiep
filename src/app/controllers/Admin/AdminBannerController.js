const Banner = require('../../models/Banner');
const jwt = require('jsonwebtoken');
var fs = require('fs');
const path = require('path');

class AdminBannerController {
    // [GET] /admin/banner
    index(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Banner.find({})
                .then((banner) => {
                    return res.send({
                        bannerList: banner
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
    // [PUT] /admin/banner/:id
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
}
module.exports = new AdminBannerController;