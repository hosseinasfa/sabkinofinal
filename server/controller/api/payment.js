require('dotenv').config()
var persianDate = require('persian-date');
const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal = ZarinpalCheckout.create('3dfbabd4-1806-47e4-aabb-9daa441b4100', true);
const Order = require('../../model/order')
const Product = require('../../model/product')
module.exports = {
    createPaymentUrl: (req, res, next) => {
        var amount = req.body.amount;
        zarinpal.PaymentRequest({
            Amount: req.body.amount,
            CallbackURL: `${process.env.BASE_URL}/api/payment/verification`,
            Description: "خرید محصول",
            Mobile: req.data.personInfo.phone,
        }).then(response => {
            if (response.status === 100) {
                Product.findById(req.body.productId).exec((err, productFound) => {
                    if (productFound) {
                        new Order({
                            personId: req.data.personInfo._id,
                            productId: req.body.productId,
                            vendorId: productFound.personId,
                            amount,
                            authority: response.authority
                        }).save((err, doc) => {
                            if (doc) {
                                res.send({
                                    status: true,
                                    data: {
                                        url: response.url
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
    },
    paymentVerification: (req, res, next) => {
        Order.findOne({
            authority: req.query.Authority,
        }).exec((err, currentTransactions) => {
            if (currentTransactions) {
                zarinpal.PaymentVerification({
                    Amount: currentTransactions.amount,
                    Authority: req.query.Authority,
                }).then(response => {
                    if (response.status === -21) {
                        res.send('no payment')
                    } else {
                        currentTransactions.refId = response.RefID;
                        currentTransactions.save();
                        Product.findById(currentTransactions.productId).exec((err, productFound) => {
                            if (productFound) {
                                productFound.sellCount++;
                                productFound.save();
                                res.render('successPayment', {
                                    amount: currentTransactions.amount.toLocaleString(),
                                    date: new persianDate(currentTransactions.createdAt).format('H:mm:ss YYYY-MM-DD'),
                                    refId: response.RefID
                                })
                            } else {
                                res.send('no product found');
                            }
                        });

                    }
                }).catch(err => {
                    res.send('no payment');
                });
            } else {
                res.send('no payment');
            }

        })
    }

}