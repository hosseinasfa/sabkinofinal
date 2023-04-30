var http = require("http");
const axios = require('axios');
const Model = require("../../model/formula");
const SetProgramPayment = require("../../model/setProgramPayment");
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
    GET_RULES: (req, res, next) => {
        var itemId = req.params.itemId;
        SetProgramPayment.findById(itemId).exec((err, doc) => {
            let data = doc;
            let duration = data.mentorPackageId.duration;
            if (duration == 1) {
                duration = 'یکماهه';
            } else if (duration == 2) {
                duration = 'دو ماهه';
            } else if (duration == 3) {
                duration = 'سه ماهه';
            } else if (duration == 3) {
                duration = 'یکساله';
            }

            let setProgram = data.mentorPackageId.setProgram;
            if (setProgram == 1) {
                setProgram = 'هفتگی';
            } else if (setProgram == 2) {
                setProgram = 'دوهفتگی';
            } else if (setProgram == 3) {
                setProgram = 'ماهانه';
            }

            let getReport = data.mentorPackageId.getReport;
            if (getReport == 1) {
                getReport = 'هفتگی';
            } else if (getReport == 2) {
                getReport = 'دوهفتگی';
            } else if (getReport == 3) {
                getReport = 'ماهانه';
            }

            var createdAt = moment(data.createdAt, 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD') ;

            console.log('data :::::::::::', data);
            res.render('ruleAcademicAdvice', {
                title: 'Express', 'data': data
                , 'duration': duration,
                'setProgram':setProgram,
                'getReport':getReport,
                'createdAt':createdAt
            });
        });
    }
};