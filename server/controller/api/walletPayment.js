const WalletPayment = require("../../model/walletPayment");
const SetProgramPayment = require("../../model/setProgramPayment");
const Person = require("../../model/person").Person;
const response = require("../../response");
var config = require('../../config');
const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal = ZarinpalCheckout.create('3dfbabd4-1806-47e4-aabb-9daa441b4100', true);
const WalletPackage = require("../../model/walletPackage");
var persianDate = require('persian-date');
var offsetApi = parseInt(process.env.ROW_NUMBER_API);
var moment = require('jalali-moment');

module.exports = {

    GET_ALL_ITEMS: (req, res, next) => {
        WalletPayment.find({}).lean().exec((err, docs) => {
            req.data.provinceList = docs;
            response.ok(req, res, next);
        })
    },

    GET_EACH_ITEM: (req, res, next) => {
        WalletPayment.findById(req.params.walletPaymentId).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },

    POST_ITEM: (req, res, next) => {

        new WalletPayment(req.body).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
                console.log(req.data.item.walletPackageId.price)
            } else {
                response.error(req, res, next);
            }
        })
    },

    createPaymentUrl: (req, res, next) => {
        var amount = req.body.amount;
        WalletPackage.findById(req.body.walletPackageId).exec((err, respons) => {
            if (respons) {
                zarinpal.PaymentRequest({
                    Amount: respons.price,
                    // CallbackURL: `${process.env.BASE_URL}/api/payment/verification`,
                    CallbackURL: `${process.env.BASE_URL}/api/walletPayment/verification`,
                    Description: "شارژ کیف پول",
                    Mobile: req.data.personInfo.phone,
                }).then(response => {
                    if (response.status === 100) {
                        WalletPackage.findById(req.body.walletPackageId).exec((err, productFound) => {
                            if (productFound) {
                                var userId = req.data.personInfo._id;
                                var strClass = req.data.personInfo.class;

                                if (strClass == 'support') {
                                    userId = req.data.personInfo.supportMentorId._id;
                                }

                                new WalletPayment({
                                    userId: userId,
                                    walletPackageId: req.body.walletPackageId,
                                    // vendorId: productFound.personId,
                                    amount: respons.price,
                                    authority: response.authority
                                }).save((err, doc) => {
                                    if (doc) {
                                        res.send({
                                            status: true,
                                            data: {
                                                url: response.url,
                                            },
                                            message: ""
                                        })
                                    } else {
                                        res.send({ err })
                                    }
                                })
                            } else {
                                res.send({ err });
                            }
                        });

                    }
                }).catch(err => {
                    res.send({ err })
                });
            } else {
                res.json({
                    status: 500,
                    message: "پکیج مورد نظر پیدا نشد"
                })
            }


        })

    },
    paymentVerification: (req, res, next) => {
        // console.log(req.query)
        WalletPayment.find({
            authority: req.query.Authority,
        }).exec((err2, currentTransactions) => {
            // console.log("userId:",currentTransactions[0].refId);
            // console.log("amin:",req.query.Authority);
            // console.log("abas:",currentTransactions[0].walletPackageId);
            if (currentTransactions) {
                zarinpal.PaymentVerification({
                    Amount: currentTransactions[0].amount,
                    Authority: req.query.Authority,
                }).then(response => {
                    // console.log('ghl',response.status)
                    currentTransactions[0].refId = response.RefID;
                    // currentTransactions.save();
                    if (response.status === 100) {
                        WalletPackage.findById(currentTransactions[0].walletPackageId).exec((err, productFound) => {
                            if (productFound) {
                                Person.findByIdAndUpdate(currentTransactions[0].userId._id, {
                                    walletBalance: currentTransactions[0].userId.walletBalance + currentTransactions[0].amount
                                }, {
                                    new: true,
                                    runValidators: true
                                }).exec((err2, doc2) => {
                                    if (doc2) {
                                        // response.ok(req, res, next);
                                        console.log("update walletBalance", doc2)
                                    } else {
                                        response.error(req, res, next);
                                        console.log("error walletBalance", err)
                                    }
                                })
                                productFound.sellCount++;
                                productFound.save();
                                res.render('successPayment', {
                                    amount: currentTransactions[0].amount.toLocaleString(),
                                    date: new persianDate(currentTransactions[0].createdAt).format('H:mm:ss YYYY-MM-DD'),
                                    refId: response.RefID,
                                    title: 'پرداخت با موفقیت انجام شد'
                                })

                            } else {
                                res.send('no product found');
                            }
                        });

                    } else {
                        res.render('successPayment', {
                            amount: currentTransactions[0].amount.toLocaleString(),
                            date: new persianDate(currentTransactions[0].createdAt).format('H:mm:ss YYYY-MM-DD'),
                            refId: response.RefID,
                            title: 'پرداخت ناموفق'
                        })
                    }
                }).catch(err => {
                    res.send(err, 'no payment2');
                    console.log("err", err);
                });
            } else {
                res.send('no payment3');
                console.log('no payment3')
            }

        })
    },
    createPaymentUrlExam: (req, res, next) => {
        WalletPackage.findById(req.body.walletPackageId).exec((err, respons) => {
            if (respons) {
                zarinpal.PaymentRequest({
                    Amount: respons.price,
                    // CallbackURL: `${process.env.BASE_URL}/api/payment/verification`,
                    CallbackURL: `${process.env.BASE_URL}/api/walletPayment/verificationExam`,
                    Description: "شارژ کیف پول",
                    Mobile: req.data.personInfo.phone,
                }).then(response => {
                    if (response.status === 100) {
                        WalletPackage.findById(req.body.walletPackageId).exec((err, productFound) => {
                            if (productFound) {
                                var strClass = req.data.personInfo.class;
                                var userId = req.data.personInfo._id;

                                if (strClass == 'support') {
                                    userId = req.data.personInfo.supportMentorId._id;
                                }


                                new WalletPayment({
                                    userId: userId,
                                    walletPackageId: req.body.walletPackageId,
                                    // vendorId: productFound.personId,
                                    amount: respons.price,
                                    authority: response.authority
                                }).save((err, doc) => {
                                    if (doc) {
                                        res.send({
                                            status: true,
                                            data: {
                                                url: response.url,
                                            },
                                            message: ""
                                        })
                                    } else {
                                        res.send({ err })
                                    }
                                })
                            } else {
                                res.send({ err });
                            }
                        });

                    }
                }).catch(err => {
                    res.send({ err })
                });
            } else {
                res.json({
                    status: 500,
                    message: "پکیج مورد نظر پیدا نشد"
                })
            }


        })

    },
    paymentVerificationExam: (req, res, next) => {
        // console.log(req.query)
        WalletPayment.find({
            authority: req.query.Authority,
        }).exec((err2, currentTransactions) => {
            // console.log("userId:",currentTransactions[0].refId);
            // console.log("amin:",req.query.Authority);
            // console.log("abas:",currentTransactions[0].walletPackageId);
            if (currentTransactions) {
                zarinpal.PaymentVerification({
                    Amount: currentTransactions[0].amount,
                    Authority: req.query.Authority,
                }).then(response => {
                    // console.log('ghl',response.status)
                    currentTransactions[0].refId = response.RefID;
                    // currentTransactions.save();
                    if (response.status === 100) {
                        WalletPackage.findById(currentTransactions[0].walletPackageId).exec((err, productFound) => {
                            if (productFound) {
                                Person.findByIdAndUpdate(currentTransactions[0].userId._id, {
                                    walletBalance: currentTransactions[0].userId.walletBalance + currentTransactions[0].amount
                                }, {
                                    new: true,
                                    runValidators: true
                                }).exec((err2, doc2) => {
                                    if (doc2) {
                                        // response.ok(req, res, next);
                                        console.log("update walletBalance", doc2)
                                    } else {
                                        response.error(req, res, next);
                                        console.log("error walletBalance", err)
                                    }
                                })
                                productFound.sellCount++;
                                productFound.save();
                                res.render('successPaymentExam', {
                                    amount: currentTransactions[0].amount.toLocaleString(),
                                    date: new persianDate(currentTransactions[0].createdAt).format('H:mm:ss YYYY-MM-DD'),
                                    refId: response.RefID,
                                    title: 'پرداخت با موفقیت انجام شد'
                                })

                            } else {
                                res.send('no product found');
                            }
                        });

                    } else {
                        res.render('successPaymentExam', {
                            amount: currentTransactions[0].amount.toLocaleString(),
                            date: new persianDate(currentTransactions[0].createdAt).format('H:mm:ss YYYY-MM-DD'),
                            refId: response.RefID,
                            title: 'پرداخت ناموفق'
                        })
                    }
                }).catch(err => {
                    res.send(err, 'no payment2');
                    console.log("err", err);
                });
            } else {
                res.send('no payment3');
                console.log('no payment3')
            }

        })
    },
    GET_USER_PAYMENT_ITEMS: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offsetApi;
        }

        SetProgramPayment.find({ userId: userId })
            .limit(offsetApi)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    if (docs.length > 0) {

                        var items = [];
                        docs.forEach(item => {
                            var paymentDate = item.createdAt;
                            var duration = item.mentorPackageId.duration;
                            duration = parseInt(duration) * 30;

                            paymentDate = moment(paymentDate, 'YYYY/MM/DD').add(duration, 'days').toISOString();
                            moment.locale('en');
                            var current_date = moment().toISOString();
                            var date1 = new Date(paymentDate);
                            var date2 = new Date(current_date);

                            const diffTime = Math.abs(date2 - date1);
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            // console.log(diffTime , " milliseconds");
                            // req.data.expireDays = diffDays;

                            items.push({
                                    expire: diffDays,
                                    expirePackageDate: item.expirePackageDate,
                                    status: item.status,
                                    price: item.price,
                                    mentorPackageId: item.mentorPackageId,
                                    mentorId: item.mentorId,
                                    userId: item.userId,
                                });
                        });





                        req.data.items = items;
                        response.ok(req, res, next);
                    }
                    else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                }

            });
    },
    GET_ACTIVE_USER_PACKAGE: (req, res, next) => {
        var userId = req.data.personInfo._id;
        SetProgramPayment.findOne({
            userId: userId,
            isActive: true,
            status: { $in: ['checking', 'active'] },
        })
            .exec((err, doc) => {
                if (doc) {
                    var paymentDate = doc.createdAt;
                    var duration = doc.mentorPackageId.duration;
                    duration = parseInt(duration) * 30;

                    paymentDate = moment(paymentDate, 'YYYY/MM/DD').add(duration, 'days').toISOString();
                    moment.locale('en');
                    var current_date = moment().toISOString();
                    var date1 = new Date(paymentDate);
                    var date2 = new Date(current_date);

                    const diffTime = Math.abs(date2 - date1);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    // console.log(diffTime , " milliseconds");
                    // req.data.expireDays = diffDays;

                    var item = {
                        expire: diffDays,
                        expirePackageDate: doc.expirePackageDate,
                        status: doc.status,
                        price: doc.price,
                        mentorPackageId: doc.mentorPackageId,
                        mentorId: doc.mentorId,
                        userId: doc.userId,
                    }
                    req.data.item = item;
                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }

            });
    }


};