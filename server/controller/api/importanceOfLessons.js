const response = require('../../response');
const config = require('../../config');
var ImportanceOfLessons = require('../../model/importanceOfLessons');

module.exports = {
    GET_SUBS: (req, res, next) => {
        ImportanceOfLessons.find({
            parent: req.params.itemId
        }).exec((err, docs) => {
            if (docs) {
                req.data.items = docs;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
            }
        })
    },
    POST_SUBS: (req, res, next) => {
        req.body.parent = req.params.itemId;
        new ImportanceOfLessons(req.body).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
            }
        })
    },
    PUT_SUB_ITEM: (req, res, next) => {
        var updateQuery = req.body;
        ImportanceOfLessons
            .findByIdAndUpdate(req.params.subId, updateQuery, config.mongooseUpdateOptions)
            .exec((err, doc) => {
                if (doc) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
                }
            })
    },
    ACTIVE_SUB_ITEM: (req, res, next) => {
        ImportanceOfLessons.findByIdAndUpdate(req.params.subId, {
            isActive: true
        }, {
            new: true,
            runValidators: true
        }).exec((err, doc) => {
            if (doc) {
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
    },
    DE_ACTIVE_SUB_ITEM: (req, res, next) => {
        ImportanceOfLessons.findByIdAndUpdate(req.params.subId, {
            isActive: false
        }, {
            new: true,
            runValidators: true
        }).exec((err, doc) => {
            if (doc) {
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
    },
}