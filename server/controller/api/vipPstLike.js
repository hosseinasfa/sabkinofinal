const Model = require("../../model/vipPstLike");
const VipPst = require("../../model/vipPst");
const response = require("../../response");
var config = require('../../config');
var moment = require('jalali-moment');
const Person = require("../../model/person").Person;
var offset = parseInt(process.env.ROW_NUMBER);
var LIKE_LIMIT = parseInt(process.env.LIKE_LIMIT);

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
            first = parseInt(first) * offsetoffset;
        }

        Model
            .find({})
            .limit(offset)
            .skip(first)
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
        });
    },
    PUT_LIKE_DISLIKE_ITEM: (req, res, next) => {
        var strClass = req.data.personInfo.class;
        var userId = req.data.personInfo._id;

        var postId = req.params.postId;
        var likeCount = 0;

        if(strClass=='support')
        {
            userId = req.data.personInfo.supportMentorId._id;
        }


        var postComment = 0;
        var postLike = 0;
        var postSaved = 0;
        var follower = 0;
        var postTopRate = 0;


        VipPst.findById(postId).exec((err, doc) => {
            likeCount = doc.postLike;
            postComment = doc.postComment;
            postSaved = doc.postSaved;
            follower = doc.userId.follower;
            console.log('likeCount :', likeCount);
        });


        moment.locale('en');
        var current_date = moment().format('YYYY-MM-DD');
        var start_date = current_date;
        var end_date = current_date;


        start_date = start_date + 'T00:00:00.000Z';
        end_date = end_date + 'T23:59:59.000Z';
        console.log('start_date :', start_date);
        console.log('end_date :', end_date);




        Model.find({
            $and: [
                { 'userId': userId },
                { 'postId': postId }
            ]
        }).exec((err, data) => {
            likeId = data._id;
            if (data.length == 0) {
                Model.find({
                    'userId': userId,
                    'createdAt': {
                        $gte: start_date,
                        $lt: end_date
                    }
                }).exec(function (errLike, docLikes) {
                    if (docLikes) {
                        console.log("docLikes.length :::::", docLikes.length);
                        if (docLikes.length < LIKE_LIMIT) {
                            const vipPstLike = new Model({
                                userId: userId,
                                postId: postId,
                            });
                            vipPstLike.save(function (err, result) {
                                if (err) {
                                    console.log(err);
                                } else {
                                    // VipPst.findById(postId).exec((err, doc) => {
                                    //     likeCount = doc.postLike
                                    //     console.log('likeCount :',likeCount)
                                    // });


                                    postTopRate = parseInt((((likeCount + 1) + postComment + postSaved) * 100) / follower);
                                    if (!postTopRate) {
                                        postTopRate = 0;
                                    }

                                    console.log('likeCount :::::', likeCount);
                                    console.log('postTopRate :::::', postTopRate);
                                    VipPst.findByIdAndUpdate(postId, {
                                        'postLike': (likeCount + 1),
                                        'postTopRate': postTopRate,
                                    },
                                        {
                                            new: true,
                                            runValidators: true
                                        }).exec((err, doc) => {
                                            if (doc) {
                                                // console.log('doc :', doc);
                                            } else {
                                                console.log('err :', err);
                                            }
                                        });

                                    response.ok(req, res, next);


                                }
                            });

                        }
                        else {
                            response.error(req, res, next, 'تعداد لایک ها بیش از حد مجاز هست');
                        }
                    }
                    else {
                        response.error(req, res, next,'اطلاعات یافت نشد');
                    }
                });

            } else {
                var query = {
                    userId: userId,
                    postId: postId,
                };

                Model.findOneAndDelete(query).exec(() => {
                    if (likeCount > 0) {
                        postTopRate = parseInt((((likeCount - 1) + postComment + postSaved) * 100) / follower);

                        if (!postTopRate) {
                            postTopRate = 0;
                        }

                        VipPst.findByIdAndUpdate(postId, {
                            'postLike': (likeCount - 1),
                            'postTopRate': postTopRate,
                        },
                            {
                                new: true,
                                runValidators: true
                            }).exec((err, doc) => {
                                if (doc) {
                                    // console.log('doc :', doc);
                                } else {
                                    console.log('err :', err);
                                }
                            });
                    }
                    response.error(req, res, next, '');
                });

            }
        });
    }

};