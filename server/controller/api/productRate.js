const response = require("../../response");
var config = require('../../config');
var offset = parseInt(process.env.ROW_NUMBER);
const Model = require('../../model/productRate');
const Product = require('../../model/product');

module.exports = {
    POST_RATE_PRODUCT: (req, res, next) => {
        var userId = req.data.personInfo._id.toString();
        var productId = req.body.productId;
        var rate = req.body.rate;

        console.log('productId ::: ',productId);
        console.log('rate ::: ',rate);

        Product.findById(productId).exec((errProduct, docProduct) => {
            if (docProduct) {
                Model.find({ userId: userId, productId: productId }).exec((errRate, docRate) => {
                    if (docRate) {

                        if (docRate.length == 0) {
                            Model.find({ productId: productId }).exec(function (errProductRate, docProductRate) {
                                if (docProductRate) {
                                    var compute_rate = 0;
                                    var rate_len = 0;
                                    docProductRate.forEach(item => {
                                        compute_rate += parseFloat(item.rate);
                                        rate_len++;
                                    });
                                    if (docProductRate.length != 0) {
                                        compute_rate = parseFloat(compute_rate) + parseFloat(rate);
                                        rate_len++;
                                        compute_rate = parseFloat(compute_rate / rate_len);
                                    }
                                    else {
                                        compute_rate = rate;
                                    }

                                    var query = {
                                        userId: userId,
                                        productId: productId,
                                        rate: rate,
                                    };

                                    new Model(query).save((err, doc) => {
                                        if (doc) {
                                            Product.findByIdAndUpdate(productId, {
                                                rate: compute_rate
                                            }, {
                                                new: true,
                                                runValidators: true
                                            }).exec((err3, doc3) => {
                                                req.data.item = doc;
                                                response.ok(req, res, next);
                                            });
                                        } else {
                                            // console.log('111111111111111111111111111111111');
                                            response.error(req, res, next, 'ثبت اطلاعات با مشکل مواجه شد');
                                        }
                                    });

                                }
                                else {
                                    response.error(req, res, next, 'اطلاعات یافت نشد');
                                }

                            });


                        }
                        else {
                            
                            response.error(req, res, next, 'قبلا امتیاز خود را ثبت کرده اید');
                        }

                    }
                    else {
                        // console.log('22222222222222222222222');
                        response.error(req, res, next, 'ثبت اطلاعات با مشکل مواجه شد');
                    }
                });
            }
            else {
                // console.log('33333333333333333333333333');
                response.error(req, res, next, 'ثبت اطلاعات با مشکل مواجه شد');
            }

        });





    },




}

