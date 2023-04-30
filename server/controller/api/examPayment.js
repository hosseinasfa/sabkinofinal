const Model = require("../../model/examPayment");
const ExamPackage = require("../../model/examPackage");
const Financial = require("../../model/financial");
const Person = require("../../model/person").Person;
const response = require("../../response");
var config = require('../../config');
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
    POST_PAYMENT_EXAM_PACKAGE: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var packageId = req.body.packageId;
        ExamPackage.findById(packageId).exec((err, respons) => {
            if (err) {
                response.error(req, res, next, 'اطلاعات ارسالی ناقص می باشد');
            } else {
                var walletBalance = req.data.personInfo.walletBalance;
                var isWalletActive = req.data.personInfo.isWalletActive;
                //var itemId = req.data.personInfo._id.toString();
                var price = respons.price;
                var duration = respons.duration;

                if (isWalletActive == true) {
                    if (walletBalance >= price) {

                        var query = {
                            userId:userId,
                            examPackageId:packageId,
                            price:price,
                            status:true,
                        };

                        new Model(query).save((err, doc) => {
                            if (doc) {
                                var walletBalanceTemp = parseInt(walletBalance - price);
                                var expireExamPackageDate = req.data.personInfo.expireExamPackageDate;
                                var expireDate = '';
                                if (typeof expireExamPackageDate !== 'undefined') {
                                    expireExamPackageDate = expireExamPackageDate.toISOString().substring(0, 10);
                                    var expireDate = new Date(expireExamPackageDate);
                                    var days = duration;
                                    expireDate.setDate(expireDate.getDate() + days);
                                } else {
                                    expireExamPackageDate = moment().toISOString().substring(0, 10);
                                    var expireDate = new Date(expireExamPackageDate);
                                    var days = duration;
                                    expireDate.setDate(expireDate.getDate() + days);
                                }

                                console.log('expireDate ::::', expireDate);

                                Person.findByIdAndUpdate(userId, {
                                    walletBalance: walletBalanceTemp,
                                    expireExamPackageDate: expireDate
                                }, {
                                    new: true,
                                    runValidators: true
                                }).exec((err2, doc2) => {
                                    if (doc2) {
                                        req.data.item = doc2;
                                        response.ok(req, res, next);
                                    } else {
                                        response.error(req, res, next);
                                    }
                                });
                            } else {
                                response.error(req, res, next);
                            }
                        });
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