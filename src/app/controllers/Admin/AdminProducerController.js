const Producer = require('../../models/Producer');
const jwt = require('jsonwebtoken');
const { multipleMongooseToObject, singleMongooseToObject, multipleMongooseToObjectOnLimit } = require('../../../util/mongoose');

class AdminProducerController {
    // [GET] /admin/producer/search
    search(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            let page = parseInt(req.query.page) || 1;

            let skip = (page - 1) * process.env.LIMIT_DOS;

            Promise.all([
                    Producer.find({ name: { $regex: new RegExp((req.query.q ? req.query.q : ''), "i") } }).sort({ createdAt: -1 }),
                    Producer.countDocuments({ name: { $regex: new RegExp((req.query.q ? req.query.q : ''), "i") } }).sort({ createdAt: -1 }),
                    Producer.countDocumentsDeleted({})
                ])
                .then(([producer, sumProducer, sumDeleted]) => {
                    let pageMax = Math.ceil((producer.length / process.env.LIMIT_DOS));
                    let pagePre = ((page > 0) ? page - 1 : 0);
                    let pageNext = ((page < pageMax) ? page + 1 : page);
                    return res.send({
                        producerList: multipleMongooseToObjectOnLimit(producer, process.env.LIMIT_DOS, skip),
                        STT: (((page - 1) * process.env.LIMIT_DOS) + 1),
                        sumProducer,
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
    // [GET] /admin/producer/search?q=&page=

    // [GET] /admin/producer/delete/search?q=&page=

    // [POST] /admin/producer/create

    // [GET] /admin/producer/:id/edit

    // [PUT] /admin/producer/:id/update

    // [DELETE] /admin/producer/:id/delete

    // [PUT] /admin/producer/:id/restore

    // [DELETE] /admin/producer/:id/destroy
}
module.exports = new AdminProducerController;