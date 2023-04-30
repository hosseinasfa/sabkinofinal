const Model = require("../../model/setProgramList");
const SetProgramPayment = require("../../model/setProgramPayment");
const SetProgramList = require("../../model/setProgramList");
const response = require("../../response");
var config = require('../../config');
var offset = parseInt(process.env.ROW_NUMBER);
var moment = require('jalali-moment');

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
    POST_SET_PROGRAM_ITEM: (req, res, next) => {
        var userId = req.body.userId;
        var mentorId = req.body.mentorId;
        var programDate = req.body.programDate;
        var title = req.body.title;
        var color = req.body.color;
        var description = req.body.description;
        var startTime = req.body.startTime;
        var endTime = req.body.endTime;
        var programType = req.body.programType;
        var duration = req.body.duration;
        var strClass = req.data.personInfo.class;

        if (strClass == 'support') {
            mentorId = req.data.personInfo.supportMentorId._id;
        }

        console.log('req.body ::::', req.body);
        process.env.TZ = 'Asia/Tehran';
        moment.locale('en');

        if (parseInt(duration) == 0) {
            var new_date = moment.from(programDate, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
            new_date = new_date + 'T00:00:00.000Z';
            console.log('new_date ::::::::', new_date);

            var query = {
                status: 'active'
            };

            SetProgramPayment.findByIdAndUpdate({
                userId: userId,
                mentorId: mentorId,
            }, query, {
                new: true,
                runValidators: true
            }).exec((errUpdate, docUpdate) => {
		 console.log('errUpdate ::::::::', errUpdate);
                if (docUpdate) {

                    Model.find({
                        'userId': userId,
                        'mentorId': mentorId,
                        'programDate': new_date,
                        'duration': parseInt(duration),
                        'isActive': true,
                        'isDelete': false
                    })
                        .exec(function (err, docs) {
                            console.log('docs :::::', docs.length);
                            var validStartTime = /^(2[0-3]|[0-1]?[\d]):[0-5][\d]$/.test(startTime);
                            var validEndTime = /^(2[0-3]|[0-1]?[\d]):[0-5][\d]$/.test(endTime);
                            if (validStartTime == true && validEndTime == true) {


                                var new_startTime = moment.from(startTime, 'fa', 'HH:mm').toISOString();
                                var new_endTime = moment.from(endTime, 'fa', 'HH:mm').toISOString();

                                // var current_time = moment().locale('fa').format('HH:mm');
                                // var date_current = new Date(new_date + ' ' + current_time);

                                var date1 = new Date(new_startTime);
                                var date2 = new Date(new_endTime);

                                if (date1.getTime() < date2.getTime()) {

                                    var minuteDiff = (((date2.getTime() - date1.getTime()) / 1000) / 60);

                                    // console.log('new_startTime ::::',date2.getMinutes());
                                    // console.log('new_endTime ::::',date1.getMinutes());
                                    console.log('minuteDiff ::::', minuteDiff);
                                    if (minuteDiff >= 30) {
                                        var is_valid_time = true;
                                        docs.forEach(item => {
                                            var startTime = moment.from(item.startTime, 'fa', 'HH:mm').toISOString();
                                            var endTime = moment.from(item.endTime, 'fa', 'HH:mm').toISOString();
                                            var dateStart = new Date(startTime);
                                            var dateEnd = new Date(endTime);

                                            if ((date1.getTime() > dateStart.getTime() && date1.getTime() < dateEnd.getTime())) {
                                                is_valid_time = false
                                            } else if ((date2.getTime() > dateStart.getTime() && date2.getTime() < dateEnd.getTime())) {
                                                is_valid_time = false;
                                            } else if (date1.getTime() == dateStart.getTime()) {
                                                is_valid_time = false;
                                            } else if (date1.getTime() == dateEnd.getTime()) {
                                                is_valid_time = false;
                                            } else if (date2.getTime() == dateStart.getTime()) {
                                                is_valid_time = false;
                                            } else if (date2.getTime() == dateEnd.getTime()) {
                                                is_valid_time = false;
                                            }
                                        });

                                        if (is_valid_time == true) {
                                            console.log('new_date ::::', new_date);
                                            console.log('new_startTime ::::', new_startTime);
                                            console.log('new_endTime ::::', new_endTime);

                                            duration = parseFloat(minuteDiff / 60).toFixed(0);
                                            var query = {
                                                'userId': userId,
                                                'mentorId': mentorId,
                                                'programDate': new_date,
                                                'title': title,
                                                'color': color,
                                                'description': description,
                                                'startTime': startTime,
                                                'endTime': endTime,
                                                'programType': programType,
                                                'duration': duration,
                                            };

                                            new Model(query).save((err, doc) => {
                                                if (doc) {
                                                    req.data.item = doc;
                                                    response.ok(req, res, next);
                                                } else {
                                                    response.error(req, res, next);
                                                }
                                            });
                                        } else {
                                            response.error(req, res, next, 'زمان های ارسالی معتبر نیست');
                                        }
                                    } else {
                                        response.error(req, res, next, 'زمان های ارسالی معتبر نیست');
                                    }
                                } else {
                                    response.error(req, res, next, 'زمان های ارسالی معتبر نیست');
                                }

                            } else {
                                response.error(req, res, next, 'زمان های ارسالی معتبر نیست');
                            }
                        });


                } else {
                    response.error(req, res, next,'اطلاعات پکیج یافت نشد لطفا یک بسته خریداری کنید');
                }
            })


        } else {
            var query = {
                status: 'active'
            };

            SetProgramPayment.findByIdAndUpdate({
                userId: userId,
                mentorId: mentorId,
            }, query, {
                new: true,
                runValidators: true
            }).exec((errUpdate, docUpdate) => {
                if (docUpdate) {
                    var new_date = moment.from(programDate, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
                    new_date = new_date + 'T00:00:00.000Z';
                    console.log('new_date ::::::::', new_date);

                    Model.find({
                        'userId': userId,
                        'mentorId': mentorId,
                        'programDate': new_date,
                        'startTime': null,
                        'endTime': null,
                        'isActive': true,
                        'isDelete': false
                    })
                        .exec(function (err, docs) {
                            var totalDuration = 0;

                            if (docs) {
                                if (docs.length != 0) {
                                    docs.forEach(item => {
                                        totalDuration += item.duration;
                                    });
                                }
                            }

                            if (parseInt(totalDuration) < 24) {
                                var query = {
                                    'userId': userId,
                                    'mentorId': mentorId,
                                    'programDate': new_date,
                                    'title': title,
                                    'color': color,
                                    'description': description,
                                    'startTime': startTime,
                                    'endTime': endTime,
                                    'programType': programType,
                                    'duration': duration,
                                };

                                new Model(query).save((err, doc) => {
                                    if (doc) {
                                        req.data.item = doc;
                                        response.ok(req, res, next);
                                    } else {
                                        response.error(req, res, next,'اطلاعات یافت نشد');
                                    }
                                });
                            } else {
                                response.error(req, res, next, 'تعداد زمان های وارد شده خارج از محدوده یک روز می باشد');
                            }
                        });
                }
            });


        }
    },
    POST_SET_REPORT_ITEM: (req, res, next) => {
        var itemId = req.body.itemId;
        var description = req.body.description;


        Model.findById(itemId).exec(function (err, doc) {
            if (err) {
                response.error(req, res, next, 'مشکل در ثبت آیتم');
            } else {
                if (doc != null) {
                    Model.findByIdAndUpdate(itemId, {
                        description: description
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
                } else {
                    response.error(req, res, next, 'مشکل در ثبت آیتم');
                }
            }
        })

    },
    POST_SET_SEEN_USER_ITEM: (req, res, next) => {
        var itemId = req.body.itemId;
        Model.findById(itemId).exec(function (err, doc) {
            if (err) {
                response.error(req, res, next, 'مشکل در ثبت آیتم');
            } else {
                if (doc != null) {
                    Model.findByIdAndUpdate(itemId, {
                        is_seen: true
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
                } else {
                    response.error(req, res, next, 'مشکل در ثبت آیتم');
                }
            }
        })
    },
    GET_SEEN_USER_ITEM: (req, res, next) => {
        var itemId = req.query.itemId;
        Model.findById(itemId).exec(function (err, doc) {
            if (err) {
                response.error(req, res, next, 'مشکل در ثبت آیتم');
            } else {
                if (doc != null) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'مشکل در ثبت آیتم');
                }
            }
        })
    },
    POST_SET_SEEN_MENTOR_ITEM: (req, res, next) => {
        var itemId = req.body.itemId;
        Model.findById(itemId).exec(function (err, doc) {
            if (err) {
                response.error(req, res, next, 'مشکل در ثبت آیتم');
            } else {
                if (doc != null) {
                    Model.findByIdAndUpdate(itemId, {
                        is_seen_mentor: true
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
                } else {
                    response.error(req, res, next, 'مشکل در ثبت آیتم');
                }
            }
        })
    },
    GET_SEEN_MENTOR_ITEM: (req, res, next) => {
        var itemId = req.query.itemId;
        Model.findById(itemId).exec(function (err, doc) {
            if (err) {
                response.error(req, res, next, 'مشکل در ثبت آیتم');
            } else {
                if (doc != null) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'مشکل در ثبت آیتم');
                }
            }
        })
    },
    GET_DAY_LIST_OF_MONTH: (req, res, next) => {
        var month = req.body.month;
        var year = req.body.year;
        var mentorId = req.body.mentorId;
        var userId = req.body.userId;
        var strClass = req.data.personInfo.class;

        if (strClass == 'support') {
            mentorId = req.data.personInfo.supportMentorId._id;
        }
        // var userId = req.data.personInfo._id.toString();

        console.log('req.body :::: ', req.body);
        moment.locale('fa');
        var currentYear = moment().local('fa').format('YYYY');
        var currentMonth = moment().local('fa').format('MM');
        var currentDay = moment().local('fa').format('DD');
        var leapYear = moment().isLeapYear();

        if (typeof month !== 'undefined') {
            currentMonth = month;
        }

        if (typeof year !== 'undefined') {
            currentYear = year;
        }

        var color = 'WHITE';
        var dayOfMonth = [];
        console.log('leapYear :::::::::', leapYear);
        if (leapYear == false) {
            if (parseInt(currentMonth) <= 6) {
                for (var i = 1; i <= 31; i++) {
                    var day = i;
                    if (i < 10) {
                        day = '0' + day;
                    }
                    var date = currentYear + '/' + currentMonth + '/' + day;
                    var dayName = moment.from(date, 'fa', 'YYYY/MM/DD').format('dddd');
                    // console.log('test :::::::::::',test);

                    dayOfMonth.push({
                        date: date,
                        color: color,
                        colorHex: '#FFFFFF',
                        dayName: dayName,
                    });

                }

            } else if (parseInt(currentMonth) > 6) {
                for (var i = 1; i <= 30; i++) {
                    var day = i;
                    if (i < 10) {
                        day = '0' + day;
                    }
                    var date = currentYear + '/' + currentMonth + '/' + day;
                    var dayName = moment.from(date, 'fa', 'YYYY/MM/DD').format('dddd');
                    // console.log('test :::::::::::',test);

                    dayOfMonth.push({
                        date: date,
                        color: color,
                        colorHex: '#FFFFFF',
                        dayName: dayName,
                    });

                }
            }

            // // console.log('test date :::::',moment.from(date, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD'));
            // var new_date = moment.from(date, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
            // var new_startTime = moment.from(startTime, 'fa', 'HH:mm').toISOString();
            // var new_endTime = moment.from(endTime, 'fa', 'HH:mm').toISOString();
            //
            // console.log('new_date ::::', new_date);
            // console.log('new_startTime ::::', new_startTime);
            // console.log('new_endTime ::::', new_endTime);
            req.data.currentYear = moment().local('fa').format('YYYY');
            req.data.currentMonth = moment().local('fa').format('MM');

            moment.locale('en');
            var currentDate = moment().format('YYYY-MM-DD');
            currentDate = currentDate + 'T00:00:00.000Z';
            // console.log('currentDate :', currentDate);
            var currentDateObj = new Date(currentDate);

            // console.log('currentDate ::::', currentDate);
            // console.log('currentDateObj.getTime() ::::', currentDateObj);
            var colorItems = [];
            colorItems.push({
                title: 'YELLOW',
                color: '#ffeab7',
            });
            colorItems.push({
                title: 'GREEN',
                color: '#baeedd',
            });
            colorItems.push({
                title: 'BLUE',
                color: '#e6660b',
            });
            colorItems.push({
                title: 'GRAY',
                color: '#e4e4e4',
            });
            colorItems.push({
                title: 'ORANGE',
                color: '#fbb4c9',
            });


            req.data.colorItems = colorItems;


            console.log('mentorId ::::::', mentorId);
            console.log('userId ::::::', userId);

            Model.find({
                'mentorId': mentorId,
                'userId': userId,
            }).exec((errTime, docTimes) => {
                // var dateAvailableTimes = docTime.date;
                var index = 0;
                var BreakException = {};

                dayOfMonth.forEach(item => {
                    var date = item.date;

                    var tempDate = moment.from(date, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD');
                    tempDate = tempDate + 'T00:00:00.000Z';
                    // console.log('tempDate :::', tempDate);
                    var tempDateObj = new Date(tempDate);

                    var is_yellow = false;
                    var is_green = false;
                    var is_blue = false;
                    var is_gray = false;
                    var is_orange = false;
                    var is_set_color = false;
                    var color = null;
                    var colorHex = null;


                    console.log('yellow ::::::', docTimes.length);


                    // //blue
                    // for (var i = 0; i < docTimes.length; i++) {
                    //     var programDate = docTimes[i].programDate;
                    //     var is_seen = docTimes[i].is_seen;
                    //     var reportText = docTimes[i].reportText;
                    //     var programDateObj = new Date(programDate);
                    //     if ((programDateObj.getTime() == tempDateObj.getTime()) && (reportText == null || reportText == "") && is_set_color == false) {
                    //         is_blue = true;
                    //         is_set_color = true;
                    //     }
                    // }



                    //yellow
                    for (var i = 0; i < docTimes.length; i++) {
                        var programDate = docTimes[i].programDate;
                        var is_seen = docTimes[i].is_seen;
                        // var is_seen = docTimes[i].is_seen;
                        var programDateObj = new Date(programDate);


                        // if (item.date == '1401/07/18' || item.date == '1401/06/19' || item.date == '1401/06/20') {
                        // console.log('programDateObj.getTime() ::::', programDateObj.getTime());
                        // console.log('tempDateObj.getTime() ::::', tempDateObj.getTime());
                        // console.log('is_seen ::::', is_seen);
                        // console.log('------------------------------------------------------------');
                        // }

                        if ((programDateObj.getTime() == tempDateObj.getTime()) && is_seen == false && is_set_color == false) {
                            is_yellow = true;
                            is_set_color = true;
                        }

                    }

                    //green
                    for (var i = 0; i < docTimes.length; i++) {
                        var programDate = docTimes[i].programDate;
                        var is_seen = docTimes[i].is_seen;
                        // var is_seen = docTimes[i].is_seen;
                        var programDateObj = new Date(programDate);
                        if ((programDateObj.getTime() == tempDateObj.getTime()) && is_seen == true && is_set_color == false) {
                            is_green = true;
                            is_set_color = true;
                        }
                    }


                    // console.log('currentDateObj.getTime() ::::', currentDateObj.getTime());
                    // console.log('tempDateObj.getTime() ::::', tempDateObj.getTime());
                    // console.log('is_set_color ::::', is_set_color);
                    // console.log('-----------------------------------------------------------------------------------------');

                    //gray
                    if (tempDateObj.getTime() > currentDateObj.getTime() && is_set_color == false) {
                        is_gray = true;
                        is_set_color = true;
                    } else if (tempDateObj.getTime() < currentDateObj.getTime() && is_set_color == false) {
                        is_orange = true;
                        is_set_color = true;
                    }

                    if (is_yellow == true) {
                        color = 'YELLOW';
                        colorHex = '#ffeab7';
                    } else if (is_green == true) {
                        color = 'GREEN';
                        colorHex = '#baeedd';
                    } else if (is_blue == true) {
                        color = 'BLUE';
                        colorHex = '#e6660b';
                    } else if (is_gray == true) {
                        color = 'GRAY';
                        colorHex = '#e4e4e4';
                    } else if (is_orange == true) {
                        color = 'ORANGE';
                        colorHex = '#fbb4c9';
                    }

                    if (color != null) {
                        dayOfMonth[index].color = color;
                        dayOfMonth[index].colorHex = colorHex;
                    }
                    index++;
                });

                req.data.items = dayOfMonth;
                response.ok(req, res, next);
            });
        } else {

            if (month <= 6) {
                for (var i = 1; i <= 31; i++) {
                    var day = i;
                    if (i < 10) {
                        day = '0' + day;
                    }
                    var date = currentYear + '/' + currentMonth + '/' + day;
                    var dayName = moment.from(date, 'fa', 'YYYY/MM/DD').format('dddd');
                    // console.log('test :::::::::::',test);

                    dayOfMonth.push({
                        date: date,
                        color: color,
                        dayName: dayName,
                    });

                }

            } else if (month > 6) {
                for (var i = 1; i <= 30; i++) {
                    if (month == 12) {
                        if (i <= 29) {
                            var day = i;
                            if (i < 10) {
                                day = '0' + day;
                            }
                            var date = currentYear + '/' + currentMonth + '/' + day;
                            var dayName = moment.from(date, 'fa', 'YYYY/MM/DD').format('dddd');
                            // console.log('test :::::::::::',test);

                            dayOfMonth.push({
                                date: date,
                                color: color,
                                dayName: dayName,
                            });
                        }
                    } else {
                        var day = i;
                        if (i < 10) {
                            day = '0' + day;
                        }
                        var date = currentYear + '/' + currentMonth + '/' + day;
                        var dayName = moment.from(date, 'fa', 'YYYY/MM/DD').format('dddd');
                        // console.log('test :::::::::::',test);

                        dayOfMonth.push({
                            date: date,
                            color: color,
                            dayName: dayName,
                        });
                    }

                }
            }

            req.data.currentYear = moment().local('fa').format('YYYY');
            req.data.currentMonth = moment().local('fa').format('MM');

            var colorItems = [];
            colorItems.push({
                title: 'YELLOW',
                color: '#ffeab7',
            });
            colorItems.push({
                title: 'GREEN',
                color: '#baeedd',
            });
            colorItems.push({
                title: 'BLUE',
                color: '#e6660b',
            });
            colorItems.push({
                title: 'GRAY',
                color: '#e4e4e4',
            });
            colorItems.push({
                title: 'ORANGE',
                color: '#fbb4c9',
            });


            req.data.colorItems = colorItems;


            moment.locale('en');
            var currentDate = moment().format('YYYY-MM-DD');
            var currentDateObj = new Date(currentDate);

            Model.find({
                'mentorId': mentorId,
                'userId': userId,
            }).exec((errTime, docTimes) => {
                // var dateAvailableTimes = docTime.date;
                var index = 0;
                var BreakException = {};

                dayOfMonth.forEach(item => {
                    var date = item.date;

                    var tempDate = moment.from(date, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD');
                    tempDate = tempDate + 'T00:00:00.000Z';
                    console.log('tempDate :::', tempDate);
                    var tempDateObj = new Date(tempDate);

                    var is_yellow = false;
                    var is_green = false;
                    var is_blue = false;
                    var is_gray = false;
                    var is_orange = false;
                    var color = null;


                    //blue
                    for (var i = 0; i < docTimes.length; i++) {
                        var programDate = docTimes[i].programDate;
                        var is_seen = docTimes[i].is_seen;
                        var reportText = docTimes[i].reportText;
                        var programDateObj = new Date(programDate);
                        if ((programDateObj.getTime() == tempDateObj.getTime()) && (reportText == null || reportText == "") && is_set_color == false) {
                            is_blue = true;
                            is_set_color = true;
                        }
                    }

                    //yellow
                    for (var i = 0; i < docTimes.length; i++) {
                        var programDate = docTimes[i].programDate;
                        var is_seen = docTimes[i].is_seen;
                        var is_seen = docTimes[i].is_seen;
                        var programDateObj = new Date(programDate);


                        // if (item.date == '1401/07/18' || item.date == '1401/06/19' || item.date == '1401/06/20') {
                        console.log('programDateObj.getTime() ::::', programDateObj.getTime());
                        console.log('tempDateObj.getTime() ::::', tempDateObj.getTime());
                        console.log('is_seen ::::', is_seen);
                        console.log('------------------------------------------------------------');
                        // }

                        if ((programDateObj.getTime() == tempDateObj.getTime()) && is_seen == false && is_set_color == false) {
                            is_yellow = true;
                            is_set_color = true;
                        }

                    }

                    //green
                    for (var i = 0; i < docTimes.length; i++) {
                        var programDate = docTimes[i].programDate;
                        var is_seen = docTimes[i].is_seen;
                        // var is_seen = docTimes[i].is_seen;
                        var programDateObj = new Date(programDate);
                        if ((programDateObj.getTime() == tempDateObj.getTime()) && is_seen == true && is_set_color == false) {
                            is_green = true;
                            is_set_color = true;
                        }
                    }



                    //gray
                    if (tempDateObj.getTime() > currentDateObj.getTime() && is_set_color == false) {
                        is_gray = true;
                        is_set_color = true;
                    } else if (tempDateObj.getTime() < currentDateObj.getTime() && is_set_color == false) {
                        is_orange = true;
                        is_set_color = true;
                    }

                    if (is_yellow == true) {
                        color = 'YELLOW';
                        colorHex = '#ffeab7';
                    } else if (is_green == true) {
                        color = 'GREEN';
                        colorHex = '#baeedd';
                    } else if (is_blue == true) {
                        color = 'BLUE';
                        colorHex = '#e6660b';
                    } else if (is_gray == true) {
                        color = 'GRAY';
                        colorHex = '#e4e4e4';
                    } else if (is_orange == true) {
                        color = 'ORANGE';
                        colorHex = '#fbb4c9';
                    }

                    if (color != null) {
                        dayOfMonth[index].color = color;
                        dayOfMonth[index].colorHex = colorHex;
                    }
                    index++;
                });

                req.data.items = dayOfMonth;
                response.ok(req, res, next);
            });

        }


    },
    GET_DAYILY_PROGRAM: (req, res, next) => {
        var userId = req.query.userId;
        var mentorId = req.query.mentorId;
        var strClass = req.data.personInfo.class;
        var date = req.query.date;
        process.env.TZ = 'Asia/Tehran';

        if (strClass == 'support') {
            mentorId = req.data.personInfo.supportMentorId._id;
        }

        var tempDate = moment.from(date, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD');
        tempDate = tempDate + 'T00:00:00.000Z';
        console.log('tempDate :::', tempDate);

        Model.find({
            'userId': userId,
            'mentorId': mentorId,
            'programDate': tempDate,
        }).exec((errProgram, docPrograms) => {
            if (errProgram) {
                response.error(req, res, next);
            } else {
                if (docPrograms) {
                    if (docPrograms.length != 0) {
                        let len = docPrograms.length;
                        var items = [];
                        for (var i = 0; i < len; i++) {
                            var programDate = moment(docPrograms[i].programDate).locale('fa').format('YYYY-MM-DD');
                            // console.log('programDate ::::', programDate);
                            docPrograms[i].programDate = programDate;


                            items.push({
                                'programDate': programDate,
                                'description': docPrograms[i].description,
                                'startTime': docPrograms[i].startTime,
                                'endTime': docPrograms[i].endTime,
                                'programType': docPrograms[i].programType,
                                'duration': docPrograms[i].duration,
                                'reportText': docPrograms[i].reportText,
                                'is_seen': docPrograms[i].is_seen,
                                'is_seen_mentor': docPrograms[i].is_seen_mentor,
                                'userId': docPrograms[i].userId,
                                'mentorId': docPrograms[i].mentorId,
                                '_id': docPrograms[i]._id,
                                'title': docPrograms[i].title,
                                'color': docPrograms[i].color,
                                'createdAt': docPrograms[i].createdAt,
                                'updatedAt': docPrograms[i].updatedAt,
                            });
                        }

                        req.data.items = items;
                        response.ok(req, res, next);
                    } else {
                        response.error(req, res, next);
                    }
                } else {
                    response.error(req, res, next);
                }
            }
        });

    },
    GET_WEEKLY_PROGRAM: (req, res, next) => {
        var userId = req.query.userId;
        var mentorId = req.query.mentorId;
        var strClass = req.data.personInfo.class;
        var date = req.query.date;

        if (strClass == 'support') {
            mentorId = req.data.personInfo.supportMentorId._id;
        }

        var startDate = moment.from(date, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD');
        var endDate = moment.from(date, 'fa', 'YYYY/MM/DD').add(7, 'days').format('YYYY-MM-DD');
        startDate = startDate + 'T00:00:00.000Z';
        endDate = endDate + 'T00:00:00.000Z';
        console.log('startDate :::', startDate);
        console.log('endDate :::', endDate);

        Model.find({
            'userId': userId,
            'mentorId': mentorId,
            'programDate': {
                $gte: startDate,
                $lt: endDate
            }
        }).sort('programDate')
            .exec((errProgram, docPrograms) => {
                if (errProgram) {
                    response.error(req, res, next);
                } else {
                    if (docPrograms) {
                        if (docPrograms.length != 0) {
                            let len = docPrograms.length;
                            var items = [];
                            for (var i = 0; i < len; i++) {
                                var programDate = moment(docPrograms[i].programDate).locale('fa').format('YYYY-MM-DD');
                                // console.log('programDate ::::', programDate);
                                docPrograms[i].programDate = programDate;

                                items.push({
                                    'programDate': programDate,
                                    'description': docPrograms[i].description,
                                    'startTime': docPrograms[i].startTime,
                                    'endTime': docPrograms[i].endTime,
                                    'programType': docPrograms[i].programType,
                                    'duration': docPrograms[i].duration,
                                    'reportText': docPrograms[i].reportText,
                                    'is_seen': docPrograms[i].is_seen,
                                    'is_seen_mentor': docPrograms[i].is_seen_mentor,
                                    'userId': docPrograms[i].userId,
                                    'mentorId': docPrograms[i].mentorId,
                                    '_id': docPrograms[i]._id,
                                    'title': docPrograms[i].title,
                                    'color': docPrograms[i].color,
                                    'createdAt': docPrograms[i].createdAt,
                                    'updatedAt': docPrograms[i].updatedAt,
                                });
                            }
                            req.data.items = items;
                            response.ok(req, res, next);
                        } else {
                            response.error(req, res, next);
                        }
                    } else {
                        response.error(req, res, next);
                    }
                }
            });

    },
    POST_REPORT_ITEM: (req, res, next) => {
        var itemId = req.body.itemId;
        var reportText = req.body.reportText;
        console.log('reg.body ::', req.body);
        Model.findByIdAndUpdate(itemId, {
            reportText: reportText
        }, {
            new: true,
            runValidators: true
        }).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        });
    },
    GET_MENTOR_USER_ITEMS: (req, res, next) => {
        var mentorId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var searchText = req.query.searchText;

        if (strClass == 'support') {
            mentorId = req.data.personInfo.supportMentorId._id;
        }

        if (strClass == 'mentor' || strClass == 'support') {
            if (typeof searchText === 'undefined' || searchText == null) {
                SetProgramPayment.find({ "mentorId": mentorId }).exec(function (err, docs) {
                    if (err) {
                        response.error(req, res, next, 'مشکل در ثبت آیتم');
                    } else {
                        if (docs != null) {
                            var items = [];
                            docs.forEach(item => {
                                items.push({
                                    'id': item._id.toString(),
                                    'firstName': item.userId.firstName,
                                    'lastName': item.userId.lastName,
                                });
                            });
                            req.data.items = items;
                            response.ok(req, res, next);
                        } else {
                            response.error(req, res, next, 'مشکل در ثبت آیتم');
                        }
                    }
                });
            }
            else {
                SetProgramPayment.find({ "mentorId": mentorId, 'firstName': new RegExp(searchText, 'i') }).populate("userId").exec(function (err, docs) {
                    if (err) {
                        response.error(req, res, next, 'مشکل در ثبت آیتم');
                    } else {
                        if (docs != null) {
                            var items = [];
                            docs.forEach(item => {
                                items.push({
                                    'id': item._id.toString(),
                                    'firstName': item.userId.firstName,
                                    'lastName': item.userId.lastName,
                                });
                            });
                            req.data.items = items;
                            response.ok(req, res, next);
                        } else {
                            response.error(req, res, next, 'مشکل در ثبت آیتم');
                        }
                    }
                });
            }
        }
        else {
            response.error(req, res, next, 'دسترسی ندارید');
        }
    },
    GET_PROGRAM_LIST_TABLE: (req, res, next) => {
        var mentorId = req.query.mentorId;
        var userId = req.query.userId;

        let currentDate = moment();
        let weekStart = currentDate.clone().startOf('week');
        let weekEnd = currentDate.clone().endOf('week');

        console.log('weekStart :', weekStart.format('YYYY-MM-DD'));
        console.log('weekEnd :', weekEnd.format('YYYY-MM-DD'));

        // var startDate = moment.from(date, 'fa', 'YYYY/MM/DD').format('YYYY-MM-DD');
        // var endDate = moment.from(date, 'fa', 'YYYY/MM/DD').add(7, 'days').format('YYYY-MM-DD');
        // startDate = startDate + 'T00:00:00.000Z';
        // endDate = endDate + 'T00:00:00.000Z';
        // console.log('startDate :::', startDate);
        // console.log('endDate :::', endDate);

        SetProgramList.find({
            "mentorId": mentorId,
            'userId': userId,
            'programDate': {
                $gte: weekStart.toISOString(),
                $lte: weekEnd.toISOString()
            }
        })
            .populate("userId")
            .populate("mentorId")
            .exec(function (err, docs) {
                if (err) {
                    response.error(req, res, next, 'مشکل در ثبت آیتم');
                } else {
                    if (docs) {
                        if (docs.length != 0) {
                            // console.log('docs :::: ', docs);
                            var items = [];
                            docs.forEach(item => {
                                var programDate = moment(item.programDate).locale('fa').format('YYYY-MM-DD');


                                var is_exist = false;
                                var indexItem = 0;
                                if (items.length > 0) {
                                    items.forEach(item2 => {
                                        if (item2.programDate == programDate) {
                                            is_exist = true;
                                        }
                                        indexItem++;
                                    });
                                }

                                if (is_exist == false) {
                                    var colorItems = [];
                                    colorItems.push({
                                        description: item.description,
                                        startTime: item.startTime,
                                        endTime: item.endTime,
                                        reportText: item.reportText,
                                        title: item.title,
                                        color: item.color,
                                    });
                                    items.push({
                                        programDate: programDate,
                                        colorItems: colorItems
                                    });
                                }
                                else {
                                    console.log('indexItem :::: ', indexItem);
                                    if (typeof items[indexItem - 1] !== 'undefined') {

                                        console.log('items[indexItem].colorItems ::: ', items[indexItem - 1].colorItems);
                                        var colorItems = items[indexItem - 1].colorItems;
                                        colorItems.push({
                                            description: item.description,
                                            startTime: item.startTime,
                                            endTime: item.endTime,
                                            reportText: item.reportText,
                                            title: item.title,
                                            color: item.color,
                                        });
                                        items[indexItem - 1].colorItems = colorItems;
                                    }

                                }

                                console.log('items :::: ', items);
                            });
                            var mentorData = docs[0].mentorId;
                            var userData = docs[0].userId;
                            // response.ok(req, res, next);
                            res.render('programListTable', { data: items, mentorData: mentorData, userData: userData });
                        }
                        else {
                            res.render('programListError');
                            // response.error(req, res, next, 'اطلاعات یافت نشد');
                        }

                    } else {
                        res.render('programListError');
                        //response.error(req, res, next, 'مشکل در ثبت آیتم');
                    }
                }
            });



    }

};
