const Model = require("../../model/userNumber");
const response = require("../../response");
var config = require('../../config');
var moment = require('jalali-moment');
var offset = parseInt(process.env.ROW_NUMBER);
var Person = require("../../model/person").Person;
var rand = require("random-key");
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
        // var first = req.params.first;
        // if (typeof first === 'undefined') {
        //     first = 0;
        // } else {
        //     first = parseInt(first) * offset;
        // }

        Model.find({})
            // .limit(offset)
            // .skip(first)
            .exec((err, docs) => {
                req.data.items = docs;
                console.log("abas", docs.length);
                response.ok(req, res, next);
            })
    },
    POST_ITEM: (req, res, next) => {
        var phoneNumber = req.body.phoneNumber;
        console.log("phoneNumber ::::", phoneNumber);
        Model.find({
            phoneNumber: phoneNumber,
        }).exec((err, docs) => {

            if (err) {
                response.error(req, res, next);
            }

            if (docs) {
                if (docs.length == 0) {
                    new Model(req.body).save((err, doc) => {
                        if (doc) {
                            req.data.item = doc;
                            response.ok(req, res, next);
                        } else {
                            response.error(req, res, next);
                        }
                    });
                }
                else {
                    response.error(req, res, next, 'شماره همراه وارد شده قبلا وارد شده');
                }
            }
            else {
                response.error(req, res, next, 'اطلاعات یافت نشد');
            }
        });

    },
    POST_USER_PHONE: (req, res, next) => {
        var phoneNumber = req.body.phoneNumber;
        // var IMEI = req.body.IMEI;
        // console.log('IMEI :::: ',IMEI);
        // response.ok(req, res, next);

        Person.find({
            phone: phoneNumber,
        }).exec((err, docs) => {
            console.log(docs)
            if (docs) {
                if (docs.length == 0) {
                    new Person({
                        phone: phoneNumber,
                        password: rand.generateDigits(75),
                        enName: rand.generateBase30(10),
                    }).save((err2, doc) => {
                        if (doc) {
                            // var query = {
                            //     phone: phoneNumber,
                            // }
                            // new OTP(query).save((err3, otp) => {
                            //     if (otp) {
                            req.data.item = doc;
                            response.ok(req, res, next);
                            //     }
                            // });
                        } else {
                            console.log('err2  :', err2);
                            response.error(req, res, next);
                        }
                    });
                    // new Token({
                    //     personId: user[0]._id.toString(),
                    //     token: rand.generateBase30(128),
                    // }).save((err, token) => {
                    //     if (token) {
                    //         // if (!req.session.initialised) {
                    //         //     req.session.initialised = true;
                    //         //     req.session.api_key = token.token;
                    //         //     req.session.save();
                    //         // }
                    //         console.log('token :', token.token);
                    //         req.data.verify = true;
                    //         req.data.token = token.token;
                    //         response.ok(req, res, next);
                    //     } else {
                    //         req.data.verify = false;
                    //         req.data.token = null;
                    //         response.error(req, res, next, 'مشکل در ایجاد توکن');
                    //     }
                    // });
                }
                else {
                    req.data.item = docs[0];
                    response.ok(req, res, next);
                }
            }
            else {
                console.log('err  :', err);
                response.error(req, res, next);
            }
        });

    },

};