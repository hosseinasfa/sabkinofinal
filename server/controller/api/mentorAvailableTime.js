const Model = require("../../model/mentorAvailableTime");
const response = require("../../response");
var config = require('../../config');
var moment = require('jalali-moment');
var bodyParser = require('body-parser');
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
        Model.find({}).sort('id').exec(function (err, docs) {
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
    GET_AVAILABLE_TIME: (req, res, next) => {
        var mentorId = req.params.mentorId;
        var date = req.params.date;
        console.log('mentorId :', mentorId);
        console.log('date :', date);

        moment.locale('en');
        var current_date = moment().locale('fa').format('YYYY-MM-DD');
        var new_date_user = moment.from(date, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
        console.log('new_date_user :', new_date_user);

        new_date_user = new_date_user + 'T00:00:00.000Z';

        Model.find({
            'mentorId': mentorId,
            'date': new_date_user,
        }).exec((err, docs) => {
            if (docs) {
                req.data.current_date = current_date;
                var result = [];

                var index = 0;
                // moment.locale('en');
                docs.forEach(item => {
                    var new_date = item.date.toISOString().substring(0, 10);
                    // var new_startTime = moment.from(item.startTime, 'fa').format('HH:mm');
                    var new_startTime = item.startTime;
                    var new_endTime = item.endTime;
                    console.log('new_date ::::', new_date);
                    console.log('new_startTime ::::', new_startTime);
                    console.log('new_endTime ::::', new_endTime);

                    // moment.locale('fa');
                    // new_date = moment.from(new_date, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
                    new_date = moment(new_date, 'YYYY-MM-DD').locale('fa').format('YYYY/MM/DD');
                    result.push({
                        'date': new_date,
                        'startTime': new_startTime,
                        'endTime': new_endTime,
                        'isActive': docs[index].isActive,
                        'isDelete': docs[index].isDelete,
                        'mentorId': docs[index].mentorId,
                        'id': docs[index].id.toString()
                    });
                    index++;
                });
                req.data.items = result;
                response.ok(req, res, next);
            } else {
                req.data.current_date = current_date;
                response.error(req, res, next);
            }
        })
    },
    POST_AVAILABLE_TIME: (req, res, next) => {
        var mentorId = req.body.mentorId;
        var date = req.body.date;
        var startTime = req.body.startTime;
        var endTime = req.body.endTime;
        process.env.TZ = 'Asia/Tehran';
        var validStartTime = /^(2[0-3]|[0-1]?[\d]):[0-5][\d]$/.test(startTime);
        var validEndTime = /^(2[0-3]|[0-1]?[\d]):[0-5][\d]$/.test(endTime);

        if (validStartTime == true && validEndTime == true) {
            // console.log('date ::::', date);
            // console.log('startTime ::::', startTime);
            // console.log('endTime ::::', endTime);
            moment.locale('en');
            // console.log('test date :::::',moment.from(date, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD'));
            var new_date = moment.from(date, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
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
                if (minuteDiff >= 20) {
                    var is_valid_time = true;
                    Model.find({
                        'date': new_date,
                        'mentorId': mentorId
                    }).exec((errAvailableTime, docAvailableTimes) => {
                        if (errAvailableTime) {
                            response.error(req, res, next, 'مشکل در ساخت آیتم');
                        }
                        docAvailableTimes.forEach(item => {
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

                            var query = {
                                mentorId: mentorId,
                                date: new_date,
                                startTime: startTime,
                                endTime: endTime
                            };

                            Model.find(query).exec((errTime, docTime) => {
                                if (errTime) {
                                    response.error(req, res, next, 'مشکل در ساخت آیتم');
                                } else {
                                    if (docTime.length == 0) {
                                        // console.log(req.body);
                                        new Model(query).save((err, doc) => {
                                            if (doc) {
                                                req.data.item = doc;
                                                response.ok(req, res, next);
                                            } else {
                                                response.error(req, res, next, 'مشکل در ساخت آیتم');
                                            }
                                        });
                                    } else {
                                        response.error(req, res, next, 'قبلا ثبت شده');
                                    }
                                }
                            });
                        } else {
                            response.error(req, res, next, 'زمان انتخاب شده با زمان های ثبت شده تداخل دارد');
                        }
                    });

                } else {
                    response.error(req, res, next, 'حداقل زمان باید ۲۰ دقیقه باشد');
                }
            } else {
                response.error(req, res, next, 'زمان وارد شده معتبر نیست');
            }
        } else {
            response.error(req, res, next, 'زمان وارد شده معتبر نیست');
        }
    },

    DELETE_AVAILABLE_TIME: (req, res, next) => {
        var itemId = req.query.itemId;
        console.log('itemId :::::::', itemId);

        Model.findById(itemId).exec((errTime, docTime) => {
            if (errTime) {
                response.error(req, res, next);
            } else {
                if (docTime) {
                    var query = {
                        '_id': itemId,
                    };

                    Model.findOneAndDelete(query).exec((err, doc) => {
                        if (err) {
                            response.error(req, res, next);
                        } else {
                            response.ok(req, res, next);
                        }
                    });
                } else {
                    response.error(req, res, next);
                }
            }
        });

    },
    GET_DAY_LIST_OF_MONTH: (req, res, next) => {
        var month = req.body.month;
        var year = req.body.year;
        var mentorId = req.body.mentorId;

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
            req.data.currentDay = moment().local('fa').format('DD');;

            moment.locale('en');
            var currentDate = moment().format('YYYY/MM/DD');
            currentDate = currentDate + 'T00:00:00.000Z';
            console.log('currentDate :', currentDate);
            var currentDateObj = new Date(currentDate);


            Model.find({
                'mentorId': mentorId,
                'isActive': true,
                'isDelete': false
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

                    for (var i = 0; i < docTimes.length; i++) {
                        var availableDate = docTimes[i].date;
                        var availableDateObj = new Date(availableDate);

                        color = null;
                        // var aa = availableDateObj.getTime() - tempDateObj.getTime();
                        // console.log('aa ::::::::::', availableDate.toISOString() + " ::::  " + aa);
                        if (availableDateObj.getTime() == tempDateObj.getTime()) {
                            color = 'WHITE';
                            break;
                        } else if (availableDateObj.getTime() > tempDateObj.getTime()) {
                            color = 'YELLOW';
                            break;
                        } else if (availableDateObj.getTime() < tempDateObj.getTime()) {
                            color = 'GREEN';
                            break;
                        }
                    }

                    if (color != null) {
                        dayOfMonth[index].color = color;
                    } else {
                        if (tempDateObj.getTime() < currentDateObj.getTime()) {
                            color = 'GRAY';
                            dayOfMonth[index].color = color;
                        } else if (tempDateObj.getTime() > currentDateObj.getTime()) {
                            color = 'RED';
                            dayOfMonth[index].color = color;
                        }
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
            req.data.currentDay = moment().local('fa').format('DD');

            moment.locale('en');
            var currentDate = moment().format('YYYY/MM/DD');
            var currentDateObj = new Date(currentDate);


            Model.find({
                'mentorId': mentorId,
                'isActive': true,
                'isDelete': false
            }).exec((errTime, docTimes) => {
                // var dateAvailableTimes = docTime.date;
                var index = 0;
                dayOfMonth.forEach(item => {
                    var date = item.date;
                    docTimes.forEach(itemTime => {
                        var availableDate = itemTime.date;
                        var availableDateObj = new Date(availableDate);

                        // console.log('currentDateObj.getUTCMilliseconds() :',currentDateObj.getUTCMilliseconds());
                        if (availableDateObj.getTime() > currentDateObj.getTime()) {
                            dayOfMonth[index].color = 'RED';
                        } else {
                            dayOfMonth[index].color = 'YELLOW';
                        }
                    });
                    index++;
                });


                req.data.items = dayOfMonth;
                response.ok(req, res, next);
            });

        }


    },
};