const Model = require("../../model/periodMentorComment");
const response = require("../../response");
var config = require('../../config');
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
    DELETE_ITEM: (req, res, next) => {
        var itemId = req.query.itemId;
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        console.log('itemId :::::::', itemId);

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }

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
                            if (doc) {
                                response.ok(req, res, next, 'با موفقیت حذف گردید');
                            } else {
                                response.error(req, res, next, 'مشکل در حذف آیتم');
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
    GET_ALL_COMMENT_ITEMS: (req, res, next) => {
        var first = req.query.first;
        var periodMentorId = req.query.periodMentorId;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }


        function getReplayResult(itemId) {
            return new Promise((resolve) => {
                console.log('itemId:::::::::::   ', itemId);
                var items = [];
                Model.find({
                    "replyId": itemId,
                    "type": 'reply',
                    "isActive": true,
                    "isDelete": false
                })
                    .populate('userId')
                    .sort({ createdAt: -1 })
                    .exec((errReply, docsReply) => {

                        if (docsReply) {
                            var lenReply = docsReply.length;
                            for (const item of docsReply) {
                                var createdAtReply = moment(item.createdAt, 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm');
                                items.push({
                                    "commentText": item.commentText,
                                    "isActive": item.isActive,
                                    "isDelete": item.isDelete,
                                    "_id": item._id,
                                    "type": item.type,
                                    "userId": item.userId,
                                    "periodMentorId": item.periodMentorId,
                                    "createdAt": createdAtReply,
                                    "updatedAt": item.updatedAt,
                                    "id": item.id,
                                });
                            }

                            resolve(items);
                        }
                        else {
                            resolve(items);
                        }
                    });



                // PostBookmark.findOne({ postId: itemId,personId:personId, bookMark: true }).exec(async (err2, doc2) => {
                //     if (doc2) {
                //         resolve(true);
                //     }
                //     else {
                //         resolve(false);
                //     }

                // });


            });
        }

        async function f1(item) {
            const replyData = await getReplayResult(item);
            console.log(replyData);
            return replyData;

        }
        async function getReplayData(itemId) {
            return await f1(itemId);
        }


        async function getList(docs) {
            var items = [];
            for (const item of docs) {
                var createdAt = moment(item.createdAt, 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm');
                console.log("createdAt ::::", createdAt);
                const replyData = await getReplayData(item._id.toString());
                //docs[i]['createdAt'] = createdAt;
                items.push({
                    "commentText": item.commentText,
                    "isActive": item.isActive,
                    "isDelete": item.isDelete,
                    "replyData": replyData,
                    "_id": item._id,
                    "type": item.type,
                    "userId": item.userId,
                    "periodMentorId": item.periodMentorId,
                    "createdAt": createdAt,
                    "updatedAt": item.updatedAt,
                    "id": item.id,
                });





            }
            req.data.items = items;
            response.ok(req, res, next);
        }




        Model.find({
            "periodMentorId": periodMentorId,
            "type": 'text',
            "isActive": true,
            "isDelete": false
        })
            .limit(offset)
            .skip(first)
            .populate('userId')
            .sort({ createdAt: -1 })
            .exec((err, docs) => {
                if (docs) {

                    getList(docs);

                    // var len = docs.length;
                    // var items = [];
                    // for (var i = 0; i < len; i++) {
                    //     var createdAt = moment(docs[i]['createdAt'], 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm');
                    //     console.log("createdAt ::::", createdAt);
                    //docs[i]['createdAt'] = createdAt;




                    // Model.find({
                    //     "replyId": docs[i]['_id'],
                    //     "type": 'reply',
                    //     "isActive": true,
                    //     "isDelete": false
                    // })
                    //     .populate('userId')
                    //     .sort({ createdAt: -1 })
                    //     .exec((errReply, docsReply) => {

                    //         if(docsReply)
                    //         {
                    //             var lenReply = docsReply.length;

                    //             for (var j = 0; j < lenReply; j++) {
                    //                 var createdAtReply = moment(docsReply[j]['createdAt'], 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm');
                    //                 items.push({
                    //                     "commentText": docsReply[j]['commentText'],
                    //                     "isActive": docsReply[j]['isActive'],
                    //                     "isDelete": docsReply[j]['isDelete'],
                    //                     "_id": docsReply[j]['_id'],
                    //                     "type": docsReply[j]['type'],
                    //                     "userId": docsReply[j]['userId'],
                    //                     "periodMentorId": docsReply[j]['periodMentorId'],
                    //                     "createdAt": createdAtReply,
                    //                     "updatedAt": docsReply[j]['updatedAt'],
                    //                     "id": docsReply[j]['id'],
                    //                 });
                    //             }
                    //         }
                    //     });


                    // items.push({
                    //     "commentText": docs[i]['commentText'],
                    //     "isActive": docs[i]['isActive'],
                    //     "isDelete": docs[i]['isDelete'],
                    //     "_id": docs[i]['_id'],
                    //     "type": docs[i]['type'],
                    //     "userId": docs[i]['userId'],
                    //     "periodMentorId": docs[i]['periodMentorId'],
                    //     "createdAt": createdAt,
                    //     "updatedAt": docs[i]['updatedAt'],
                    //     "id": docs[i]['id'],
                    // });
                    // }

                    // req.data.items = items;
                    // response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
    },
    POST_REPLY_ITEM: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var periodMentorId = req.body.periodMentorId;
        var replyId = req.body.replyId;
        var commentText = req.body.commentText;

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }


        PeriodMentor.findById(periodMentorId).exec((errPeriod, docPeriod) => {

            console.log('docPeriod ::::: ', docPeriod);
            if (docPeriod) {
                if (docPeriod.userId._id.toString() == userId.toString()) {
                    var query = {
                        'periodMentorId': periodMentorId,
                        'replyId': replyId,
                        'userId': userId,
                        'type': 'reply',
                        'commentText': commentText,
                    };
                    new Model(query).save((err, doc) => {
                        if (doc) {
                            req.data.item = doc;
                            response.ok(req, res, next);
                        } else {
                            response.error(req, res, next, 'عملیات با مشکل مواجه شد');
                        }
                    });
                }
                else {
                    response.error(req, res, next, 'شما دسترسی ندارید');
                }
            }
            else {
                response.error(req, res, next, 'عملیات با مشکل مواجه شد');
            }
        });
    },

    POST_COMMENT_ITEM: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var periodMentorId = req.body.periodMentorId;
        var commentText = req.body.commentText;

        if (strClass == 'support') {
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


        if (typeof periodMentorId !== 'undefined' && typeof commentText !== 'undefined') {

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
                            'periodMentorId': periodMentorId,
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