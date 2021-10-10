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
    // [GET] /admin/producer/delete/search
    searchDeleted(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            let page = parseInt(req.query.page) || 1;

            let skip = (page - 1) * process.env.LIMIT_DOS;

            Producer.findDeleted({ name: { $regex: new RegExp((req.query.q ? req.query.q : ''), "i") } }).sort({ createdAt: -1 })
                .then((producer) => {
                    let pageMax = Math.ceil((producer.length / process.env.LIMIT_DOS));
                    let pagePre = ((page > 0) ? page - 1 : 0);
                    let pageNext = ((page < pageMax) ? page + 1 : page);
                    return res.send({
                        producerList: multipleMongooseToObjectOnLimit(producer, process.env.LIMIT_DOS, skip),
                        STT: (((page - 1) * process.env.LIMIT_DOS) + 1),
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
    // [GET] /admin/producer/delete/search?q=&page=

    // [POST] /admin/producer/create
    create(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            let producer = new Producer({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                address: req.body.address
            });
            producer.save()
                .then((producer) => {
                    return res.send({ producer });
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
    // [GET] /admin/producer/:id/edit
    edit(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Producer.findOne({ _id: req.params.id })
                .then((producer) => {
                    return res.send(producer);
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
    // [PUT] /admin/producer/:id/update
    update(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Producer.findOne({ _id: req.params.id })
                .then((producer) => {
                    producer.name = req.body.name;
                    producer.email = req.body.email;
                    producer.phone = req.body.phone;
                    producer.address = req.body.address;

                    Producer.updateOne({ _id: req.params.id }, producer)
                        .then(() => {
                            return res.send({
                                message: 'Cập nhật nhà cung cấp thành công!'
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
    };
    // [DELETE] /admin/producer/:id/delete
    delete(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Producer.delete({ _id: req.params.id })
                .then((producer) => {
                    return res.send({
                        message: 'Xóa nhà cung cấp thành công!'
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
    // [PUT] /admin/producer/:id/restore
    restore(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Producer.restore({ _id: req.params.id })
                .then((producer) => {
                    return res.send({
                        message: 'Khôi phục nhà cung cấp thành công!'
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
    // [DELETE] /admin/producer/:id/destroy
    destroy(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Producer.deleteOne({ _id: req.params.id })
                .then((producer) => {
                    return res.send({
                        message: 'Xóa nhà cung cấp thành công!'
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
module.exports = new AdminProducerController;