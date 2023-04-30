const Model = require("../../model/bookComment");
const response = require("../../response");
var config = require('../../config');
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
            // .limit(offset)
            // .skip(first)
            .sort({ createdAt: -1 })
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
            })
    },
    GET_ALL_COMMENT_ITEMS: (req, res, next) => {
        var first = req.query.first;
        var bookId = req.query.bookId;

        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        Model.find({
            bookId: bookId,
            isActive: true,
            isDelete: false
        })
            .limit(offset)
            .skip(first)
            .sort({ createdAt: -1 })
            .exec((err, docs) => {
                if (docs) {
                    var items = [];

                    var len = docs.length;
                    for (var i = 0; i < len; i++) {
                        var createdAt = moment(docs[i]['createdAt'], 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm');
                        //docs[i]['createdAt'] = moment(docs[i]['createdAt'], 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm');
                        items.push({
                            "commentText": docs[i]['commentText'],
                            "isActive": docs[i]['isActive'],
                            "isDelete": docs[i]['isDelete'],
                            "_id": docs[i]['_id'],
                            "userId": docs[i]['userId'],
                            "bookId": docs[i]['bookId'],
                            "createdAt": createdAt,
                            "updatedAt": docs[i]['updatedAt'],
                            "id": docs[i]['id'],
                        });
                    }

                    req.data.items = items;
                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
    },

    DELETE_ITEM: (req, res, next) => {
        var itemId = req.query.itemId;
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }
        console.log('itemId :::::::', itemId);
        Model.findById(itemId).exec((errComment, docComment) => {
            if (errComment) {
                response.error(req, res, next);
            } else {
                if (docComment) {

                    if (userId.toString() == docComment.userId._id.toString()) {
                        var query = {
                            '_id': itemId,
                        };

                        Model.findOneAndDelete(query).exec((err, doc) => {
                            if (err) {
                                response.error(req, res, next);
                            } else {
                                response.ok(req, res, next);
                            }
                        });
                    }
                    else {
                        response.error(req, res, next, 'دسترسی ندارید');
                    }
                } else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            }
        });

    },

    POST_ITEM: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var bookId = req.body.bookId;
        var commentText = req.body.commentText;
        if(strClass=='support')
        {
            userId = req.data.personInfo.supportMentorId._id;
        }

        moment.locale('en');
        var current_date = moment().format('YYYY-MM-DD');
        var start_date = current_date;
        var end_date = current_date;


        start_date = start_date + 'T00:00:00.000Z';
        end_date = end_date + 'T23:59:59.000Z';
        console.log('start_date :', start_date);
        console.log('end_date :', end_date);


        if (typeof bookId !== 'undefined' && typeof commentText !== 'undefined') {

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
                            'userId': userId,
                            'bookId': bookId,
                            'commentText': commentText,
                        };
                        new Model(query).save((err, doc) => {
                            if (doc) {
                                req.data.item = doc;
                                response.ok(req, res, next, 'با موفقیت ثبت گردید');
                            } else {
                                response.error(req, res, next);
                            }
                        });

                    }
                    else {
                        response.error(req, res, next, 'تعداد کامنت های ثبت شده بیش از حد مجاز است');
                    }
                }
                else {
                    response.error(req, res, next);
                }
            });
        }
        else {
            response.error(req, res, next, 'اطلاعات وارد شده معتبر نیست');
        }
    }
};