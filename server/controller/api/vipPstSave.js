const Model = require("../../model/vipPstSave");
const VipPst = require("../../model/vipPst");
const response = require("../../response");
var config = require('../../config');
var moment = require('jalali-moment');
const Person = require("../../model/person").Person;
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
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
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
        })
    },
    PUT_SAVE_DELETE_POST: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var postId = req.params.postId;



        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }


        console.log('userId :', userId);
        console.log('postId :', postId);



        Model.find({
            $and: [
                { 'userId': userId },
                { 'postId': postId }
            ]
        }).exec((err, data) => {

            console.log('data :', data);
            if (data.length == 0) {
                const vipPstSave = new Model({
                    userId: userId,
                    postId: postId,
                });

                vipPstSave.save(function (err, result) {
                    if (err) {
                        console.log(err);
                    } else {

                        VipPst.findById(postId).exec((err, doc) => {
                            var postSaved = doc.postSaved;
                            var postLike = doc.postLike;
                            var postComment = doc.postComment;
                            var follower = doc.userId.follower;
                            console.log('postSaved :', postSaved);


                            var postTopRate = parseInt(((postLike + postComment + (postSaved + 1)) * 100) / follower);
                            if (!postTopRate) {
                                postTopRate = 0;
                            }

                            VipPst.findByIdAndUpdate(postId, {
                                'postSaved': (postSaved + 1),
                                'postTopRate': postTopRate
                            },
                                {
                                    new: true,
                                    runValidators: true
                                }).exec((err, doc) => {
                                    if (doc) {
                                        response.ok(req, res, next);
                                        // console.log('doc :', doc);
                                    } else {
                                        console.log('err :', err);

                                    }
                                });
                        });

                    }
                });
            } else {
                var query = {
                    userId: userId,
                    postId: postId,
                };

                VipPst.findById(postId).exec((err, doc) => {
                    if (doc) {

                        console.log('doc :', doc);
                        var postSaved = doc.postSaved;
                        var postLike = doc.postLike;
                        var postComment = doc.postComment;
                        var follower = doc.userId.follower;
                        console.log('postSaved :', postSaved)

                        var postTopRate = parseInt(((postLike + postComment + (postSaved - 1)) * 100) / follower);
                        if (!postTopRate) {
                            postTopRate = 0;
                        }

                        VipPst.findByIdAndUpdate(postId, {
                            'postSaved': (postSaved - 1),
                            'postTopRate': postTopRate
                        },
                            {
                                new: true,
                                runValidators: true
                            }).exec((err, doc) => {
                                if (doc) {
                                    Model.findOneAndDelete(query).exec(() => {

                                        response.ok(req, res, next);
                                        //
                                    });


                                    // console.log('doc :', doc);
                                } else {
                                    console.log('err :', err);
                                    response.error(req, res, next);

                                }
                            });
                    }
                    else {
                        console.log('err :', err);
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                });
            }
        });
    },
    GET_SAVE_POST: (req, res, next) => {
        var userId = req.query.userId;

        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }


        function getUserInfoResult(itemId) {
            return new Promise((resolve) => {
                Person.findById(itemId).exec((err, doc) => {
                    if (doc) {
                        resolve(doc);
                    }
                    else {
                        resolve(null);
                    }
                })
            });
        }


        async function f2(itemId) {
            const result = await getUserInfoResult(itemId);
            // console.log(result);
            return result;

        }
        async function getUserInfo(itemId) {
            return await f2(itemId);
        }


        async function getList(docs) {
            for (var item of docs) {
                var responseData = [];
                var likes = item.likeData;
                console.log('item.postData :::', item.postData[0].userId);
                userInfo = await getUserInfo(item.postData[0].userId);
                var is_like = false;
                likes.forEach(l => {

                    console.log('l.userId ::: ', l.userId);
                    if (l.userId == userId) {
                        is_like = true;
                    }
                });

                // var saves = item.saveData;
                var is_save = true;
                // saves.forEach(l => {
                //     if (l.userId == userId) {
                //         is_save = true;
                //     }
                // });

                var userData = item.userData;
                var pstMediaData = item.pstMediaData;
                var firstName = '';
                var lastName = '';
                var avatar = null;
                // userData.forEach(l => {


                // console.log('llllllllllll :', l);
                firstName = userInfo.firstName;
                lastName = userInfo.lastName;
                avatar = process.env.BASE_URL + process.env.UPLOAD_URL + '/files/' + userInfo.avatar;
                //     }
                // });

                if (item.postData) {
                    item.postData = item.postData[0];
                }
                // console.log('item.postData :::', item.postData);
                responseData.push({
                    '_id': item.postData._id,
                    'userId': item.postData.userId,
                    'avatar': avatar,
                    'firstName': firstName,
                    'lastName': lastName,
                    'title': item.postData.title,
                    'postImage': process.env.BASE_URL + process.env.UPLOAD_URL + "/pst_media/" + item.postData.avatar,
                    'caption': item.postData.caption,
                    'tag': item.postData.tag,
                    'description': item.postData.description,
                    'postLike': item.postData.postLike,
                    'postSaved': item.postData.postSaved,
                    'sort': item.postData.sort,
                    'is_like': is_like,
                    'is_save': is_save,
                    'is_follow': false,
                    'pstMediaData': pstMediaData,
                    'isActive': item.postData.isActive,
                    'isDelete': item.postData.isDelete,
                    'createdAt': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                    'updatedAt': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                });

                // // req.personInfo = personInfo;


            }

            req.data = responseData;
            response.ok(req, res, next);

        }




        Model
            .aggregate([
                {
                    $match: {
                        $and: [
                            { userId: config.ObjectIdConvertor(userId) },
                        ]
                    }
                },
                { $sort: { createdAt: -1 } },
                { $limit: offset },
                { $skip: first },


            ])
            .lookup({
                from: "vippsts",
                localField: "postId",
                foreignField: "_id",
                as: "postData"
            })
            .lookup({
                from: "vippstlikes",
                localField: "postId",
                foreignField: "postId",
                as: "likeData"
            })
            // .lookup({
            //     from: "vippstsaves",
            //     localField: "postId",
            //     foreignField: "_id",
            //     as: "saveData"
            // })
            .lookup({
                from: "people",
                localField: "userId",
                foreignField: "_id",
                as: "userData"
            })
            .lookup({
                from: "vippstmedias",
                localField: "postId",
                foreignField: "postId",
                as: "pstMediaData"
            })

            // .sort({_id: -1})
            // .skip(first)
            // .limit(offset)                    
            .exec((err, data) => {
                if (err) {
                    response.error(req, res, next, 'not found');
                    return;
                } else {
                    getList(data);

                }
            });




    }

};