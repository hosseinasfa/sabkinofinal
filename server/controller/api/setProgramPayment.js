const Model = require("../../model/setProgramPayment");
const Financial = require("../../model/financial");
const ChatList = require("../../model/chatList");
const mentorPackageList = require("../../model/mentorPackageList");
const OnlineCallMentor = require("../../model/onlineCallMentor");
const EducationalField = require("../../model/educationalField");
const EducationalStage = require("../../model/educationalStage");
const SetProgramExitUser = require("../../model/setProgramExitUser");
const Person = require("../../model/person").Person;
const response = require("../../response");
var moment = require('jalali-moment');
var config = require('../../config');
var offset = parseInt(process.env.ROW_NUMBER);
const User = require("../../model/person").User;
var FCM = require('fcm-node');
const SERVER_KEY = process.env.SERVER_KEY;
const fetch = require("node-fetch");
const { type } = require("os");

function subscribeTokenToTopic(token, topic) {
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
    PAYMENT: (req, res, next) => {
        var ownerID = req.data.personInfo._id;
        var isSetProgramAccess = req.data.personInfo.isSetProgramAccess;
        var userId = req.body.userId;
        var mentorId = req.body.mentorId;
        var mentorPackageId = req.body.mentorPackageId;
        Model.find({
            'userId': userId,
        }).exec((err, docs) => {
            if (docs.length) {
                response.error(req, res, next, 'قبلا بسته را دریافت کرده اید');
            } else {
                mentorPackageList.findById(mentorPackageId).exec((err2, doc2) => {
                    if (doc2) {
                        Person.findById(mentorId).exec((errMentor, docMentor) => {
                            if (docMentor) {
                                var channelId = docMentor.channelId;
                                // console.log('doc2.personInfo ::::::::::', req.data.personInfo.walletBalance);
                                var price = doc2.price;
                                var walletBalance = req.data.personInfo.walletBalance;
                                if (walletBalance >= price) {
                                    var duration = doc2.duration;
                                    var channel = doc2.channel;
                                    var callCount = doc2.callId.callCount;
                                    var percent = 0;
                                    OnlineCallMentor.findOne({
                                        duration: duration,
                                        channel: channel,
                                        callCount: callCount,
                                    }).exec((errCall, docCall) => {
                                        if (docCall) {
                                            percent = docCall.percent;
                                            var computePrice = price - ((price * percent) / 100);

                                            var query = {
                                                'amount': price,
                                                'type': 'consulting',
                                                'count': 1,
                                                'totalSell': 1,
                                                'totalPrice': price,
                                                'totalPriceMonth': 0,
                                                'finalPrice': computePrice,
                                                'ownerId': ownerID,
                                                'userId': doc2.mentorId,
                                                'consultingId': mentorPackageId,
                                            };


                                            new Financial(query).save((errFinancial, docFinancial) => {
                                                if (docFinancial) {

                                                    var paymentDate = moment().locale('en').format('YYYY-MM-DD');
                                                    duration = parseInt(duration) * 30;
                                                    var expirePackageDate = moment(paymentDate, 'YYYY/MM/DD').add(duration, 'days').toISOString();
                                                    // moment.locale('en');

                                                    var query = {
                                                        mentorPackageId: mentorPackageId,
                                                        mentorId: doc2.mentorId,
                                                        userId: ownerID,
                                                        price: price,
                                                        expirePackageDate: expirePackageDate,
                                                    };
                                                    new Model(query).save((err3, doc3) => {
                                                        if (doc3) {

                                                            var hasChannel = false;
                                                            if (doc2.channel == true) {
                                                                hasChannel = true;
                                                            }


                                                            User.findByIdAndUpdate(userId, {
                                                                walletBalance: walletBalance - price,
                                                                channelId: channelId,
                                                                isChannel: true,
                                                                hasMentor: mentorId,

                                                            }, {
                                                                new: true,
                                                                runValidators: true
                                                            }).exec((err, doc) => {
                                                                if (doc) {
                                                                    if (hasChannel == true) {
                                                                        var topicSubsctibe = "channel" + channelId._id.toString();

                                                                        console.log('topicSubsctibe :::', topicSubsctibe);
                                                                        console.log('doc.notificationKey :::', doc.notificationKey);
                                                                        subscribeTokenToTopic(doc.notificationKey, topicSubsctibe);
                                                                        console.log("subscribe to channel");
                                                                    }

                                                                    ChatList.findOne({ UserIdA: userId, UserIdB: mentorId }).exec(function (errChat, docChat) {
                                                                        if (!docChat) {
                                                                            var queryChat = {
                                                                                UserIdA: userId,
                                                                                UserIdB: mentorId,
                                                                                Mute: false,
                                                                                Block: false,
                                                                                message_count: 0,
                                                                            };

                                                                            new ChatList(queryChat).save((err5, doc5) => {
                                                                                if (err5) {
                                                                                    response.error(req, res, next, err5);
                                                                                }
                                                                            })
                                                                        }
                                                                    });




                                                                    ChatList.findOne({ UserIdA: mentorId, UserIdB: userId }).exec(function (errChat, docChat) {
                                                                        if (!docChat) {
                                                                            var queryChat = {
                                                                                UserIdA: mentorId,
                                                                                UserIdB: userId,
                                                                                Mute: false,
                                                                                Block: false,
                                                                                message_count: 0,
                                                                            };

                                                                            new ChatList(queryChat).save((err5, doc5) => {
                                                                                if (err5) {
                                                                                    response.error(req, res, next, err5);
                                                                                }
                                                                            })
                                                                        }
                                                                    });


                                                                    req.data.item = doc3;
                                                                    response.ok(req, res, next);
                                                                } else {
                                                                    response.error(req, res, next);
                                                                }
                                                            });
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

                                } else {
                                    response.error(req, res, next, 'متاسفانه موجودی کافی نیست');
                                }
                            }
                        });

                    }
                })
            }
        })
    },
    GET_PROGRAM_USER: (req, res, next) => {
        var first = req.query.first;
        var search = req.query.search;
        var educationalFieldId = req.query.educationalFieldId;
        var educationalStageId = req.query.educationalStageId;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }


        function getEducationalFieldResult(itemId) {
            return new Promise((resolve) => {
                console.log('itemId:::::::::::   ', itemId);
                EducationalField.findById(itemId).exec((err, doc) => {
                    if (doc) {
                        resolve(doc);
                    }
                    else {
                        resolve(null);
                    }
                });
            });
        }

        async function f1(item) {
            const data = await getEducationalFieldResult(item);
            return data;

        }
        async function getEducationalField(itemId) {
            return await f1(itemId);
        }


        function getEducationalStageResult(itemId) {
            return new Promise((resolve) => {
                console.log('itemId:::::::::::   ', itemId);

                EducationalStage.findById(itemId).exec((err, doc) => {
                    if (doc) {
                        resolve(doc);
                    }
                    else {
                        resolve(null);
                    }
                });
            });
        }

        async function f2(item) {
            const data = await getEducationalStageResult(item);
            return data;

        }
        async function getEducationalStage(itemId) {
            return await f2(itemId);
        }

        var mentorId = req.query.mentorId;
        console.log('mentorId :::::::::::', mentorId);

        var filter = [];
        if (typeof search !== 'undefined' && search != null && search != "") {
            function escapeRegex(text) {
                return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            };
            const regex = new RegExp(escapeRegex(search), 'gi');
            filter.push({ $eq: ["$firstName", search] });
        }

        if (typeof educationalFieldId !== 'undefined' && educationalFieldId != null && educationalFieldId != "") {
            filter.push({ $eq: ["$educationalFieldId", educationalFieldId] });
        }

        if (typeof educationalStageId !== 'undefined' && educationalStageId != null && educationalStageId != "") {
            filter.push({ $eq: ["$educationalStageId", educationalStageId] });
        }


        async function getList(docs) {
            var items = [];
            moment.locale('en');
            var current_date = moment().toISOString();

            for (const item of docs) {

                if (item.userId.length > 0 && item.mentorPackageId.length > 0 && item.mentorId.length > 0) {
                    var mentorPackageId = item.mentorPackageId[0];
                    var mentorId = item.mentorId[0];
                    var userId = item.userId[0];


                    // console.log('item ::: ', item);
                    console.log('item.userId ::: ', item.userId);

                    var educationalFieldId2 = null;
                    if (typeof userId.educationalFieldId !== 'undefined') {
                        educationalFieldId2 = await getEducationalField(userId.educationalFieldId);
                    }


                    var educationalStageId2 = null;
                    if (typeof userId.educationalStageId !== 'undefined') {
                        educationalStageId2 = await getEducationalStage(userId.educationalStageId);
                    }



                    var createdAt = item.createdAt;
                    var date1 = new Date(createdAt);
                    var date2 = new Date(current_date);

                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    var is_new = false;
                    if (diffDays <= 3) {
                        is_new = true;
                    }


                    items.push({
                        _id: item._id.toString(),
                        is_new: is_new,
                        price: item.price,
                        isActive: item.isActive,
                        isDelete: item.isDelete,
                        status: item.status,
                        mentorPackageId: mentorPackageId,
                        mentorId: mentorId,
                        userId: userId,
                        educationalFieldId: educationalFieldId2,
                        educationalStageId: educationalStageId2,
                        createdAt: item.createdAt,
                        updatedAt: item.updatedAt,
                    })
                }

            }
            req.data.items = items;
            response.ok(req, res, next);
        }

        Model
            .aggregate([
                {
                    $match: {
                        $and: [
                            { 'mentorId': config.ObjectIdConvertor(mentorId) },
                            // { isActive: true },
                            // { isDelete: false }
                        ]
                    }
                },
                { $sort: { createdAt: -1 } },
                { $limit: offset },
                { $skip: first },
            ])
            // .match({
            //     $and: [
            //         { 'mentorId': config.ObjectIdConvertor(mentorId) },
            //     //     // { isActive: true },
            //     //     // { isDelete: false }
            //     ]
            // })
            .lookup({
                from: "people",
                localField: "userId",
                foreignField: "_id",
                pipeline: [
                    {
                        $match:
                        {
                            $expr:
                            {
                                $and: filter
                            }
                        }
                    },
                ],

                as: "userId",

            })
            .lookup({
                from: "mentorpackagelists",
                localField: "mentorPackageId",
                foreignField: "_id",
                as: "mentorPackageId"
            })

            .lookup({
                from: "people",
                localField: "mentorId",
                foreignField: "_id",
                as: "mentorId"
            })
            .exec((err, docs) => {
                if (docs) {
                    getList(docs);
                } else {
                    response.error(req, res, next, 'چنین آیتمی وجود ندارد');
                }
            });
    },
    GET_CHECK_VALID_PACKAGE: (req, res, next) => {
        var mentorId = req.body.mentorId;
        var userId = req.body.userId;
        console.log('mentorId :::::::::::', mentorId);
        process.env.TZ = 'Asia/Tehran';

        Model.find({
            'mentorId': mentorId,
            'userId': userId,
            'isActive': true,
            'isDelete': false,
        })
            .exec((err, docs) => {
                if (docs) {
                    let len = docs.length;
                    let is_valid = false;
                    for (var i = 0; i < len; i++) {
                        var paymentDate = docs[i].createdAt;
                        var duration = docs[i].mentorPackageId.duration;
                        duration = parseInt(duration) * 30;

                        paymentDate = moment(paymentDate, 'YYYY/MM/DD').add(duration, 'days').toISOString();
                        moment.locale('en');
                        var current_date = moment().toISOString();

                        // console.log('paymentDate :::', paymentDate);
                        // console.log('duration :::', duration);
                        // console.log('current_date :::', current_date);
                        var date1 = new Date(paymentDate);
                        var date2 = new Date(current_date);

                        if (date1.getTime() >= date2.getTime()) {
                            is_valid = true;
                            break;
                        }
                    }

                    if (is_valid == true) {
                        req.data.items = docs;
                        response.ok(req, res, next);
                    } else {
                        response.error(req, res, next, 'متاسفانه بسته شما اعتبار ندارد');
                    }

                } else {
                    response.error(req, res, next, 'چنین آیتمی وجود ندارد');
                }
            });
    },
    GET_ACTIVE_PACKAGE: (req, res, next) => {
        var userId = req.data.personInfo._id.toString();
        console.log('userId ::::', userId);
        process.env.TZ = 'Asia/Tehran';

        Model.findOne({
            'userId': userId,
            'isActive': true,
            'isDelete': false,
        })
            .exec((err, doc) => {
                if (doc) {
                    let is_valid = false;
                    var paymentDate = doc.createdAt;
                    var duration = doc.mentorPackageId.duration;
                    duration = parseInt(duration) * 30;

                    paymentDate = moment(paymentDate, 'YYYY/MM/DD').add(duration, 'days').toISOString();
                    moment.locale('en');
                    var current_date = moment().toISOString();

                    // console.log('paymentDate :::', paymentDate);
                    // console.log('duration :::', duration);
                    // console.log('current_date :::', current_date);
                    var date1 = new Date(paymentDate);
                    var date2 = new Date(current_date);

                    if (date1.getTime() >= date2.getTime()) {
                        is_valid = true;
                    }


                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    // console.log(diffTime , " milliseconds");
                    // console.log(diffDays , " days");

                    if (is_valid == true) {
                        req.data.expireDays = diffDays;
                        req.data.item = doc;
                        response.ok(req, res, next);
                    } else {
                        response.error(req, res, next, 'متاسفانه بسته شما اعتبار ندارد');
                    }

                } else {
                    response.error(req, res, next, 'چنین آیتمی وجود ندارد');
                }
            });
    },
    GET_USER_PACKAGE: (req, res, next) => {
        var userId = req.data.personInfo._id.toString();
        var mentorId = req.query.mentorId;
        console.log('userId ::::', userId);
        process.env.TZ = 'Asia/Tehran';

        Model.findOne({
            'userId': userId,
            'mentorId': mentorId,
            'isActive': true,
            'isDelete': false,
        })
            .exec((err, doc) => {
                if (doc) {
                    let is_valid = false;
                    var paymentDate = doc.createdAt;
                    var duration = doc.mentorPackageId.duration;
                    duration = parseInt(duration) * 30;

                    paymentDate = moment(paymentDate, 'YYYY/MM/DD').add(duration, 'days').toISOString();
                    moment.locale('en');
                    var current_date = moment().toISOString();

                    // console.log('paymentDate :::', paymentDate);
                    // console.log('duration :::', duration);
                    // console.log('current_date :::', current_date);
                    var date1 = new Date(paymentDate);
                    var date2 = new Date(current_date);

                    if (date1.getTime() >= date2.getTime()) {
                        is_valid = true;
                    }


                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    // console.log(diffTime , " milliseconds");
                    // console.log(diffDays , " days");

                    if (is_valid == true) {
                        req.data.expireDays = diffDays;
                        req.data.item = doc;
                        response.ok(req, res, next);
                    } else {
                        Model.findByIdAndUpdate(doc._id, {
                            status: 'noRenewal',
                        }, {
                            new: true,
                            runValidators: true
                        }).exec((errPayment, docPayment) => {
                            if (docPayment) {
                                response.error(req, res, next, 'متاسفانه بسته شما اعتبار ندارد');
                            }
                            else {
                                response.error(req, res, next, 'متاسفانه بسته شما اعتبار ندارد');
                            }

                        });
                    }

                } else {
                    response.error(req, res, next, 'چنین آیتمی وجود ندارد');
                }
            });
    },
    EXIT_USER: (req, res, next) => {
        var userId = req.query.userId;
        var reportTitle = req.query.reportTitle;
        var mentorId = req.data.personInfo._id.toString();
        var mentorClass = req.data.personInfo.class;
        console.log('userId ::::', userId);
        console.log('mentorId ::::', mentorId);
        process.env.TZ = 'Asia/Tehran';

        if (mentorClass == 'mentor') {
            Model.findOne({
                'userId': userId,
                'mentorId': mentorId,
                'isActive': true,
                'isDelete': false,
            })
                .exec((err, doc) => {
                    if (doc) {
                        var query = {
                            mentorId: mentorId,
                            userId: userId,
                            setProgramPaymentId: doc._id,
                            reportTitle: reportTitle,
                        };
                        new SetProgramExitUser(query).save((errExitUser, docExitUser) => {
                            if (docExitUser) {
                                req.data.item = docExitUser;
                                response.ok(req, res, next);
                            } else {
                                response.error(req, res, next);
                            }
                        });


                        // let is_valid = false;
                        // var expirePackageDate = doc.expirePackageDate;
                        // // expirePackageDate = moment(paymentDate, 'YYYY/MM/DD').add(duration, 'days').toISOString();
                        // moment.locale('en');
                        // var current_date = moment().toISOString();

                        // // console.log('paymentDate :::', paymentDate);
                        // // console.log('duration :::', duration);
                        // // console.log('current_date :::', current_date);
                        // var date1 = new Date(expirePackageDate);
                        // var date2 = new Date(current_date);

                        // if (date1.getTime() >= date2.getTime()) {
                        //     is_valid = true;
                        // }


                        // const diffTime = Math.abs(date2 - date1);
                        // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        // // console.log(diffTime , " milliseconds");
                        // // console.log(diffDays , " days");

                        // if (is_valid == true) {
                        //     console.log('diffDays ::::', diffDays);
                        //     req.data.expireDays = diffDays;
                        //     req.data.item = doc;
                        //     response.ok(req, res, next);
                        // } else {
                        //     response.error(req, res, next, 'متاسفانه بسته شما اعتبار ندارد');
                        // }

                    } else {
                        response.error(req, res, next, 'چنین آیتمی وجود ندارد');
                    }
                });
        }
        else {
            response.error(req, res, next, 'دسترسی ندارید');
        }
    },
    DELETE_USER: (req, res, next) => {
        var userId = req.query.userId;
        var mentorId = req.data.personInfo._id.toString();
        var mentorClass = req.data.personInfo.class;
        console.log('userId ::::', userId);
        process.env.TZ = 'Asia/Tehran';

        if (mentorClass == 'mentor') {
            Model.findOne({
                'userId': userId,
                'mentorId': mentorId,
                'isActive': true,
                'isDelete': false,
            })
                .exec((err, doc) => {
                    if (doc) {
                        let is_valid = false;
                        var expirePackageDate = doc.expirePackageDate;
                        // expirePackageDate = moment(paymentDate, 'YYYY/MM/DD').add(duration, 'days').toISOString();
                        moment.locale('en');
                        var current_date = moment().toISOString();

                        // console.log('paymentDate :::', paymentDate);
                        // console.log('duration :::', duration);
                        // console.log('current_date :::', current_date);
                        var date1 = new Date(expirePackageDate);
                        var date2 = new Date(current_date);

                        if (date1.getTime() >= date2.getTime()) {
                            is_valid = true;
                        }


                        const diffTime = Math.abs(date2 - date1);
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                        // console.log(diffTime , " milliseconds");
                        // console.log(diffDays , " days");
                        console.log('diffDays ::::', diffDays);

                        if (is_valid == true) {
                            req.data.expireDays = diffDays;
                            if (diffDays < 0) {
                                var updateQuery = {
                                    isActive: false,
                                    isDelete: true,
                                };

                                Model
                                    .findByIdAndUpdate(doc._id, updateQuery, config.mongooseUpdateOptions)
                                    .exec((err, doc) => {
                                        if (doc) {
                                            req.data.item = doc;
                                            response.ok(req, res, next);
                                        } else {
                                            response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
                                        }
                                    })
                            }
                            else {
                                var query = {
                                    mentorId: mentorId,
                                    userId: userId,
                                    setProgramPaymentId: doc._id,
                                };
                                SetProgramExitUser.findOne(query).exec((errExitUser, docExitUser) => {
                                    if (docExitUser) {
                                        req.data.item = docExitUser;
                                        response.ok(req, res, next);
                                    } else {
                                        response.error(req, res, next);
                                    }
                                });
                            }
                            // req.data.item = doc;
                            // response.ok(req, res, next);
                        } else {
                            response.error(req, res, next, 'متاسفانه بسته شما اعتبار ندارد');
                        }

                    } else {
                        response.error(req, res, next, 'چنین آیتمی وجود ندارد');
                    }
                });
        }
        else {
            response.error(req, res, next, 'دسترسی ندارید');
        }
    }

};