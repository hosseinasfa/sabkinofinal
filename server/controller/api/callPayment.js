const Model = require("../../model/callPayment");
const CallLog = require("../../model/callLog");
const MentorAvailableTime = require("../../model/mentorAvailableTime");
const OnlineCall = require("../../model/onlineCall");
const Financial = require("../../model/financial");
const Person = require("../../model/person").Person;
const response = require("../../response");
var config = require('../../config');
const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal = ZarinpalCheckout.create('3dfbabd4-1806-47e4-aabb-9daa441b4100', true);
const onlineCallPackage = require("../../model/onlineCallPackage");
var persianDate = require('persian-date');
var offset = parseInt(process.env.ROW_NUMBER);
var moment = require('jalali-moment');

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

module.exports = {
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
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
            })
    },
    GET_EACH_ITEM: (req, res, next) => {
        Model.findById(req.params.ModelId).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },

    POST_ITEM: (req, res, next) => {
        new Model(req.body).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
                console.log(req.data.item.onlineCallPackageId.price)
            } else {
                response.error(req, res, next);
            }
        })
    },
    createPaymentUrl: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var availableTimeId = req.body.availableTimeId;
        var mentorId = req.body.mentorId;
        var onlineCallPackageId = req.body.onlineCallPackageId;

        console.log('req.body :::: ',req.body);
        onlineCallPackage.findById(onlineCallPackageId).exec((err, respons) => {
            if (respons) {
                var walletBalance = req.data.personInfo.walletBalance;
                var isWalletActive = req.data.personInfo.isWalletActive;
                var itemId = req.data.personInfo._id.toString();
                var price = respons.price;
                var USERID = respons.mentorId
                if (isWalletActive == true) {
                    if (walletBalance >= price) {
                        var duration = respons.duration;
                        var startAvailableTime = null;
                        var endAvailableTime = null;

                        var newStartTime = null;
                        var newEndTime = null;
                        MentorAvailableTime.findById(availableTimeId).exec((errAvailableTime, resAvailableTime) => {
                            if (resAvailableTime != null) {
                                process.env.TZ = 'Asia/Tehran';
                                var lastTimeReserved = resAvailableTime.lastTimeReserved;
                                if (lastTimeReserved == null || lastTimeReserved == '00:00') {
                                    console.log('lastTimeReserved111111 :', lastTimeReserved);
                                    startAvailableTime = resAvailableTime.startTime;
                                    endAvailableTime = resAvailableTime.endTime;
                                    // availableDate = moment.from(resAvailableTime.date , 'en', 'YYYY/MM/DD HH:mm');
                                    availableDate = moment(resAvailableTime.date).format('YYYY-MM-DD');
                                    // console.log('availableDate ::', availableDate);
                                    availableDate = availableDate + 'T' + startAvailableTime + ':00.000Z';
                                    // var newStartTime = moment(availableDate).add(startAvailableTime, 'm').toDate();

                                    duration = duration + parseInt(process.env.SPACE_BETWEEN_TWO_CALL);
                                    newEndTime = moment(availableDate).add(duration, 'm').toDate();


                                    // console.log('date1 ::',date1);
                                    // console.log('aa ::',aa);
                                    newStartTime = startAvailableTime;
                                    // newEndTime = moment(newEndTime).format('HH:mm');
                                    // newEndTime = newEndTime.toISOString();

                                    arrNewEndTime = newEndTime.toISOString().split('T');
                                    newEndTime = arrNewEndTime[1];
                                    newEndTime = newEndTime.replace(':00.000Z', '');

                                    // console.log('startAvailableTime ::', startAvailableTime);
                                    // console.log('newEndTime ::', newEndTime);
                                    // console.log('availableDate ::', availableDate);

                                    var callDate = moment(resAvailableTime.date).format('YYYY-MM-DD');

                                    var queryCallLog = {
                                        'userId': userId,
                                        'callDate': callDate,
                                        'startTime': newStartTime,
                                        'endTime': newEndTime,
                                        'mentorId': mentorId,
                                        'mentoravailabletimeId': availableTimeId,
                                        'status': 'reserved',
                                    };

                                    CallLog.find(queryCallLog).exec((errCall, resCall) => {
                                        if (errCall) {
                                            response.error(req, res, next);
                                        } else {

                                            console.log('resCall ::::', resCall);
                                            if (resCall.length == 0) {
                                                new CallLog(queryCallLog).save((err, doc) => {
                                                    MentorAvailableTime.findByIdAndUpdate(availableTimeId, {
                                                        lastTimeReserved: newEndTime,
                                                        isActive: true,
                                                    }, {
                                                        new: true,
                                                        runValidators: true
                                                    }).exec((err2, doc2) => {
                                                        if (doc2) {
                                                            var queryCallPayment = {
                                                                'userId': userId,
                                                                'onlineCallPackageId': onlineCallPackageId,
                                                                'amount': price,
                                                            };
                                                            new Model(queryCallPayment).save((errCallPayment, docCallPayment) => {
                                                                if (docCallPayment) {
                                                                    itemId2 = docCallPayment._id.toString();

                                                                    var duration = respons.duration;
                                                                    var percent = 0;
                                                                    OnlineCall.find({
                                                                        'duration': duration,
                                                                        // priceFrom : { $gt :  price},
                                                                        // priceTo : { $lt : price},
                                                                    }).exec((err3, doc3) => {
                                                                        console.log('percent ::::', doc3);
                                                                        if (doc3.length != 0) {
                                                                            percent = doc3[0].percent;

                                                                            var compute = price - ((price * percent) / 100);
                                                                            console.log('compute ::::::', compute);
                                                                            var query = {
                                                                                'callPaymentId': itemId2,
                                                                                'amount': price,
                                                                                'type': 'onlineCall',
                                                                                'count': 1,
                                                                                'totalPrice': price,
                                                                                'finalPrice': compute,
                                                                                'ownerId' : userId,
                                                                                'userId' : USERID
                                                                            };

                                                                            new Financial(query).save((errFinancial, docFinancial) => {
                                                                                if (docFinancial) {
                                                                                    Person.findByIdAndUpdate(itemId, {
                                                                                        walletBalance: walletBalance - price
                                                                                    }, {
                                                                                        new: true,
                                                                                        runValidators: true
                                                                                    }).exec((err4, doc4) => {
                                                                                        if (doc4) {
                                                                                            req.data.item = respons;
                                                                                            response.ok(req, res, next);
                                                                                        } else {
                                                                                            response.error(req, res, next,'00');
                                                                                        }
                                                                                    });
                                                                                } else {
                                                                                    response.error(req, res, next,'11');
                                                                                }
                                                                            });
                                                                        }

                                                                    });

                                                                } else {
                                                                    response.error(req, res, next,'22');
                                                                }
                                                            });
                                                        } else {
                                                            response.error(req, res, next,'33');
                                                        }
                                                    })
                                                });
                                            } else {
                                                response.error(req, res, next,'44');
                                            }
                                        }
                                    });
                                } else {
                                    startAvailableTime = resAvailableTime.startTime;
                                    lastTimeReserved = resAvailableTime.lastTimeReserved;
                                    endAvailableTime = resAvailableTime.endTime;
                                    // availableDate = moment.from(resAvailableTime.date , 'en', 'YYYY/MM/DD HH:mm');
                                    availableDate = moment(resAvailableTime.date).format('YYYY-MM-DD');
                                    // console.log('availableDate ::', availableDate);
                                    availableDate = availableDate + 'T' + lastTimeReserved + ':00.000Z';
                                    // var newStartTime = moment(availableDate).add(startAvailableTime, 'm').toDate();

                                    duration = duration + parseInt(process.env.SPACE_BETWEEN_TWO_CALL);
                                    newEndTime = moment(availableDate).add(duration, 'm').toDate();

                                    // console.log('date1 ::',date1);
                                    // console.log('aa ::',aa);
                                    newStartTime = lastTimeReserved;
                                    // newEndTime = moment(newEndTime).format('HH:mm');
                                    // newEndTime = newEndTime.toISOString();

                                    arrNewEndTime = newEndTime.toISOString().split('T');
                                    newEndTime = arrNewEndTime[1];
                                    newEndTime = newEndTime.replace(':00.000Z', '');

                                    console.log('startAvailableTime ::', lastTimeReserved);
                                    console.log('newEndTime ::', newEndTime);
                                    console.log('availableDate ::', availableDate);

                                    var callDate = moment(resAvailableTime.date).format('YYYY-MM-DD');

                                    var endAvailableTimeTemp = moment.from(endAvailableTime, 'fa', 'HH:mm').toISOString();
                                    var date1 = new Date(endAvailableTimeTemp);


                                    var newEndTimeTemp = moment.from(newEndTime, 'fa', 'HH:mm').toISOString();
                                    var date2 = new Date(newEndTimeTemp);

                                    if (date2.getTime() <= date1.getTime()) {
                                        var queryCallLog = {
                                            'userId': userId,
                                            'callDate': callDate,
                                            'startTime': newStartTime,
                                            'endTime': newEndTime,
                                            'mentorId': mentorId,
                                            'mentoravailabletimeId': availableTimeId,
                                            'status': 'reserved',
                                        };

                                        CallLog.find(queryCallLog).exec((errCall, resCall) => {
                                            if (errCall) {
                                                response.error(req, res, next);
                                            } else {

                                                console.log('resCall ::::', resCall);
                                                if (resCall.length == 0) {
                                                    new CallLog(queryCallLog).save((err, doc) => {
                                                        MentorAvailableTime.findByIdAndUpdate(availableTimeId, {
                                                            lastTimeReserved: newEndTime,
                                                            isActive: true,
                                                        }, {
                                                            new: true,
                                                            runValidators: true
                                                        }).exec((err2, doc2) => {
                                                            if (doc2) {


                                                                var queryCallPayment = {
                                                                    'userId': userId,
                                                                    'onlineCallPackageId': onlineCallPackageId,
                                                                    'amount': price,
                                                                };

                                                                new Model(queryCallPayment).save((errCallPayment, docCallPayment) => {
                                                                    if (docCallPayment) {
                                                                        itemId2 = docCallPayment._id.toString();

                                                                        var duration = respons.duration;
                                                                        var percent = 0;
                                                                        OnlineCall.find({
                                                                            'duration': duration,
                                                                            // priceFrom : { $gt :  price},
                                                                            // priceTo : { $lt : price},
                                                                        }).exec((err3, doc3) => {
                                                                            console.log('percent ::::', doc3);
                                                                            if (doc3.length != 0) {
                                                                                percent = doc3[0].percent;

                                                                                var compute = price - ((price * percent) / 100);
                                                                                console.log('compute ::::::', compute);
                                                                                var query = {
                                                                                    'callPaymentId': itemId2,
                                                                                    'amount': price,
                                                                                    'type': 'onlineCall',
                                                                                    'count': 1,
                                                                                    'totalPrice': price,
                                                                                    'finalPrice': compute,
                                                                                };

                                                                                new Financial(query).save((errFinancial, docFinancial) => {
                                                                                    if (docFinancial) {
                                                                                        Person.findByIdAndUpdate(itemId, {
                                                                                            walletBalance: walletBalance - price
                                                                                        }, {
                                                                                            new: true,
                                                                                            runValidators: true
                                                                                        }).exec((err4, doc4) => {
                                                                                            if (doc4) {
                                                                                                req.data.item = respons;
                                                                                                response.ok(req, res, next);
                                                                                            } else {
                                                                                                response.error(req, res, next,'0');
                                                                                            }
                                                                                        });
                                                                                    } else {
                                                                                        response.error(req, res, next,'1');
                                                                                    }
                                                                                });
                                                                            }

                                                                        });

                                                                    } else {
                                                                        response.error(req, res, next,'2');
                                                                    }
                                                                });

                                                            } else {
                                                                response.error(req, res, next,'3');
                                                            }
                                                        })
                                                    });
                                                } else {
                                                    response.error(req, res, next,'4');
                                                }
                                            }
                                        });
                                    } else {
                                        response.error(req, res, next, 'متاسفانه در این زمان نمی توانید بگیرید');
                                    }
                                }
                            } else {
                                response.error(req, res, next,'5');
                            }
                        });

                    } else {
                        response.error(req, res, next, 'متاسفانه اعتبار شما کافی نیست');
                    }
                } else {
                    response.error(req, res, next, 'کاربر عزیز کیف پول شما مسدود شده');
                }
            } else {
                response.error(req, res, next,'6');
            }
        })

    },

    checkPaymentCallPackage: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var onlineCallPackageId = req.body.onlineCallPackageId;
        onlineCallPackage.findById(onlineCallPackageId).exec((err, respons) => {
            if (err) {
                response.error(req, res, next, 'اطلاعات ارسالی ناقص می باشد');
            } else {
                var walletBalance = req.data.personInfo.walletBalance;
                var isWalletActive = req.data.personInfo.isWalletActive;
                var itemId = req.data.personInfo._id.toString();
                var price = respons.price;

                if (isWalletActive == true) {
                    if (walletBalance >= price) {
                        response.ok(req, res, next);
                    } else {
                        response.error(req, res, next, 'کاربر گرامی اعتبار شما کافی نیست');
                    }
                } else {
                    response.error(req, res, next, 'کاربر گرامی حساب شما غیر فعال شده');
                }
            }

        });
    }


};