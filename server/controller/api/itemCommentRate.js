const Model = require("../../model/itemCommentRate");
const ItemComment = require("../../model/itemComment");
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
    POST_STORE_COMMENT_RATE: (req, res, next) => {
        var personId = req.data.personInfo._id;
        var refId = req.body.refId;
        var rate = (req.body.rate === 'true');

        var query = {
            personId: personId,
            refId: refId,
            rate: rate,
        };

        Model.find({ personId: personId, refId: refId }).exec((errItemCommentRate, docItemCommentRate) => {
            if (docItemCommentRate) {
                if (docItemCommentRate.length == 0) {

                    new Model(query).save((err, doc) => {
                        if (doc) {
                            ItemComment.findById(refId).exec((errItemComment, docItemComment) => {
                                if (docItemComment) {
                                    var commentRate = docItemComment.rate;

                                    console.log('commentRate :::', commentRate);
                                    var updateQuery = {};


                                    if (rate == true) {
                                        updateQuery = {
                                            rate: (commentRate + 1)
                                        };
                                    }
                                    else {
                                        if (commentRate >= 1) {
                                            updateQuery = {
                                                rate: (commentRate - 1)
                                            };
                                        }
                                    }

                                    ItemComment
                                        .findByIdAndUpdate(refId, updateQuery, config.mongooseUpdateOptions)
                                        .exec((err2, doc2) => {
                                            if (doc2) {
                                                req.data.item = doc;
                                                response.ok(req, res, next);
                                            } else {
                                                response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
                                            }
                                        })
                                }
                            });
                        } else {
                            response.error(req, res, next);
                        }
                    })
                }
                else {
                    var updateQueryRate = {
                        rate: rate,
                    }

                    console.log('docItemCommentRate._id ::; ', docItemCommentRate[0]._id);
                    Model.findByIdAndUpdate(docItemCommentRate[0]._id, updateQueryRate, config.mongooseUpdateOptions)
                        .exec((err, doc) => {
                            if (doc) {
                                ItemComment.findById(refId).exec((errItemComment, docItemComment) => {
                                    if (docItemComment) {
                                        var commentRate = docItemComment.rate;

                                        console.log('commentRate :::', commentRate);
                                        var updateQuery = {};
                                        if (rate != docItemCommentRate[0].rate) {
                                            if (rate == true) {
                                                updateQuery = {
                                                    rate: (commentRate + 1)
                                                };
                                            }
                                            else {
                                                if (commentRate >= 1) {
                                                    updateQuery = {
                                                        rate: (commentRate - 1)
                                                    };
                                                }
                                            }


                                            ItemComment
                                                .findByIdAndUpdate(refId, updateQuery, config.mongooseUpdateOptions)
                                                .exec((err2, doc2) => {
                                                    if (doc2) {
                                                        req.data.item = doc;
                                                        response.ok(req, res, next);
                                                    } else {
                                                        response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
                                                    }
                                                });
                                        }
                                        else {
                                            response.error(req, res, next, 'قبلا امتیاز شما ثبت شده');
                                        }
                                    }
                                });
                            } else {
                                response.error(req, res, next);
                            }
                        });
                }
            }
            else {
                response.error(req, res, next);
            }
        });

    },
};