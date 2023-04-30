const Model = require("../../model/periodMentorBookmark");
const response = require("../../response");
var config = require('../../config');
// const PeriodMentor = require('../../model/periodMentor');
var offset = parseInt(process.env.ROW_NUMBER);
var moment = require('jalali-moment');

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
    GET_BOOK_ITEMS: (req, res, next) => {
        var first = req.query.first;
        var userId = req.data.personInfo._id;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        Model.find({ userId: userId })
            .populate('periodMentorId')
            .limit(offset)
            .skip(first)
            .sort({ createdAt: -1 })
            .exec((err, docs) => {
                if (docs) {

                    // console.log('docs ::: ', docs);
                    if (docs.length > 0) {
                        req.data.items = docs;
                        response.ok(req, res, next);
                    }
                    else {
                        response.error(req, res, next);
                    }
                }
                else {
                    response.error(req, res, next);
                }
            });

    },
    POST_BOOK_ITEM: (req, res, next) => {
        var periodMentorId = req.body.periodMentorId;
        var userId = req.data.personInfo._id;

        var query = {
            periodMentorId: periodMentorId,
            userId: userId,
        };

        Model.find({ periodMentorId: periodMentorId, userId: userId }).exec((errBookmark, docBookmark) => {
            if (docBookmark) {
                if (docBookmark.length == 0) {
                    new Model(query).save((err, doc) => {
                        if (doc) {
                            response.ok(req, res, next, 'با موفقیت ثبت گردید');
                        } else {
                            response.error(req, res, next);
                        }
                    })
                }
                else {
                    Model.findOneAndDelete(query).exec(() => {
                        response.ok(req, res, next, 'با موفقیت حذف گردید');
                    });
                }
            }
            else {
                response.error(req, res, next);
            }
        });
    },

};