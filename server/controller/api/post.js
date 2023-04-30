const response = require("../../response");
const {
    Post,
    // PostBookmark,
    // PostComment,
    PostLike,
    PostReport,
    PostEvent,
    PostEntertainment,
    PostNews,
    PostQuestion
} = require("../../model/post")
const PostComment = require("../../model/postComment")
const itemComment = require("../../model/itemComment")
const itemBookmark = require("../../model/itemBookmark")
const PostBookmark = require("../../model/postBookmark")
const ItemLike = require("../../model/itemLike")
const ItemDislike = require("../../model/itemDislike")
var mime = require('mime-types');
const config = require("../../config");
var offset = parseInt(process.env.ROW_NUMBER);
var offsetApi = parseInt(process.env.ROW_NUMBER_API);
var moment = require('jalali-moment');
var COMMENT_LIMIT = parseInt(process.env.COMMENT_LIMIT);


module.exports = {
    POST_ITEM_EVENT: (req, res, next) => {
        if (req.body['avatar']) {
            req.body['avatarType'] = mime.contentType(req.body['avatar']).split('/')[0]
        }
        new PostEvent({
            personId: req.data.personInfo._id,
            caption: req.body.caption,
            categoryId: req.body.categoryId,
            avatar: req.body.avatar,
            avatarType: req.body.avatarType,
        }).save((err, doc) => {
            if (doc) {
                req.data.postInfo = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در ایجاد پست');
            }
        })
    },
    POST_ITEM_QUESTION: (req, res, next) => {
        if (req.body['avatar']) {
            req.body['avatarType'] = mime.contentType(req.body['avatar']).split('/')[0]
        }
        new PostQuestion({
            personId: req.data.personInfo._id,
            caption: req.body.caption,
            categoryId: req.body.categoryId,
            avatar: req.body.avatar,
            avatarType: req.body.avatarType,
        }).save((err, doc) => {
            if (doc) {
                req.data.postInfo = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در ایجاد پست');
            }
        })
    },
    GET_ALL_ITEMS: (req, res, next) => {
        var orList = [{
            class: 'postEvent'
        }, {
            class: 'postQuestion'
        }];
        if (req.query.type) {
            orList = req.query.type.split(',').map((x) => { return { class: x } });
        }
        Post.aggregate().match({
            $or: orList
        })
            .lookup({
                from: "postlikes",
                localField: "_id",
                foreignField: "postId",
                as: "likeList"
            })
            .addFields({
                likeCount: {
                    $size: "$likeList"
                },
            })
            .lookup({
                from: "postlikes",
                let: {
                    postId: "$_id",
                },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$postId", "$$postId"]
                                },
                                {
                                    $eq: ["$personId", config.ObjectIdConvertor(req.data.personInfo._id)]
                                }
                            ]
                        }
                    }
                },],
                as: "likes"
            }).addFields({
                likesLen: {
                    $size: "$likes"
                },
            }).addFields({
                isLike: {
                    $cond: {
                        if: {
                            $gte: ["$likesLen", 1]
                        },
                        then: true,
                        else: false
                    }
                }
            }).lookup({
                from: "postbookmarks",
                let: {
                    postId: "$_id",
                },
                pipeline: [{
                    $match: {
                        $expr: {
                            $and: [
                                {
                                    $eq: ["$postId", "$$postId"]
                                },
                                {
                                    $eq: ["$personId", config.ObjectIdConvertor(req.data.personInfo._id)]
                                }
                            ]
                        }
                    }
                },],
                as: "bookmarks"
            }).addFields({
                bookmarksLen: {
                    $size: "$bookmarks"
                },
            }).addFields({
                isBookmark: {
                    $cond: {
                        if: {
                            $gte: ["$bookmarksLen", 1]
                        },
                        then: true,
                        else: false
                    }
                }
            }).project({
                bookmarks: 0,
                bookmarksLen: 0,
                likes: 0,
                likesLen: 0,
                likeList: 0,
            })
            .sort({ createdAt: -1 })
            .exec(async (err, docs) => {
                var postList = [];
                for (let index = 0; index < docs.length; index++) {
                    var x = await Post.hydrate(docs[index]).populate('categoryId').populate('personId', '-password').execPopulate();
                    postList.push(x);

                }
                req.data.postList = postList;
                response.ok(req, res, next);
            })
    },
    GET_EACH_ITEM: (req, res, next) => {
        Post
            .findById(req.params.itemId)
            .populate('categoryId')
            .populate('personId', '-password')
            .exec(async (err, doc) => {
                if (doc) {
                    req.data.postInfo = JSON.parse(JSON.stringify(doc));
                    req.data.postInfo['commentList'] = await PostComment.find({
                        postId: req.params.itemId
                    }).populate('personId', '-password').exec();
                    response.ok(req, res, next);

                } else {
                    response.error(req, res, next, 'چنین پستی موجود نمی باشد');
                }
            })
    },

    GET_ANSWER_OF_QUESTION_ITEMS: (req, res, next) => {
        var first = req.query.first;
        var itemId = req.query.itemId;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        itemComment.find({
            refId: itemId,
        })
            .limit(offset)
            .skip(first)
            .sort({ CorrectAnswer: -1, rate: -1, createdAt: -1 })
            .exec((err, docs) => {
                if (docs) {
                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'چنین آیتمی وجود ندارد');
                }
            })
    },
    PUT_EACH_ITEM_INFO: (req, res, next) => {
        if (req.body['avatar']) {
            req.body['avatarType'] = mime.contentType(req.body['avatar']).split('/')[0]
        }
        Post.findByIdAndUpdate(req.params.itemId, {
            caption: req.body.caption,
            type: req.body.type,
            categoryId: req.body.categoryId,
            avatar: req.body.avatar,
            avatarType: req.body.avatarType,
        }).exec((err, doc) => {
            if (doc) {
                req.data.postInfo = doc;
                response.ok(req, res, next);
            } else {
                req.data.error = err;
                response.error(req, res, next, 'چنین پستی موجود نمی باشد');
            }
        })
    },
    POST_EACH_ITEM_COMMENT: (req, res, next) => {
        var itemId = req.body.itemId;
        var userId = req.data.personInfo._id.toString();
        var type = req.body.type;

        moment.locale('en');
        var current_date = moment().format('YYYY-MM-DD');
        var start_date = current_date;
        var end_date = current_date;


        start_date = start_date + 'T00:00:00.000Z';
        end_date = end_date + 'T23:59:59.000Z';
        console.log('start_date :', start_date);
        console.log('end_date :', end_date);


        PostComment.find({
            personId: userId,
            type: type,
            createdAt: {
                $gte: start_date,
                $lt: end_date
            }
        }).exec(function (errCom, docComs) {
            if (docComs) {
                console.log("docComs.length :::::", docComs.length);
                if (docComs.length < COMMENT_LIMIT) {
                    new PostComment({
                        personId: req.data.personInfo._id,
                        postId: itemId,
                        type: type,
                        caption: req.body.caption,
                    }).save((err, doc) => {
                        if (doc) {
                            req.data.commentInfo = doc;
                            response.ok(req, res, next, 'با موفقیت ثبت گردید');
                        } else {
                            response.error(req, res, next, 'مشکل در ایجاد نظر');
                        }
                    })
                }
                else {
                    response.error(req, res, next, 'تعداد کامنت های ثبت شده بیش از حد مجاز است');
                }
            }
            else {
                response.error(req, res, next);
            }
        });
    },
    GET_NEWS_ALL_COMMENT_ITEMS: (req, res, next) => {
        var first = req.query.first;
        var postId = req.query.postId;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        PostComment.find({
            postId: postId,
            type: 'news',
            isActive: true,
            isDelete: false
        })
            .limit(offset)
            .skip(first)
            .sort({ createdAt: -1 })
            .exec((err, docs) => {
                if (docs) {
                    var len = docs.length;
                    var items = [];
                    for (var i = 0; i < len; i++) {
                        var createdAt = moment(docs[i]['createdAt'], 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm');
                        console.log("createdAt ::::", createdAt);
                        //docs[i]['createdAt'] = createdAt;


                        items.push({
                            "caption": docs[i]['caption'],
                            "isActive": docs[i]['isActive'],
                            "isDelete": docs[i]['isDelete'],
                            "_id": docs[i]['_id'],
                            "personId": docs[i]['personId'],
                            "postId": docs[i]['postId'],
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
    GET_ENTERTAINMENT_ALL_COMMENT_ITEMS: (req, res, next) => {
        var first = req.query.first;
        var postId = req.query.postId;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        PostComment.find({
            postId: postId,
            type: 'entertainment',
            isActive: true,
            isDelete: false
        })
            .limit(offset)
            .skip(first)
            .sort({ createdAt: -1 })
            .exec((err, docs) => {
                if (docs) {
                    var len = docs.length;
                    var items = [];
                    for (var i = 0; i < len; i++) {
                        var createdAt = moment(docs[i]['createdAt'], 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm');
                        console.log("createdAt ::::", createdAt);
                        //docs[i]['createdAt'] = createdAt;


                        items.push({
                            "caption": docs[i]['caption'],
                            "isActive": docs[i]['isActive'],
                            "isDelete": docs[i]['isDelete'],
                            "_id": docs[i]['_id'],
                            "personId": docs[i]['personId'],
                            "postId": docs[i]['postId'],
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

    DELETE_COMMENT_ITEM: (req, res, next) => {
        var itemId = req.query.itemId;
        var userId = req.data.personInfo._id;
        console.log('itemId :::::::', itemId);

        PostComment.findById(itemId).exec((errComment, docComment) => {
            if (errComment) {
                response.error(req, res, next);
            } else {
                if (docComment) {

                    if (userId.toString() == docComment.personId._id.toString()) {
                        var query = {
                            '_id': itemId,
                        };

                        PostComment.findOneAndDelete(query).exec((err, doc) => {
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
                    response.error(req, res, next);
                }
            }
        });

    },



    POST_EACH_COMMENT_REPLY: (req, res, next) => {
        PostComment.findByIdAndUpdate(req.params.commentId, {
            $push: {
                reply: {
                    personId: req.data.personInfo._id,
                    caption: req.body.caption,
                }
            }
        }, {
            new: true,
            runValidators: true,
        }).exec((err, doc) => {
            if (doc) {
                req.data.commentInfo = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در ایجاد پاسخ');
            }
        })
    },
    PUT_EACH_ITEM_LIKE: (req, res, next) => {
        PostLike.findOne({
            personId: req.data.personInfo._id,
            postId: req.params.itemId,
        }).exec((preErr, preDoc) => {
            if (preDoc) {
                PostLike.findOneAndDelete({
                    personId: req.data.personInfo._id,
                    postId: req.params.itemId,
                }).exec(() => {
                    req.data.isLike = false;
                    response.ok(req, res, next);
                });
            } else {
                new PostLike({
                    personId: req.data.personInfo._id,
                    postId: req.params.itemId,
                }).save((savedErr, savedDoc) => {
                    if (savedDoc) {
                        req.data.isLike = true;
                        response.ok(req, res, next);
                    } else {
                        req.data.isLike = false;
                        response.ok(req, res, next);
                    }
                })
            }
        })
    },


    PUT_NEWS_ITEM_LIKE: (req, res, next) => {
        ItemLike.findOne({
            personId: req.data.personInfo._id,
            refModelName: 'postNews',
            refId: req.query.itemId,
        }).exec((preErr, preDoc) => {
            if (preDoc) {
                response.error(req, res, next, 'قبلا ثبت شده');

                // PostNews.findById(req.query.itemId).exec((errNews, docNews) => {
                //     if (docNews) {
                // var beforeLike = docNews.like;

                // beforeLike = parseInt(beforeLike) - 1;
                // if (beforeLike < 0) {
                //     beforeLike = 0;
                // }
                // var updateQuery = {
                //     like: beforeLike
                // };

                // PostNews.findByIdAndUpdate(req.query.itemId, updateQuery, config.mongooseUpdateOptions)
                //     .exec((err, doc) => {
                //         if (doc) {
                //             ItemLike.findOneAndDelete({
                //                 personId: req.data.personInfo._id,
                //                 refId: req.query.itemId,
                //             }).exec(() => {
                //                 req.data.isLike = false;
                //                 response.ok(req, res, next);
                //             });
                //         }
                //         else {
                //             response.error(req, res, next, 'اطلاعات یافت نشد');
                //         }
                //     });

                // }
                // else {
                //     response.error(req, res, next, 'اطلاعات یافت نشد');
                // }

                // });
            } else {
                PostNews.findById(req.query.itemId).exec((errNews, docNews) => {
                    if (docNews) {
                        var beforeLike = docNews.like;

                        beforeLike = parseInt(beforeLike) + 1;
                        if (beforeLike < 0) {
                            beforeLike = 0;
                        }
                        var updateQuery = {
                            like: beforeLike
                        };

                        PostNews.findByIdAndUpdate(req.query.itemId, updateQuery, config.mongooseUpdateOptions)
                            .exec((err, doc) => {
                                if (doc) {
                                    new ItemLike({
                                        personId: req.data.personInfo._id,
                                        refModelName: 'postNews',
                                        refId: req.query.itemId,
                                    }).save((savedErr, savedDoc) => {
                                        if (savedDoc) {
                                            req.data.isLike = true;
                                            response.ok(req, res, next);
                                        } else {
                                            req.data.isLike = false;
                                            response.ok(req, res, next);
                                        }
                                    })
                                }
                                else {
                                    response.error(req, res, next, 'اطلاعات یافت نشد');
                                }
                            });
                    }
                    else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                });
            }
        })
    },

    PUT_NEWS_ITEM_DIS_LIKE: (req, res, next) => {
        ItemDislike.findOne({
            personId: req.data.personInfo._id,
            refModelName: 'postNews',
            refId: req.query.itemId,
        }).exec((preErr, preDoc) => {
            if (preDoc) {
                response.error(req, res, next, 'قبلا ثبت شده');

                // PostNews.findById(req.query.itemId).exec((errNews, docNews) => {
                //     if (docNews) {
                // var beforeDisLike = docNews.disLike;

                // beforeDisLike = parseInt(beforeDisLike) - 1;
                // if (beforeDisLike < 0) {
                //     beforeDisLike = 0;
                // }
                // var updateQuery = {
                //     disLike: beforeDisLike
                // };

                // PostNews.findByIdAndUpdate(req.query.itemId, updateQuery, config.mongooseUpdateOptions)
                //     .exec((err, doc) => {
                //         if (doc) {
                //             ItemDislike.findOneAndDelete({
                //                 personId: req.data.personInfo._id,
                //                 refId: req.query.itemId,
                //             }).exec(() => {
                //                 req.data.isLike = false;
                //                 response.ok(req, res, next);
                //             });
                //         }
                //         else {
                //             response.error(req, res, next, 'اطلاعات یافت نشد');
                //         }
                //     });

                // }
                // else {
                //     response.error(req, res, next, 'اطلاعات یافت نشد');
                // }
                // });


            } else {
                PostNews.findById(req.query.itemId).exec((errNews, docNews) => {
                    if (docNews) {
                        var beforeDisLike = docNews.disLike;

                        beforeDisLike = parseInt(beforeDisLike) + 1;
                        if (beforeDisLike < 0) {
                            beforeDisLike = 0;
                        }
                        var updateQuery = {
                            disLike: beforeDisLike
                        };

                        PostNews.findByIdAndUpdate(req.query.itemId, updateQuery, config.mongooseUpdateOptions)
                            .exec((err, doc) => {
                                if (doc) {
                                    new ItemDislike({
                                        personId: req.data.personInfo._id,
                                        refModelName: 'postNews',
                                        refId: req.query.itemId,
                                    }).save((savedErr, savedDoc) => {
                                        if (savedDoc) {
                                            req.data.isLike = true;
                                            response.ok(req, res, next);
                                        } else {
                                            req.data.isLike = false;
                                            response.ok(req, res, next);
                                        }
                                    })
                                }
                                else {
                                    response.error(req, res, next, 'اطلاعات یافت نشد');
                                }
                            });
                    }
                    else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                });

            }
        })
    },



    PUT_ENTERTAINMENT_ITEM_LIKE: (req, res, next) => {
        ItemLike.findOne({
            personId: req.data.personInfo._id,
            refModelName: 'postEntertainment',
            refId: req.query.itemId,
        }).exec((preErr, preDoc) => {
            if (preDoc) {

                response.error(req, res, next, 'قبلا ثبت شده');
                // PostEntertainment.findById(req.query.itemId).exec((errEntertainment, docEntertainment) => {
                //     if (docEntertainment) {
                //         var beforeLike = docEntertainment.like;

                //         beforeLike = parseInt(beforeLike) - 1;
                //         if (beforeLike < 0) {
                //             beforeLike = 0;
                //         }
                //         var updateQuery = {
                //             like: beforeLike
                //         };

                //         PostEntertainment.findByIdAndUpdate(req.query.itemId, updateQuery, config.mongooseUpdateOptions)
                //             .exec((err, doc) => {
                //                 if (doc) {
                //                     ItemLike.findOneAndDelete({
                //                         personId: req.data.personInfo._id,
                //                         refId: req.query.itemId,
                //                     }).exec(() => {
                //                         req.data.isLike = false;
                //                         response.ok(req, res, next);
                //                     });
                //                 }
                //                 else {
                //                     response.error(req, res, next, 'اطلاعات یافت نشد');
                //                 }
                //             });
                //     }
                //     else {
                //         response.error(req, res, next, 'اطلاعات یافت نشد');
                //     }
                // });
            } else {
                PostEntertainment.findById(req.query.itemId).exec((errNews, docEntertainment) => {
                    if (docEntertainment) {
                        var beforeLike = docEntertainment.like;

                        beforeLike = parseInt(beforeLike) + 1;
                        if (beforeLike < 0) {
                            beforeLike = 0;
                        }
                        var updateQuery = {
                            like: beforeLike
                        };

                        PostEntertainment.findByIdAndUpdate(req.query.itemId, updateQuery, config.mongooseUpdateOptions)
                            .exec((err, doc) => {
                                if (doc) {
                                    new ItemLike({
                                        personId: req.data.personInfo._id,
                                        refModelName: 'postEntertainment',
                                        refId: req.query.itemId,
                                    }).save((savedErr, savedDoc) => {
                                        if (savedDoc) {
                                            req.data.isLike = true;
                                            response.ok(req, res, next);
                                        } else {
                                            req.data.isLike = false;
                                            response.ok(req, res, next);
                                        }
                                    });
                                }
                                else {
                                    response.error(req, res, next, 'اطلاعات یافت نشد');
                                }
                            });
                    }
                    else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                });
            }
        })
    },

    PUT_ENTERTAINMENT_ITEM_DIS_LIKE: (req, res, next) => {
        ItemDislike.findOne({
            personId: req.data.personInfo._id,
            refModelName: 'postEntertainment',
            refId: req.query.itemId,
        }).exec((preErr, preDoc) => {
            if (preDoc) {
                response.error(req, res, next, 'قبلا ثبت شده');
                // PostEntertainment.findById(req.query.itemId).exec((errNews, docEntertainment) => {
                //     if (docEntertainment) {
                //         var beforeDisLike = docEntertainment.disLike;

                //         beforeDisLike = parseInt(beforeDisLike) - 1;
                //         if (beforeDisLike < 0) {
                //             beforeDisLike = 0;
                //         }
                //         var updateQuery = {
                //             disLike: beforeDisLike
                //         };

                //         PostEntertainment.findByIdAndUpdate(req.query.itemId, updateQuery, config.mongooseUpdateOptions)
                //             .exec((err, doc) => {
                //                 if (doc) {
                //                     ItemDislike.findOneAndDelete({
                //                         personId: req.data.personInfo._id,
                //                         refId: req.query.itemId,
                //                     }).exec(() => {
                //                         req.data.isLike = false;
                //                         response.ok(req, res, next);
                //                     });
                //                 }
                //                 else {
                //                     response.error(req, res, next, 'اطلاعات یافت نشد');
                //                 }
                //             });
                //     }
                //     else {
                //         response.error(req, res, next, 'اطلاعات یافت نشد');
                //     }
                // });
            } else {

                PostEntertainment.findById(req.query.itemId).exec((errNews, docEntertainment) => {
                    if (docEntertainment) {
                        var beforeDisLike = docEntertainment.disLike;

                        beforeDisLike = parseInt(beforeDisLike) + 1;
                        if (beforeDisLike < 0) {
                            beforeDisLike = 0;
                        }
                        var updateQuery = {
                            disLike: beforeDisLike
                        };

                        PostEntertainment.findByIdAndUpdate(req.query.itemId, updateQuery, config.mongooseUpdateOptions)
                            .exec((err, doc) => {
                                if (doc) {
                                    new ItemDislike({
                                        personId: req.data.personInfo._id,
                                        refModelName: 'postEntertainment',
                                        refId: req.query.itemId,
                                    }).save((savedErr, savedDoc) => {
                                        if (savedDoc) {
                                            req.data.isLike = true;
                                            response.ok(req, res, next);
                                        } else {
                                            req.data.isLike = false;
                                            response.ok(req, res, next);
                                        }
                                    });
                                }
                                else {
                                    response.error(req, res, next, 'اطلاعات یافت نشد');
                                }
                            });
                    }
                    else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                });
            }
        })
    },

    POST_EACH_ITEM_REPORT: (req, res, next) => {
        new PostReport({
            personId: req.data.personInfo._id,
            postId: req.params.itemId,
            title: req.body.title,
            caption: req.body.caption,
        }).save((err, doc) => {
            if (doc) {
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در ایجاد گزارش');
            }
        })
    },
    PUT_EACH_ITEM_BOOKMARK: (req, res, next) => {
        PostBookmark.findOne({
            personId: req.data.personInfo._id,
            postId: req.params.itemId,
        }).exec((preErr, preDoc) => {
            if (preDoc) {
                PostBookmark.findOneAndDelete({
                    personId: req.data.personInfo._id,
                    postId: req.params.itemId,
                }).exec(() => {
                    req.data.isBookmark = false;
                    response.ok(req, res, next);
                });
            } else {
                new PostBookmark({
                    personId: req.data.personInfo._id,
                    postId: req.params.itemId,
                }).save((savedErr, savedDoc) => {
                    if (savedDoc) {
                        req.data.isBookmark = true;
                        response.ok(req, res, next);
                    } else {
                        req.data.isBookmark = false;
                        response.ok(req, res, next);
                    }
                })
            }
        })
    },
    GET_SEARCH_ITEMS: (req, res, next) => {
        var first = req.query.first;
        var personId = req.data.personInfo._id.toString();


        function escapeRegex(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        };


        var categoryId = req.query.categoryId;
        var title = req.query.title;
        var educationalStageId = req.query.educationalStageId;
        var educationalFieldId = req.query.educationalFieldId;

        var filter = {};
        console.log('filter ::: ', filter);
        if (typeof educationalFieldId !== 'undefined' && educationalFieldId != null && educationalFieldId != "") {
            filter.educationalFieldId = educationalFieldId;
        }

        if (typeof educationalStageId !== 'undefined' && educationalStageId != null && educationalStageId != "") {
            filter.educationalStageId = educationalStageId;
        }


        if (typeof categoryId !== 'undefined' && categoryId != null && categoryId != "") {
            filter.categoryId = categoryId;
        }


        if (typeof title !== 'undefined' && title != null && title != "") {
            const regex = new RegExp(escapeRegex(title), 'gi');
            filter.title = regex;
        }


        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }


        console.log('filter ::::', filter);

        function getBookmarkResult(itemId, personId) {
            return new Promise((resolve) => {
                console.log('itemId:::::::::::   ', itemId);
                PostBookmark.findOne({ postId: itemId, personId: personId, bookMark: true }).exec(async (err2, doc2) => {
                    if (doc2) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }

                });
            });
        }

        async function f1(item, personId) {
            const isBookmark = await getBookmarkResult(item, personId);
            console.log(isBookmark);
            return isBookmark;

        }
        async function checkBookmark(itemId, personId) {
            return await f1(itemId, personId);
        }


        async function getList(docs, personId) {
            var items = [];
            for (const item of docs) {
                const isBookmark = await checkBookmark(item._id.toString(), personId);

                items.push({
                    'isBookmark': isBookmark,
                    'educationalFieldId': item.educationalFieldId,
                    'educationalStageId': item.educationalStageId,
                    'title': item.title,
                    'avatar': item.avatar,
                    'caption': item.caption,
                    'rejectionReason': item.rejectionReason,
                    'categoryId': item.categoryId,
                    'personId': item.personId,
                    'createdAt': item.createdAt,
                    'updatedAt': item.updatedAt,
                    'id': item.id,
                    '_id': item.id,
                });
            }
            req.data.items = items;
            response.ok(req, res, next);
        }



        PostQuestion
            .find(filter)
            .limit(offset)
            .skip(first)
            .sort({ createdAt: -1 })
            .exec(async (err, docs) => {
                if (docs) {

                    var items = [];



                    // docs.forEach(item => {
                    //     const x = checkBookmark(item._id);


                    //     items.push({
                    //         'isBookmark': x,
                    //         'educationalFieldId': item.educationalFieldId,
                    //         'educationalStageId': item.educationalStageId,
                    //         'title': item.title,
                    //         'avatar': item.avatar,
                    //         'caption': item.caption,
                    //         'rejectionReason': item.rejectionReason,
                    //         'categoryId': item.categoryId,
                    //         'personId': item.personId,
                    //         'createdAt': item.createdAt,
                    //         'updatedAt': item.updatedAt,
                    //         'id': item.id,
                    //         '_id': item.id,
                    //     });
                    // });

                    getList(docs, personId);

                } else {
                    response.error(req, res, next, 'چنین پستی موجود نمی باشد');
                }
            });
    },
    SEARCH_HASHTAG: (req, res, next) => {
        var first = req.query.first;
        var search = req.query.search;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        if (typeof search !== 'undefined') {
            function escapeRegex(text) {
                return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            };
            const regex = new RegExp(escapeRegex(search), 'gi');
            PostNews.find({ "hashtag": regex })
                .limit(offset)
                .skip(first)
                .exec((err, docs) => {
                    if (docs) {
                        req.data.items = docs;
                        response.ok(req, res, next);
                    } else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                });
        }
        else {
            response.error(req, res, next, 'اطلاعات یافت نشد');
        }
    },

    GET_POST_QUESTION_ITEM: (req, res, next) => {
        var itemId = req.params.itemId;
        PostQuestion.findById(itemId)
            .exec((err, doc) => {
                if (doc) {
                    res.render('postQuestion', { data: doc })
                } else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });

    },

    GET_MY_QUESTION_LIST: (req, res, next) => {
        var personId = req.data.personInfo._id;

        function getBookmarkResult(itemId, personId) {
            return new Promise((resolve) => {
                console.log('itemId:::::::::::   ', itemId);
                PostBookmark.findOne({ postId: itemId, personId: personId, bookMark: true }).exec(async (err2, doc2) => {
                    if (doc2) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }

                });
            });
        }

        async function f1(item, personId) {
            const isBookmark = await getBookmarkResult(item, personId);
            console.log(isBookmark);
            return isBookmark;

        }
        async function checkBookmark(itemId, personId) {
            return await f1(itemId, personId);
        }


        async function getList(docs, personId) {
            var items = [];
            for (const item of docs) {
                const isBookmark = await checkBookmark(item._id.toString(), personId);

                items.push({
                    'isBookmark': isBookmark,
                    'educationalFieldId': item.educationalFieldId,
                    'educationalStageId': item.educationalStageId,
                    'title': item.title,
                    'avatar': item.avatar,
                    'caption': item.caption,
                    'rejectionReason': item.rejectionReason,
                    'categoryId': item.categoryId,
                    'personId': item.personId,
                    'address': item.address,
                    'tags': item.tags,
                    'hashtag': item.hashtag,
                    'media': item.media,
                    'sort': item.sort,
                    'class': item.class,
                    'createdAt': item.createdAt,
                    'updatedAt': item.updatedAt,
                    'id': item.id,
                    '_id': item.id,
                });
            }
            req.data.items = items;
            response.ok(req, res, next);
        }


        PostQuestion.find({ personId: personId })
            .exec((err, docs) => {
                if (docs) {
                    getList(docs, personId);
                } else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });

    },
    GET_ENTERTAINMENT_ITEMS: (req, res, next) => {
        var itemId = req.query.itemId;
        var first = req.query.first;

        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offsetApi;
        }

        PostEntertainment.find({
            postCategoryId: itemId
        })
            .limit(offsetApi)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    if (docs.length > 0) {
                        var items = [];
                        docs.forEach(item => {
                            var createdAt = moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm');
                            items.push({
                                'file': item.file,
                                'like': item.like,
                                'link': item.link,
                                'disLike': item.disLike,
                                'title': item.title,
                                'avatar': item.avatar,
                                'caption': item.caption,
                                'rejectionReason': item.rejectionReason,
                                'address': item.address,
                                'tags': item.tags,
                                'hashtag': item.hashtag,
                                'media': item.media,
                                'sort': item.sort,
                                'isActive': item.isActive,
                                'isDelete': item.isDelete,
                                'postCategoryId': item.postCategoryId,
                                'class': item.class,
                                'createdAt': createdAt,
                                'updatedAt': item.updatedAt,
                                'id': item.id,
                                '_id': item.id,
                            });
                        });

                        req.data.items = items;
                        response.ok(req, res, next);
                    }
                    else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
    }

}