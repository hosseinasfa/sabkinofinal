const Model = require("../../model/periodMentorMediaComment");
const response = require("../../response");
var config = require('../../config');
const periodMentorMedia = require('../../model/periodMentorMedia');
const PeriodMentor = require('../../model/periodMentor');
var offset = parseInt(process.env.ROW_NUMBER);
var moment = require('jalali-moment');
var COMMENT_LIMIT = parseInt(process.env.COMMENT_LIMIT);

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
            .limit(offset)
            .skip(first)
            .sort({ createdAt: -1 })
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
            })
    },
    POST_ITEM: (req, res, next) => {
        new Model(req.body).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
    },
    PERIOD_MENTOR_ID: (req, res, next) => {
        var periodMentorId = req.params.periodMentorId;
        periodMentorMedia
            .aggregate()
            .match({
                $and: [
                    { 'periodMentorId': config.ObjectIdConvertor(periodMentorId) },
                    { isActive: true },
                    { isDelete: false }
                ]
            })
            .exec((err, data) => {
                if (data.length == 0) {
                    response.error(req, res, next, 'not found');
                    return;
                } else {
                    var responseData = [];
                    data.forEach(item => {
                        req.data = responseData;
                        response.ok(req, res, next);
                    });
                }
            });
    },
    DELETE_COMMEMT: (req, res, next) => {
        var itemId = req.query.itemId;
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }

        Model.findById(itemId).exec((err, doc) => {
            if (doc) {
                console.log('doc.userId._id :::', doc.userId._id.toString());
                console.log('userId :::', userId);
                if (doc.userId._id.toString() == userId.toString()) {
                    var query = {
                        '_id': itemId,
                    };
                    Model.findOneAndDelete(query).exec(() => {
                        response.ok(req, res, next, 'اطلاعات با موفقیت حذف گردید');
                    });
                } else {
                    response.error(req, res, next, 'دسترسی حذف را ندارید');
                }
            }
            else {
                response.error(req, res, next, 'اطلاعات یافت نشد');
            }
        });
    },
    GET_COMMENT: (req, res, next) => {
        var periodMentorMediaId = req.query.periodMentorMediaId;
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        // console.log('first :::', first);
        // console.log('periodMentorMediaId :::', periodMentorMediaId);
        moment.locale('en');

        Model.find({
            'periodMentorMediaId': periodMentorMediaId,
            'isActive': true,
            'isDelete': false
        })
            .limit(offset)
            .skip(first)
            .sort({ createdAt: -1 })
            .exec((err, docs) => {
                if (err) {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                } else {
                    if (docs.length != 0) {


                        var items = [];
                        docs.forEach(item => {
                            var new_date = item.createdAt.toISOString().substring(0, 10);
                            new_date = moment(new_date, 'YYYY-MM-DD').locale('fa').format('YYYY/MM/DD');

                            items.push({
                                replyId: item.replyId,
                                commentText: item.commentText,
                                isActive: item.isActive,
                                isDelete: item.isDelete,
                                periodMentorMediaId: item.periodMentorMediaId,
                                userId: item.userId,
                                createdAt: new_date,
                                updatedAt: new_date,
                            })
                        });
                        
                        req.data.items = items;
                        response.ok(req, res, next);
                    } else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                }
            });
    },
    POST_CUSTOM_ITEM: (req, res, next) => {
        var periodMentorMediaId = req.body.periodMentorMediaId;
        var userId = req.data.personInfo._id.toString();
        var strClass = req.data.personInfo.class;
        var commentText = req.body.commentText;

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id.toString();
        }

        moment.locale('en');
        var current_date = moment().format('YYYY-MM-DD');
        var start_date = current_date;
        var end_date = current_date;


        start_date = start_date + 'T00:00:00.000Z';
        end_date = end_date + 'T23:59:59.000Z';
        console.log('start_date :', start_date);
        console.log('end_date :', end_date);


        Model.find({
            'userId': userId,
            'createdAt': {
                $gte: start_date,
                $lt: end_date
            }
        }).exec(function (errCom, docComs) {
            if (docComs) {
                console.log("docComs.length :::::", docComs.length);
                if (docComs.length < COMMENT_LIMIT) {
                    var query = {
                        'periodMentorMediaId': periodMentorMediaId,
                        'userId': userId,
                        'commentText': commentText,
                    };


                    new Model(query).save((err, doc) => {
                        if (doc) {
                            req.data.item = doc;
                            response.ok(req, res, next, 'اطلاعات با موفقیت ثبت گردید');
                        } else {

                            console.log('err ::: ', err);
                            response.error(req, res, next, 'مشکل در ثبت آیتم');
                        }
                    });
                }
                else {
                    response.error(req, res, next, 'تعداد کامنت های ثبت شده بیش از حد مجاز است');
                }
            }
            else {
                response.error(req, res, next, 'مشکل در ثبت آیتم');
            }
        });


    },
    POST_REPLY_ITEM: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var periodMentorMediaId = req.body.periodMentorMediaId;
        var replyId = req.body.replyId;
        var commentText = req.body.commentText;

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }


        var query = {
            'periodMentorMediaId': periodMentorMediaId,
            'replyId': replyId,
            'userId': userId,
            'commentText': commentText,
        };
        new Model(query).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        });
    },


};