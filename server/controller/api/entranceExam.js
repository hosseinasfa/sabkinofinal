const response = require('../../response');
const config = require('../../config');
var EntranceExam = require('../../model/entranceExam');
var EntranceExam2 = require('../../model/entranceExam2');

module.exports = {
    GET_SUBS: (req, res, next) => {
        EntranceExam.find({
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
        new EntranceExam(req.body).save((err, doc) => {
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
        EntranceExam
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
        EntranceExam.findByIdAndUpdate(req.params.subId, {
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
        EntranceExam.findByIdAndUpdate(req.params.subId, {
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