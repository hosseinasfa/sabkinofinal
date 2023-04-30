const Model = require("../../model/periodMentorReport");
const periodMentor = require("../../model/periodMentor");
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
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
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
                    response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
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
        var first = req.params.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        Model.find({})
            // .limit(offset)
            // .skip(first)
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
            })
    },
    POST_ITEM: (req, res, next) => {
        var periodMentorId = req.body.periodMentorId;
        var userIdReport = req.body.userIdReport;
        var reportTitle = req.body.reportTitle;
        // console.log('req.body ::: ', req.body);
        periodMentor.findById(periodMentorId).exec((errPeriodMentor, docPeriodMentor) => {
            if (docPeriodMentor) {
                if (userIdReport != docPeriodMentor.userId._id.toString()) {
                    var query = {
                        periodMentorId: periodMentorId,
                        userIdReport: userIdReport,
                        reportTitle: reportTitle,
                    };
                    new Model(req.body).save((err, doc) => {
                        if (doc) {
                            req.data.item = doc;
                            response.ok(req, res, next, 'گزارش با موفقیت ثبت گردید');
                        } else {
                            response.error(req, res, next);
                        }
                    });
                }
                else {
                    response.error(req, res, next, 'دسترسی ندارید');
                }

            }
            else {
                response.error(req, res, next, 'اطلاعات یافت نشد');
            }
        });
    },

};