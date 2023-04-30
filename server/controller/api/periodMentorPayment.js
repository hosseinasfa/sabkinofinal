const Model = require("../../model/periodMentorPayment");
const Financial = require("../../model/financial");
const ChatList = require("../../model/chatList");
const periodMentor = require("../../model/periodMentor");
const OnlineCallMentor = require("../../model/onlineCallMentor");
const PeriodMentorPriceList = require("../../model/periodMentorPriceList");
const Person = require("../../model/person").Person;
const response = require("../../response");
var config = require('../../config');
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
        var userId = req.data.personInfo._id.toString();
        var mentorId = req.body.mentorId;
        var periodMentorId = req.body.periodMentorId;
        var walletBalance = req.data.personInfo.walletBalance;
        var price = 0;
        // console.log('userId :::::::::::::', userId);
        // console.log('mentorId :::::::::::::', mentorId);
        // console.log('periodMentorId :::::::::::::', periodMentorId);
        periodMentor.findById(periodMentorId)
            .exec(function (err, doc) {
                if (doc) {
                    var paymentCount = doc.paymentCount;
                    var USERID = doc.userId;
                    price = doc.price;
                    var sessionCount = doc.sessionCount;
                    var duration = doc.duration;
                    if (walletBalance >= price) {
                        // var duaration= 0;
                        // var callCount= 0;


                        PeriodMentorPriceList
                            .find({
                                $and: [
                                    {
                                        fromSesson: {
                                            $lte: sessionCount,
                                        }
                                    },
                                    {
                                        toSesson: {
                                            $gte: sessionCount
                                        }
                                    }
                                ]
                            })
                            .exec((errPriceList, docPriceList) => {
                                if (errPriceList) {
                                    response.error(req, res, next, 'اطلاعات کاربر یافت نشد');
                                }

                                if (docPriceList.length != 0) {
                                    var percent = docPriceList[0].percent;

                                    var compute = price - ((price * percent) / 100);
                                    var query = {
                                        'periodMentorId': periodMentorId,
                                        'amount': price,
                                        'type': 'onlineCourse',
                                        'count': 1,
                                        'totalPrice': price,
                                        'finalPrice': compute,
                                        'ownerId': userId,
                                        'userId': USERID,
                                    };

                                    new Financial(query).save((errFinancial, docFinancial) => {
                                        if (docFinancial) {
                                            Person.findByIdAndUpdate(userId, {
                                                walletBalance: walletBalance - doc.price
                                            }, {
                                                new: true,
                                                runValidators: true
                                            }).exec((err2, doc2) => {
                                                if (err2) {
                                                    response.error(req, res, next);
                                                }
                                            });

                                            periodMentor.findByIdAndUpdate(periodMentorId, {
                                                paymentCount: paymentCount + 1
                                            }, {
                                                new: true,
                                                runValidators: true
                                            }).exec((err3, doc3) => {
                                                if (doc3) {
                                                    Model.find({}).sort('id').exec(function (err, docs) {
                                                        // req.body.id = docs.reverse()[0].id + 1;
                                                        if (docs) {


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


                                                            var query = {
                                                                userId: userId,
                                                                mentorId: mentorId,
                                                                periodMentorId: periodMentorId,
                                                                price: price,
                                                            };
                                                            new Model(query).save((err4, doc4) => {
                                                                if (doc4) {
                                                                    req.data.item = doc4;
                                                                    response.ok(req, res, next);
                                                                } else {
                                                                    response.error(req, res, next);
                                                                }
                                                            })
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

                                } else {
                                    response.error(req, res, next, 'اطلاعات یافت نشد');
                                }
                            });
                    } else {
                        response.error(req, res, next, 'اعتبار شما کافی نیست');
                    }
                } else {
                    response.error(req, res, next);
                }
            });
    },
    PAYMENT_CHECKOUT: (req, res, next) => {
        var userId = req.query.userId;
        var mentorId = req.query.mentorId;
        Model.find({
            'userId': userId,
            'mentorId': mentorId,
        }).exec(function (err, docs) {
            if (err) {
                response.error(req, res, next);
            } else {
                if (docs.length != 0) {
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'لطفا یک دوره خریداری نمایید');
                }
            }
        });
    },
    PAYMENT_CHECKOUT_USER: (req, res, next) => {
        var userId = req.data.personInfo._id.toString();
        var periodMentorId = req.query.periodMentorId;

        console.log('userId :: ',userId);
        console.log('periodMentorId :: ',periodMentorId);
        Model.findOne({
            'userId': userId,
            'periodMentorId': periodMentorId,
        }).exec(function (err, doc) {
            if (err) {
                response.error(req, res, next);
            } else {
                if (doc) {
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            }
        });
    },
    GET_PAYMENT_LIST: (req, res, next) => {
        var mentorId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var periodMentorId = req.query.periodMentorId;

        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        if (strClass == 'teacher') {
            Model.find({
                'mentorId': mentorId,
                'periodMentorId': periodMentorId,
            })
                .limit(offset)
                .skip(first)
                .exec(function (err, docs) {
                    if (err) {
                        response.error(req, res, next);
                    } else {
                        if (docs) {
                            if (docs.length != 0) {
                                req.data.items = docs;
                                response.ok(req, res, next);
                            } else {
                                response.error(req, res, next);
                            }
                        }
                        else {
                            response.error(req, res, next);
                        }
                    }
                });
        }
        else if (strClass == 'mentor') {
            Model.find({
                'mentorId': mentorId,
                'periodMentorId': periodMentorId,
            })
                .limit(offset)
                .skip(first)
                .exec(function (err, docs) {
                    if (err) {
                        response.error(req, res, next);
                    } else {
                        if (docs) {
                            if (docs.length != 0) {
                                req.data.items = docs;
                                response.ok(req, res, next);
                            } else {
                                response.error(req, res, next);
                            }
                        }
                        else {
                            response.error(req, res, next);
                        }
                    }
                });
        }
        else if (strClass == 'user') {
            Model.find({
                'userId': mentorId,
            })
                .limit(offset)
                .skip(first)
                .exec(function (err, docs) {
                    if (err) {
                        response.error(req, res, next);
                    } else {
                        if (docs) {
                            if (docs.length != 0) {
                                req.data.items = docs;
                                response.ok(req, res, next);
                            } else {
                                response.error(req, res, next);
                            }
                        }
                        else {
                            response.error(req, res, next);
                        }
                    }
                });
        }
        else {
            response.error(req, res, next, 'دسترسی ندارید');
        }
    }

};