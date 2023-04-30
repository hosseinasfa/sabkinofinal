const Model = require("../../model/feedbackCallUser");
const OnlineCallPackage = require("../../model/onlineCallPackage");
const response = require("../../response");
var config = require('../../config');
var offset = parseInt(process.env.ROW_NUMBER);

module.exports = {
    GET_EACH_ITEM: (req, res, next) => {
        Model.findById(req.params.itemId).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, '(FBCU-001) چنین آیتمی موجود نمی باشد');
            }
        })
    },
    PUT_EACH_ITEM: (req, res, next) => {
        var updateQuery = req.body;
        Model
            .findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
            .exec((err, doc) => {
                if (doc) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, '(FBCU-002) مشکل در بروزرسانی آیتم');
                }
            })
    },
    PUT_ITEM_ACTIVE: (req, res, next) => {
        Model.findByIdAndUpdate(req.params.itemId, {
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
    PUT_ITEM_DE_ACTIVE: (req, res, next) => {
        Model.findByIdAndUpdate(req.params.itemId, {
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
    GET_ALL_ITEMS: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        Model.find({})
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
            })
    },
    POST_ITEM: (req, res, next) => {
        var query = {
            'userId': userId,
            'mentorId': mentorId,
            'status': status,
            'customer_satisfaction': customer_satisfaction,
            'mentor_skill': mentor_skill,
            'ethics_fundamental': ethics_fundamental,
            'mentor_result': mentor_result,
            'availability_conditions': availability_conditions,
            'onlineCallPackageId': onlineCallPackageId,
            'critics': critics,
        };

        OnlineCallPackage.findByIdAndUpdate(onlineCallPackageId, {
            'status': status
        }, {
            new: true,
            runValidators: true
        }).exec((errCallPackage, docCallPackage) => {
            if (docCallPackage) {
                new Model(query).save((err, doc) => {
                    if (doc) {
                        req.data.item = doc;
                        response.ok(req, res, next);
                    } else {
                        response.error(req, res, next);
                    }
                });
            } else {
                response.error(req, res, next);
            }
        })

    }
};