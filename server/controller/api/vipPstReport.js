const Model = require("../../model/vipPstReport");
const VipPst = require("../../model/vipPst");
const response = require("../../response");
var config = require('../../config');
var moment = require('jalali-moment');
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
            // .limit(offset)
            // .skip(first)
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
            })
    },
    POST_ITEM: (req, res, next) => {
        // Model.find({}).exec(function (err, docs) {
        // req.body.id = docs.reverse()[0].id + 1;
        new Model(req.body).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
        // });
    },
    POST_REPORT_ITEM: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var reportTitle = req.body.reportTitle;
        var postId = req.body.postId;
        var query = {
            userId: userId,
            reportTitle: reportTitle,
            postId: postId
        };

        VipPst.findById(postId).exec((errPst, docPst) => {
            if (docPst) {

                // console.log('docPst.userId.toString() :: ',docPst.userId._id.toString());
                // console.log('userId.toString() :: ',userId.toString());
                if (docPst.userId._id.toString() != userId.toString()) {
                    new Model(query).save((err, doc) => {
                        if (doc) {
                            req.data.item = doc;
                            response.ok(req, res, next, 'با موفقیت ثبت گردید');
                        } else {
                            response.error(req, res, next);
                        }
                    })
                }
                else {
                    response.error(req, res, next, 'دسترسی ثبت ندارید');
                }
            }
            else {
                response.error(req, res, next);
            }
        });
        // });
    },
};