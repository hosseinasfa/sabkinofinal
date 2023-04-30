const Model = require("../../model/callLog");
const MentorAvailableTime = require("../../model/mentorAvailableTime");
const response = require("../../response");
var config = require('../../config');
const setting = require('../../model/setting');
var moment = require('jalali-moment');
var offset = parseInt(process.env.ROW_NUMBER);
process.env.TZ = 'Asia/Tehran';

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
            // .limit(offset)
            // .skip(first)
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
            })
    },
    POST_ITEM: (req, res, next) => {
        Model.find({}).exec(function (err, docs) {
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
    POST_CALL: (req, res, next) => {
        var userId = req.body.userId;
        var mentorId = req.body.mentorId;
        var callDate = req.body.callDate;
        var mentoravailabletimeId = req.body.mentoravailabletimeId;

        moment.locale('en');
        // console.log('test date :::::',moment.from(date, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD'));
        var new_callDate = moment.from(callDate, 'fa', 'YYYY-MM-DD').toISOString();
        // var new_callDate = t(item.createdAt, 'MM/DD HH:mm').locale('fa').format('MM/DD HH:mm');
        console.log('new_callDate ::::', new_callDate);

        var query = {
            userId: userId,
            mentorId: mentorId,
            callDate: new_callDate,
            mentoravailabletimeId: mentoravailabletimeId,
        };
        // console.log(req.body);
        new Model(query).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در ساخت آیتم');
            }
        });
    },
    GetReservedCall: (req, res, next) => {
        // process.env.TZ = 'Asia/Tehran';
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        var userId = req.query.userId;

        var current_date = moment().format('YYYY-MM-DD');
        var yesterday = moment().subtract(1, "days").format('YYYY-MM-DD');
        current_date = current_date + 'T00:00:00.000Z';
        yesterday = yesterday + 'T00:00:00.000Z';
        console.log('current_date :::::::::::::::', current_date);
        console.log('yesterday :::::::::::::::', yesterday);

        //
        // var current_date = moment().toISOString();
        //
        // console.log('current_date :::::::::::::::', current_date);


        console.log('userId :::::::::::::::', userId);
        Model.find({
            'userId': userId,
            'callDate': { $gte: current_date },
            'status': 'reserved',
        })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    var items = [];
                    var today = [];
                    var yesterday = [];
                    var older = [];
                    docs.forEach(item => {
                        var callDate = '';
                        if (item.callDate.toISOString() == current_date.toString()) {
                            var new_date = item.callDate.toISOString().substring(0, 10);
                            // console.log('new_date ::', new_date);
                            moment.locale('fa');
                            callDate = moment.from(new_date, 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');
                            // console.log('callDate:::::', callDate);

                            today.push({
                                'callDate': callDate,
                                'startTime': item.startTime,
                                'endTime': item.endTime,
                                'status': item.status,
                                '_id': item._id,
                                'userId': item.userId,
                                'mentorId': item.mentorId,
                                'mentoravailabletimeId': item.mentoravailabletimeId,
                                'id': item.id,
                            });

                        } else if (item.callDate.toISOString() == yesterday.toString()) {
                            var new_date = item.callDate.toISOString().substring(0, 10);
                            // console.log('new_date ::', new_date);
                            moment.locale('fa');
                            callDate = moment.from(new_date, 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');
                            // console.log('callDate:::::', callDate);

                            yesterday.push({
                                'callDate': callDate,
                                'startTime': item.startTime,
                                'endTime': item.endTime,
                                'status': item.status,
                                '_id': item._id,
                                'userId': item.userId,
                                'mentorId': item.mentorId,
                                'mentoravailabletimeId': item.mentoravailabletimeId,
                                'id': item.id,
                            });
                        } else {
                            var new_date = item.callDate.toISOString().substring(0, 10);
                            // console.log('new_date ::', new_date);
                            moment.locale('fa');
                            callDate = moment.from(new_date, 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');
                            // console.log('callDate:::::', callDate);

                            older.push({
                                'callDate': callDate,
                                'startTime': item.startTime,
                                'endTime': item.endTime,
                                'status': item.status,
                                '_id': item._id,
                                'userId': item.userId,
                                'mentorId': item.mentorId,
                                'mentoravailabletimeId': item.mentoravailabletimeId,
                                'id': item.id,
                            });
                        }
                    });


                    // items.push({
                    //     'today': today,
                    //     'yesterday': yesterday,
                    //     'older': older,
                    // });

                    items.push({
                        'today': today,
                    });
                    items.push({
                        'yesterday': yesterday,
                    });
                    items.push({
                        'older': older,
                    });

                    req.data.items = items;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'آیتم یافت نشد');
                }
            });
    },
    GetTodayCall: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        // process.env.TZ = 'Asia/Tehran';
        var userId = req.query.userId;

        var current_date = moment().format('YYYY-MM-DD');
        current_date = current_date + 'T00:00:00.000Z';
        console.log('current_date :::::::::::::::', current_date);

        Model.find({
            'userId': userId,
            'callDate': current_date,
        })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    var items = [];
                    docs.forEach(item => {
                        var new_date = item.callDate.toISOString().substring(0, 10);
                        // console.log('new_date ::', new_date);
                        moment.locale('fa');
                        var callDate = moment.from(new_date, 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');
                        // console.log('callDate:::::', callDate);
                        items.push({
                            'callDate': callDate,
                            'startTime': item.startTime,
                            'endTime': item.endTime,
                            'status': item.status,
                            '_id': item._id,
                            'userId': item.userId,
                            'mentorId': item.mentorId,
                            'mentoravailabletimeId': item.mentoravailabletimeId,
                            'id': item.id,
                        });
                    });
                    req.data.items = items;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'آیتم یافت نشد');
                }
            })
    },
    GetHistoryCall: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        // process.env.TZ = 'Asia/Tehran';
        var userId = req.query.userId;
        // var current_date = moment().toISOString();

        var current_date = moment().format('YYYY-MM-DD');
        var yesterday = moment().subtract(1, "days").format('YYYY-MM-DD');
        current_date = current_date + 'T00:00:00.000Z';
        yesterday = yesterday + 'T00:00:00.000Z';
        // console.log('current_date :::::::::::::::', current_date);
        console.log('current_date :::::::::::::::', current_date);
        console.log('yesterday :::::::::::::::', yesterday);

        Model.find({
            'userId': userId,
            'callDate': { $lte: current_date },
        })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    var items = [];
                    var today = [];
                    var yesterday = [];
                    var older = [];
                    docs.forEach(item => {
                        var callDate = '';
                        if (item.callDate.toISOString() == current_date.toString()) {
                            var new_date = item.callDate.toISOString().substring(0, 10);
                            // console.log('new_date ::', new_date);
                            moment.locale('fa');
                            callDate = moment.from(new_date, 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');
                            // console.log('callDate:::::', callDate);

                            today.push({
                                'callDate': callDate,
                                'startTime': item.startTime,
                                'endTime': item.endTime,
                                'status': item.status,
                                '_id': item._id,
                                'userId': item.userId,
                                'mentorId': item.mentorId,
                                'mentoravailabletimeId': item.mentoravailabletimeId,
                                'id': item.id,
                            });

                        } else if (item.callDate.toISOString() == yesterday.toString()) {
                            var new_date = item.callDate.toISOString().substring(0, 10);
                            // console.log('new_date ::', new_date);
                            moment.locale('fa');
                            callDate = moment.from(new_date, 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');
                            // console.log('callDate:::::', callDate);

                            yesterday.push({
                                'callDate': callDate,
                                'startTime': item.startTime,
                                'endTime': item.endTime,
                                'status': item.status,
                                '_id': item._id,
                                'userId': item.userId,
                                'mentorId': item.mentorId,
                                'mentoravailabletimeId': item.mentoravailabletimeId,
                                'id': item.id,
                            });
                        } else {
                            var new_date = item.callDate.toISOString().substring(0, 10);
                            // console.log('new_date ::', new_date);
                            moment.locale('fa');
                            callDate = moment.from(new_date, 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');
                            // console.log('callDate:::::', callDate);

                            older.push({
                                'callDate': callDate,
                                'startTime': item.startTime,
                                'endTime': item.endTime,
                                'status': item.status,
                                '_id': item._id,
                                'userId': item.userId,
                                'mentorId': item.mentorId,
                                'mentoravailabletimeId': item.mentoravailabletimeId,
                                'id': item.id,
                            });
                        }
                    });


                    items.push({
                        'today': today,
                    });
                    items.push({
                        'yesterday': yesterday,
                    });
                    items.push({
                        'older': older,
                    });

                    req.data.items = items;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'آیتم یافت نشد');
                }
            })
    },

    GetReservedCallMentor: (req, res, next) => {

        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }
        var mentorId = req.data.personInfo._id
        var strClass = req.data.personInfo.class
        if (strClass == 'mentor') {

            var yesterday = moment().subtract(1, "days").format('YYYY-MM-DD');
            var current_date = moment().format('YYYY-MM-DD');
            current_date = current_date + 'T00:00:00.000Z';
            yesterday = yesterday + 'T00:00:00.000Z';
            console.log('current_date :::::::::::::::', current_date);

            //
            // var current_date = moment().toISOString();
            //
            // console.log('current_date :::::::::::::::', current_date);


            console.log('yesterday :::::::::::::::', yesterday);
            console.log('mentorId :::::::::::::::', mentorId);
            Model.find({
                'mentorId': mentorId,
                'callDate': { $gte: current_date },
                'status': 'reserved',
            })
                .limit(offset)
                .skip(first)
                .exec((err, docs) => {
                    if (docs) {
                        var items = [];
                        var today = [];
                        var yesterday = [];
                        var older = [];
                        docs.forEach(item => {
                            var callDate = '';
                            console.log('item.callDate.toISOString() :::', item.callDate.toISOString());
                            if (item.callDate.toISOString() == current_date.toString()) {
                                var new_date = item.callDate.toISOString().substring(0, 10);
                                // console.log('new_date ::', new_date);
                                moment.locale('fa');
                                callDate = moment.from(new_date, 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');
                                // console.log('callDate:::::', callDate);

                                today.push({
                                    'callDate': callDate,
                                    'startTime': item.startTime,
                                    'endTime': item.endTime,
                                    'status': item.status,
                                    '_id': item._id,
                                    'userId': item.userId,
                                    'mentorId': item.mentorId,
                                    'mentoravailabletimeId': item.mentoravailabletimeId,
                                    'id': item.id,
                                });

                            } else if (item.callDate.toISOString() == yesterday.toString()) {
                                var new_date = item.callDate.toISOString().substring(0, 10);
                                // console.log('new_date ::', new_date);
                                moment.locale('fa');
                                callDate = moment.from(new_date, 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');
                                // console.log('callDate:::::', callDate);

                                yesterday.push({
                                    'callDate': callDate,
                                    'startTime': item.startTime,
                                    'endTime': item.endTime,
                                    'status': item.status,
                                    '_id': item._id,
                                    'userId': item.userId,
                                    'mentorId': item.mentorId,
                                    'mentoravailabletimeId': item.mentoravailabletimeId,
                                    'id': item.id,
                                });
                            } else {
                                var new_date = item.callDate.toISOString().substring(0, 10);
                                // console.log('new_date ::', new_date);
                                moment.locale('fa');
                                callDate = moment.from(new_date, 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');
                                // console.log('callDate:::::', callDate);

                                older.push({
                                    'callDate': callDate,
                                    'startTime': item.startTime,
                                    'endTime': item.endTime,
                                    'status': item.status,
                                    '_id': item._id,
                                    'userId': item.userId,
                                    'mentorId': item.mentorId,
                                    'mentoravailabletimeId': item.mentoravailabletimeId,
                                    'id': item.id,
                                });
                            }
                        });


                        // items.push({
                        //     'today': today,
                        //     'yesterday': yesterday,
                        //     'older': older,
                        // });

                        items.push({
                            'today': today,
                        });
                        items.push({
                            'yesterday': yesterday,
                        });
                        items.push({
                            'older': older,
                        });

                        req.data.items = items;
                        response.ok(req, res, next);
                    } else {
                        response.error(req, res, next, 'آیتم یافت نشد');
                    }
                });
        } else {
            response.error(req, res, next, 'دسترسی ندارید');
        }

    },
    GetTodayCallMentor: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        // process.env.TZ = 'Asia/Tehran';
        var mentorId = req.data.personInfo._id
        var strClass = req.data.personInfo.class
        if (strClass == 'mentor') {

            var current_date = moment().format('YYYY-MM-DD');
            current_date = current_date + 'T00:00:00.000Z';
            console.log('current_date :::::::::::::::', current_date);

            Model.find({
                'mentorId': mentorId,
                'callDate': current_date,
            })
                .limit(offset)
                .skip(first)
                .exec((err, docs) => {
                    if (docs) {
                        var items = [];
                        docs.forEach(item => {
                            var new_date = item.callDate.toISOString().substring(0, 10);
                            // console.log('new_date ::', new_date);
                            moment.locale('fa');
                            var callDate = moment.from(new_date, 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');
                            // console.log('callDate:::::', callDate);
                            items.push({
                                'callDate': callDate,
                                'startTime': item.startTime,
                                'endTime': item.endTime,
                                'status': item.status,
                                '_id': item._id,
                                'userId': item.userId,
                                'mentorId': item.mentorId,
                                'mentoravailabletimeId': item.mentoravailabletimeId,
                                'id': item.id,
                            });
                        });


                        req.data.items = items;
                        response.ok(req, res, next);
                    } else {
                        response.error(req, res, next, 'آیتم یافت نشد');
                    }
                });
        } else {
            response.error(req, res, next, 'دسترسی ندارید');
        }
    },
    GetHistoryCallMentor: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        // process.env.TZ = 'Asia/Tehran';

        var mentorId = req.data.personInfo._id
        var strClass = req.data.personInfo.class
        if (strClass == 'mentor') {

            var current_date = moment().format('YYYY-MM-DD');
            var yesterday = moment().subtract(1, "days").format('YYYY-MM-DD');
            current_date = current_date + 'T00:00:00.000Z';
            yesterday = yesterday + 'T00:00:00.000Z';
            // console.log('current_date :::::::::::::::', current_date);
            console.log('current_date :::::::::::::::', current_date);
            console.log('yesterday :::::::::::::::', yesterday);

            Model.find({
                'mentorId': mentorId,
                'callDate': { $lte: current_date },
            })
                .limit(offset)
                .skip(first)
                .exec((err, docs) => {
                    if (docs) {
                        var items = [];
                        var today = [];
                        var yesterday = [];
                        var older = [];
                        docs.forEach(item => {
                            var callDate = '';
                            if (item.callDate.toISOString() == current_date.toString()) {
                                var new_date = item.callDate.toISOString().substring(0, 10);
                                // console.log('new_date ::', new_date);
                                moment.locale('fa');
                                callDate = moment.from(new_date, 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');
                                // console.log('callDate:::::', callDate);

                                today.push({
                                    'callDate': callDate,
                                    'startTime': item.startTime,
                                    'endTime': item.endTime,
                                    'status': item.status,
                                    '_id': item._id,
                                    'userId': item.userId,
                                    'mentorId': item.mentorId,
                                    'mentoravailabletimeId': item.mentoravailabletimeId,
                                    'id': item.id,
                                });

                            } else if (item.callDate.toISOString() == yesterday.toString()) {
                                var new_date = item.callDate.toISOString().substring(0, 10);
                                // console.log('new_date ::', new_date);
                                moment.locale('fa');
                                callDate = moment.from(new_date, 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');
                                // console.log('callDate:::::', callDate);

                                yesterday.push({
                                    'callDate': callDate,
                                    'startTime': item.startTime,
                                    'endTime': item.endTime,
                                    'status': item.status,
                                    '_id': item._id,
                                    'userId': item.userId,
                                    'mentorId': item.mentorId,
                                    'mentoravailabletimeId': item.mentoravailabletimeId,
                                    'id': item.id,
                                });
                            } else {
                                var new_date = item.callDate.toISOString().substring(0, 10);
                                // console.log('new_date ::', new_date);
                                moment.locale('fa');
                                callDate = moment.from(new_date, 'en', 'YYYY-MM-DD').format('YYYY-MM-DD');
                                // console.log('callDate:::::', callDate);

                                older.push({
                                    'callDate': callDate,
                                    'startTime': item.startTime,
                                    'endTime': item.endTime,
                                    'status': item.status,
                                    '_id': item._id,
                                    'userId': item.userId,
                                    'mentorId': item.mentorId,
                                    'mentoravailabletimeId': item.mentoravailabletimeId,
                                    'id': item.id,
                                });
                            }
                        });


                        // items.push({
                        //     'today': today,
                        //     'yesterday': yesterday,
                        //     'older': older,
                        // });

                        items.push({
                            'today': today,
                        });
                        items.push({
                            'yesterday': yesterday,
                        });
                        items.push({
                            'older': older,
                        });


                        req.data.items = items;
                        response.ok(req, res, next);
                    } else {
                        response.error(req, res, next, 'آیتم یافت نشد');
                    }
                });
        } else {
            response.error(req, res, next, 'دسترسی ندارید');
        }
    },

    GetCheckRoom: (req, res, next) => {
        process.env.TZ = 'Asia/Tehran';
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var currentDateTime = moment().format('YYYY-MM-DD HH:mm');
        var current_date = moment().format('YYYY-MM-DD');
        current_date = current_date + 'T00:00:00.000Z';
        // console.log('current_date :::::::::::::::', current_date);
        console.log('current_date :::::::::::::::', current_date);

        Model.find({
            'userId': userId,
            'callDate': current_date,
        }).exec((err, docs) => {
            if (docs) {
                var is_valid_room = false;
                docs.forEach(item => {
                    var new_startTime = moment.from(item.startTime, 'fa', 'HH:mm').toISOString();
                    var new_endTime = moment.from(item.endTime, 'fa', 'HH:mm').toISOString();

                    var dateStart = new Date(new_startTime);
                    var dateEnd = new Date(new_endTime);
                    var dateTimeCurrent = new Date(currentDateTime);
                    if (dateStart.getTime() >= dateTimeCurrent.getTime() && dateEnd.getTime() <= dateTimeCurrent.getTime()) {
                        is_valid_room = true;
                    }

                });

                req.data.is_valid_room = is_valid_room;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'آیتم یافت نشد');
            }
        });

    },
    PAYMENT_CALL: (req, res, next) => {
        var date = req.body.date;
        var userId = req.body.userId;
        var mentoravailabletimeId = req.body.mentoravailabletimeId;
        var mentorId = req.body.mentorId;

        MentorAvailableTime.findById(mentoravailabletimeId).exec((err, doc) => {
            var startTime = req.body.startTime;
            var endTime = req.body.endTime;

            // if(doc.)
            var callDate = moment.from(date, 'fa', 'YYYY/MM/DD').toISOString();
            var query = {
                'userId': userId,
                'callDate': callDate,
                'startTime': startTime,
                'endTime': endTime,
                'mentorId': mentorId,
                'mentoravailabletimeId': mentoravailabletimeId,
                'status': status,
            };

            new Model(query).save((err, doc) => {
                if (doc) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'مشکل در ساخت آیتم');
                }
            });
        });


    }
};
