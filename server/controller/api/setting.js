const Model = require("../../model/setting");
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
    GET_DAY_LIST_OF_MONTH: (req, res, next) => {
        var month = req.query.month;
        var year = req.query.year;

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
            req.data.items = dayOfMonth;
            response.ok(req, res, next);
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
                            dayName: dayName,
                        });
                    }

                }
            }

            req.data.currentYear = moment().local('fa').format('YYYY');
            req.data.currentMonth = moment().local('fa').format('MM');
            req.data.items = dayOfMonth;
            response.ok(req, res, next);
        }


    },

};