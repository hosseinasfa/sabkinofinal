const response = require('../../response');
const config = require('../../config');
const _ = require('lodash');
var ItemLike = require('../../model/itemLike');
var ItemDislike = require('../../model/itemDislike');
var ItemBookmark = require('../../model/itemBookmark');
var ItemComment = require('../../model/itemComment');
var ItemReport = require('../../model/itemReport');
var ItemRate = require('../../model/itemRate');
var ItemFollower = require('../../model/itemFollower');
const Package = require("../../model/package");
const Person = require("../../model/person").Person;
const Mentor = require("../../model/person").Mentor;
const School = require('../../model/school');
const Academies = require('../../model/academy');
const Channel = require("../../model/channel");
const PeroductPayment = require("../../model/productPayment");
const Product = require("../../model/product");
var rand = require("random-key");
var offset = parseInt(process.env.ROW_NUMBER);
var FCM = require('fcm-node');
const SERVER_KEY = process.env.SERVER_KEY;
var moment = require('jalali-moment');
const fetch = require("node-fetch");

function subscribeTokenToTopic(token, topic) {
    if (typeof token !== 'undefined' && token != null) {
        fetch('https://iid.googleapis.com/iid/v1/' + token + '/rel/topics/' + topic, {
            method: 'POST',
            headers: {
                'Authorization': 'key=' + SERVER_KEY
            }
        }).then(response => {
            if (response.status < 200 || response.status >= 400) {
                throw 'Error subscribing to topic: ' + response.status + ' - ' + response.text();
            }
            console.log('Subscribed to "' + topic + '"');
        }).catch(error => {
            console.error(error);
        })
    }
}


// const { userValidator , validate} = require('../../middleware/validator');
// var VipPstComment = require('../../model/vipPstComment');
// var ItemFollower = require('../../model/itemFollower');

function checkNationalCode(meli_code) {
    return true;
    if (meli_code.length == 10) {
        if (meli_code == '0000000000' ||
            meli_code == '2222222222' ||
            meli_code == '3333333333' ||
            meli_code == '4444444444' ||
            meli_code == '5555555555' ||
            meli_code == '6666666666' ||
            meli_code == '7777777777' ||
            meli_code == '8888888888' ||
            meli_code == '9999999999') {
            return false;
        }
        c = parseInt(meli_code.charAt(9));
        n = parseInt(meli_code.charAt(0)) * 10 +
            parseInt(meli_code.charAt(1)) * 9 +
            parseInt(meli_code.charAt(2)) * 8 +
            parseInt(meli_code.charAt(3)) * 7 +
            parseInt(meli_code.charAt(4)) * 6 +
            parseInt(meli_code.charAt(5)) * 5 +
            parseInt(meli_code.charAt(6)) * 4 +
            parseInt(meli_code.charAt(7)) * 3 +
            parseInt(meli_code.charAt(8)) * 2;
        r = n - parseInt(n / 11) * 11;
        if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}


module.exports = {
    GET_SEARCH: (req, res, next) => {
        var andList = [];
        var search = [];
        var limit = 1000;
        var skip = 0;
        var sort = {
            createdAt: -1,
        };
        var find = {};
        if (req.params.searchParams) {
            search = req.params.searchParams.split(';');
        }
        search.forEach(element => {
            var key = element.split('=')[0];
            var value = element.split('=')[1];
            var orList = [];
            value.split(',').forEach(eachVal => {
                var obj = {};
                if (eachVal.match(/^[0-9a-fA-F]{24}$/)) {
                    obj[key] = config.ObjectIdConvertor(eachVal);
                } else {

                    if (isNaN(eachVal)) {
                        if (eachVal == 'root') {
                            obj[key] = {
                                $exists: false
                            }
                        } else if (eachVal == "true") {
                            obj[key] = true
                        } else if (eachVal == "false") {
                            obj[key] = false
                        } else {
                            // obj[key] = {
                            //     $regex: eachVal,
                            //     $options: "i",
                            // }
                        }
                    } else {
                        obj[key] = eachVal
                    }
                }
                orList.push(obj)
            });
            andList.push({
                $or: orList
            })

        });
        if (req.query.limit) {
            limit = Number(req.query.limit)
        }
        if (req.query.skip) {
            skip = Number(req.query.skip)
        }
        if (req.query.sort) {
            var sortArr = req.query.sort.split(',');
            sortArr.forEach(element => {
                sort[element] = -1
            });
        }
        if (andList.length != 0) {
            find = {
                $and: andList,
            }
        }
        if (req.query.aggregate == 'true') {
            req.model
                .aggregate()
                .match(find)
                .lookup({
                    from: "itemlikes",
                    localField: "_id",
                    foreignField: "refId",
                    as: "likeList"
                })
                .addFields({
                    likeCount: {
                        $size: "$likeList"
                    },
                })
                .lookup({
                    from: "itemlikes",
                    let: {
                        refId: "$_id",
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$refId", "$$refId"]
                                },
                                {
                                    $eq: ["$personId", config.ObjectIdConvertor(req.data.personInfo._id)]
                                }
                                ]
                            }
                        }
                    }],
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
                })
                .lookup({
                    from: "itemdislikes",
                    localField: "_id",
                    foreignField: "refId",
                    as: "dislikeList"
                })
                .addFields({
                    dislikeCount: {
                        $size: "$dislikeList"
                    },
                })
                .lookup({
                    from: "itemdislikes",
                    let: {
                        refId: "$_id",
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$refId", "$$refId"]
                                },
                                {
                                    $eq: ["$personId", config.ObjectIdConvertor(req.data.personInfo._id)]
                                }
                                ]
                            }
                        }
                    }],
                    as: "dislikes"
                }).addFields({
                    dislikesLen: {
                        $size: "$dislikes"
                    },
                }).addFields({
                    isDislike: {
                        $cond: {
                            if: {
                                $gte: ["$dislikesLen", 1]
                            },
                            then: true,
                            else: false
                        }
                    }
                })
                .lookup({
                    from: "itemcomments",
                    localField: "_id",
                    foreignField: "refId",
                    as: "commentList"
                })
                .addFields({
                    commentCount: {
                        $size: "$commentList"
                    },
                })
                .lookup({
                    from: "itembookmarks",
                    let: {
                        refId: "$_id",
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$refId", "$$refId"]
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
                })
                .lookup({
                    from: "itemrates",
                    localField: "_id",
                    foreignField: "refId",
                    as: "rateList"
                })
                .addFields({
                    rateLen: {
                        $size: "$rateList"
                    },
                })
                .addFields({
                    rate: {
                        $cond: {
                            if: {
                                $gte: ["$rateLen", 1]
                            },
                            then: {
                                $avg: "$rateList.rate"
                            },
                            else: 0
                        }
                    }
                })


                .lookup({
                    from: "itemfollowers",
                    let: {
                        refId: "$_id",
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$refId", "$$refId"]
                                },
                                {
                                    $eq: ["$personId", config.ObjectIdConvertor(req.data.personInfo._id)]
                                }
                                ]
                            }
                        }
                    },],
                    as: "following"
                }).addFields({
                    followingCount: {
                        $size: "$following"
                    },
                })
                .addFields({
                    isFollow: {
                        $cond: {
                            if: {
                                $gte: ["$followingCount", 1]
                            },
                            then: true,
                            else: false
                        }
                    }
                })



                .lookup({
                    from: "itemfollowers",
                    let: {
                        refId: "$_id",
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$refId", config.ObjectIdConvertor(req.data.personInfo._id)]
                                },
                                {
                                    $eq: ["$personId", "$$refId"]
                                }
                                ]
                            }
                        }
                    },],
                    as: "followers"
                }).addFields({
                    followersCount: {
                        $size: "$followers"
                    },
                })

                .limit(limit)
                .skip(skip)
                .sort(sort)
                .project({
                    bookmarks: 0,
                    bookmarksLen: 0,
                    likes: 0,
                    likesLen: 0,
                    likeList: 0,
                    dislikeList: 0,
                    dislikes: 0,
                    dislikesLen: 0,
                    rateList: 0,
                    rateLen: 0,
                    commentList: 0,
                    following: 0,
                    followers: 0
                }).exec(async (err, docs) => {
                    if (docs) {
                        var list = [];
                        for (let index = 0; index < docs.length; index++) {
                            var each = JSON.parse(JSON.stringify(await req.model.findById(docs[index]._id).exec()));
                            docs[index] = JSON.parse(JSON.stringify(docs[index]));
                            list.push(_.assign({}, docs[index], each));
                        }
                        req.data.items = list;
                        response.ok(req, res, next);
                    } else {
                        response.error(req, res, next, 'aggregate Fail');
                    }

                })
        } else {
            req.model.find(find).limit(limit).skip(skip).sort(sort).exec((err, docs) => {
                req.data.search = {
                    $and: andList,
                    limit,
                    sort
                };
                req.data.items = docs;
                response.ok(req, res, next);
            })
        }

    },
    GET_SCHEMA: (req, res, next) => {
        console.log('resa')
        req.data.schema = req.model.jsonSchema();
        response.ok(req, res, next);
    },
    GET_TABLE: async (req, res, next) => {
        req.model.metaData.data = await req.model.find({}).exec();
        req.data.table = JSON.stringify(req.model.metaData);
        response.ok(req, res, next);
    },
    GET_EACH_ITEM: (req, res, next) => {
        if (req.query.aggregate == 'true') {
            req.model
                .aggregate()
                .match({
                    _id: config.ObjectIdConvertor(req.params.itemId)
                })
                .lookup({
                    from: "itemlikes",
                    localField: "_id",
                    foreignField: "refId",
                    as: "likeList"
                })
                .addFields({
                    likeCount: {
                        $size: "$likeList"
                    },
                })
                .lookup({
                    from: "itemlikes",
                    let: {
                        refId: "$_id",
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$refId", "$$refId"]
                                },
                                {
                                    $eq: ["$personId", config.ObjectIdConvertor(req.data.personInfo._id)]
                                }
                                ]
                            }
                        }
                    }],
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
                })
                .lookup({
                    from: "itemdislikes",
                    localField: "_id",
                    foreignField: "refId",
                    as: "dislikeList"
                })
                .addFields({
                    dislikeCount: {
                        $size: "$dislikeList"
                    },
                })
                .lookup({
                    from: "itemdislikes",
                    let: {
                        refId: "$_id",
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$refId", "$$refId"]
                                },
                                {
                                    $eq: ["$personId", config.ObjectIdConvertor(req.data.personInfo._id)]
                                }
                                ]
                            }
                        }
                    }],
                    as: "dislikes"
                }).addFields({
                    dislikesLen: {
                        $size: "$dislikes"
                    },
                }).addFields({
                    isDislike: {
                        $cond: {
                            if: {
                                $gte: ["$dislikesLen", 1]
                            },
                            then: true,
                            else: false
                        }
                    }
                })
                .lookup({
                    from: "itemcomments",
                    localField: "_id",
                    foreignField: "refId",
                    as: "commentList"
                })
                .addFields({
                    commentCount: {
                        $size: "$commentList"
                    },
                })
                .lookup({
                    from: "itembookmarks",
                    let: {
                        refId: "$_id",
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$refId", "$$refId"]
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
                })
                .lookup({
                    from: "itemrates",
                    localField: "_id",
                    foreignField: "refId",
                    as: "rateList"
                })
                .addFields({
                    rateLen: {
                        $size: "$rateList"
                    },
                })
                .addFields({
                    rate: {
                        $cond: {
                            if: {
                                $gte: ["$rateLen", 1]
                            },
                            then: {
                                $avg: "$rateList.rate"
                            },
                            else: 0
                        }
                    }
                })



                .lookup({
                    from: "itemfollowers",
                    let: {
                        refId: "$_id",
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$refId", "$$refId"]
                                },
                                {
                                    $eq: ["$personId", config.ObjectIdConvertor(req.data.personInfo._id)]
                                }
                                ]
                            }
                        }
                    },],
                    as: "following"
                }).addFields({
                    followingCount: {
                        $size: "$following"
                    },
                })
                .addFields({
                    isFollow: {
                        $cond: {
                            if: {
                                $gte: ["$followingCount", 1]
                            },
                            then: true,
                            else: false
                        }
                    }
                })



                .lookup({
                    from: "itemfollowers",
                    let: {
                        refId: "$_id",
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$refId", config.ObjectIdConvertor(req.data.personInfo._id)]
                                },
                                {
                                    $eq: ["$personId", "$$refId"]
                                }
                                ]
                            }
                        }
                    },],
                    as: "followers"
                }).addFields({
                    followersCount: {
                        $size: "$followers"
                    },
                })



                .project({
                    bookmarks: 0,
                    bookmarksLen: 0,
                    likes: 0,
                    likesLen: 0,
                    likeList: 0,
                    dislikeList: 0,
                    dislikes: 0,
                    dislikesLen: 0,
                    rateList: 0,
                    rateLen: 0,
                    commentList: 0,
                    following: 0,
                    followers: 0
                }).exec(async (err, docs) => {
                    if (docs) {
                        var list = [];
                        for (let index = 0; index < docs.length; index++) {
                            var each = JSON.parse(JSON.stringify(await req.model.findById(docs[index]._id).exec()));
                            docs[index] = JSON.parse(JSON.stringify(docs[index]));
                            list.push(_.assign({}, docs[index], each));
                        }
                        if (list.length != 0) {
                            req.data.item = list[0];
                            response.ok(req, res, next);
                        } else {
                            response.error(req, res, next, 'aggregate Fail');
                        }
                    } else {
                        response.error(req, res, next, 'aggregate Fail');
                    }

                })
        } else {
            req.model.findById(req.params.itemId).exec((err, doc) => {
                if (doc) {

                var userId = req.data.personInfo._id;
                    var productId = req.params.itemId;
                    Product.findById(productId).exec(function (err, docs) {
                        if (docs) {
                    var query2 = {
                        userId: userId,
                        productId: productId,
                    };
                    PeroductPayment.find(query2).exec(function (err, docPeroductPayment) {

                        var chekProductPayment = {
                            productPayment : docPeroductPayment.length,
                        };

                        req.data.checkItem = chekProductPayment;
                        req.data.item = doc;
                        response.ok(req, res, next);
                        
                    })
                }else {
                    response.error(req, res, next);
                }
			})

                
                    
                } else {
                    response.error(req, res, next, 'چنین آیتمی وجود ندارد');
                }
            })
        }




    },
    GET_EACH_ITEM_CHILDREN: (req, res, next) => {
        req.model.find({
            parent: req.params.itemId,
        }).exec((err, docs) => {
            if (docs) {
                req.data.items = docs;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی وجود ندارد');
            }
        })
    },

    GET_EACH_ITEM_CHILD: (req, res, next) => {
        req.model.find({
            refId: req.params.itemId,
        }).exec((err, docs) => {
            if (docs) {
                req.data.items = docs;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی وجود ندارد');
            }
        })
    },

    GET_EACH_ITEM_PERSONID: (req, res, next) => {
        req.model.find({
            personId: req.params.itemId,
            class: "postQuestion",
        }).exec((err, docs) => {
            if (docs) {
                req.data.items = docs;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی وجود ندارد');
            }
        })
    },

    GET_EACH_ITEM_TYPE_NEWS: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }


        req.model.find({
            type: 'News',
        })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'چنین آیتمی وجود ندارد');
                }
            })
    },

    GET_EACH_ITEM_TYPE_ENTERTIAMENT: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        req.model.find({
            type: 'Entertiament',
        })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'چنین آیتمی وجود ندارد');
                }
            })
    },

    GET_EACH_ITEM_CATEGORY: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }
        req.model.find({
            postCategoryId: req.params.itemId,
        })
            .limit(offset)
            .skip(first)
            .sort({
                createdAt: -1,
            })
            .exec((err, docs) => {
                if (docs) {
                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'چنین آیتمی وجود ندارد');
                }
            })
    },

    PUT_EACH_ITEM: (req, res, next) => {

        // console.log('req', req.body)
        var stClass = req.data.personInfo.class;
        var iden = req.body.identifierCode;
        var IDPerson = req.data.personInfo._id;
        var reason = req.body.reason;


        // console.log('info',stClass,'schoolBoss')
        // console.log('IDPerson', IDPerson);

        // console.log('req.model ::: ', req.model);
        // if (req.model == "Model { person }") {
        console.log('req.body.reason ::', reason);
        // }




        if (stClass === 'schoolBoss' && req.body.avatar && req.body.cover) {
            // console.log('welcome schoolBoss')

            if (iden) {
                Person.find({ "referalCode": iden }).exec((err44, doccc) => {
                    if (doccc) {

                        var updateQuery = req.body;

                        // console.log("avatar", updateQuery)
                        // console.log("itemId", req.params.itemId)
                        req.model
                            .findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
                            .exec((err, doc) => {
                                // console.log("amin", doc)
                                if (doc) {
                                    //--------------- start

                                    var updateQueryy = {
                                        avatar: req.body.avatar,
                                        logo: req.body.cover,

                                    };


                                    if (typeof reason !== 'undefined') {
                                        // updateQuery.step = 6;
                                    }
                                    School.findOneAndUpdate({ bossId: IDPerson }, updateQueryy, config.mongooseUpdateOptions)
                                        .exec((errSchool, docSchool) => {
                                            // console.log("amin", doc)
                                            if (docSchool) {
                                                req.data.item = doc;
                                                response.ok(req, res, next);
                                            } else {
                                                console.log('error :', errSchool);
                                                response.error(req, res, next, '(ABM-001) مشکل در بروزرسانی آیتم');
                                            }
                                        })


                                    //------------------- end

                                } else {

                                    console.log('error :', err);
                                    response.error(req, res, next, '(ABM-002) مشکل در بروزرسانی آیتم');
                                }
                            })

                    } else {
                        console.log(err44)
                        response.error(req, res, next, 'کد وارد شده اشتباه میباشد');
                    }
                });
            } else {
                // console.log("log3")
                var updateQuery = req.body;
                // console.log("avatar", updateQuery)
                // console.log("itemId", req.params.itemId)
                req.model
                    .findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
                    .exec((err, doc) => {
                        // console.log("amin", doc)
                        if (doc) {
                            //--------------- start

                            var updateQueryy = {
                                avatar: req.body.avatar,
                                logo: req.body.cover,

                            };

                            if (typeof reason !== 'undefined') {
                                // updateQuery.step = 6;
                            }

                            School.findOneAndUpdate({ bossId: IDPerson }, updateQueryy, config.mongooseUpdateOptions)
                                .exec((errSchool, docSchool) => {
                                    // console.log("amin", doc)
                                    if (docSchool) {
                                        req.data.item = doc;
                                        response.ok(req, res, next);

                                    } else {

                                        console.log('error :', errSchool);
                                        response.error(req, res, next, '(ABM-003) مشکل در بروزرسانی آیتم');
                                    }
                                })


                            //-------------------end

                        } else {

                            console.log('error :', err);
                            response.error(req, res, next, '(ABM-004) مشکل در بروزرسانی آیتم');
                        }
                    })
            }

        } else if (stClass === 'educationalInstitutions' && req.body.avatar && req.body.cover) {
            // console.log('welcome educationalInstitutions')
            if (iden) {
                Person.find({ "referalCode": iden }).exec((err44, doccc) => {
                    if (doccc) {

                        var updateQuery = req.body;

                        // console.log("avatar", updateQuery)
                        // console.log("itemId", req.params.itemId)
                        req.model
                            .findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
                            .exec((errr, docs) => {
                                // console.log("amin", doc)
                                if (docs) {
                                    //--------------- start

                                    var updateQueryy = {
                                        avatar: req.body.avatar,
                                        logo: req.body.cover,

                                    };

                                    if (typeof reason !== 'undefined') {
                                        // updateQuery.step = 6;
                                    }

                                    Academies.findOneAndUpdate({ bossId: IDPerson }, updateQueryy, config.mongooseUpdateOptions)
                                        .exec((errEducation, docEducation) => {
                                            // console.log("amin", doc)
                                            if (docEducation) {
                                                req.data.item = docs;
                                                response.ok(req, res, next);
                                            } else {
                                                console.log('error :', errEducation);
                                                response.error(req, res, next, '(ABM-005) مشکل در بروزرسانی آیتم');
                                            }
                                        })


                                    //------------------- end

                                } else {

                                    console.log('error :', errr);
                                    response.error(req, res, next, '(ABM-006) مشکل در بروزرسانی آیتم');
                                }
                            })

                    } else {
                        console.log(err44)
                        response.error(req, res, next, 'کد وارد شده اشتباه میباشد');
                    }
                });
            } else {
                // console.log("log3")
                var updateQuery = req.body;
                // console.log("avatar", updateQuery)
                // console.log("itemId", req.params.itemId)
                req.model
                    .findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
                    .exec((err, doc) => {
                        // console.log("amin", doc)
                        if (doc) {
                            //--------------- start

                            var updateQueryy = {
                                avatar: req.body.avatar,
                                logo: req.body.cover,

                            };

                            Academies.findOneAndUpdate({ bossId: IDPerson }, updateQueryy, config.mongooseUpdateOptions)
                                .exec((errSchool, docSchool) => {
                                    console.log("amin")
                                    if (docSchool) {
                                        req.data.item = doc;
                                        response.ok(req, res, next);

                                    } else {

                                        console.log('error :', errSchool);
                                        response.error(req, res, next, '(ABM-007) مشکل در بروزرسانی آیتم');
                                    }
                                })


                            //-------------------end

                        } else {

                            console.log('error :', err);
                            response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
                        }
                    })
            }

        }

        else {

            if (iden) {
                Person.find({ "referalCode": iden }).exec((err44, doccc) => {
                    if (doccc) {

                        var updateQuery = req.body;

                        if (typeof reason !== 'undefined') {
                            // updateQuery.step = 6;
                        }

                        // console.log("avatar", updateQuery)
                        // console.log("itemId", req.params.itemId)

                        // console.log('updateQuery ::: ', updateQuery);
                        req.model
                            .findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
                            .exec((err, doc) => {
                                // console.log("amin", doc)
                                if (doc) {
                                    req.data.item = doc;
                                    response.ok(req, res, next);

                                } else {

                                    console.log('error :', err);
                                    response.error(req, res, next, '(ABM-008) مشکل در بروزرسانی آیتم');
                                }
                            })

                    } else {
                        console.log(err44)
                        response.error(req, res, next, 'کد وارد شده اشتباه میباشد');
                    }
                });
            } else {
                // console.log("log3")
                var updateQuery = req.body;
                // console.log("avatar", updateQuery)
                // console.log("itemId", req.params.itemId)

                // console.log('updateQuery ::: ', updateQuery);
                // console.log('req.params.itemId ::: ', req.params.itemId);
                // console.log('req.model ::: ', req.model);

                if (typeof reason !== 'undefined') {
                    // updateQuery.step = 6;
                }
                req.model.findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
                    .exec((err, doc) => {
                        // console.log("amin", doc)
                        if (doc) {
                            req.data.item = doc;
                            response.ok(req, res, next);

                        } else {

                            console.log('error :', err);
                            response.error(req, res, next, '(ABM-009) مشکل در بروزرسانی آیتم');
                        }
                    })
            }
        }


    },

    PUT_EACH_ITEM_PERSON: (req, res, next) => {
        // console.log('req', req.body)
        var updateQuery = req.body;
        // var exPersonalCode = req.data.personInfo.personalCode;

        // console.log('updateQuery :::', updateQuery);

        var personalCodeValid = false;
        var personalCode = updateQuery.personalCode;
        Person.findOne({ 'personalCode': personalCode }).exec((errPersonal, docPersonal) => {
            if (docPersonal) {
                personalCodeValid = false;
            }
            else {
                personalCodeValid = true;
            }

            if (personalCodeValid == true) {
                Person.findByIdAndUpdate(req.params.itemId, { class: req.body.class, changeClass: false }, config.mongooseUpdateOptions)
                    .exec((err, doc) => {
                        
                        // console.table(err,doc)
                        console.log('@@@@@@@@@@@@@@@@@@@@@@@@',err,doc)
                        if (doc) {
                            var strClass = req.body.class;
                            // console.log('strClass ::::: ', strClass);
                            // console.log('req.body ::::: ', req.body);

                            Package.find({ 'roll': strClass, 'priceAll': 0 }).exec((errPack, docPack) => {
                                if (docPack) {
                                    var expirePackageDate = doc.expirePackageDate;
                                    var expireDate = null;
                                    if (typeof expirePackageDate !== 'undefined') {
                                        // var expirePackageDate = expirePackageDate.toISOString().substring(0, 10);
                                        var expireDate = new Date();
                                        var days = docPack[0].duration * 7;
                                        expireDate.setDate(expireDate.getDate() + days);
                                    } else {
                                        // var expirePackageDate = moment().toISOString().substring(0, 10);
                                        var expireDate = new Date();
                                        var days = docPack[0].duration * 7;
                                        expireDate.setDate(expireDate.getDate() + days);
                                        // new Date(newDate.setDate(newDate.getDate() + number))
                                    }

                                    if (strClass === 'user' || strClass === 'family') {


                                        console.log('$$$$$ Insert user or family',doc)
                                        // console.table(err,doc)


                                        if (checkNationalCode(personalCode)) {
                                            req.model.findByIdAndUpdate(req.params.itemId, { expirePackageDate: expireDate, isConfirmed: true }, config.mongooseUpdateOptions)
                                                .exec((err1, doc1) => {
                                                    
                                                    if (doc1) {
                                                        moment.locale('en');
                                                        var current_date = moment().toISOString();

                                                        var birth = updateQuery.birth;
                                                        var new_date_user = moment.from(birth, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
                                                        console.log('new_date_user :', new_date_user);

                                                        // var createdAt = item.createdAt;
                                                        var date1 = new Date(new_date_user);
                                                        var date2 = new Date(current_date);
                                                        var diffTime = Math.abs(date2 - date1);
                                                        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                                                       // console.log('diffTime ::::: ', diffTime);
                                                       // console.log('diffDays ::::: ', diffDays);

                                                        diffDays = Math.floor(((diffDays / 30) / 12));
                                                        updateQuery.age = diffDays;

                                                        
                                                        
                                                        req.model.findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
                                                            .exec((err2, doc2) => {
                                                                // console.table(err2,doc2)
                                                                if (doc2) {
                                                                    //console.log('diffDays ::::: ', diffDays);
                                                                    //console.log('doc2.notificationKey ::::: ', doc2.notificationKey);
                                                                    
                                                                    subscribeTokenToTopic(doc2.notificationKey, 'public');
                                                                    req.data.item = doc2;
                                                                    response.ok(req, res, next);

                                                                } else {

                                                                    console.log('error :', err2);
                                                                    response.error(req, res, next, '(ABM-010) مشکل در بروزرسانی کلاس');
                                                                    //dkjfhskdjhf
                                                                }
                                                            });
                                                    } else {
                                                        console.log('error :', err1);
                                                        response.error(req, res, next, '(ABM-011) مشکل در بروزرسانی کلاس');
                                                    }

                                                });
                                        }
                                        else {
                                            console.log('national code not valid');
                                            response.error(req, res, next, 'کد ملی معتبر نیست');
                                        }
                                    } else if (strClass === 'mentor' || strClass === 'teacher') {
                                        if (checkNationalCode(personalCode)) {

                                            var MentorId = req.data.personInfo._id.toString();
                                            if (strClass == 'mentor') {
                                                if (typeof req.data.personInfo.channelId == 'undefined' || req.data.personInfo.channelId === null) {
                                                    new Channel({
                                                        mentorId: MentorId,
                                                        channelName: req.body.firstName,
                                                        channelAvatar: req.body.avatar,
                                                    }).save((err, doc) => {
                                                        if (doc) {
                                                            // console.log('doc :::', doc);

                                                            Mentor.findByIdAndUpdate(MentorId, {
                                                                channelId: doc._id
                                                            }, {
                                                                new: true,
                                                                runValidators: true
                                                            }).exec((err3, doc3) => {
                                                                if (doc3) {
                                                                    console.log(req.model)
                                                                    Mentor.findByIdAndUpdate(req.params.itemId, { expirePackageDate: expireDate, isConfirmed: false, supportCode: rand.generate(5) }, config.mongooseUpdateOptions)
                                                                        .exec((err3, doc3) => {
                                                                            if (doc3) {

                                                                                moment.locale('en');
                                                                                var current_date = moment().toISOString();

                                                                                var birth = updateQuery.birth;
                                                                                var new_date_user = moment.from(birth, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
                                                                                console.log('new_date_user :', new_date_user);

                                                                                // var createdAt = item.createdAt;
                                                                                var date1 = new Date(new_date_user);
                                                                                var date2 = new Date(current_date);
                                                                                var diffTime = Math.abs(date2 - date1);
                                                                                var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                                                diffDays = Math.floor(((diffDays / 30) / 12));
                                                                                updateQuery.age = diffDays;


                                                                                Mentor.findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
                                                                                    .exec((err5, doc5) => {
                                                                                        if (doc5) {
                                                                                            subscribeTokenToTopic(doc5.notificationKey, 'public');
                                                                                            req.data.item = doc5;
                                                                                            response.ok(req, res, next);

                                                                                        } else {
                                                                                            // console.log('amin2')
                                                                                            // console.log(res);
                                                                                            console.log('error :', err5);
                                                                                            response.error(req, res, next, '(ABM-012) مشکل در بروزرسانی کلاس');
                                                                                        }
                                                                                    });
                                                                            } else {
                                                                                console.log('error :', err3);
                                                                                response.error(req, res, next, '(ABM-013) مشکل در بروزرسانی کلاس');

                                                                            }

                                                                        });


                                                                } else {
                                                                    response.error(req, res, next, 'اطلاعات یافت نشد');
                                                                    console.log(err3)
                                                                }
                                                            })
                                                        } else {
                                                            response.error(req, res, next, 'اطلاعات یافت نشد');
                                                        }

                                                    })
                                                } else {


                                                    var channelName = req.data.personInfo.firstName + ' ' + req.data.personInfo.lastName;
                                                    var channelId = {
                                                        "status": req.data.personInfo.channelId.status,
                                                        "isActive": req.data.personInfo.channelId.isActive,
                                                        "isDelete": req.data.personInfo.channelId.isDelete,
                                                        "_id": req.data.personInfo.channelId._id,
                                                        "mentorId": MentorId,
                                                        "channelName": channelName,
                                                        "channelAvatar": req.data.personInfo.avatar,
                                                        "createdAt": req.data.personInfo.channelId.createdAt,
                                                        "updatedAt": req.data.personInfo.channelId.updatedAt,
                                                        "id": req.data.personInfo.channelId._id.toString()
                                                    }
                                                    console.log(req.model)
                                                    Mentor.findByIdAndUpdate(req.params.itemId, { expirePackageDate: expireDate, isConfirmed: false, supportCode: rand.generate(5) }, config.mongooseUpdateOptions)
                                                        .exec((err3, doc3) => {
                                                            
                                                            if (doc3) {

                                                                moment.locale('en');
                                                                var current_date = moment().toISOString();

                                                                var birth = updateQuery.birth;
                                                                var new_date_user = moment.from(birth, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
                                                                console.log('new_date_user :', new_date_user);

                                                                // var createdAt = item.createdAt;
                                                                var date1 = new Date(new_date_user);
                                                                var date2 = new Date(current_date);
                                                                var diffTime = Math.abs(date2 - date1);
                                                                var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                                diffDays = Math.floor(((diffDays / 30) / 12));
                                                                updateQuery.age = diffDays;

                                                                Mentor.findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
                                                                    .exec((err5, doc5) => {
                                                                        if (doc5) {
                                                                            subscribeTokenToTopic(doc5.notificationKey, 'public');
                                                                            req.data.item = doc5;
                                                                            response.ok(req, res, next);

                                                                        } else {
                                                                            // console.log('amin2')
                                                                            // console.log(res);
                                                                            console.log('error :', err5);
                                                                            response.error(req, res, next, '(ABM-014) مشکل در بروزرسانی کلاس');
                                                                        }
                                                                    });
                                                            } else {
                                                                console.log('error :', err3);
                                                                response.error(req, res, next, '(ABM-015) مشکل در بروزرسانی کلاس');

                                                            }

                                                        });
                                                }
                                            }
                                            else {
                                                req.model.findByIdAndUpdate(req.params.itemId, { expirePackageDate: expireDate, isConfirmed: false, supportCode: rand.generate(5) }, config.mongooseUpdateOptions)
                                                    .exec((err3, doc3) => {
                                                        if (doc3) {
                                                            moment.locale('en');
                                                            var current_date = moment().toISOString();

                                                            var birth = updateQuery.birth;
                                                            var new_date_user = moment.from(birth, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
                                                            console.log('new_date_user :', new_date_user);

                                                            // var createdAt = item.createdAt;
                                                            var date1 = new Date(new_date_user);
                                                            var date2 = new Date(current_date);
                                                            var diffTime = Math.abs(date2 - date1);
                                                            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                            diffDays = Math.floor(((diffDays / 30) / 12));
                                                            updateQuery.age = diffDays;


                                                            req.model.findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
                                                                .exec((err5, doc5) => {
                                                                    if (doc5) {
                                                                        subscribeTokenToTopic(doc5.notificationKey, 'public');
                                                                        req.data.item = doc5;
                                                                        response.ok(req, res, next);
                                                                    } else {
                                                                        // console.log('amin2')
                                                                        // console.log(res);
                                                                        console.log('error :', err5);
                                                                        response.error(req, res, next, '(ABM-016) مشکل در بروزرسانی کلاس');
                                                                    }
                                                                });
                                                        } else {
                                                            console.log('error :', err3);
                                                            response.error(req, res, next, '(ABM-017) مشکل در بروزرسانی کلاس');

                                                        }

                                                    });
                                            }



                                        }
                                        else {
                                            console.log('national code not valid');
                                            response.error(req, res, next, 'کد ملی معتبر نیست');
                                        }
                                    } else {
                                        // console.log('req.body ::::', req.body);
                                        if (strClass === 'schoolBoss') {

                                            if (checkNationalCode(personalCode)) {
                                                req.model.findByIdAndUpdate(req.params.itemId, { expirePackageDate: expireDate, isConfirmed: false }, config.mongooseUpdateOptions)
                                                    .exec((err4, doc4) => {
                                                        if (doc4) {

                                                            moment.locale('en');
                                                            var current_date = moment().toISOString();

                                                            var birth = updateQuery.birth;
                                                            var new_date_user = moment.from(birth, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
                                                            console.log('new_date_user :', new_date_user);

                                                            // var createdAt = item.createdAt;
                                                            var date1 = new Date(new_date_user);
                                                            var date2 = new Date(current_date);
                                                            var diffTime = Math.abs(date2 - date1);
                                                            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                            diffDays = Math.floor(((diffDays / 30) / 12));
                                                            updateQuery.age = diffDays;



                                                            req.model.findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
                                                                .exec((err2, doc2) => {
                                                                    if (doc2) {
                                                                        subscribeTokenToTopic(doc2.notificationKey, 'public');
                                                                        new School({
                                                                            title: req.body.companyName,
                                                                            type: req.body.type,
                                                                            boss: req.body.managerName,
                                                                            establishmentNumber: req.body.establishmentNumber,
                                                                            establishedYear: req.body.establishmentYear,
                                                                            provinceId: req.body.provinceId,
                                                                            cityId: req.body.cityId,
                                                                            address: req.body.address,
                                                                            phone: req.body.fixedPhone,
                                                                            avatar: req.body.avatar,
                                                                            logo: req.body.cover,
                                                                            bossId: req.params.itemId
                                                                        }).save((err8, doc8) => {

                                                                            if (doc8) {

                                                                                req.model.findByIdAndUpdate(req.params.itemId, { schoolId: doc8._id }, config.mongooseUpdateOptions)
                                                                                    .exec((err9, doc9) => {
                                                                                        if (doc9) {
                                                                                            req.data.item = doc;
                                                                                            response.ok(req, res, next);
                                                                                        }
                                                                                        else {
                                                                                            console.log('error :', err9);
                                                                                            response.error(req, res, next, '(ABM-016) مشکل در بروزرسانی کلاس');
                                                                                        }
                                                                                    });
                                                                            } else {
                                                                                response.error(req, res, next, 'مشکل در ساخت آیتم');
                                                                                console.log(err8)
                                                                            }
                                                                        })

                                                                    } else {

                                                                        console.log('error :', err2);
                                                                        response.error(req, res, next, '(ABM-017) مشکل در بروزرسانی کلاس');
                                                                    }
                                                                });
                                                        } else {
                                                            console.log('error :', err4);
                                                            response.error(req, res, next, '(ABM-018) مشکل در بروزرسانی کلاس');
                                                        }

                                                    });
                                            }
                                            else {
                                                console.log('national code not valid');
                                                response.error(req, res, next, 'کد ملی معتبر نیست');
                                            }

                                        } else if (strClass === 'educationalInstitutions') {
                                            if (checkNationalCode(personalCode)) {
                                                req.model.findByIdAndUpdate(req.params.itemId, { expirePackageDate: expireDate, isConfirmed: false }, config.mongooseUpdateOptions)
                                                    .exec((err4, doc4) => {
                                                        if (doc4) {

                                                            moment.locale('en');
                                                            var current_date = moment().toISOString();

                                                            var birth = updateQuery.birth;
                                                            var new_date_user = moment.from(birth, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
                                                            console.log('new_date_user :', new_date_user);

                                                            // var createdAt = item.createdAt;
                                                            var date1 = new Date(new_date_user);
                                                            var date2 = new Date(current_date);
                                                            var diffTime = Math.abs(date2 - date1);
                                                            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                            diffDays = Math.floor(((diffDays / 30) / 12));
                                                            updateQuery.age = diffDays;



                                                            req.model.findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
                                                                .exec((err2, doc2) => {
                                                                    if (doc2) {
                                                                        subscribeTokenToTopic(doc2.notificationKey, 'public');
                                                                        new Academies({
                                                                            title: req.body.companyName,
                                                                            type: req.body.type,
                                                                            boss: req.body.managerName,
                                                                            establishmentNumber: req.body.establishmentNumber,
                                                                            establishedYear: req.body.establishmentYear,
                                                                            provinceId: req.body.provinceId,
                                                                            cityId: req.body.cityId,
                                                                            address: req.body.address,
                                                                            phone: req.body.fixedPhone,
                                                                            // avatar : req.body.avatar,
                                                                            // logo : req.body.cover,
                                                                            bossId: req.params.itemId
                                                                        }).save((err9, doc9) => {

                                                                            if (doc9) {


                                                                                req.model.findByIdAndUpdate(req.params.itemId, { academyId: doc9._id }, config.mongooseUpdateOptions)
                                                                                    .exec((err10, doc10) => {
                                                                                        if (doc10) {
                                                                                            req.data.item = doc;
                                                                                            response.ok(req, res, next);
                                                                                        }
                                                                                    });
                                                                            } else {
                                                                                response.error(req, res, next, 'مشکل در ساخت آیتم');
                                                                                console.log(err9)
                                                                            }
                                                                        })

                                                                    } else {

                                                                        console.log('error :', err2);
                                                                        response.error(req, res, next, '(ABM-020 مشکل در بروزرسانی کلاس');
                                                                    }
                                                                });
                                                        } else {
                                                            console.log('error :', err4);
                                                            response.error(req, res, next, '(ABM-021) مشکل در بروزرسانی کلاس');
                                                        }

                                                    });
                                            }
                                            else {
                                                console.log('national code not valid');
                                                response.error(req, res, next, 'کد ملی معتبر نیست');
                                            }
                                        } else
                                            if (checkNationalCode(personalCode)) {
                                                req.model.findByIdAndUpdate(req.params.itemId, { expirePackageDate: expireDate, isConfirmed: false }, config.mongooseUpdateOptions)
                                                    .exec((err4, doc4) => {
                                                        if (doc4) {
                                                            moment.locale('en');
                                                            var current_date = moment().toISOString();

                                                            var birth = updateQuery.birth;
                                                            var new_date_user = moment.from(birth, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
                                                            console.log('new_date_user :', new_date_user);

                                                            // var createdAt = item.createdAt;
                                                            var date1 = new Date(new_date_user);
                                                            var date2 = new Date(current_date);
                                                            var diffTime = Math.abs(date2 - date1);
                                                            var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                            diffDays = Math.floor(((diffDays / 30) / 12));
                                                            updateQuery.age = diffDays;



                                                            req.model.findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
                                                                .exec((err2, doc2) => {
                                                                    if (doc2) {
                                                                        subscribeTokenToTopic(doc2.notificationKey, 'public');
                                                                        req.data.item = doc2;
                                                                        response.ok(req, res, next);

                                                                    } else {

                                                                        console.log('error :', err2);
                                                                        response.error(req, res, next, '(ABM-023) مشکل در بروزرسانی کلاس');
                                                                    }
                                                                });
                                                        } else {
                                                            console.log('error :', err4);
                                                            response.error(req, res, next, '(ABM-024) مشکل در بروزرسانی کلاس');
                                                        }

                                                    });
                                            }
                                            else {
                                                console.log('national code not valid');
                                                response.error(req, res, next, 'کد ملی معتبر نیست');
                                            }
                                    }

                                    // updateQuery = updateQuery

                                }

                            });
                            // req.data.item = doc;
                            // response.ok(req, res, next,'ثبت رول موفق');
                            // if(req.body.class === 'user'){
                            //     return userValidator;
                            //    }
                            // userValidator,
                            // validate

                        } else {
                            // console.log('amin2')
                            // console.log(res);
                            //console.log('error :', err);
			console.log('@@@@@@@@@@@@@@@@@@@@@@@@',err,doc)
				console.table(err,doc)
                            response.error(req, res, next, '(ABM-025) مشکل در بروزرسانی آیتم');
                        }
                    });
            }
            else {
                response.error(req, res, next, 'کد  ملی وارد شده تکراری است');
            }
        });



    },

    PUT_EACH_ITEM_ITEM_COMMENT: (req, res, next) => {

        var itemId = req.params.itemId;
        var userId = req.data.personInfo._id;
        ItemComment.findById(itemId).exec((err, doc) => {
            if (doc) {
                if (doc.CorrectAnswer == true) {
                    response.error(req, res, next, 'یک جواب صحیح وجود دارد !');
                }
                else {
                    var updateQuery = req.body;
                    if (doc.refId.personId._id.toString() == userId.toString()) {
                        ItemComment.findByIdAndUpdate(itemId, updateQuery, config.mongooseUpdateOptions)
                            .exec((err2, doc2) => {
                                if (doc2) {
                                    req.data.item = doc2;
                                    response.ok(req, res, next, 'آپدیت با موفقیت انجام شد');
                                } else {
                                    response.error(req, res, next, '(ABM-026) مشکل در بروزرسانی آیتم');
                                }
                            })
                    }
                    else {
                        response.error(req, res, next, 'امکان تنظیم پاسخ صحیح فقط برای گذارنده سؤال می باشد.');
                    }

                }

            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        });

        // var updateQuery = req.body;
        // req.model
        //     .findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
        //     .exec((err, doc) => {
        //         if (doc) {
        //             // console.log('amin')
        //             req.data.item = doc;
        //             response.ok(req, res, next);

        //         } else {
        //             // console.log('amin2')
        //             // console.log(res);
        //             console.log('error :',err);
        //             response.error(req, res, next, '(ABM-028) مشکل در بروزرسانی آیتم');
        //         }
        //     })
    },

    ACTIVE_EACH_ITEM: (req, res, next) => {
        req.model.findByIdAndUpdate(req.params.itemId, {
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
    DEACTIVE_EACH_ITEM: (req, res, next) => {
        req.model.findByIdAndUpdate(req.params.itemId, {
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
    POST_ITEM: (req, res, next) => {

        new req.model(req.body).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در ساخت آیتم');
            }
        })
    },
    PUT_EACH_ITEM_TOGGLE_LIKE: (req, res, next) => {
        var query = {
            personId: req.data.personInfo._id,
            refModelName: req.modelName,
            refId: req.params.itemId
        };
        ItemLike.findOne(query).exec((preErr, preDoc) => {
            if (preDoc) {
                ItemLike.findOneAndDelete(query).exec(() => {
                    req.data.isLike = false;
                    response.ok(req, res, next);
                });
            } else {
                new ItemLike(query).save((savedErr, savedDoc) => {
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
    PUT_EACH_ITEM_TOGGLE_DISLIKE: (req, res, next) => {
        var query = {
            personId: req.data.personInfo._id,
            refModelName: req.modelName,
            refId: req.params.itemId
        };
        ItemDislike.findOne(query).exec((preErr, preDoc) => {
            if (preDoc) {
                ItemDislike.findOneAndDelete(query).exec(() => {
                    req.data.isDislike = false;
                    response.ok(req, res, next);
                });
            } else {
                new ItemDislike(query).save((savedErr, savedDoc) => {
                    if (savedDoc) {
                        req.data.isDislike = true;
                        response.ok(req, res, next);
                    } else {
                        req.data.isDislike = false;
                        response.ok(req, res, next);
                    }
                })
            }
        })
    },
    PUT_EACH_ITEM_TOGGLE_FOLLOW: (req, res, next) => {
        var query = {
            personId: req.data.personInfo._id,
            refModelName: req.modelName,
            refId: req.params.itemId
        };
        ItemFollower.findOne(query).exec((preErr, preDoc) => {
            if (preDoc) {
                ItemFollower.findOneAndDelete(query).exec(() => {
                    req.data.isFollow = false;
                    response.ok(req, res, next);
                });
            } else {
                new ItemFollower(query).save((savedErr, savedDoc) => {
                    if (savedDoc) {
                        req.data.isFollow = true;
                        response.ok(req, res, next);
                    } else {
                        req.data.isFollow = false;
                        response.ok(req, res, next);
                    }
                })
            }
        })
    },
    PUT_EACH_ITEM_TOGGLE_RATE: (req, res, next) => {
        var query = {
            personId: req.data.personInfo._id,
            rate: req.body.rate,
            refModelName: req.modelName,
            refId: req.params.itemId
        };
        ItemRate.findOne(query).exec((preErr, preDoc) => {
            if (preDoc) {
                ItemRate.findOneAndDelete(query).exec(() => {
                    req.data.isRate = false;
                    response.ok(req, res, next);
                });
            } else {
                new ItemRate(query).save((savedErr, savedDoc) => {
                    if (savedDoc) {
                        req.data.isRate = true;
                        response.ok(req, res, next);
                    } else {
                        req.data.isRate = false;
                        response.ok(req, res, next);
                    }
                })
            }
        })
    },
    PUT_EACH_ITEM_TOGGLE_BOOKMARK: (req, res, next) => {
        var query = {
            personId: req.data.personInfo._id,
            refModelName: req.modelName,
            refId: req.params.itemId
        };
        ItemBookmark.findOne(query).exec((preErr, preDoc) => {
            if (preDoc) {
                ItemBookmark.findOneAndDelete(query).exec(() => {
                    req.data.isBookmark = false;
                    response.ok(req, res, next);
                });
            } else {
                new ItemBookmark(query).save((savedErr, savedDoc) => {
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
    POST_EACH_ITEM_COMMENT: (req, res, next) => {
        new ItemComment({
            personId: req.data.personInfo._id,
            refModelName: req.modelName,
            refId: req.params.itemId,
            caption: req.body.caption,
            CorrectAnswer: req.body.CorrectAnswer,
            AnswerImage: req.body.AnswerImage,
            reply: []
        }).save((err, doc) => {
            if (doc) {
                req.data.subInfo = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در ایجاد زیر مدل');
            }
        })
    },
    POST_EACH_ITEM_REPORT: (req, res, next) => {
        new ItemReport({
            personId: req.data.personInfo._id,
            refModelName: req.modelName,
            refId: req.params.itemId,
            title: req.body.title,
            caption: req.body.caption,
            reply: []
        }).save((err, doc) => {
            if (doc) {
                req.data.subInfo = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در ایجاد زیر مدل');
            }
        })
    },
    GET_ALL_ITEMS: (req, res, next) => {

        if (req.query.aggregate == 'true') {
            req.model
                .aggregate()
                .match({})
                .lookup({
                    from: "itemlikes",
                    localField: "_id",
                    foreignField: "refId",
                    as: "likeList"
                })
                .addFields({
                    likeCount: {
                        $size: "$likeList"
                    },
                })
                .lookup({
                    from: "itemlikes",
                    let: {
                        refId: "$_id",
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$refId", "$$refId"]
                                },
                                {
                                    $eq: ["$personId", config.ObjectIdConvertor(req.data.personInfo._id)]
                                }
                                ]
                            }
                        }
                    }],
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
                })
                .lookup({
                    from: "itemdislikes",
                    localField: "_id",
                    foreignField: "refId",
                    as: "dislikeList"
                })
                .addFields({
                    dislikeCount: {
                        $size: "$dislikeList"
                    },
                })
                .lookup({
                    from: "itemdislikes",
                    let: {
                        refId: "$_id",
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$refId", "$$refId"]
                                },
                                {
                                    $eq: ["$personId", config.ObjectIdConvertor(req.data.personInfo._id)]
                                }
                                ]
                            }
                        }
                    }],
                    as: "dislikes"
                }).addFields({
                    dislikesLen: {
                        $size: "$dislikes"
                    },
                }).addFields({
                    isDislike: {
                        $cond: {
                            if: {
                                $gte: ["$dislikesLen", 1]
                            },
                            then: true,
                            else: false
                        }
                    }
                })
                .lookup({
                    from: "itemcomments",
                    localField: "_id",
                    foreignField: "refId",
                    as: "commentList"
                })
                .addFields({
                    commentCount: {
                        $size: "$commentList"
                    },
                })
                .lookup({
                    from: "itembookmarks",
                    let: {
                        refId: "$_id",
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$refId", "$$refId"]
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
                })
                .lookup({
                    from: "itemrates",
                    localField: "_id",
                    foreignField: "refId",
                    as: "rateList"
                })
                .addFields({
                    rateLen: {
                        $size: "$rateList"
                    },
                })
                .addFields({
                    rate: {
                        $cond: {
                            if: {
                                $gte: ["$rateLen", 1]
                            },
                            then: {
                                $avg: "$rateList.rate"
                            },
                            else: 0
                        }
                    }
                })
                .lookup({
                    from: "itemfollowers",
                    let: {
                        refId: "$_id",
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$refId", "$$refId"]
                                },
                                {
                                    $eq: ["$personId", config.ObjectIdConvertor(req.data.personInfo._id)]
                                }
                                ]
                            }
                        }
                    },],
                    as: "following"
                }).addFields({
                    followingCount: {
                        $size: "$following"
                    },
                })
                .addFields({
                    isFollow: {
                        $cond: {
                            if: {
                                $gte: ["$followingCount", 1]
                            },
                            then: true,
                            else: false
                        }
                    }
                })
                .lookup({
                    from: "itemfollowers",
                    let: {
                        refId: "$_id",
                    },
                    pipeline: [{
                        $match: {
                            $expr: {
                                $and: [{
                                    $eq: ["$refId", config.ObjectIdConvertor(req.data.personInfo._id)]
                                },
                                {
                                    $eq: ["$personId", "$$refId"]
                                }
                                ]
                            }
                        }
                    },],
                    as: "followers"
                }).addFields({
                    followersCount: {
                        $size: "$followers"
                    },
                })
                .project({
                    bookmarks: 0,
                    bookmarksLen: 0,
                    likes: 0,
                    likesLen: 0,
                    likeList: 0,
                    dislikeList: 0,
                    dislikes: 0,
                    dislikesLen: 0,
                    rateList: 0,
                    rateLen: 0,
                    commentList: 0,
                    following: 0,
                    followers: 0
                }).exec(async (err, docs) => {
                    if (docs) {
                        var list = [];
                        for (let index = 0; index < docs.length; index++) {
                            var each = JSON.parse(JSON.stringify(await req.model.findById(docs[index]._id).exec()));
                            docs[index] = JSON.parse(JSON.stringify(docs[index]));
                            list.push(_.assign({}, docs[index], each));
                        }
                        req.data.items = list;
                        response.ok(req, res, next);
                    } else {
                        response.error(req, res, next, 'aggregate Fail');
                    }

                })
        } else {
            req.model.find({}).exec((err, docs) => {
                if (docs) {
                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next);
                }

            })
        }

    }
}