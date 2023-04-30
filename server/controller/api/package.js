const Package = require("../../model/package");
const response = require("../../response");
var config = require('../../config');
const Person = require('../../model/person').Person
const PackageList = require("../../model/packageList");
var offset = parseInt(process.env.ROW_NUMBER);
var moment = require('jalali-moment');

module.exports = {

    GET_ALL_ITEMS: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }
        Package.find({})
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
            });
    },

    PUT_EACH_ITEM: (req, res, next) => {
        var updateQuery = req.body;
        Package
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

    GET_EACH_ITEM: (req, res, next) => {
        Package.findById(req.params.PackageId).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },

    POST_ITEM: (req, res, next) => {

        new Package(req.body).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
    },

    GET_USER_INFO: (req, res, next) => {
        var strClass = req.data.personInfo.class;
        if (strClass == 'support') {
            var supportType = req.data.personInfo.supportType;
            var supportMentorId = req.data.personInfo.supportMentorId;
            var days = 0;
            var dayExam = 0;
            var expirePackageDate = supportMentorId.expirePackageDate;
            var expireExamPackageDate = supportMentorId.expireExamPackageDate;
            if (typeof expirePackageDate === 'undefined') {
                days = 0;
            } else {
                expirePackageDate = expirePackageDate.toISOString().substring(0, 10);
                var expireDate = new Date(expirePackageDate);
                var now = moment(new Date()); //todays date
                var expireDate = moment(expirePackageDate, 'YYYY/MM/DD HH:mm:ss'); // another date
                var duration = moment.duration(expireDate.diff(now));
                days = parseInt(duration.asDays());

                if (days < 0) {
                    days = 0;
                }
            }

            if (typeof expireExamPackageDate === 'undefined') {
                dayExam = 0;
            } else {
                expireExamPackageDate = expireExamPackageDate.toISOString().substring(0, 10);
                var expireDateExam = new Date(expireExamPackageDate);
                var now = moment(new Date()); //todays date
                var expireDateExam = moment(expireExamPackageDate, 'YYYY/MM/DD HH:mm:ss'); // another date
                var duration = moment.duration(expireDateExam.diff(now));
                dayExam = parseInt(duration.asDays());

                if (dayExam < 0) {
                    dayExam = 0;
                }
            }

            req.data.expirePackageDate = days;
            req.data.expireExamPackageDate = dayExam;
            response.ok(req, res, next);
        }
        else {

            if (strClass == 'user') {
                console.log('req.data.personInfo :::: ', req.data.personInfo);
            }
            var days = 0;
            var dayExam = 0;
            var expirePackageDate = req.data.personInfo.expirePackageDate;
            var expireExamPackageDate = req.data.personInfo.expireExamPackageDate;
            if (typeof expirePackageDate === 'undefined') {
                days = 0;
            } else {
                expirePackageDate = expirePackageDate.toISOString().substring(0, 10);
                var expireDate = new Date(expirePackageDate);
                var now = moment(new Date()); //todays date
                var expireDate = moment(expirePackageDate, 'YYYY/MM/DD HH:mm:ss'); // another date
                var duration = moment.duration(expireDate.diff(now));
                days = parseInt(duration.asDays());

                if (days < 0) {
                    days = 0;
                }
            }

            if (typeof expireExamPackageDate === 'undefined') {
                dayExam = 0;
            } else {
                expireExamPackageDate = expireExamPackageDate.toISOString().substring(0, 10);
                var expireDateExam = new Date(expireExamPackageDate);
                var now = moment(new Date()); //todays date
                var expireDateExam = moment(expireExamPackageDate, 'YYYY/MM/DD HH:mm:ss'); // another date
                var duration = moment.duration(expireDateExam.diff(now));
                dayExam = parseInt(duration.asDays());

                if (dayExam < 0) {
                    dayExam = 0;
                }
            }

            req.data.expirePackageDate = days;
            req.data.expireExamPackageDate = dayExam;
            response.ok(req, res, next);
        }





    },
    CHECK_EACHITEM: (req, res, next) => {
        Package.findById(req.body.PackageId).exec((err, doc) => {
            if (doc) {
                console.log(req.data.personInfo.walletBalance)
                console.log(doc.priceAll)
                if (doc.priceAll == 0) {
                }
                if (doc.priceAll <= req.data.personInfo.walletBalance) {
                    console.log(req.data.personInfo.walletBalance - doc.priceAll)
                    console.log(req.data.personInfo.expirePackageDate);
                    var expirePackageDate = req.data.personInfo.expirePackageDate;
                    if (typeof expirePackageDate !== 'undefined') {
                        expirePackageDate = expirePackageDate.toISOString().substring(0, 10);
                        var expireDate = new Date(expirePackageDate);
                        var days = doc.duration * 7;
                        expireDate.setDate(expireDate.getDate() + days);
                    } else {
                        expirePackageDate = moment().toISOString().substring(0, 10);
                        var expireDate = new Date(expirePackageDate);
                        var days = doc.duration * 7;
                        expireDate.setDate(expireDate.getDate() + days);
                    }

                    console.log('expireDate ::::', expireDate);

                    var price = 0;
                    if (doc.discount != 0) {
                        price = parseInt(doc.priceAll - ((doc.discount * doc.priceAll) / 100));
                    }
                    else {
                        price = doc.priceAll;
                    }

                    console.log('price :: ',price);

                    Person.findByIdAndUpdate(req.data.personInfo._id, {
                        walletBalance: req.data.personInfo.walletBalance - price,
                        expirePackageDate: expireDate,
                        isPackage: true
                    }, {
                        new: true,
                        runValidators: true
                    }).exec((err2, doc2) => {
                        if (doc2) {

                            new PackageList({
                                userId: req.data.personInfo._id,
                                PackageId: req.body.PackageId,
                                reservePackage: true,
                                duration: doc.duration
                            }).save((err, doc) => {
                                if (doc) {
                                    res.status(200).json({
                                        message: "خرید بسته شما با موفقیت انجام شد",
                                        status: true
                                    })
                                } else {
                                    response.error(req, res, next);
                                }
                            })
                        } else {
                            response.error(req, res, next);
                            console.log("error walletBalance", err)
                        }
                    })
                } else {
                    res.status(200).json({
                        message: "موجودی حساب شما از قیمت بسته مورد نظر کمتر می باشد",
                        status: false
                    })
                }
                //  req.data.item = doc;
                //  response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                console.log(err)
            }
        })
    },
    GET_USER_PACKAGE: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        console.log('strClass ::', strClass);
        if (strClass == 'support') {
            var supportType = req.data.personInfo.supportType;
            if (supportType == 'teacher') {
                Package.find({
                    roll: 'teacher',
                    priceAll: { $ne: 0 },
                    status: true
                })
                    .limit(offset)
                    .skip(first)
                    .exec((err, docs) => {
                        req.data.items = docs;
                        response.ok(req, res, next);
                    });
            }
            else if (supportType == 'mentor') {
                Package.find({
                    roll: 'mentor',
                    priceAll: { $ne: 0 },
                    status: true
                })
                    .limit(offset)
                    .skip(first)
                    .exec((err, docs) => {
                        req.data.items = docs;
                        response.ok(req, res, next);
                    });
            }
        }
        else {
            Package.find({
                roll: strClass,
                priceAll: { $ne: 0 },
                status: true
            })
                .limit(offset)
                .skip(first)
                .exec((err, docs) => {
                    req.data.items = docs;
                    response.ok(req, res, next);
                });
        }
    }


};