const PublisherSeries = require("../../model/publisherSeries");
const PublisherSeriesTimeRate = require("../../model/publisherSeriesTimeRate");
const response = require("../../response");
var config = require('../../config');
const Mentor = require('../../model/person').Mentor;
const Person = require('../../model/person').Person;
var moment = require('moment');
var offset = parseInt(process.env.ROW_NUMBER);
module.exports = {


    SEARCH_HASHTAG: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        function escapeRegex(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        };
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        PublisherSeries.find({
            "hashtag": regex,
            isActive: true,
            isDelete: false
        })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            })
    },



    GET_PUBLISHERID: (req, res, next) => {
        PublisherSeries.find({
            publisherId: req.params.publisherId,
            isActive: true,
            isDelete: false
        }).exec((err, docs) => {
            if (docs) {
                req.data.items = docs;
                response.ok(req, res, next);
            } else {
                res.send(err)
            }
        })
    },


    GET_SINGLE_ITEM: (req, res, next) => {
        var itemId = req.params.itemId;
        console.log('itemId :::: ',itemId);
        PublisherSeries.findById(itemId).exec((err, doc) => {
            if (doc) {
                res.render('publisherSeries',{data:doc})
            } else {
                res.send(err)
            }
        })
    },


    GET_PUBLISHER_SINGLE_ITEM: (req, res, next) => {
        var itemId = req.query.itemId;
        console.log('itemId :::: ',itemId);
        PublisherSeries.findById(itemId).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next,'اطلاعات یافت نشد');
            }
        })
    },

    POST_RATE_TIME: (req, res, next) => {
        var Userid = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var PublisherseriesId = req.body.publisherseriesId;
        var Rate = 5;
        var Type = req.body.type;

        if(strClass=='support')
        {
            Userid = req.data.personInfo.supportMentorId._id;
        }


        PublisherSeriesTimeRate.find({ personId: Userid, publisherseriesId: PublisherseriesId, type: Type }).exec((err, docs) => {
            if (docs) {
                if (docs.length == 0) {
                    new PublisherSeriesTimeRate({
                        personId: Userid,
                        publisherseriesId: req.body.publisherseriesId,
                        rate: Rate,
                        type: Type,
                    }).save((err, doc) => {
                        if (doc) {
                            PublisherSeriesTimeRate.find({ publisherseriesId: PublisherseriesId, type: Type }).exec((err2, PublisherSeriesTimeRateList) => {
                                if (PublisherSeriesTimeRateList) {
                                    var bookRate = 0;
                                    var tempRate = 0;
                                    var lenRate = PublisherSeriesTimeRateList.length;
                                    PublisherSeriesTimeRateList.forEach(item => {
                                        tempRate += item.rate;
                                    });

                                    if (tempRate != 0 && lenRate != 0) {
                                        bookRate = tempRate / lenRate;
                                    }

                                    var updateQuery = {};
                                    if (Type == "bookTimeRate1") {
                                        updateQuery = { bookTimeRate1: bookRate };
                                    }
                                    else if (Type == "bookTimeRate2") {
                                        updateQuery = { bookTimeRate2: bookRate };
                                    }
                                    else if (Type == "bookTimeRate3") {
                                        updateQuery = { bookTimeRate3: bookRate };
                                    }
                                    else if (Type == "bookTimeRate4") {
                                        updateQuery = { bookTimeRate4: bookRate };
                                    }
                                    else if (Type == "bookTimeRate5") {
                                        updateQuery = { bookTimeRate5: bookRate };
                                    }
                                    else if (Type == "bookTimeRate6") {
                                        updateQuery = { bookTimeRate6: bookRate };
                                    }
                                    else if (Type == "bookTimeRate7") {
                                        updateQuery = { bookTimeRate7: bookRate };
                                    }
                                    PublisherSeries.findByIdAndUpdate(PublisherseriesId, updateQuery, config.mongooseUpdateOptions).exec((err2, doc) => {
                                        req.data.item = doc;
                                        response.ok(req, res, next, ' با موفقیت ثبت شد');
                                    });
                                }
                            });

                        } else {
                            response.error(req, res, next, 'مشکل در ثبت امتیاز کتاب');
                        }

                    })
                } else {

                    const updateQuery = { rate: Rate };
                    PublisherSeriesTimeRate.findByIdAndUpdate(docs[0]._id, updateQuery, config.mongooseUpdateOptions).exec((errr, docc2) => {
                        if (docc2) {
                            PublisherSeriesTimeRate.find({ publisherseriesId: PublisherseriesId, type: Type }).exec((err2, PublisherSeriesTimeRateList) => {
                                if (PublisherSeriesTimeRateList) {
                                    var bookRate = 0;
                                    var tempRate = 0;
                                    var lenRate = PublisherSeriesTimeRateList.length;
                                    PublisherSeriesTimeRateList.forEach(item => {
                                        tempRate += item.rate;
                                    });

                                    if (tempRate != 0 && lenRate != 0) {
                                        bookRate = tempRate / lenRate;
                                    }
                                    var updateQuery = {};
                                    if (Type == "bookTimeRate1") {
                                        updateQuery = { bookTimeRate1: bookRate };
                                    }
                                    else if (Type == "bookTimeRate2") {
                                        updateQuery = { bookTimeRate2: bookRate };
                                    }
                                    else if (Type == "bookTimeRate3") {
                                        updateQuery = { bookTimeRate3: bookRate };
                                    }
                                    else if (Type == "bookTimeRate4") {
                                        updateQuery = { bookTimeRate4: bookRate };
                                    }
                                    else if (Type == "bookTimeRate5") {
                                        updateQuery = { bookTimeRate5: bookRate };
                                    }
                                    else if (Type == "bookTimeRate6") {
                                        updateQuery = { bookTimeRate6: bookRate };
                                    }
                                    else if (Type == "bookTimeRate7") {
                                        updateQuery = { bookTimeRate7: bookRate };
                                    }

                                    PublisherSeries.findByIdAndUpdate(PublisherseriesId, updateQuery, config.mongooseUpdateOptions).exec((err2, doc) => {
                                        req.data.item = docc2;
                                        response.ok(req, res, next, 'با موفقیت بروزرسانی شد');
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

    },


    // NEW_REPORT : (req,res,next) => {
    //     var Userid = req.data.personInfo._id
    //     Person.findById(Userid).exec((err, docs) => {
    //         if(docs){

    //             new Report({
    //                 userId : Userid,
    //                 channelId : req.body.channelId,
    //                 contentId : req.body.contentId,
    //                 reportTitle : req.body.reportTitle,
    //             }).save((err, doc) => {
    //                 if (doc) {
    //                     console.log(doc)
    //                     res.status(200).json({
    //                         report : doc,
    //                         message : "گزارش تخلف با موفقیت ثبت شد"
    //                     })
    //                 } else {
    //                     console.log('error :', err)
    //                     response.error(req, res, next);
    //                 }

    //             })
    //         }
    //     })
    // },



};

