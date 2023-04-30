const Model = require("../../model/vipPstComment");
const VipPst = require("../../model/vipPst");
const response = require("../../response");
var config = require('../../config');
var moment = require('jalali-moment');
var offset = parseInt(process.env.ROW_NUMBER);
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
        var first = req.query.first;
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
    GET_ALL_COMMENTS: (req, res, next) => {
        var first = req.query.first;
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
        Model.find({}).sort('id').exec(function (err, docs) {
            req.body.id = docs.reverse()[0].id + 1;
            new Model(req.body).save((err, doc) => {
                if (doc) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next);
                }
            })
        });
    },
    GET_BY_POSTID: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }


        var postId = req.params.postId;

        console.log('postId :::', postId);
        // Model
        //     .aggregate()
        //     .match({
        //         $and: [
        //             { 'postId': config.ObjectIdConvertor(postId) },
        //             { 'isActive': true },
        //             { 'isDelete': false }
        //         ]
        //     })
        //     // .lookup({
        //     //     from: "people",
        //     //     localField: "userId",
        //     //     foreignField: "_id",
        //     //     as: "userData"
        //     // })
        //     .limit(offset)
        //     .skip(first)
        //     .sort({ createdAt: -1 })
        //     .exec((err, data) => {
        //         var items = [];
        //         var userData = {};
        //         var len = data.length;
        //         for (var i = 0; i < len; i++) {


        //             // userData = {
        //             //     _id: data[i]['userData'][0]._id,
        //             //     phone: data[i]['userData'][0].phone,
        //             //     avatar: "https://api.sabkino.com/uploads/files/" + data[i]['userData'][0].avatar,
        //             //     cover: data[i]['userData'][0].cover,
        //             //     createdAt: data[i]['userData'][0].createdAt,
        //             //     enName: data[i]['userData'][0].enName,
        //             //     firstName: data[i]['userData'][0].firstName,
        //             //     class: data[i]['userData'][0].class,
        //             //     isActive: data[i]['userData'][0].isActive,
        //             //     isExit: data[i]['userData'][0].isExit,
        //             //     isConfirmed: data[i]['userData'][0].isConfirmed,
        //             //     isDelete: data[i]['userData'][0].isDelete,
        //             //     isSetProgramAccess: data[i]['userData'][0].isSetProgramAccess,
        //             //     isWalletActive: data[i]['userData'][0].isWalletActive,
        //             //     lastName: data[i]['userData'][0].lastName,
        //             //     notificationKey: data[i]['userData'][0].notificationKey,
        //             //     password: data[i]['userData'][0].password,
        //             //     referalCode: data[i]['userData'][0].referalCode,
        //             //     supportCode: data[i]['userData'][0].supportCode,
        //             //     updatedAt: data[i]['userData'][0].updatedAt,
        //             //     walletBalance: data[i]['userData'][0].walletBalance,
        //             //     last_seen: data[i]['userData'][0].last_seen,
        //             //     channelId: data[i]['userData'][0].channelId,
        //             //     sheba: data[i]['userData'][0].sheba,
        //             //     follower: data[i]['userData'][0].follower,
        //             //     posts: data[i]['userData'][0].posts,
        //             //     personalCode: data[i]['userData'][0].personalCode,
        //             //     bankName: data[i]['userData'][0].bankName,
        //             //     lastPostPublished: data[i]['userData'][0].lastPostPublished,
        //             //     todayPostCount: data[i]['userData'][0].todayPostCount,
        //             //     following: data[i]['userData'][0].following,
        //             //     expirePackageDate: data[i]['userData'][0].expirePackageDate,
        //             //     expireExamPackageDate: data[i]['userData'][0].expireExamPackageDate,
        //             //     isChannel: data[i]['userData'][0].isChannel,
        //             //     schoolId: data[i]['userData'][0].schoolId,
        //             // };

        //             items.push({
        //                 _id: data[i]['_id'],
        //                 isReply: data[i]['isReply'],
        //                 userData: data[i]['userId'],
        //                 postId: data[i]['postId'],
        //                 commentText: data[i]['commentText'],
        //                 createdAt: moment(data[i]['createdAt'], 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
        //                 updatedAt: data[i]['updatedAt'],
        //                 // userData: userData
        //             });

        //             // data[i]['userData'][0].avatar = "https://api.sabkino.com/uploads/files/" + data[i]['userData'][0].avatar;
        //             // data[i]['createdAt'] = moment(data[i]['createdAt'], 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm');
        //         }
        //         req.data = items;
        //         response.ok(req, res, next);
        //     });







            Model.find({
                postId:postId,
                isActive:true,
                isDelete:false,
            })
            .limit(offset)
            .skip(first)
            .sort({ createdAt: -1 })
            .exec((err, data) => {
                var items = [];
                var userData = {};
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    items.push({
                        _id: data[i]['_id'],
                        isReply: data[i]['isReply'],
                        userData: data[i]['userId'],
                        class: data[i]['userId'].class,
                        postId: data[i]['postId'],
                        commentText: data[i]['commentText'],
                        createdAt: moment(data[i]['createdAt'], 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                        updatedAt: data[i]['updatedAt'],
                        // userData: userData
                    });
                }
                req.data = items;
                response.ok(req, res, next);
            });
    },
    GET_POSTID: (req, res, next) => {
        Model.find({ postId: req.params.postId }).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },
    DELETE_POST_COMMEMT: (req, res, next) => {
        var commentId = req.query.commentId;
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        if(strClass=='support')
        {
            userId = req.data.personInfo.supportMentorId._id;
        }

        Model.findById(commentId).exec((err, doc) => {
            if (err) {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            } else {
                if (doc) {
                    console.log('doc.userId :::', doc.userId.id);
                    console.log('userId :::', userId);
                    if (doc.userId._id.toString() == userId.toString()) {
                        var query = {
                            '_id': commentId,
                        };
                        Model.findOneAndDelete(query).exec(() => {
                            response.ok(req, res, next);
                        });
                    } else {
                        response.error(req, res, next, 'دسترسی حذف پست ندارید');
                    }
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            }
        });
    },
    POST_CUSTOM_ITEM: (req, res, next) => {
        var strClass = req.data.personInfo.class;
        var userId = req.data.personInfo._id;
        var postId = req.body.postId;
        var replyId = req.body.replyId;
        var commentText = req.body.commentText;

        var isReply = false;
        if (typeof replyId === 'undefined') {
            replyId = null;
        }
        else {
            isReply = true;
        }


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
                        'postId': postId,
                        'replyId': replyId,
                        'isReply': isReply,
                        'commentText': commentText,
                    };


                    VipPst.findById(postId).exec(function (errPost, docPost) {
                        if (docPost) {
                            var postComment = 0;
                            var postLike = 0;
                            var postSaved = 0;
                            var follower = 0;

                            postComment = docPost.postComment;
                            postLike = docPost.postLike;
                            postSaved = docPost.postSaved;
                            follower = docPost.userId.follower;


                            var postTopRate = parseInt(((postLike + postComment + postSaved) * 100) / follower);

                            if (!postTopRate) {
                                postTopRate = 0;
                            }


                            VipPst.findByIdAndUpdate(postId, {
                                postComment: postComment + 1,
                                postTopRate: postTopRate
                            }, {
                                new: true,
                                runValidators: true
                            }).exec((errComment, docComment) => {
                                if (docComment) {
                                    new Model(query).save((err, doc) => {
                                        if (doc) {
                                            req.data.item = doc;
                                            response.ok(req, res, next,'با موفقیت ثبت شد');
                                        } else {

                                            response.error(req, res, next);
                                        }
                                    });
                                } else {
                                    response.error(req, res, next);
                                }
                            });
                        }
                        else {
                            response.error(req, res, next, 'اطلاعات یافت نشد');
                        }
                    });
                }
                else {
                    response.error(req, res, next, 'تعداد کامنت های ثبت شده بیش از حد مجاز است');
                }
            }
            else {
                response.error(req, res, next, 'مشکل در عملیات بوجود آمده');
            }
        });

    },
};