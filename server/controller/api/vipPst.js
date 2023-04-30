const Model = require("../../model/vipPst");
const VipUserFollow = require("../../model/vipUserFollow");
const VipHashtag = require("../../model/vipHashtag");
const VipPstSave = require("../../model/vipPstSave");
const VipPstLike = require("../../model/vipPstLike");
const response = require("../../response");
var config = require('../../config');
var moment = require('jalali-moment');
const Person = require("../../model/person").Person;
const Mentor = require("../../model/person").Mentor;
var offset = parseInt(process.env.ROW_NUMBER);
var offsetApi = parseInt(process.env.ROW_NUMBER_API);
var VITRIN_POST_LIMIT = parseInt(process.env.VITRIN_POST_LIMIT);

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

        // const crypto = require('crypto')

        // let hash = crypto.createHash('md5').update('some_string').digest("hex");
        // console.log('hash', hash);


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
        });
    },
    GET_BY_USERID: (req, res, next) => {
        var userId = req.params.userId;
        var personInfo = req.data.personInfo;
        var visitUserId = req.params.visitUserId;
        var postId = req.params.postId;

        console.log('userId :::::::::::::::', userId);
        console.log('visitUserId :::::::::::::::', visitUserId);
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
            // first = parseInt(first) + offset;
        }

        console.log('first ::::::::::', first);
        // console.log('visitUserId ::::::::::', visitUserId);
        // console.log('first ::::::::::', first);
        // console.log('offset ::::::::::', offset);

        var is_follow = false;


        // Model
        // .aggregate([
        //     // { $skip: first }, { $limit: offset }
        // ])
        // .match({
        //     $and: [
        //         {_id : config.ObjectIdConvertor(postId) },
        //         { isActive: true },
        //         { isDelete: false }
        //     ]
        // }).lookup({
        //     from: "vippstlikes",
        //     localField: "_id",
        //     foreignField: "postId",
        //     as: "likeData"
        // })
        // .lookup({
        //     from: "vippstsaves",
        //     localField: "_id",
        //     foreignField: "postId",
        //     as: "saveData"
        // })
        // .lookup({
        //     from: "people",
        //     localField: "userId",
        //     foreignField: "_id",
        //     as: "userData"
        // })
        // .lookup({
        //     from: "vippstmedias",
        //     localField: "_id",
        //     foreignField: "postId",
        //     as: "pstMediaData"
        // }).exec((err, data) => {

        //     if (err) {
        //         response.error(req, res, next, 'not found');
        //         return;
        //     } else {

        //     }
        // });


        VipUserFollow.find({
            'userId': visitUserId,
            'followUserId': userId,
        })
            .exec((err, doc) => {
                if (err) {
                    is_follow = false;
                } else {
                    if (doc.length != 0) {
                        is_follow = true;
                    }
                }

                Model
                    .aggregate([
                        // { $skip: first }, { $limit: offset }
                    ])
                    .match({
                        $and: [
                            { 'userId': config.ObjectIdConvertor(userId) },
                            { isActive: true },
                            { isDelete: false }
                        ]
                    })
                    .lookup({
                        from: "vippstlikes",
                        localField: "_id",
                        foreignField: "postId",
                        as: "likeData"
                    })
                    .lookup({
                        from: "vippstsaves",
                        localField: "_id",
                        foreignField: "postId",
                        as: "saveData"
                    })
                    .lookup({
                        from: "people",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userData"
                    })
                    .lookup({
                        from: "vippstmedias",
                        localField: "_id",
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
                            var responseData = [];
                            data.forEach(item => {

                                var likes = item.likeData;
                                var is_like = false;
                                likes.forEach(l => {
                                    if (l.userId == visitUserId) {
                                        is_like = true;
                                    }
                                });

                                var saves = item.saveData;
                                var is_save = false;
                                saves.forEach(l => {
                                    if (l.userId == visitUserId) {
                                        is_save = true;
                                    }
                                });

                                var userData = item.userData;
                                var pstMediaData = item.pstMediaData;
                                var firstName = '';
                                var lastName = '';
                                var avatar = null;
                                userData.forEach(l => {
                                    // console.log('llllllllllll :',l);
                                    if (l._id.toString() == userId) {
                                        // console.log('llllllllllll :', l);
                                        firstName = l.firstName;
                                        lastName = l.lastName;
                                        avatar = process.env.BASE_URL + process.env.UPLOAD_URL + '/files/' + l.avatar;
                                    }
                                });


                                // if (userData) {
                                //     if (item.userData.length != 0) {
                                //         avatar = process.env.BASE_URL + process.env.UPLOAD_URL + '/files/'.item.userData[0].avatar;
                                //     }
                                // }

                                //console.log('item.userData : ',item.userData);

                                // var responseData2 = {};
                                // if (item._id.toString() == postId.toString()) {
                                //     responseData2 = {
                                //         '_id': item._id.toString(),
                                //         'userId': item.userId,
                                //         'avatar': avatar,
                                //         'firstName': firstName,
                                //         'lastName': lastName,
                                //         'title': item.title,
                                //         'postImage': process.env.BASE_URL + process.env.UPLOAD_URL + "/pst_media/" + item.avatar,
                                //         'caption': item.caption,
                                //         'tag': item.tag,
                                //         'description': item.description,
                                //         'postLike': item.postLike,
                                //         'postSaved': item.postSaved,
                                //         'sort': item.sort,
                                //         'is_like': is_like,
                                //         'is_save': is_save,
                                //         'is_follow': is_follow,
                                //         'pstMediaData': pstMediaData,
                                //         'isActive': item.isActive,
                                //         'isDelete': item.isDelete,
                                //         'createdAt': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                                //         'updatedAt': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                                //     };
                                // }
                                // else {
                                responseData.push({
                                    '_id': item._id.toString(),
                                    'userId': item.userId,
                                    'avatar': avatar,
                                    'firstName': firstName,
                                    'lastName': lastName,
                                    'title': item.title,
                                    'postImage': process.env.BASE_URL + process.env.UPLOAD_URL + "/pst_media/" + item.avatar,
                                    'caption': item.caption,
                                    'tag': item.tag,
                                    'description': item.description,
                                    'postLike': item.postLike,
                                    'postSaved': item.postSaved,
                                    'sort': item.sort,
                                    'is_like': is_like,
                                    'is_save': is_save,
                                    'is_follow': is_follow,
                                    'pstMediaData': pstMediaData,
                                    'isActive': item.isActive,
                                    'isDelete': item.isDelete,
                                    'createdAt': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                                    'updatedAt': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                                });
                                // }
                            });


                            // console.log('responseData :',responseData);
                            // req.personInfo = personInfo;
                            req.data = responseData;
                            response.ok(req, res, next);
                        }

                    });
            });
    },
    GET_USER_POSTS: (req, res, next) => {

        console.log('GET_USER_POSTS ::: ');
        var userId = req.query.userId;
        var personInfo = req.data.personInfo;
        var visitUserId = req.data.personInfo._id;
        var postId = req.query.postId;

        console.log('userId :::::::::::::::', userId);
        console.log('visitUserId :::::::::::::::', visitUserId);
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
            // first = parseInt(first) + offset;
        }

        console.log('first ::::::::::', first);
        // console.log('visitUserId ::::::::::', visitUserId);
        // console.log('first ::::::::::', first);
        // console.log('offset ::::::::::', offset);

        var is_follow = false;

        var responseData2 = {};
        VipUserFollow.find({
            'userId': visitUserId,
            'followUserId': userId,
        })
            .exec((err, doc) => {
                if (err) {
                    is_follow = false;
                } else {
                    if (doc.length != 0) {
                        is_follow = true;
                    }
                }

                Model
                    .aggregate([
                        // { $skip: first }, { $limit: offset }
                    ])
                    .match({
                        $and: [
                            { 'userId': config.ObjectIdConvertor(userId) },
                            { isActive: true },
                            { isDelete: false }
                        ]
                    })
                    .lookup({
                        from: "vippstlikes",
                        localField: "_id",
                        foreignField: "postId",
                        as: "likeData"
                    })
                    .lookup({
                        from: "vippstsaves",
                        localField: "_id",
                        foreignField: "postId",
                        as: "saveData"
                    })
                    .lookup({
                        from: "people",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userData"
                    })
                    .lookup({
                        from: "vippstmedias",
                        localField: "_id",
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
                            var responseData = [];
                            data.forEach(item => {

                                var likes = item.likeData;
                                var is_like = false;
                                likes.forEach(l => {
                                    if (l.userId == visitUserId.toString()) {
                                        is_like = true;
                                    }
                                });

                                var saves = item.saveData;
                                var is_save = false;
                                saves.forEach(l => {
                                    if (l.userId == visitUserId.toString()) {
                                        is_save = true;
                                    }
                                });

                                var userData = item.userData;
                                var pstMediaData = item.pstMediaData;
                                var firstName = '';
                                var lastName = '';
                                var avatar = null;
                                var strClass = '';
                                userData.forEach(l => {
                                    // console.log('llllllllllll :',l);
                                    if (l._id.toString() == userId) {
                                        // console.log('llllllllllll :', l);
                                        firstName = l.firstName;
                                        lastName = l.lastName;
                                        strClass = l.class;
                                        avatar = process.env.BASE_URL + process.env.UPLOAD_URL + '/files/' + l.avatar;
                                    }
                                });


                                // if (userData) {
                                //     if (item.userData.length != 0) {
                                //         avatar = process.env.BASE_URL + process.env.UPLOAD_URL + '/files/'.item.userData[0].avatar;
                                //     }
                                // }

                                //console.log('item.userData : ',item.userData);



                                console.log('strClass :', strClass);
                                console.log('item._id.toString() :', item._id.toString());
                                console.log('postId.toString() :', postId.toString());
                                if (item._id.toString() == postId.toString()) {
                                    responseData2 = {
                                        '_id': item._id.toString(),
                                        'userId': item.userId,
                                        'avatar': avatar,
                                        'firstName': firstName,
                                        'lastName': lastName,
                                        'title': item.title,
                                        'postImage': process.env.BASE_URL + process.env.UPLOAD_URL + "/pst_media/" + item.avatar,
                                        'caption': item.caption,
                                        'tag': item.tag,
                                        'class': strClass,
                                        'description': item.description,
                                        'postLike': item.postLike,
                                        'postSaved': item.postSaved,
                                        'sort': item.sort,
                                        'is_like': false,
                                        'is_save': is_save,
                                        'is_follow': is_follow,
                                        'pstMediaData': pstMediaData,
                                        'isActive': item.isActive,
                                        'isDelete': item.isDelete,
                                        'createdAt': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                                        'updatedAt': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                                    };
                                }
                                else {
                                    responseData.push({
                                        '_id': item._id.toString(),
                                        'userId': item.userId,
                                        'avatar': avatar,
                                        'firstName': firstName,
                                        'lastName': lastName,
                                        'title': item.title,
                                        'postImage': process.env.BASE_URL + process.env.UPLOAD_URL + "/pst_media/" + item.avatar,
                                        'caption': item.caption,
                                        'tag': item.tag,
                                        'class':  strClass,
                                        'description': item.description,
                                        'postLike': item.postLike,
                                        'postSaved': item.postSaved,
                                        'sort': item.sort,
                                        'is_like': false,
                                        'is_save': is_save,
                                        'is_follow': is_follow,
                                        'pstMediaData': pstMediaData,
                                        'isActive': item.isActive,
                                        'isDelete': item.isDelete,
                                        'createdAt': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                                        'updatedAt': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                                    });
                                }
                            });


                            responseData.unshift(responseData2);



                            // console.log('responseData :',responseData);
                            // req.personInfo = personInfo;
                            req.data = responseData;
                            response.ok(req, res, next);
                        }

                    });
            });
    },

    POST_CUSTOM_ITEM: (req, res, next) => {
        var strClass = req.data.personInfo.class;
        var userId = req.body.userId;
        var title = req.body.title;
        var caption = req.body.caption;
        var avatar = req.body.avatar;
        var tags = req.body.tags;
        var description = req.body.description;
        var postLike = 0;
        var postSaved = 0;
        var sort = 0;
        var userName = req.data.personInfo.firstName + ' ' + req.data.personInfo.lastName;

        if (strClass == 'mentor' || strClass == 'teacher' || strClass == 'support') {

            if (strClass == 'support') {
                userId = req.data.personInfo.supportMentorId._id;
            }

            // console.log('req.file :::::::::::::::::',req.image);
            // response.ok(req, res, next);
            var query = {
                userId: userId,
                title: title,
                avatar: avatar,
                caption: caption,
                tags: tags,
                description: description,
                postLike: postLike,
                postSaved: postSaved,
                sort: sort,
                userName: userName,
            };

            Person.findById(userId).exec((errUser, docUser) => {
                var posts = 0;
                var todayPostCount = 0;
                var lastPostPublished = null;
                var current_date = moment().format('YYYY/MM/DD HH:mm:ss');
                if (docUser.length != 0) {
                    posts = docUser.posts;
                    todayPostCount = docUser.todayPostCount;
                    lastPostPublished = docUser.lastPostPublished;
                }
                console.log('todayPostCount ::: ', todayPostCount);

                if (todayPostCount < VITRIN_POST_LIMIT) {
                    Person.findByIdAndUpdate(userId, {
                        posts: posts + 1,
                        todayPostCount: todayPostCount + 1,
                        lastPostPublished: current_date,
                    }, {
                        new: true,
                        runValidators: true
                    }).exec((errPost, docPost) => {
                        if (docPost) {
                            new Model(query).save((err, doc) => {
                                if (doc) {
                                    req.data.item = doc;
                                    response.ok(req, res, next);
                                } else {
                                    response.error(req, res, next, 'مشکل در ساخت آیتم');
                                }
                            })
                        } else {
                            response.error(req, res, next);
                        }
                    });
                } else if (todayPostCount >= VITRIN_POST_LIMIT) {


                    // console.log('lastPostPublished.diff ::', lastPostPublished.getFullYear());
                    // console.log('lastPostPublished.diff ::', lastPostPublished.getUTCMonth());
                    // console.log('lastPostPublished.diff ::', lastPostPublished.getUTCDay());

                    year = lastPostPublished.getFullYear();
                    month = lastPostPublished.getMonth() + 1;
                    dt = lastPostPublished.getDate();
                    hour = lastPostPublished.getHours();
                    minute = lastPostPublished.getMinutes();
                    second = lastPostPublished.getSeconds();

                    if (hour < 10) {
                        hour = '0' + hour;
                    }

                    if (minute < 10) {
                        minute = '0' + minute;
                    }

                    if (second < 10) {
                        second = '0' + second;
                    }


                    console.log('time ::::', hour + ':' + minute + ':' + second);
                    if (dt < 10) {
                        dt = '0' + dt;
                    }
                    if (month < 10) {
                        month = '0' + month;
                    }

                    console.log('date :::::: ', year + '-' + month + '-' + dt);
                    lastPostPublished = moment(year + '/' + month + '/' + dt + ' ' + hour + ':' + minute + ':' + second, 'YYYY/MM/DD HH:mm:ss');
                    current_date = moment(current_date, 'YYYY/MM/DD HH:mm:ss');
                    // console.log('lastPostPublished.diff ::', moment(lastPostPublished.toDateString(), 'YYYY/MM/DD'));

                    var duration = moment.duration(current_date.diff(lastPostPublished));
                    var hours = duration.asHours();
                    console.log('hours :::::::::', hours);
                    if (hours > 24) {
                        Person.findByIdAndUpdate(userId, {
                            posts: posts + 1,
                            todayPostCount: 0,
                            lastPostPublished: current_date,
                        }, {
                            new: true,
                            runValidators: true
                        }).exec((errPost, docPost) => {
                            if (docPost) {
                                new Model(query).save((err, doc) => {
                                    if (doc) {
                                        req.data.item = doc;
                                        response.ok(req, res, next);
                                    } else {
                                        response.error(req, res, next, 'مشکل در ساخت آیتم');
                                    }
                                })
                            } else {
                                response.error(req, res, next);
                            }
                        });
                    } else {
                        response.error(req, res, next, 'متاسفانه تعداد پست های ثبت شده بیش از حد مجاز است');
                    }
                }
            });
        } else {
            response.error(req, res, next, 'متاسفانه دسترسی برای ثبت ئست ندارید');
        }
    },
    GET_EXPOLORE_POST: (req, res, next) => {
        var first = req.query.first;
        var title = req.query.title;
        // var caption = req.query.caption;
        // var description = req.query.description;

        var personInfo = req.data.personInfo;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offsetApi;
        }

        process.env.TZ = 'Asia/Tehran';
        var current_date = moment().format('YYYY/MM/DD');
        var current_iso_date = moment().toISOString();
        var current_time = moment().locale('fa').format('HH:mm');


        function escapeRegex(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        };

        var filter = {};
        // var filter = {
        //     $and: [
        //         {
        //             startDate: {
        //                 $lte: current_iso_date,
        //             }
        //         },
        //         {
        //             endDate: {
        //                 $gte: current_iso_date
        //             }
        //         },
        //         { isActive: true },
        //         { isDelete: false },
        //     ]
        // };



        console.log('filter1 ::: ', filter);

        if (typeof title !== 'undefined') {
            const regex = new RegExp(escapeRegex(title), 'gi');
            // filter.title = regex;

            
            filter = {
                $or: [
                    {title: regex},
                    {userName: regex},
                    {caption: regex},
                    {description: regex},
                ],
                $and: [
                    {
                        startDate: {
                            $lte: current_iso_date,
                        }
                    },
                    {
                        endDate: {
                            $gte: current_iso_date
                        }
                    },
                    { isActive: true },
                    { isDelete: false },
                ]
            };
        }
        else
        {
            filter = {
                $and: [
                    {
                        startDate: {
                            $lte: current_iso_date,
                        }
                    },
                    {
                        endDate: {
                            $gte: current_iso_date
                        }
                    },
                    { isActive: true },
                    { isDelete: false },
                ]
            };
        }

        // if (typeof caption !== 'undefined') {
        //     const regex = new RegExp(escapeRegex(caption), 'gi');
        //     filter.caption = regex;
        // }

        // if (typeof description !== 'undefined') {
        //     const regex = new RegExp(escapeRegex(description), 'gi');
        //     filter.description = regex;
        // }

        // filter.userId = {};
        // filter.userId.firstName = 'صنم';





        // console.log('current_time :::::::::::', current_time);
        // console.log('current_date :::::::::::', current_date);
        // console.log('current_iso_date :::::::::::', current_iso_date);

        // .find({
        //     $and: [
        //         {
        //             startDate: {
        //                 $lte: current_iso_date,
        //             }
        //         },
        //         {
        //             endDate: {
        //                 $gte: current_iso_date
        //             }
        //         },
        //         { isActive: true },
        //         { isDelete: false },
        //     ]
        // })






        console.log('filter ::: ', filter);

        Model
            .find(filter)
            // .populate({ path: 'userId', firstName:'صنم'})
            .populate({
                path: 'userId',
                match: {
                    'userId.firstName': 'صنم'
                }
            })
            .limit(offsetApi)
            .skip(first)
            .sort({ createdAt: -1 })
            .exec((err, data) => {
                if (err) {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                } else {
                    var respon = [];
                    var itemIds = [];
                    // process.env.TZ = 'Asia/Tehran';
                    data.forEach(item => {
                        if (item.startTime != null && item.endTime != null) {
                            var new_startTime = moment.from(current_date + ' ' + item.startTime, 'en', 'YYYY/MM/DD HH:mm').format('YYYY/MM/DD HH:mm');
                            var new_endTime = moment.from(current_date + ' ' + item.endTime, 'en', 'YYYY/MM/DD HH:mm').format('YYYY/MM/DD HH:mm');
                            var date_current = new Date(current_date + ' ' + current_time);
                            var date1 = new Date(new_startTime);
                            var date2 = new Date(new_endTime);



                            console.log('date_current :::', date_current);
                            console.log('new_startTime :::', date1);
                            console.log('new_endTime :::', date2);


                            if (date_current.getTime() >= date1.getTime() && date_current.getTime() <= date2.getTime()) {
                                //same date
                                console.log('is ok');
                                respon.push(item);
                                itemIds.push(item._id);
                            } else {
                                console.log('not in range');
                            }

                        }
                    });


                    console.log('itemIds ::: ', itemIds);
                    // isActive: true,
                    //         isDelete: false,
                    //         _id: { $nin: itemIds }



                    var filter2 = {};
                    if (typeof title !== 'undefined') {
                        const regex = new RegExp(escapeRegex(title), 'gi');
                        // filter2.title = regex;


                        filter2 = {
                            $or: [
                                {title: regex},
                                {userName: regex},
                                {caption: regex},
                                {description: regex},
                            ],
                            $and: [
                                { _id: { $nin: itemIds } },
                                { isActive: true },
                                { isDelete: false },
                            ]
                        };


                    }

                    // if (typeof caption !== 'undefined') {
                    //     const regex = new RegExp(escapeRegex(caption), 'gi');
                    //     filter2.caption = regex;
                    // }

                    // if (typeof description !== 'undefined') {
                    //     const regex = new RegExp(escapeRegex(description), 'gi');
                    //     filter2.description = regex;
                    // }

                    // filter2.isActive = true;
                    // filter2.isDelete = false;
                    // filter2._id = { $nin: itemIds };


                    Model
                        .find(filter2)
                        .populate({
                            path: 'userId',
                            match: {
                                'userId.firstName': 'صنم'
                            }
                        })
                        .sort({ postTopRate: -1, createdAt: -1 })
                        .limit(offsetApi)
                        .skip(first)
                        .exec((err2, data2) => {
                            if (data2) {
                                if (data2.length > 0) {
                                    console.log('data2 : ', data2.length);
                                    data2.forEach(item => {

                                        // var isExist = false;
                                        // itemIds.forEach(itemId => {
                                        //     if (itemId == item._id) {
                                        //         isExist = true;
                                        //     }
                                        // });

                                        // if (isExist == false) {
                                        respon.push(item);
                                        // }
                                    });


                                    // req.data.personInfo = personInfo;
                                    req.data = respon;
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
            });
    },
    GET_HOME_POST: (req, res, next) => {
        var first = req.query.first;
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }


        console.log('userId ::::::: ', userId);
        var personInfo = req.data.personInfo;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }


        var followUsers = [];
        VipUserFollow.find({ 'userId': userId }).exec((err2, data2) => {
            data2.forEach(item => {
                if (item.followUserId != null) {
                    followUsers.push(config.ObjectIdConvertor(item.followUserId._id));
                }
            });

            console.log('followUsers ::::', followUsers);

            var is_follow = true;
            Model
                .aggregate([
                    {
                        $match: {
                            $and: [
                                { userId: config.ObjectIdConvertor(userId) },
                                { isActive: true },
                                { isDelete: false }
                            ]
                        }
                    },
                    { $sort: { createdAt: -1 } },
                    { $limit: offset },
                    { $skip: first },

                ])
                .lookup({
                    from: "vippstlikes",
                    localField: "_id",
                    foreignField: "postId",
                    as: "likeData"
                })
                .lookup({
                    from: "vippstsaves",
                    localField: "_id",
                    foreignField: "postId",
                    as: "saveData"
                })
                .lookup({
                    from: "people",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                })
                .lookup({ 
                    from: "vippstmedias",
                    localField: "_id",
                    foreignField: "postId",
                    as: "pstMediaData"
                })
                // .sort({ createdAt: -1 })
                // .sort({_id: -1})
                // .skip(first)
                // .limit(offset)                    
                .exec((err, data) => {
                    if (err) {
                        response.error(req, res, next, 'not found');
                        return;
                    } else {

                        console.log('data :::::::::::::', data.length);
                        var responseData = [];
                        data.forEach(item => {

                            var likes = item.likeData;
                            console.log('item.likeData ::::', item.likeData);
                            var is_like = false;
                            likes.forEach(l => {
                                if (l.userId == userId.toString()) {
                                    is_like = true;
                                }
                            });

                            var saves = item.saveData;
                            console.log('item.saveData ::::', item.saveData);
                            var is_save = false;
                            saves.forEach(l => {

                                if (l.userId == userId.toString()) {
                                    is_save = true;
                                }
                            });

                            var userData = item.userData;

                            // console.log('userData :::',userData);
                            var pstMediaData = item.pstMediaData;
                            var firstName = '';
                            var lastName = '';
                            var strClass = '';
                            var avatar = null;
                            userData.forEach(l => {
                                // console.log('llllllllllll :',l);
                                // if (l._id.toString() == userId.toString()) {
                                // console.log('llllllllllll :', l);
                                firstName = l.firstName;
                                lastName = l.lastName;
                                strClass = l.class;
                                avatar = process.env.BASE_URL + process.env.UPLOAD_URL + '/files/' + l.avatar;
                                // }
                            });


                            // if (userData) {
                            //     if (item.userData.length != 0) {
                            //         avatar = process.env.BASE_URL + process.env.UPLOAD_URL + '/files/'.item.userData[0].avatar;
                            //     }
                            // }

                            //console.log('item.userData : ',item.userData);
                            responseData.push({
                                '_id': item._id.toString(),
                                'userId': item.userId,
                                'avatar': avatar,
                                'firstName': firstName,
                                'lastName': lastName,
                                'title': item.title,
                                'postImage': process.env.BASE_URL + process.env.UPLOAD_URL + "/pst_media/" + item.avatar,
                                'caption': item.caption,
                                'class': strClass,
                                'tag': item.tag,
                                'description': item.description,
                                'postLike': item.postLike,
                                'postSaved': item.postSaved,
                                'sort': item.sort,
                                'is_like': is_like,
                                'is_save': is_save,
                                'is_follow': is_follow,
                                'pstMediaData': pstMediaData,
                                'isActive': item.isActive,
                                'isDelete': item.isDelete,
                                'createdAt': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                                'updatedAt': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                            });
                        });


                        Model
                            .aggregate([
                                {
                                    $match: {
                                        $and: [
                                            { userId: { $in: followUsers } },
                                            { isActive: true },
                                            { isDelete: false }
                                        ]
                                    }
                                },
                                { $sort: { createdAt: -1 } },
                                { $limit: offset },
                                { $skip: first },

                                // { $skip: first }, { $limit: offset }
                            ])
                            // .match({
                            //     $and: [
                            //         { 'userId': { $in: followUsers } },
                            //         { 'isActive': true },
                            //         { 'isDelete': false }
                            //     ]
                            // })
                            .lookup({
                                from: "vippstlikes",
                                localField: "_id",
                                foreignField: "postId",
                                as: "likeData"
                            })
                            .lookup({
                                from: "vippstsaves",
                                localField: "_id",
                                foreignField: "postId",
                                as: "saveData"
                            })
                            .lookup({
                                from: "people",
                                localField: "userId",
                                foreignField: "_id",
                                as: "userData"
                            })
                            .lookup({
                                from: "vippstmedias",
                                localField: "_id",
                                foreignField: "postId",
                                as: "pstMediaData"
                            })
                            .sort({ createdAt: -1 })
                            // .sort({_id: -1})
                            // .skip(first)
                            // .limit(offset)                    
                            .exec((err, data) => {
                                if (err) {
                                    response.error(req, res, next, 'not found');
                                    return;
                                } else {

                                    data.forEach(item => {

                                        var likes = item.likeData;
                                        var is_like = false;
                                        likes.forEach(l => {
                                            if (l.userId == userId.toString()) {
                                                is_like = true;
                                            }
                                        });

                                        var saves = item.saveData;
                                        var is_save = false;
                                        saves.forEach(l => {
                                            if (l.userId == userId.toString()) {
                                                is_save = true;
                                            }
                                        });



                                        var userData = item.userData;
                                        // console.log('userData2 :::',userData);

                                        var pstMediaData = item.pstMediaData;
                                        var firstName = '';
                                        var lastName = '';
                                        var strClass = '';
                                        var avatar = null;
                                        userData.forEach(l => {
                                            // console.log('llllllllllll :',l);
                                            // if (l._id.toString() == userId.toString()) {
                                            // console.log('llllllllllll :', l);
                                            firstName = l.firstName;
                                            lastName = l.lastName;
                                            strClass = l.class;
                                            avatar = process.env.BASE_URL + process.env.UPLOAD_URL + '/files/' + l.avatar;
                                            // }
                                        });


                                        responseData.push({
                                            '_id': item._id.toString(),
                                            'userId': item.userId,
                                            'avatar': avatar,
                                            'firstName': firstName,
                                            'lastName': lastName,
                                            'title': item.title,
                                            'postImage': process.env.BASE_URL + process.env.UPLOAD_URL + "/pst_media/" + item.avatar,
                                            'caption': item.caption,
                                            'class': strClass,
                                            'tag': item.tag,
                                            'description': item.description,
                                            'postLike': item.postLike,
                                            'postSaved': item.postSaved,
                                            'sort': item.sort,
                                            'is_like': is_like,
                                            'is_save': is_save,
                                            'is_follow': is_follow,
                                            'pstMediaData': pstMediaData,
                                            'isActive': item.isActive,
                                            'isDelete': item.isDelete,
                                            'createdAt': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                                            'updatedAt': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                                        });
                                    });

                                    // req.personInfo = personInfo;
                                    console.log('ttttttttttttttttttttttttttttt');
                                    req.data = responseData;
                                    response.ok(req, res, next);
                                }
                            });

                        // console.log('responseData :',responseData);

                    }

                });


        });
    },
    GET_HOME_POST2: (req, res, next) => {
        // var first = req.query.first;
        // var userId = req.query.userId;
        // if (typeof first === 'undefined') {
        //     first = 0;
        // } else {
        //     first = parseInt(first) * offset;
        // }

        // process.env.TZ = 'Asia/Tehran';
        // var current_date = moment().format('YYYY/MM/DD');
        // var current_iso_date = moment().toISOString();
        // var current_time = moment().locale('fa').format('HH:mm');

        // var followUsers = [];
        // VipUserFollow.find({ 'userId': userId }).exec((err2, data2) => {
        //     data2.forEach(item => {
        //         followUsers.push(config.ObjectIdConvertor(item.followUserId._id));
        //     });

        //     console.log('followUsers ::::', followUsers);

        //     Model
        //         .find({ userId: { $in: followUsers } })
        //         .limit(offset)
        //         .skip(first)
        //         .sort({ createdAt: 1 })
        //         .exec((err, data) => {
        //             if (err) {
        //                 console.log('err :::', err);
        //                 response.error(req, res, next, 'اطلاعات یافت نشد');
        //             } else {

        //                 if (data) {
        //                     var respon = [];
        //                     console.log('data.length :::', data.length);
        //                     // process.env.TZ = 'Asia/Tehran';
        //                     data.forEach(item => {
        //                         // if (item.startTime != null && item.endTime != null) {
        //                         var new_startTime = moment.from(current_date + ' ' + item.startTime, 'en', 'YYYY/MM/DD HH:mm').format('YYYY/MM/DD HH:mm');
        //                         var new_endTime = moment.from(current_date + ' ' + item.endTime, 'en', 'YYYY/MM/DD HH:mm').format('YYYY/MM/DD HH:mm');
        //                         var date_current = new Date(current_date + ' ' + current_time);
        //                         var date1 = new Date(new_startTime);
        //                         var date2 = new Date(new_endTime);

        //                         console.log('date_current :::', date_current);
        //                         console.log('new_startTime :::', date1);
        //                         console.log('new_endTime :::', date2);


        //                         // if (date_current.getTime() >= date1.getTime() && date_current.getTime() <= date2.getTime()) {
        //                         //same date
        //                         console.log('is ok');
        //                         respon.push(item);
        //                         // } else {
        //                         //     console.log('not in range');
        //                         // }

        //                         // }

        //                     });

        //                     // console.log('respon :', respon);
        //                     // req.data = respon;
        //                     // response.ok(req, res, next);

        //                     Model
        //                         .find({ 'userId': userId })
        //                         .limit(offset)
        //                         .skip(first)
        //                         .exec((err2, data2) => {
        //                             if (!err2) {
        //                                 console.log('top rate post');
        //                                 data2.forEach(item => {
        //                                     respon.push(item);
        //                                 });

        //                                 req.data = respon;
        //                                 response.ok(req, res, next);
        //                             } else {
        //                                 if (respon.length != 0) {
        //                                     req.data = respon;
        //                                     response.ok(req, res, next);
        //                                 } else {
        //                                     response.error(req, res, next);
        //                                 }
        //                             }

        //                         });
        //                 } else {
        //                     response.error(req, res, next);
        //                 }
        //             }
        //         });


        // });

        // console.log('current_time :::::::::::', current_time);
        // console.log('current_date :::::::::::', current_date);
        // console.log('current_iso_date :::::::::::', current_iso_date);

    },

    DELETE_POST_ITEM: (req, res, next) => {
        var itemId = req.query.itemId;
        console.log('itemId :::::::', itemId);

        Model.findById(itemId).exec((errPst, docPst) => {
            if (errPst) {
                response.error(req, res, next);
            } else {
                if (docPst) {
                    var query = {
                        '_id': itemId,
                    };

                    var postUserId = docPst.userId._id.toString();
                    var posts = docPst.userId.posts;
                    var userId = req.data.personInfo._id.toString();
                    var strClass = req.data.personInfo.class;

                    console.log('userId :::', userId);
                    console.log('postUserId :::', postUserId);

                    if (strClass == 'support') {
                        userId = req.data.personInfo.supportMentorId._id.toString();
                    }

                    if (postUserId == userId) {
                        Model.findOneAndDelete(query).exec((err, doc) => {
                            if (err) {
                                response.error(req, res, next);
                            } else {

                                if ((parseInt(posts) - 1) >= 0) {
                                    posts = parseInt(posts) - 1;
                                } else {
                                    posts = 0;
                                }

                                Person.findByIdAndUpdate(postUserId, {
                                    posts: posts,
                                }, {
                                    new: true,
                                    runValidators: true
                                }).exec((errPost, docPost) => {
                                    var query = {
                                        'postId': itemId,
                                    };

                                    VipPstLike.findOneAndDelete(query).exec((err2, doc2) => {
                                        if (err2) {
                                            response.error(req, res, next);
                                        }
                                    });


                                    VipPstSave.findOneAndDelete(query).exec((err2, doc2) => {
                                        if (err2) {
                                            response.error(req, res, next);
                                        }
                                    });

                                    response.ok(req, res, next);

                                });

                            }
                        });
                    } else {
                        response.error(req, res, next, 'دسترسی جهت حذف ندارید');
                    }
                } else {
                    response.error(req, res, next);
                }
            }
        });

    },
    PUT_VIP_PST_ITEM: (req, res, next) => {
        var itemId = req.body.itemId;
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }

        Model.findById(itemId).exec((err, doc) => {
            if (err) {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            } else {
                if (userId.toString() == doc.userId._id.toString()) {
                    Model.findByIdAndUpdate(itemId, req.body, {
                        new: true,
                        runValidators: true
                    }).exec((err2, doc2) => {
                        if (doc2) {
                            response.ok(req, res, next);
                        } else {
                            response.error(req, res, next);
                        }
                    });
                }
                else {
                    response.error(req, res, next);
                }

            }
        });

    },
    GET_PST_ITEM: (req, res, next) => {
        var itemId = req.params.itemId;
        Model.findById(itemId).exec((err, doc) => {
            if (err) {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            } else {

                var item = doc;
                // console.log('llllllllllll :', l);
                var firstName = item.userId.firstName;
                var lastName = item.userId.lastName;
                var avatar = item.userId.avatar;

                res.render('vipPst', {
                    data: {
                        '_id': item._id.toString(),
                        'userId': item.userId,
                        'avatar': avatar,
                        'firstName': firstName,
                        'lastName': lastName,
                        'title': item.title,
                        'postImage': item.avatar,
                        'caption': item.caption,
                        'tag': item.tag,
                        'description': item.description,
                        'postLike': item.postLike,
                        'postSaved': item.postSaved,
                        'sort': item.sort,
                        'isActive': item.isActive,
                        'isDelete': item.isDelete,
                        'createdAt': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                        'updatedAt': moment(item.createdAt, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm'),
                    }
                });
            }
        });

    }
};