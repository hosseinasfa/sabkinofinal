const PublisherSeriesBook = require("../../model/publisherSeriesBook");
const PublisherSeriesBookTimeRate = require("../../model/publisherSeriesBookTimeRate");
const response = require("../../response");
var ItemBookmark = require('../../model/itemBookmark');
var config = require('../../config');
var moment = require('moment');
var offset = parseInt(process.env.ROW_NUMBER);

module.exports = {


    // SEARCH_HASHTAG : (req,res,next) =>{
    //     function escapeRegex(text) {
    //         return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    //     };
    //     const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    //     PublisherSeries.find({ "hashtag": regex }).exec((err, docs) => {
    //         if(docs) {
    //             req.data.items = docs;
    //             response.ok(req, res, next);
    //         } else {
    //             res.send(err)
    //         }
    //     })
    // },



    GET_PUBLISHER_SERIESBOOK: (req, res, next) => {

        PublisherSeriesBook.find({
            publisherSeriesId: req.params.publisherSeriesId,
            isActive: true,
            isDelete: false

        }).exec((err, docs) => {
            if (docs) {
                const fil = docs.map((e) => e.publisherSeriesId)

                res.json({
                    data: fil[0],
                    docs

                })
            } else {
                res.send(err)
            }
        })
    },


    GET_PUBLISHER_SERIESBOOKITEMS: (req, res, next) => {
        var first = req.query.first;
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }



        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }
        var query = req.query;

        function getBookmarkResult(itemId) {
            return new Promise((resolve) => {
                console.log('itemId:::::::::::   ', itemId);

                var query = {
                    personId: userId,
                    refModelName: 'publisherSeriesBook',
                    refId: itemId
                };
                ItemBookmark.findOne(query).exec((preErr, preDoc) => {
                    if (preDoc) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                });
            });
        }

        async function f1(item) {
            const isBookmark = await getBookmarkResult(item);
            console.log(isBookmark);
            return isBookmark;

        }
        async function checkBookmark(itemId) {
            return await f1(itemId);
        }


        async function getList(docs) {
            var items = [];
            for (const item of docs) {
                const isBookmark = await checkBookmark(item._id);

                items.push({
                    'isBookmark': isBookmark,
                    "title": item.title,
                    "stage": item.stage,
                    "field": item.field,
                    "avatar": item.avatar,
                    "isBookmark": isBookmark,
                    "isActive": item.isActive,
                    "isDelete": item.isDelete,
                    "_id": item._id,
                    "publisherId": item.publisherId,
                    "publisherSeriesId": item.publisherSeriesId,
                    "createdAt": item.createdAt,
                    "updatedAt": item.updatedAt,
                    "id": item.id,
                });
            }
            req.data.items = items;
            response.ok(req, res, next);
        }




        PublisherSeriesBook.find(query)
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    getList(docs);
                }
                else {
                    response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                }
            });




    },

    GET_PUBLISHER_UNIQUE_BOOK: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var itemId = req.query.itemId;

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }
        PublisherSeriesBook.findById(itemId)
            .exec((err, doc) => {
                if (doc) {
                    var items = [];
                    var isBookmark = false;
                    var query = {
                        personId: userId,
                        refModelName: 'publisherSeriesBook',
                        refId: doc._id
                    };

                    ItemBookmark.findOne(query).exec((preErr, preDoc) => {
                        if (preDoc) {
                            isBookmark = true;
                        }
                    });

                    items.push({
                        "title": doc.title,
                        "stage": doc.stage,
                        "field": doc.field,
                        "avatar": doc.avatar,
                        "cover": doc.cover,
                        "caption": doc.caption,
                        "cut": doc.cut,
                        "hashtag": doc.hashtag,
                        "season": doc.season,
                        "hardRate": doc.hardRate,
                        "bookRate": doc.bookRate,
                        "bookTimeRate1": doc.bookTimeRate1,
                        "bookTimeRate2": doc.bookTimeRate2,
                        "bookTimeRate3": doc.bookTimeRate3,
                        "bookTimeRate4": doc.bookTimeRate4,
                        "bookTimeRate5": doc.bookTimeRate5,
                        "bookTimeRate6": doc.bookTimeRate6,
                        "bookTimeRate7": doc.bookTimeRate7,
                        "multipleChoiceQuestions": doc.multipleChoiceQuestions,
                        "descriptiveQuestions": doc.descriptiveQuestions,
                        "textbook": doc.textbook,
                        "concoursQuestions": doc.concoursQuestions,
                        "freeAttachment": doc.freeAttachment,
                        "descriptiveAnswer": doc.descriptiveAnswer,
                        "isBookmark": isBookmark,
                        "isActive": doc.isActive,
                        "isDelete": doc.isDelete,
                        "_id": doc._id,
                        "publisherId": doc.publisherId,
                        "publisherSeriesId": doc.publisherSeriesId,
                        "createdAt": doc.createdAt,
                        "updatedAt": doc.updatedAt,
                        "id": doc.id,
                    });

                    req.data.items = items;
                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                }
            });
    },

    POST_RATE_TIME: (req, res, next) => {
        var Userid = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var PublisherseriesBookId = req.body.PublisherseriesBookId;
        var Rate = 5;
        var Type = req.body.type;

        if (strClass == 'support') {
            Userid = req.data.personInfo.supportMentorId._id;
        }


        PublisherSeriesBookTimeRate.find({ personId: Userid, PublisherseriesBookId: PublisherseriesBookId, type: Type }).exec((err, docs) => {
            if (docs) {
                if (docs.length == 0) {
                    new PublisherSeriesBookTimeRate({
                        personId: Userid,
                        PublisherseriesBookId: req.body.PublisherseriesBookId,
                        rate: Rate,
                        type: Type,
                    }).save((err, doc) => {
                        if (doc) {
                            PublisherSeriesBookTimeRate.find({ PublisherseriesBookId: PublisherseriesBookId, type: Type }).exec((err2, PublisherSeriesBookTimeRateList) => {
                                if (PublisherSeriesBookTimeRateList) {
                                    var bookRate = 0;
                                    var tempRate = 0;
                                    var lenRate = PublisherSeriesBookTimeRateList.length;
                                    PublisherSeriesBookTimeRateList.forEach(item => {
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
                                    PublisherSeriesBook.findByIdAndUpdate(PublisherseriesBookId, updateQuery, config.mongooseUpdateOptions).exec((err2, doc) => {
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
                    PublisherSeriesBookTimeRate.findByIdAndUpdate(docs[0]._id, updateQuery, config.mongooseUpdateOptions).exec((errr, docc2) => {
                        if (docc2) {
                            PublisherSeriesBookTimeRate.find({ publisherseriesId: PublisherseriesId, type: Type }).exec((err2, PublisherSeriesBookTimeRateList) => {
                                if (PublisherSeriesBookTimeRateList) {
                                    var bookRate = 0;
                                    var tempRate = 0;
                                    var lenRate = PublisherSeriesBookTimeRateList.length;
                                    PublisherSeriesBookTimeRateList.forEach(item => {
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

                                    PublisherSeriesBook.findByIdAndUpdate(PublisherseriesBookId, updateQuery, config.mongooseUpdateOptions).exec((err2, doc) => {
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


};

