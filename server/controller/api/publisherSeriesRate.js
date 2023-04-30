const response = require("../../response");
var config = require('../../config');
const PublisherSeriesRate = require('../../model/publisherSeriesRate');
const PublisherSeries = require('../../model/publisherSeries');


module.exports = {
    GET_ALL_PUBLISHERSERIESRATE: (req, res, next) => {
        PublisherSeriesRate.find({}).exec((err, docs) => {
            if (docs) {
                req.data.items = docs;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
    },

    // GET_EACH_PUBLISHERSERIESRATE: (req, res, next) => {
    //     School.findById(req.params.schoolId).exec((err, doc) => {
    //         if (doc) {
    //             req.data.item = doc;
    //             response.ok(req, res, next);
    //         }   else {
    //             response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
    //         }
    //     })
    // },

    GET_PUBLISHERSERIESRATE_USER: (req, res, next) => {
        var Userid = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var PublisherseriesId = req.query.publisherseriesId;

        if(strClass=='support')
        {
            Userid = req.data.personInfo.supportMentorId._id;
        }

        PublisherSeriesRate.find({
            personId: Userid, publisherseriesId: PublisherseriesId,
            isActive: true,
            isDelete: false
        }).exec((err, docs) => {
            if (docs) {
                var userRate = 0;
                var userHardship = 0;
                docs.forEach(item => {
                    if (item.type == 'Rate') {
                        userRate = item.rate;
                    }
                    else if (item.type == 'Hardship') {
                        userHardship = item.rate;
                    }
                });

                var query = {
                    userRate: userRate,
                    userHardship: userHardship,
                };
                req.data.items = query;
                response.ok(req, res, next);
            }
            else {
                response.error(req, res, next, 'اطلاعات یافت نشد');
            }
        });
    },



    NEW_PUBLISHERSERIESRATE: (req, res, next) => {
        var Userid = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var PublisherseriesId = req.body.publisherseriesId;
        var Rate = req.body.rate;
        var Type = req.body.type;

        if(strClass=='support')
        {
            Userid = req.data.personInfo.supportMentorId._id;
        }


        if (Type == "Rate") {
            PublisherSeriesRate.find({
                personId: Userid, publisherseriesId: PublisherseriesId,
                type: Type,
                isActive: true,
                isDelete: false
            }).exec((err, docs) => {
                if (docs) {
                    if (docs.length == 0) {
                        new PublisherSeriesRate({
                            personId: Userid,
                            publisherseriesId: req.body.publisherseriesId,
                            rate: Rate,
                            type: Type,
                        }).save((err, doc) => {
                            if (doc) {
                                PublisherSeriesRate.find({ publisherseriesId: PublisherseriesId, type: Type }).exec((err2, PublisherSeriesRateList) => {
                                    if (PublisherSeriesRateList) {
                                        var bookRate = 0;
                                        var tempRate = 0;
                                        var lenRate = PublisherSeriesRateList.length;
                                        PublisherSeriesRateList.forEach(item => {
                                            tempRate += item.rate;
                                        });

                                        if (tempRate != 0 && lenRate != 0) {
                                            bookRate = tempRate / lenRate;
                                        }
                                        var updateQuery = { bookRate: bookRate };
                                        PublisherSeries.findByIdAndUpdate(PublisherseriesId, updateQuery, config.mongooseUpdateOptions).exec((err2, doc) => {
                                            req.data.item = doc;
                                            response.ok(req, res, next, 'امتیاز کتاب با موفقیت ثبت شد');
                                        });
                                    }
                                });

                            } else {
                                response.error(req, res, next, 'مشکل در ثبت امتیاز کتاب');
                            }

                        })
                    } else {

                        const updateQuery = { rate: Rate };
                        PublisherSeriesRate.findByIdAndUpdate(docs[0]._id, updateQuery, config.mongooseUpdateOptions).exec((errr, docc2) => {
                            if (docc2) {
                                PublisherSeriesRate.find({ publisherseriesId: PublisherseriesId, type: Type }).exec((err2, PublisherSeriesRateList) => {
                                    if (PublisherSeriesRateList) {
                                        var bookRate = 0;
                                        var tempRate = 0;
                                        var lenRate = PublisherSeriesRateList.length;
                                        PublisherSeriesRateList.forEach(item => {
                                            tempRate += item.rate;
                                        });

                                        if (tempRate != 0 && lenRate != 0) {
                                            bookRate = tempRate / lenRate;
                                        }
                                        var updateQuery = { bookRate: bookRate };
                                        PublisherSeries.findByIdAndUpdate(PublisherseriesId, updateQuery, config.mongooseUpdateOptions).exec((err2, doc) => {
                                            req.data.item = docc2;
                                            response.ok(req, res, next, 'امتیاز کتاب با موفقیت بروزرسانی شد');
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
                else {
                    response.error(req, res, next, 'مشکل در ثبت امتیاز کتاب');
                }
            });
        }
        else if (Type == "Hardship") {
            PublisherSeriesRate.find({ personId: Userid, publisherseriesId: PublisherseriesId, type: Type }).exec((err, docs) => {
                if (docs) {
                    if (docs.length == 0) {
                        new PublisherSeriesRate({
                            personId: Userid,
                            publisherseriesId: req.body.publisherseriesId,
                            rate: Rate,
                            type: Type,
                        }).save((err, doc) => {
                            if (doc) {


                                PublisherSeriesRate.find({ publisherseriesId: PublisherseriesId, type: Type }).exec((err2, PublisherSeriesRateList) => {
                                    if (PublisherSeriesRateList) {
                                        var hardRate = 0;
                                        var tempRate = 0;
                                        var lenRate = PublisherSeriesRateList.length;
                                        PublisherSeriesRateList.forEach(item => {
                                            tempRate += item.rate;
                                        });

                                        if (tempRate != 0 && lenRate != 0) {
                                            hardRate = tempRate / lenRate;
                                        }
                                        var updateQuery = { hardRate: hardRate };
                                        PublisherSeries.findByIdAndUpdate(PublisherseriesId, updateQuery, config.mongooseUpdateOptions).exec((err2, doc) => {
                                            req.data.item = doc;
                                            response.ok(req, res, next, 'امتیاز کتاب با موفقیت ثبت شد');
                                        });
                                    }
                                });





                                req.data.item = doc;
                                response.ok(req, res, next, 'سختی کتاب با موفقیت ثبت شد');
                            } else {
                                response.error(req, res, next, 'مشکل در ثبت سختی کتاب');
                            }

                        })
                    } else {
                        const updateQuery = { rate: Rate };
                        PublisherSeriesRate.findByIdAndUpdate(docs[0]._id, updateQuery, config.mongooseUpdateOptions).exec((errr, docc2) => {
                            if (docc2) {


                                PublisherSeriesRate.find({ publisherseriesId: PublisherseriesId, type: Type }).exec((err2, PublisherSeriesRateList) => {
                                    if (PublisherSeriesRateList) {
                                        var hardRate = 0;
                                        var tempRate = 0;
                                        var lenRate = PublisherSeriesRateList.length;
                                        PublisherSeriesRateList.forEach(item => {
                                            tempRate += item.rate;
                                        });

                                        if (tempRate != 0 && lenRate != 0) {
                                            hardRate = tempRate / lenRate;
                                        }
                                        var updateQuery = { hardRate: hardRate };
                                        PublisherSeries.findByIdAndUpdate(PublisherseriesId, updateQuery, config.mongooseUpdateOptions).exec((err2, doc) => {
                                            req.data.item = docc2;
                                            response.ok(req, res, next, 'سختی کتاب با موفقیت بروزرسانی شد');
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
                else {
                    response.error(req, res, next, 'مشکل در ثبت سختی کتاب');
                }
            });
        }
    },

    POST_NEW_PUBLISHERSERIESRATE: (req, res, next) => {

        var PersonId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var PublisherseriesId = req.body.publisherseriesId;
        var Rate = req.body.rate;
        var Type = req.body.type;

        if(strClass=='support')
        {
            PersonId = req.data.personInfo.supportMentorId._id;
        }


        PublisherSeriesRate.find({
            personId: PersonId,
            publisherseriesId: PublisherseriesId,
            isActive: true,
            isDelete: false
        }).exec((err, docs) => {

            if (docs.length <= 0) {
                new PublisherSeriesRate({
                    personId: PersonId,
                    publisherseriesId: PublisherseriesId,
                    rate: Rate,
                    type: Type,
                }).save((err, docc) => {
                    if (docc) {
                        if (req.body.type == "Rate") {
                            req.data.item = docc;
                            response.ok(req, res, next, 'امتیاز کتاب با موفقیت ثبت شد');
                        } else if (req.body.type == "Hardship") {
                            req.data.item = docc;
                            response.ok(req, res, next, 'سختی کتاب با موفقیت ثبت شد');
                        }
                    } else {
                        response.error(req, res, next, err);
                    }

                })
            } else if (docs.length > 0) {
                if (docs[0].bookMark === false) {
                    const updateQuery = { rate: Rate };
                    PublisherSeriesRate.findByIdAndUpdate(docs[0]._id, updateQuery, config.mongooseUpdateOptions).exec((errr, docc2) => {

                        if (docc2) {
                            req.data.data = docc2;
                            response.ok(req, res, next, 'نشانه گزاری با موفقیت ثبت شد');
                        } else {
                            req.data.error = err;
                            response.error(req, res, next);
                        }
                    })
                } else {
                    const updateQueryy = { bookMark: false };
                    PostBookmark.findByIdAndUpdate(docs[0]._id, updateQueryy, config.mongooseUpdateOptions).exec((errr, docc) => {

                        if (docc) {
                            req.data.data = docc;
                            response.ok(req, res, next, 'نشانه گزاری با موفقیت حذف شد');
                        } else {
                            req.data.error = err;
                            response.error(req, res, next);
                        }
                    })
                }

            } else {
                req.data.error = err;
                response.error(req, res, next);
            }
        })

    },





};

