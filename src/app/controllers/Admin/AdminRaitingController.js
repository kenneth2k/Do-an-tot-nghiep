const Raiting = require('../../models/Raiting');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { multipleMongooseToObject, singleMongooseToObject, multipleMongooseToObjectOnLimit } = require('../../../util/mongoose');

class AdminRaitingController {
    // [GET] /admin/raiting/search
    search(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            let page = parseInt(req.query.page) || 1;

            let skip = (page - 1) * process.env.LIMIT_DOS;
            let limit = parseInt(process.env.LIMIT_DOS);

            Promise.all([
                    Raiting.aggregate(
                        [{
                                $match: {
                                    createdAt: {
                                        $gte: new Date(`${req.query.dateBefore}T00:00:00+00:00`),
                                        $lte: new Date(`${req.query.dateAfter}T23:59:59+00:00`)
                                    },

                                }
                            }, {
                                $lookup: {
                                    from: "users",
                                    localField: "userSlug",
                                    foreignField: "slug",
                                    as: "user"
                                }
                            },
                            {
                                $lookup: {
                                    from: "products",
                                    localField: "proSlug",
                                    foreignField: "slug",
                                    as: "product"
                                }
                            },
                            { $unwind: { path: "$userInfoData", preserveNullAndEmptyArrays: true } },
                            { $unwind: { path: "$userRoleData", preserveNullAndEmptyArrays: true } }
                        ])
                    .skip(skip)
                    .limit(limit),
                    Raiting.aggregate(
                        [{
                            $match: {
                                createdAt: {
                                    $gte: new Date(`${req.query.dateBefore}T00:00:00+00:00`),
                                    $lte: new Date(`${req.query.dateAfter}T23:59:59+00:00`)
                                },

                            }
                        }])
                ])
                .then(([raiting, sumRaiting]) => {
                    let pageMax = Math.ceil((sumRaiting.length / limit));
                    let pagePre = ((page > 0) ? page - 1 : 0);
                    let pageNext = ((page < pageMax) ? page + 1 : page);
                    return res.send({
                        raitingList: raiting,
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
    // [DELETE] /admin/raiting/:id/delete
    delete(req, res, next) {
        try {
            const token = req.header('Authorization').replace("Bearer ", "");
            const decoded = jwt.verify(token, process.env.EPHONE_STORE_PRIMARY_KEY);
            if (!decoded) throw new Error('TOKEN UNDEFINED!');
            Raiting.delete({ _id: req.params.id })
                .then((raiting) => {
                    return res.send({
                        message: 'Xóa đánh giá thành công!'
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
module.exports = new AdminRaitingController;