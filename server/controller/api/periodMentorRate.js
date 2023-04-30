const Model = require("../../model/periodMentorRate");
const periodMentor = require("../../model/periodMentor");
const Mentor = require("../../model/person").Mentor;
const Teacher = require("../../model/person").Teacher;

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
    POST_PERIOD_MENTOR_RATE: (req, res, next) => {
        var userId = req.body.userId;
        var strClass = req.data.personInfo.class;
        var mentorId = req.body.mentorId;
        var periodMentorId = req.body.periodMentorId;
        var rate = req.body.rate;

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }
        Model.find({
            'userId': userId,
            'mentorId': mentorId,
            'periodMentorId': periodMentorId,
        }).exec(function (err22, docs22) {
            if (docs22) {
                if (docs22.length == 0) {
                    Model.find({}).sort('id').exec(function (err, docs) {
                        var compute_rate = 0;
                        var rate_len = 0;
                        docs.forEach(item => {
                            if (item.periodMentorId._id.toString() == periodMentorId) {
                                compute_rate += parseFloat(item.rate);
                                rate_len++;
                            }
                        });
                        if (docs.length != 0) {
                            compute_rate = parseFloat(compute_rate) + parseFloat(rate);
                            rate_len++;
                            compute_rate = parseFloat(compute_rate / rate_len);
                        }
                        else {
                            compute_rate = rate;
                        }

                        //req.body.id = docs.reverse()[0].id + 1;
                        var query = {
                            userId: userId,
                            mentorId: mentorId,
                            periodMentorId: periodMentorId,
                            rate: rate,
                        };
                        new Model(query).save((err2, doc2) => {
                            if (doc2) {
                                periodMentor.findByIdAndUpdate(periodMentorId, {
                                    rate: compute_rate
                                }, {
                                    new: true,
                                    runValidators: true
                                }).exec((err3, doc3) => {
                                    if (doc3) {

                                        if (doc3.type == 'mentor') {

                                            var totalRate = 0;
                                            var totalPeriodMentor = 0;

                                            periodMentor.find({ userId: mentorId }).exec((err4, docsPeriodMentor) => {
                                                docsPeriodMentor.forEach(item => {
                                                    totalRate += item.rate;
                                                    totalPeriodMentor++;
                                                });

                                                compute_rate = parseFloat(totalRate / totalPeriodMentor);
                                                Mentor.findByIdAndUpdate(mentorId, {
                                                    rate: compute_rate
                                                }, {
                                                    new: true,
                                                    runValidators: true
                                                }).exec((err5, doc5) => {

                                                    req.data.item = doc3;
                                                    response.ok(req, res, next, 'اطلاعات یا موفقیت ثبت گردید');

                                                });

                                            });

                                        }
                                        else {
                                            var totalRate = 0;
                                            var totalPeriodMentor = 0;

                                            periodMentor.find({ userId: mentorId }).exec((err4, docsPeriodMentor) => {
                                                docsPeriodMentor.forEach(item => {
                                                    totalRate += item.rate;
                                                    totalPeriodMentor++;
                                                });

                                                compute_rate = parseFloat(totalRate / totalPeriodMentor);
                                                Teacher.findByIdAndUpdate(mentorId, {
                                                    rate: compute_rate
                                                }, {
                                                    new: true,
                                                    runValidators: true
                                                }).exec((err5, doc5) => {

                                                    req.data.item = doc3;
                                                    response.ok(req, res, next, 'اطلاعات یا موفقیت ثبت گردید');

                                                });

                                            });
                                        }
                                    } else {
                                        response.error(req, res, next, 'اطلاعات یافت نشد');
                                    }
                                })

                            } else {
                                response.error(req, res, next, 'اطلاعات یافت نشد');
                            }
                        })
                    });
                } else {
                    response.error(req, res, next, 'قبلا امتیاز خود را ثبت کرده اید');
                }
            }
            else {
                response.error(req, res, next, 'اطلاعات یافت نشد');
            }
        });

    },
    GET_PERIOD_MENTOR_RATE: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        var mentorId = req.query.mentorId;
        console.log('mentorId :::::::::::::', mentorId);
        Model.find({ 'mentorId': mentorId })
            .limit(offset)
            .skip(first)
            .exec(function (err, docs) {
                if (docs) {
                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next);
                }
            });
    },
    GET_PERIOD_MENTOR_COMMENT: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        var mentorId = req.query.mentorId;
        var periodMentorId = req.query.periodMentorId;
        console.log('mentorId :::::::::::::', mentorId);
        Model.find({
            'mentorId': mentorId,
            'periodMentorId': periodMentorId,
        })
            .limit(offset)
            .skip(first)
            .exec(function (err, docs) {
                if (docs) {
                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next);
                }
            });
    }

};