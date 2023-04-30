const Model = require("../../model/onlineCallPackage");
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
        })
    },
    GET_PACKAGE_ITEM: (req, res, next) => {
        var mentorId = req.params.itemId;
        var first = req.params.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }
        process.env.TZ = 'Asia/Tehran';
        moment.locale('fa');
        var current_date = moment().format('YYYY-MM-DD');

        console.log('mentorId :::::::::::', mentorId);

        // var currentDate = moment().locale('fa').format('YYYY/MM/DD');

        console.log('current_date :::', current_date);
        Model.find({
            'mentorId': mentorId,
        })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    console.log('docs ::::::', docs);
                    req.data.items = docs;
                    req.data.currentDate = current_date;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next);
                }
            });
    },
    POST_PACKAGE_ITEM: (req, res, next) => {
        var mentorId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var durations = [20, 30, 45];

        if (strClass == 'support') {
            mentorId = req.data.personInfo.supportMentorId._id;
        }


        Model.find({
            'mentorId': mentorId,
            'isActive': true,
            'isDelete': false
        }).exec((err1, docs) => {
            if (err1) {
                response.error(req, res, next);
            }

            if (docs.length == 0) {
                durations.forEach(item => {
                    var query = {
                        duration: item,
                        price: 0,
                        mentorId: mentorId,
                        status: 'reserve',
                        isActive: false
                    };

                    new Model(query).save((err, doc) => {
                        if (err) {
                            response.error(req, res, next);
                        }
                    });
                });
                response.ok(req, res, next);
            }
            else {
                response.error(req, res, next, 'قبلا بسته های تماس ایجاد شده');
            }
        });


    }
};