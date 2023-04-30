const Channel = require("../../model/channel");
const ChannelContent = require("../../model/channelContent");
const Report = require("../../model/report");
const Product = require("../../model/product");
const response = require("../../response");
var config = require('../../config');
const Mentor = require('../../model/person').Mentor;
const Person = require('../../model/person').Person;
var moment = require('moment');
module.exports = {


    GET_ALL_REPORT: (req, res, next) => {
        Report.find({}).populate('contentId').populate('userId').populate('channelId').exec((err, docs) => {
            if (docs) {
                res.send(docs)
            } else {
                res.send(err)
            }
        })
    },


    NEW_REPORT: (req, res, next) => {
        // console.log(req.body)
        var Userid = req.data.personInfo._id;
        Person.findById(Userid).exec((err, docs) => {
            if (docs) {
                if (req.body.type == 'shop') {
                    // console.log(' req.body :::', req.body);
                    var productId = req.body.productId;
                    Product.findById(productId).exec((errProduct, docProduct) => {
                        if (docProduct) {
                            if (Userid.toString() != docProduct.personId._id.toString()) {
                                new Report({
                                    reportUserId: Userid,
                                    channelId: req.body.channelId,
                                    contentId: req.body.contentId,
                                    reportTitle: req.body.reportTitle,
                                    postId: req.body.postId,
                                    postCommentId: req.body.postCommentId,
                                    productId: req.body.productId,
                                    type: req.body.type,
                                }).save((err, doc) => {
                                    if (doc) {
                                        console.log(doc);

                                        req.data.report = doc;
                                        response.ok(req, res, next, "گزارش تخلف با موفقیت ثبت شد");
                                    } else {
                                        console.log('error :', err)
                                        response.error(req, res, next);
                                    }

                                });
                            }
                            else {
                                response.error(req, res, next, 'دسترسی ندارید');
                            }
                        }
                        else {
                            response.error(req, res, next, 'اطلاعات یافت نشد');
                        }
                    });
                }
                else {
                    // console.log(' req.body :::', req.body);
                    new Report({
                        reportUserId: Userid,
                        channelId: req.body.channelId,
                        contentId: req.body.contentId,
                        reportTitle: req.body.reportTitle,
                        postId: req.body.postId,
                        postCommentId: req.body.postCommentId,
                        productId: req.body.productId,
                        type: req.body.type,
                    }).save((err, doc) => {
                        if (doc) {
                            console.log(doc);

                            req.data.report = doc;
                            response.ok(req, res, next, "گزارش تخلف با موفقیت ثبت شد");
                        } else {
                            console.log('error :', err)
                            response.error(req, res, next);
                        }

                    });
                }




            }
        })
    },



};

