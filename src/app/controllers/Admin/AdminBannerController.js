const Banner = require('../../models/Banner');
const jwt = require('jsonwebtoken');

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
    }
}
module.exports = new AdminBannerController;