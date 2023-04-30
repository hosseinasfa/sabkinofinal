const Model = require("../../model/setProgramExitUser");
const setProgramPayment = require("../../model/setProgramPayment");
const response = require("../../response");
var config = require('../../config');
const Person = require("../../model/person").Person;
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

        var isExit = req.body.isExit;
        if (isExit == true) {
            var updateQuery = req.body;
            Model
                .findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
                .exec((err, doc) => {
                    if (doc) {
                        var setProgramPaymentId = doc.setProgramPaymentId._id;
                        if (typeof setProgramPaymentId !== 'undefined') {

                            var updateQuery2 = {
                                isActive: false,
                                isDelete: true,
                                status: 'delete',
                            };
                            setProgramPayment.findByIdAndUpdate(setProgramPaymentId, updateQuery2, config.mongooseUpdateOptions).exec((err2, doc2) => {
                                req.data.item = doc;
                                response.ok(req, res, next);
                            });
                        }
                        
                    } else {
                        response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
                    }
                })
        }
        else {
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
        }
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
        console.log('bbbbbbbbbbbbb');
        new Model(req.body).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
    },
    POST_PROGRAM_EXIT_USER: (req, res, next) => {
        var mentorId = req.body.mentorId;
        var userId = req.body.userId;
        var setProgramPaymentId = req.body.setProgramPaymentId;
        var reportTitle = req.body.reportTitle;

        Model.find({
            'mentorId': mentorId,
            'userId': userId,
            'setProgramPaymentId': setProgramPaymentId,
        })
            .exec(function (err1, docs1) {
                if (docs1.length == 0) {
                    Model.find({}).sort('id').exec(function (err2, docs2) {
                        req.body.id = docs2.reverse()[0].id + 1;
                        var query = {
                            mentorId: mentorId,
                            userId: userId,
                            setProgramPaymentId: setProgramPaymentId,
                            reportTitle: reportTitle,
                        };

                        new Model(query).save((err3, doc3) => {
                            if (doc3) {
                                req.data.item = doc3;
                                response.ok(req, res, next);
                            } else {
                                response.error(req, res, next);
                            }
                        })
                    });
                } else {
                    response.error(req, res, next, 'کاربر قبلا ثبت شده');
                }
            });

    },
    POST_PROGRAM_DELETE_USER: (req, res, next) => {
        var mentorId = req.body.mentorId;
        var userId = req.body.userId;
        var mentorPackageId = req.body.mentorPackageId;
        setProgramPayment.find({
            'mentorId': mentorId,
            'userId': userId,
            'mentorPackageId': mentorPackageId,
        }).exec(function (err, doc) {
            if (doc) {
                Person.findById(userId).exec((errUser, docUser) => {
                    if (docUser && docUser.isExit == true) {
                        setProgramPayment.findByIdAndUpdate(doc.id.toString(), {
                            isDelete: true
                        }, {
                            new: true,
                            runValidators: true
                        }).exec((err, doc) => {
                            if (doc) {
                                response.ok(req, res, next);
                            } else {
                                response.error(req, res, next, 'اطلاعات یافت نشد');
                            }
                        });
                    } else {
                        response.error(req, res, next, 'دسترسی حذف کاربر را ندارید');
                    }
                });

            } else {
                response.error(req, res, next, 'اطلاعات یافت نشد');
            }
        });
    },

};