const Model = require("../../model/periodMentorMedia");
const PeriodMentor = require("../../model/periodMentor");
const PeriodMentorMedia = require("../../model/periodMentorMedia");
const response = require("../../response");
var config = require('../../config');
const PeriodMentorMediaFile = require('../../model/periodMentorMediaFile');
const { getVideoDurationInSeconds } = require('get-video-duration');
var offset = parseInt(process.env.ROW_NUMBER);
var BASE_URL = process.env.BASE_URL;
var fs = require('fs');

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

        var query = req.query;
        if (typeof query !== 'undefined') {
            Model.find(query)
                .limit(offset)
                .skip(first)
                .exec((err, docs) => {
                    req.data.items = docs;
                    response.ok(req, res, next);
                });
        }
        else {
            Model.find({})
                .limit(offset)
                .skip(first)
                .exec((err, docs) => {
                    req.data.items = docs;
                    response.ok(req, res, next);
                });
        }
    },
    GET_SINGLE_ITEM: (req, res, next) => {
        var itemId = req.query.itemId;


        Model.findById(itemId).exec((err, doc) => {
            if (doc) {

                var item = {};
                var files = [];

                PeriodMentorMediaFile.find({ periodMentorMediaId: doc.id }).exec((errFile, docFiles) => {
                    if (docFiles) {
                        if (docFiles.length > 0) {

                            docFiles.forEach(itemFile => {
                                files.push({
                                    _id: itemFile._id,
                                    title: itemFile.title,
                                    file: itemFile.file,
                                });
                            })
                            item.title = doc.title;
                            item.description = doc.description;
                            item.image = doc.image;
                            item.video = doc.video;
                            item.counter = doc.counter;
                            item.reason = doc.reason;
                            item.status = doc.status;
                            item.isActive = doc.isActive;
                            item.isDelete = doc.isDelete;
                            item._id = doc._id;
                            item.id = doc.id;
                            item.files = files;
                            item.periodMentorId = doc.periodMentorId;
                            item.createdAt = doc.createdAt;
                            item.updatedAt = doc.updatedAt;
                        }
                        else {
                            item.title = doc.title;
                            item.description = doc.description;
                            item.image = doc.image;
                            item.video = doc.video;
                            item.counter = doc.counter;
                            item.reason = doc.reason;
                            item.status = doc.status;
                            item.isActive = doc.isActive;
                            item.isDelete = doc.isDelete;
                            item._id = doc._id;
                            item.id = doc.id;
                            item.files = files;
                            item.periodMentorId = doc.periodMentorId;
                            item.createdAt = doc.createdAt;
                            item.updatedAt = doc.updatedAt;
                        }
                        req.data.item = item;
                        response.ok(req, res, next);
                    }
                });

            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },
    POST_ITEM: (req, res, next) => {
        new Model(req.body).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        });
    },
    PERIOD_MENTOR_ID: (req, res, next) => {
        var periodMentorId = req.params.periodMentorId;
        Model
            .aggregate()
            .match({
                $and: [
                    { 'periodMentorId': config.ObjectIdConvertor(periodMentorId) },
                    // { isActive: true },
                    { isDelete: false }
                ]
            })
            .exec((err, data) => {
                if (data.length == 0) {
                    response.error(req, res, next, 'not found');
                    return;
                } else {
                    var responseData = [];
                    data.forEach(item => {
                        req.data = responseData;
                        response.ok(req, res, next);
                    });
                }
            });
    },
    // Session_Counter: (req, res, next) => {
    //     var itemId = req.body.itemId;
    //     Model.findById(itemId).exec((err, doc) => {
    //         if (doc) {
    //             var counter = doc.counter;
    //             Model.findByIdAndUpdate(itemId, {
    //                 counter: ++counter
    //             }, {
    //                 new: true,
    //                 runValidators: true
    //             }).exec((err2, doc2) => {
    //                 if (doc2) {
    //                     response.ok(req, res, next);
    //                 } else {
    //                     response.error(req, res, next);
    //                 }
    //             });


    //             // req.data.item = doc;
    //             // response.ok(req, res, next);
    //         } else {
    //             response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
    //         }
    //     });
    // },
    DELETE_SESSION_ITEM: (req, res, next) => {
        var userId = req.data.personInfo._id.toString();
        var strClass = req.data.personInfo.class;
        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id.toString();
        }


        var periodMentorId = req.query.periodMentorId;
        var itemId = req.query.itemId;
        PeriodMentor.findById(periodMentorId).exec((errPeriod, docPeriod) => {
            if (docPeriod) {
                if (docPeriod.userId._id.toString() == userId) {
                    Model.findById(itemId).exec((err, doc) => {
                        if (err) {
                            response.error(req, res, next);
                        } else {
                            if (doc) {

                                if (doc.status != 'confirm') {

                                    var query = {
                                        'periodMentorMediaId': itemId,
                                    };

                                    PeriodMentorMediaFile.findOneAndDelete(query).exec();

                                    query = {
                                        '_id': itemId,
                                    };

                                    Model.findOneAndDelete(query).exec((err, doc) => {
                                        if (err) {
                                            response.error(req, res, next, 'عملیات با مشکل مواجه شد');
                                        } else {
                                            response.ok(req, res, next);
                                        }
                                    });
                                }
                                else {
                                    response.error(req, res, next, 'دسترسی حذف ندارید');
                                }
                            } else {
                                response.error(req, res, next, 'اطلاعات یافت نشد');
                            }
                        }
                    });
                }
                else {
                    response.error(req, res, next, 'دسترسی ندارید');
                }
            }
        });



    },
    PUT_SESSION_ITEM: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var itemId = req.body.itemId;
        var periodMentorId = req.body.periodMentorId;

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }


        function getVideoDuration(fileName) {
            return new Promise((resolve) => {
                getVideoDurationInSeconds(fileName).then((duration) => {
                    console.log('duration :', duration);
                    resolve(duration);
                });
            });
        }

        async function f1(fileName) {
            const duration = await getVideoDuration(fileName);
            console.log('duration :: ', duration);
            return duration;

        }
        async function computeDuration(itemId) {
            return await f1(itemId);
        }



        async function updateSessionCountAndDuration(docs, sessionCount) {
            var durationVideos = 0;
            for (const item of docs) {
                var fileName = item.video;
                sessionCount++;

                var video = item.video.replace(BASE_URL, "public");
                console.log('video ::: ', video);




                if (fs.existsSync(video)) {
                    console.log('exist file');
                    const duration = await computeDuration(item.video);
                    durationVideos += duration;
                }
            }


            if (durationVideos != 0) {
                durationVideos = durationVideos / 60;
                durationVideos = parseFloat(durationVideos).toFixed(0);
            }

            PeriodMentor.findByIdAndUpdate(periodMentorId, {
                duration: durationVideos,
                sessionCount: sessionCount,
            }, {
                new: true,
                runValidators: true
            }).exec((err, docPeriodMentor) => {
                if (docPeriodMentor) {
                    req.data.item = docPeriodMentor;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next);
                }
            });
        }


        PeriodMentor.findById(periodMentorId).exec((err, doc) => {
            if (err) {
                response.error(req, res, next);
            } else {
                if (doc) {

                    console.log("doc.userId._id :::::", doc.userId._id);
                    console.log("userId ::::", userId);
                    if (doc.userId._id.toString() == userId) {


                        // var video = item.video.replace(BASE_URL, "public");
                        // console.log('video ::: ', video);

                        Model.find({ periodMentorId: periodMentorId }).exec((err2, docs) => {
                            if (docs) {

                                if (docs.length > 0) {
                                    Model.findByIdAndUpdate(itemId, req.body, {
                                        new: true,
                                        runValidators: true
                                    }).exec((errUpdate, docUpdate) => {
                                        if (docUpdate) {
                                            updateSessionCountAndDuration(docs, docs.length);
                                            //response.ok(req, res, next);
                                        } else {
                                            response.error(req, res, next);
                                        }
                                    });
                                }
                                else {
                                    response.error(req, res, next);
                                }


                            }
                            else {
                                response.error(req, res, next);
                            }
                        });

                    }
                    else {
                        response.error(req, res, next, 'دسترسی ندارید');
                    }
                } else {
                    response.error(req, res, next);
                }
            }
        });

    },

    POST_CUSTOM_ITEM: (req, res, next) => {
        var files = req.body.files;
        var strClass = req.data.personInfo.class;
        var periodMentorId = req.body.periodMentorId;

        function getVideoDuration(fileName) {
            return new Promise((resolve) => {
                getVideoDurationInSeconds(fileName).then((duration) => {
                    console.log('duration :', duration);
                    resolve(duration);
                });
            });
        }

        async function f1(fileName) {
            const duration = await getVideoDuration(fileName);
            console.log('duration :: ', duration);
            return duration;

        }
        async function computeDuration(itemId) {
            return await f1(itemId);
        }


        async function updateSessionCountAndDuration(docs, sessionCount) {
            var durationVideos = 0;
            for (const item of docs) {
                var fileName = item.video;
                sessionCount++;
                var absolutePath = BASE_URL + 'uploads/period_media_video/';

                // console.log('item.video :::  ',item.video);
                // console.log('absolutePath  :::  ',absolutePath + item.video);
                var video = item.video.replace(BASE_URL, "public");
                console.log('video ::: ', video);




                if (fs.existsSync(video)) {
                    console.log('exist file');
                    const duration = await computeDuration(item.video);
                    durationVideos += duration;
                }
            }


            if (durationVideos != 0) {
                durationVideos = durationVideos / 60;
                durationVideos = parseFloat(durationVideos).toFixed(0);
            }

            PeriodMentor.findByIdAndUpdate(periodMentorId, {
                duration: durationVideos,
                sessionCount: sessionCount,
            }, {
                new: true,
                runValidators: true
            }).exec((err, docPeriodMentor) => {
                if (docPeriodMentor) {
                    req.data.item = docPeriodMentor;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next);
                }
            });
        }



        // if (fs.existsSync('public/uploads/period_media_video/cXfC4MFkeWTHWPyx-1667824658619.mp4')) {
        //     console.log('exist file 222');
        // }



        if (strClass == 'mentor' || strClass == 'teacher' || strClass == 'support') {
            PeriodMentor.findById(periodMentorId).exec((errPeriod, docPeriod) => {

                if (docPeriod) {
                    // var maxSessionCount = docPeriod.maxSessionCount;
                    Model.find({ periodMentorId: periodMentorId }).exec((errPeriodMedia, docPeriodMedia) => {
                        if (docPeriodMedia) {
                            // var sessionCount = parseInt(docPeriodMedia.length);
                            // if ((sessionCount + 1) <= parseInt(maxSessionCount)) {

                            new Model(req.body).save((err, doc) => {
                                if (doc) {
                                    if (typeof files !== 'undefined') {

                                        files = JSON.parse(files);
                                        files.forEach(item => {
                                            var query = {
                                                periodMentorMediaId: doc._id,
                                                title: item.title,
                                                file: item.file,
                                            };
                                            new PeriodMentorMediaFile(query).save((err2, doc2) => {

                                            });
                                        });
                                    }

                                    PeriodMentorMedia.find({
                                        'periodMentorId': periodMentorId
                                    }).exec((err2, docsPeriodMentorMedia) => {
                                        if (docsPeriodMentorMedia) {
                                            var sessionCount = parseInt(docsPeriodMentorMedia.length);
                                            updateSessionCountAndDuration(docsPeriodMentorMedia, sessionCount);

                                        }
                                    });

                                    // req.data.item = doc;
                                    // response.ok(req, res, next);
                                } else {
                                    console.log('err :', err);
                                    response.error(req, res, next, 'مشکل در ثبت آیتم');
                                }
                            });
                            // }
                            // else {
                            //     response.error(req, res, next, 'تعداد جلسات ثبت شده بیش از حد مجاز است');
                            // }
                        }
                        else {
                            response.error(req, res, next, 'اطلاعات یافت نشد');
                        }
                    });
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
        }
        else {
            response.error(req, res, next, 'دسترسی ندارید');
        }
    },
};