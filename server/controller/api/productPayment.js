const Model = require("../../model/periodMentorPayment");
const Financial = require("../../model/financial");
const Product = require("../../model/product");
const OnlineCallMentor = require("../../model/onlineCallMentor");
const PeroductPayment = require("../../model/productPayment");
const ShoppingPrice = require("../../model/shoppingPrice");
const Person = require("../../model/person").Person;
const response = require("../../response");
var config = require('../../config');
var offset = parseInt(process.env.ROW_NUMBER);


module.exports = {
    PRODUCT_PAYMENT: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var walletBalance = req.data.personInfo.walletBalance;
        var strClass = req.data.personInfo.class;
        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
            walletBalance = req.data.personInfo.supportMentorId.walletBalance;
        }

        var productId = req.body.productId;
        var price = 0;
        Product.findById(productId)

            .exec(function (err, doc) {
                if (doc) {
                    var paymentCount = doc.sellCount;
                    var price = doc.price;
                    productOWner = doc.personId
                    // var sessionCount = doc.sessionCount;
                    // var duration = doc.duration;


                    var query2 = {
                        userId: userId,
                        productId: productId,
                    };
                    PeroductPayment.find(query2).exec(function (err, docPeroductPayment) {

                        // req.body.id = docs.reverse()[0].id + 1;
                        if (docPeroductPayment.length == 0) {
                            // var duaration= 0;
                            // var callCount= 0;
                            if (walletBalance >= price) {

                                ShoppingPrice
                                    .find({
                                        $and: [
                                            {
                                                priceFrom: {
                                                    $lte: price,
                                                }
                                            },
                                            {
                                                priceTo: {
                                                    $gte: price
                                                }
                                            }
                                        ]
                                    })
                                    .exec((errPriceList, docPriceList) => {
                                        if (errPriceList) {
                                            response.error(req, res, next, 'اطلاعات کاربر یافت نشد');
                                        }

                                        if (docPriceList.length != 0) {
                                            var percent = docPriceList[0].percent;

                                            var compute = price - ((price * percent) / 100);
                                            var query = {
                                                'productId': productId,
                                                'amount': price,
                                                'type': 'shop',
                                                'count': 1,
                                                'totalPrice': price,
                                                'finalPrice': compute,
                                                'ownerId': userId,
                                                'userId': productOWner,

                                            };

                                            new Financial(query).save((errFinancial, docFinancial) => {
                                                if (docFinancial) {
                                                    Person.findByIdAndUpdate(userId, {
                                                        walletBalance: walletBalance - doc.price
                                                    }, {
                                                        new: true,
                                                        runValidators: true
                                                    }).exec((err2, doc2) => {
                                                        if (err2) {
                                                            response.error(req, res, next);
                                                        }
                                                    });

                                                    Product.findByIdAndUpdate(productId, {
                                                        sellCount: paymentCount + 1
                                                    }, {
                                                        new: true,
                                                        runValidators: true
                                                    }).exec((err3, doc3) => {
                                                        if (doc3) {
                                                            PeroductPayment.find({}).sort('id').exec(function (err, docs) {
                                                                // req.body.id = docs.reverse()[0].id + 1;
                                                                if (docs) {
                                                                    var query = {
                                                                        userId: userId,
                                                                        productId: productId,
                                                                        price: price,
                                                                    };
                                                                    new PeroductPayment(query).save((err4, doc4) => {
                                                                        if (doc4) {
                                                                            req.data.item = doc4;
                                                                            response.ok(req, res, next);
                                                                        } else {
                                                                            response.error(req, res, next);
                                                                        }
                                                                    })
                                                                } else {
                                                                    response.error(req, res, next);
                                                                }
                                                            });
                                                        } else {
                                                            response.error(req, res, next);
                                                        }
                                                    });


                                                } else {
                                                    response.error(req, res, next);
                                                }
                                            });

                                        } else {
                                            response.error(req, res, next, 'اطلاعات یافت نشد');
                                        }
                                    });
                            } else {
                                response.error(req, res, next, 'اعتبار شما کافی نیست');
                            }
                        }
                        else {
                            response.error(req, res, next, 'قبلا محصول را خریداری کرده اید');
                        }
                    });


                } else {
                    response.error(req, res, next);
                }
            });
    },
    GET_USER_PRODUCT_PAYMENTS: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }

        var query2 = {
            userId: userId,
        };
        PeroductPayment.find(query2)
            .limit(offset)
            .skip(first)
            .exec(function (err, docPeroductPayments) {
                if (err) {
                    response.error(req, res, next, 'عملیات با مشکل مواجه شده');
                }

                if (docPeroductPayments.length != 0) {
                    req.data.items = docPeroductPayments;
                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
    }
};