const Model = require("../../model/periodMentor");
const Person = require("../../model/person").Person;
const PeriodMentorPayment = require("../../model/periodMentorPayment");
const periodMentorPriceList = require("../../model/periodMentorPriceList");
const PeriodMentorMedia = require("../../model/periodMentorMedia");
const response = require("../../response");
var config = require('../../config');
const { getVideoDurationInSeconds } = require('get-video-duration');
var offset = parseInt(process.env.ROW_NUMBER);
var offsetApi = parseInt(process.env.ROW_NUMBER_API);
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
        var isPublished = req.body.isPublished;
        console.log('isPublished ::::: ', isPublished);
        if (isPublished == 'reject') {
            var reason = '';
            PeriodMentorMedia.find({ periodMentorId: req.params.itemId }).exec((err2, docs) => {
                if (docs) {
                   // docs.forEach(item => {
                        //reason += '&' + item.reason;
                  //  });


                    updateQuery.reason += reason;
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
                }
            });


            // Model
            // .findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
            // .exec((err, doc) => {
            //     if (doc) {
            //         req.data.item = doc;
            //         response.ok(req, res, next);
            //     } else {
            //         response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
            //     }
            // })
        }
        else if (isPublished == 'confirm') {
            PeriodMentorMedia.find({ periodMentorId: req.params.itemId }).exec((err2, docs) => {
                if (docs) {
                    var status = true;
                    if (docs.length > 0) {
                        docs.forEach(item => {
                            if (item.status != 'confirm' && item.isActive != true) {
                                status = false;
                            }
                        });
                    }
                    else {
                        status = false;
                    }

                    if (status == true) {
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
                    }
                    else {
                        response.error(req, res, next, 'جلسات این دوره تایید نشده لطفا مجددا بررسی کنید');
                    }
                }
            });
        }
        else {
            Model
                .findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
                .exec((err, doc) => {
                    if (doc) {
                        req.data.item = doc;
                        res
                        ponse.ok(req, res, next);
                    } else {
                        response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
                    }
                })
        }
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
        //var path = require("path");
        var first = req.query.first;
        var type = req.query.type;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        var filter = {};
        if (typeof type === 'undefined') {
            filter.isPublished = 'confirm';
        }
        if (type == 'pending') {
            //.find({ userId: { $in: followUsers } })
            filter = {
                isPublished: { $in: ['pending', 'reject'] }
            }
            // filter.isPublished = 'pending';
        }

        Model.find(filter)
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
            })
    },
    GET_SINGLE_ITEMS: (req, res, next) => {
        var itemId = req.query.itemId;
        var item = {};
        var walletBalance = req.data.personInfo.walletBalance;

        Model.findById(itemId).exec((err, doc) => {
            if (doc) {
                periodMentorPriceList.find({}).exec((errPriceList, docPriceList) => {
                    if (docPriceList) {
                        item.image = doc.image;
                        item.video = doc.video;
                        item.name = doc.name;
                        item.type = doc.type;
                        item.headers = doc.headers;
                        item.sessionCount = doc.sessionCount;
                        item.maxSessionCount = doc.maxSessionCount;
                        item.minSessionCount = doc.minSessionCount;
                        item.duration = doc.duration;
                        item.description = doc.description;
                        item.rate = doc.rate;
                        item.paymentCount = doc.paymentCount;
                        item.shareCount = doc.shareCount;
                        item.price = doc.price;
                        item.isPublished = doc.isPublished;
                        item.educationalFieldId = doc.educationalFieldId;
                        item.educationalStageId = doc.educationalStageId;
                        item.isActive = doc.isActive;
                        item.isDelete = doc.isDelete;
                        item._id = doc._id;
                        item.userId = doc.userId;
                        item.createdAt = doc.createdAt;
                        item.reason = doc.reason;
                        item.updatedAt = doc.updatedAt;
                        item.id = doc.id;
                        item.priceList = doc.PriceList;
                        item.walletBalance = walletBalance;

                        req.data.item = item;
                        response.ok(req, res, next);
                    }
                    else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                });

            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },
    PUT_CANCEL_ITEM: (req, res, next) => {
        var itemId = req.query.itemId;
        Model.findById(itemId, {
        }).exec((err, doc) => {
            if (doc) {
                var isPublished = doc.isPublished;
                if (isPublished != 'confirm') {
                    Model.findByIdAndUpdate(itemId, {
                        isPublished: 'draft'
                    }, {
                        new: true,
                        runValidators: true
                    }).exec((err2, doc2) => {
                        if (doc2) {

                            PeriodMentorMedia.updateMany(
                                { periodMentorId: itemId },
                                { $set: { "status": 'draft' } },
                                { upsert: true }
                            ).exec((err2, doc2) => {
                                req.data.item = doc2;
                                response.ok(req, res, next, 'با موفقیت انجام شد');
                            });


                        } else {
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

    },
    GET_PERIOD_COUNT_ITEM: (req, res, next) => {
        var confirmCount = 0;
        var draftCount = 0;
        var pendingCount = 0;
        var userId = req.data.personInfo._id;
        Model.find({ isPublished: 'confirm', userId: userId }).exec((errConfirm, docConfirm) => {
            // if (docConfirm) {
            confirmCount = docConfirm.length;
            Model.find({ isPublished: { $in: ['draft', 'reject'] }, userId: userId }).exec((errDraft, docDraft) => {
                // if (docDraft) {
                draftCount = docDraft.length;
                Model.find({ isPublished: 'pending', userId: userId }).exec((errPending, docPending) => {
                    // if (docPending) {
                    pendingCount = docPending.length;
                    console.log('confirmCount :: ', confirmCount);
                    console.log('draftCount :: ', draftCount);
                    console.log('pendingCount :: ', pendingCount);

                    req.data.confirmCount = confirmCount;
                    req.data.draftCount = draftCount;
                    req.data.pendingCount = pendingCount;
                    response.ok(req, res, next);
                    // }
                    // else {
                    //     response.error(req, res, next, 'اطلاعات یافت نشد');
                    // }
                });
                // }
                // else {
                //     response.error(req, res, next, 'اطلاعات یافت نشد');
                // }
            });
            // }
            // else {
            //     response.error(req, res, next, 'اطلاعات یافت نشد');
            // }
        });
    },
    PUT_COVER_ITEM: (req, res, next) => {
        var itemId = req.query.itemId;
        var image = req.body.image;
        Model.findById(itemId, {
        }).exec((err, doc) => {
            if (doc) {
                var isPublished = doc.isPublished;
                if (isPublished != 'confirm') {
                    Model.findByIdAndUpdate(itemId, {
                        isPublished: 'draft',
                        image: image
                    }, {
                        new: true,
                        runValidators: true
                    }).exec((err2, doc2) => {
                        if (doc2) {
                            req.data.item = doc2;
                            response.ok(req, res, next, 'با موفقیت انجام شد');
                        } else {
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

    },
    PUT_PREVIEW_ITEM: (req, res, next) => {
        var itemId = req.query.itemId;
        var video = req.body.video;
        Model.findById(itemId, {
        }).exec((err, doc) => {
            if (doc) {
                var isPublished = doc.isPublished;
                if (isPublished != 'confirm') {
                    Model.findByIdAndUpdate(itemId, {
                        isPublished: 'draft',
                        video: video
                    }, {
                        new: true,
                        runValidators: true
                    }).exec((err2, doc2) => {
                        if (doc2) {
                            req.data.item = doc2;
                            response.ok(req, res, next, 'با موفقیت انجام شد');
                        } else {
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

    },
    POST_ITEM: (req, res, next) => {
        var strClass = req.data.personInfo.class;
        if (strClass == 'mentor' || strClass == 'teacher' || strClass == 'support') {
            var userId = req.data.personInfo._id;
            var image = req.body.image;
            var video = req.body.video;
            var name = req.body.name;
            var educationalFieldId = req.body.educationalFieldId;
            var educationalStageId = req.body.educationalStageId;
            var type = strClass;
            var description = req.body.description;
            var userName = req.data.personInfo.firstName + ' ' + req.data.personInfo.lastName;
            if (strClass == 'mentor') {
                if (typeof image !== 'undefined' && typeof video !== 'undefined' && typeof name !== 'undefined' && typeof description !== 'undefined') {
                    var query = {
                        userId: userId,
                        image: image,
                        video: video,
                        name: name,
                        type: type,
                        userName: userName,
                        description: description,
                    };
                    // if (strClass == 'support') {

                    // }

                    req.body.type = strClass;
                    console.log('req.body :::', req.body);
                    new Model(query).save((err, doc) => {
                        if (doc) {
                            req.data.item = doc;
                            response.ok(req, res, next, 'دوره با موفقیت ثبت گردید');
                        } else {
                            response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                        }
                    });
                }
                else {
                    response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                }
            }
            else if (strClass == 'teacher') {
                if (typeof image !== 'undefined' && typeof video !== 'undefined' && typeof name !== 'undefined' && typeof description !== 'undefined' && typeof educationalStageId !== 'undefined' && typeof educationalFieldId !== 'undefined') {
                    var query = {
                        userId: userId,
                        image: image,
                        video: video,
                        name: name,
                        type: type,
                        educationalStageId: educationalStageId,
                        educationalFieldId: educationalFieldId,
                        description: description,
                        userName: userName,
                    };
                    // if (strClass == 'support') {

                    // }

                    req.body.type = strClass;
                    console.log('req.body :::', req.body);
                    new Model(query).save((err, doc) => {
                        if (doc) {
                            req.data.item = doc;
                            response.ok(req, res, next, 'دوره با موفقیت ثبت گردید');
                        } else {
                            response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                        }
                    });
                }
                else {
                    response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                }
            }
            else if (strClass == 'support') {
                var supportType = req.data.personInfo.supportType;
                var supportMentorId = req.data.personInfo.supportMentorId._id;
                if (supportType == 'mentor') {
                    if (typeof image !== 'undefined' && typeof video !== 'undefined' && typeof name !== 'undefined' && typeof description !== 'undefined') {
                        var query = {
                            userId: supportMentorId,
                            image: image,
                            video: video,
                            name: name,
                            type: type,
                            userName: userName,
                            description: description,
                        };
                        // if (strClass == 'support') {

                        // }

                        req.body.type = strClass;
                        console.log('req.body :::', req.body);
                        new Model(query).save((err, doc) => {
                            if (doc) {
                                req.data.item = doc;
                                response.ok(req, res, next, 'دوره با موفقیت ثبت گردید');
                            } else {
                                response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                            }
                        });
                    }
                    else {
                        response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                    }

                }
                else if (supportType == 'teacher') {
                    if (typeof image !== 'undefined' && typeof video !== 'undefined' && typeof name !== 'undefined' && typeof description !== 'undefined' && typeof educationalStageId !== 'undefined' && typeof educationalFieldId !== 'undefined') {
                        var query = {
                            userId: supportMentorId,
                            image: image,
                            video: video,
                            name: name,
                            type: type,
                            userName: userName,
                            educationalStageId: educationalStageId,
                            educationalFieldId: educationalFieldId,
                            description: description,
                        };
                        // if (strClass == 'support') {

                        // }

                        req.body.type = strClass;
                        console.log('req.body :::', req.body);
                        new Model(query).save((err, doc) => {
                            if (doc) {
                                req.data.item = doc;
                                response.ok(req, res, next, 'دوره با موفقیت ثبت گردید');
                            } else {
                                response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                            }
                        });
                    }
                    else {
                        response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                    }
                }
            }
        }
        else {
            response.error(req, res, next, 'برای ثبت دوره دسترسی ندارید');
        }
    },
    PUT_PERIOD_ITEM: (req, res, next) => {
        var strClass = req.data.personInfo.class;
        var userId = req.data.personInfo._id;
        var itemId = req.body.itemId;
        var image = req.body.image;
        var video = req.body.video;
        var name = req.body.name;
        var headers = req.body.headers;
        var educationalFieldId = req.body.educationalFieldId;
        var educationalStageId = req.body.educationalStageId;
        var type = strClass;
        var description = req.body.description;


        console.log('req.body  :::  ', req.body);




        if (strClass == 'mentor' || strClass == 'teacher' || strClass == 'support') {
            if (strClass == 'mentor') {

                Model.findById(itemId).exec((errPeriod, docPeriod) => {
                    if (docPeriod) {

                        console.log('docPeriod.userId.toString() ::', docPeriod.userId._id.toString());
                        console.log('userId.toString() ::', userId.toString());
                        if (docPeriod.userId._id.toString() == userId.toString()) {
                            if (typeof image !== 'undefined' && typeof video !== 'undefined' && typeof name !== 'undefined' && typeof description !== 'undefined') {
                                var query = {
                                    userId: userId,
                                    image: image,
                                    video: video,
                                    name: name,
                                    type: type,
                                    headers: headers,
                                    description: description,
                                };
                                // if (strClass == 'support') {

                                // }

                                req.body.type = strClass;
                                console.log('req.body :::', req.body);

                                Model.findByIdAndUpdate(itemId, query, {
                                    new: true,
                                    runValidators: true
                                }).exec((err, doc) => {
                                    if (doc) {
                                        req.data.item = doc;
                                        response.ok(req, res, next, 'دوره با موفقیت ثبت گردید');
                                    } else {
                                        response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                                    }
                                });
                            }
                            else {
                                response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                            }
                        }
                        else {
                            response.error(req, res, next, 'دسترسی ندارید');
                        }
                    } else {
                        response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                    }
                })



            }
            else if (strClass == 'teacher') {
                Model.findById(itemId).exec((errPeriod, docPeriod) => {
                    if (docPeriod) {
                        if (docPeriod.userId._id.toString() == userId.toString()) {
                            if (typeof image !== 'undefined' && typeof video !== 'undefined' && typeof name !== 'undefined' && typeof description !== 'undefined' && typeof educationalStageId !== 'undefined' && typeof educationalFieldId !== 'undefined') {
                                var query = {
                                    userId: userId,
                                    image: image,
                                    video: video,
                                    name: name,
                                    type: type,
                                    headers: headers,
                                    educationalStageId: educationalStageId,
                                    educationalFieldId: educationalFieldId,
                                    description: description,
                                };
                                // if (strClass == 'support') {

                                // }

                                req.body.type = strClass;
                                console.log('req.body :::', req.body);
                                Model.findByIdAndUpdate(itemId, query, {
                                    new: true,
                                    runValidators: true
                                }).exec((err, doc) => {
                                    if (doc) {
                                        req.data.item = doc;
                                        response.ok(req, res, next, 'دوره با موفقیت ثبت گردید');
                                    } else {
                                        response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                                    }
                                });
                            }
                            else {
                                response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                            }
                        }
                        else {
                            response.error(req, res, next, 'دسترسی ندارید');
                        }
                    }
                    else {
                        response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                    }
                });

            }
            else if (strClass == 'support') {
                var supportType = req.data.personInfo.supportType;
                var supportMentorId = req.data.personInfo.supportMentorId._id;
                if (supportType == 'mentor') {

                    Model.findById(itemId).exec((errPeriod, docPeriod) => {
                        if (docPeriod) {
                            if (docPeriod.userId._id.toString() == supportMentorId.toString()) {
                                if (typeof image !== 'undefined' && typeof video !== 'undefined' && typeof name !== 'undefined' && typeof description !== 'undefined') {
                                    var query = {
                                        userId: supportMentorId,
                                        image: image,
                                        video: video,
                                        name: name,
                                        type: type,
                                        headers: headers,
                                        description: description,
                                    };
                                    // if (strClass == 'support') {

                                    // }

                                    req.body.type = strClass;
                                    console.log('req.body :::', req.body);
                                    Model.findByIdAndUpdate(itemId, query, {
                                        new: true,
                                        runValidators: true
                                    }).exec((err, doc) => {
                                        if (doc) {
                                            req.data.item = doc;
                                            response.ok(req, res, next, 'دوره با موفقیت ثبت گردید');
                                        } else {
                                            response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                                        }
                                    });
                                }
                                else {
                                    response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                                }
                            }
                            else {
                                response.error(req, res, next, 'دسترسی ندارید');
                            }
                        }
                        else {
                            response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                        }
                    });
                }
                else if (supportType == 'teacher') {
                    Model.findById(itemId).exec((errPeriod, docPeriod) => {
                        if (docPeriod) {
                            if (docPeriod.userId._id.toString() == supportMentorId.toString()) {
                                if (typeof image !== 'undefined' && typeof video !== 'undefined' && typeof name !== 'undefined' && typeof description !== 'undefined' && typeof educationalStageId !== 'undefined' && typeof educationalFieldId !== 'undefined') {
                                    var query = {
                                        userId: supportMentorId,
                                        image: image,
                                        video: video,
                                        name: name,
                                        type: type,
                                        headers: headers,
                                        educationalStageId: educationalStageId,
                                        educationalFieldId: educationalFieldId,
                                        description: description,
                                    };
                                    // if (strClass == 'support') {

                                    // }

                                    req.body.type = strClass;
                                    console.log('req.body :::', req.body);
                                    Model.findByIdAndUpdate(itemId, query, {
                                        new: true,
                                        runValidators: true
                                    }).exec((err, doc) => {
                                        if (doc) {
                                            req.data.item = doc;
                                            response.ok(req, res, next, 'دوره با موفقیت ثبت گردید');
                                        } else {
                                            response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                                        }
                                    });
                                }
                                else {
                                    response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                                }
                            }
                            else {
                                response.error(req, res, next, 'دسترسی ندارید');
                            }
                        }
                        else {
                            response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                        }
                    });

                }
            }
        }
        else {
            response.error(req, res, next, 'برای ثبت دوره دسترسی ندارید');
        }
    },
    PUT_SHARE_PERIOD: (req, res, next) => {
        var itemId = req.query.itemId;
        Model.findById(itemId, {
        }).exec((err, doc) => {
            if (doc) {
                var shareCount = doc.shareCount;
                Model.findByIdAndUpdate(itemId, {
                    shareCount: (shareCount + 1)
                }, {
                    new: true,
                    runValidators: true
                }).exec((err2, doc2) => {
                    if (doc) {
                        response.ok(req, res, next, 'با موفقیت انجام شد');
                    } else {
                        response.error(req, res, next);
                    }
                });
            }
            else {
                response.error(req, res, next, 'اطلاعات یافت نشد');
            }
        });
    },
    GET_PERIOD_MENTOR: (req, res, next) => {
        var first = req.query.first;
        var is_published = req.query.is_published;

        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offsetApi;
        }

        if (typeof is_published === 'undefined') {
            is_published = ['draft', 'reject'];
        }
        else if (is_published == 'draft') {
            is_published = ['draft', 'reject'];
        }
        else if (is_published == 'pending') {
            is_published = ['pending'];
        }
        else if (is_published == 'confirm') {
            is_published = ['confirm'];
        }


        var userId = req.query.userId;
        var visitorId = req.data.personInfo._id;

        if (userId == visitorId.toString()) {
            console.log('userId :::::::::::::', userId);
            Model.find({
                userId: userId,
                isPublished: { $in: is_published },
                isDelete: false
            })

                .limit(offsetApi)
                .skip(first)
                .sort({ createdAt: -1 })
                .exec(function (err, docs) {
                    if (docs) {

                        if (docs.length > 0) {
                            var items = [];
                            PeriodMentorPayment.find({ 'userId': visitorId }).exec(function (err2, docs2) {
                                if (docs2) {
                                    docs.forEach(item => {
                                        var isPay = false;

                                        docs2.forEach(item2 => {

                                            console.log('item2.periodMentorId._id.toString() ::::', item2.periodMentorId._id.toString());
                                            if (item2.periodMentorId._id.toString() == item._id.toString()) {
                                                isPay = true;
                                            }
                                        });

                                        var headers = item.headers;
                                        if (typeof headers === 'undefined') {
                                            headers = " ";
                                        }
                                        items.push({
                                            'id': item._id.toString(),
                                            'userId': item.userId,
                                            'image': item.image,
                                            'video': item.video,
                                            'name': item.name,
                                            'headers': headers,
                                            'topic': item.topic,
                                            'grade': item.grade,
                                            'sessionCount': item.sessionCount,
                                            'duration': item.duration,
                                            'description': item.description,
                                            'rate': item.rate,
                                            'paymentCount': item.paymentCount,
                                            'price': item.price,
                                            'isActive': item.isActive,
                                            'isPublished': item.isPublished,
                                            'reason': item.reason,
                                            'educationalFieldId': item.educationalFieldId,
                                            'educationalStageId': item.educationalStageId,
                                            'isPay': isPay,
                                        });
                                    });


                                    req.data.items = items;
                                    response.ok(req, res, next);

                                }
                            });
                        }
                        else {
                            response.error(req, res, next, 'اطلاعات یافت نشد');
                        }
                    } else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                });
        }
        else {
            console.log('userId :::::::::::::', userId);
            Model.find({
                userId: userId,
                isPublished: { $in: is_published },
                isActive: true,
                isDelete: false
            })
                .limit(offsetApi)
                .skip(first)
                .exec(function (err, docs) {
                    if (docs) {
                        if (docs.length > 0) {
                            var items = [];


                            PeriodMentorPayment.find({ 'userId': visitorId }).exec(function (err2, docs2) {
                                if (docs2) {
                                    docs.forEach(item => {
                                        var isPay = false;

                                        docs2.forEach(item2 => {

                                            console.log('item2.periodMentorId._id.toString() ::::', item2.periodMentorId._id.toString());
                                            if (item2.periodMentorId._id.toString() == item._id.toString()) {
                                                isPay = true;
                                            }
                                        });

                                        var headers = item.headers;
                                        if (typeof headers === 'undefined') {
                                            headers = " ";
                                        }
                                        items.push({
                                            'id': item._id.toString(),
                                            'userId': item.userId,
                                            'image': item.image,
                                            'video': item.video,
                                            'name': item.name,
                                            'headers': headers,
                                            'topic': item.topic,
                                            'grade': item.grade,
                                            'sessionCount': item.sessionCount,
                                            'duration': item.duration,
                                            'description': item.description,
                                            'rate': item.rate,
                                            'paymentCount': item.paymentCount,
                                            'price': item.price,
                                            'isActive': item.isActive,
                                            'isPublished': item.isPublished,
                                            'reason': item.reason,
                                            'educationalFieldId': item.educationalFieldId,
                                            'educationalStageId': item.educationalStageId,
                                            'isPay': isPay,
                                        });
                                    });


                                    req.data.items = items;
                                    response.ok(req, res, next);

                                }
                            });
                        }
                        else {
                            response.error(req, res, next, 'اطلاعات یافت نشد');
                        }
                    } else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                });
        }

    },
    GET_PERIOD_USER: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offsetApi;
        }

        var userId = req.query.userId;
        var visitorId = req.data.personInfo._id;

        if (userId == visitorId.toString()) {
            console.log('userId :::::::::::::', userId);
            Model.find({
                userId: userId,
                isPublished: 'confirm',
                isDelete: false
            })
                .limit(offsetApi)
                .skip(first)
                .sort({ createdAt: -1 })
                .exec(function (err, docs) {
                    if (docs) {
                        if (docs.length > 0) {
                            var items = [];
                            PeriodMentorPayment.find({ 'userId': visitorId }).exec(function (err2, docs2) {
                                if (docs2) {
                                    docs.forEach(item => {
                                        var isPay = false;

                                        docs2.forEach(item2 => {

                                            console.log('item2.periodMentorId._id.toString() ::::', item2.periodMentorId._id.toString());
                                            if (item2.periodMentorId._id.toString() == item._id.toString()) {
                                                isPay = true;
                                            }
                                        });

                                        var headers = item.headers;
                                        if (typeof headers === 'undefined') {
                                            headers = " ";
                                        }

                                        items.push({
                                            'id': item._id.toString(),
                                            'userId': item.userId,
                                            'image': item.image,
                                            'video': item.video,
                                            'name': item.name,
                                            'headers': headers,
                                            'topic': item.topic,
                                            'grade': item.grade,
                                            'sessionCount': item.sessionCount,
                                            'duration': item.duration,
                                            'description': item.description,
                                            'rate': item.rate,
                                            'paymentCount': item.paymentCount,
                                            'price': item.price,
                                            'isActive': item.isActive,
                                            'isPublished': item.isPublished,
                                            'educationalFieldId': item.educationalFieldId,
                                            'educationalStageId': item.educationalStageId,
                                            'isPay': isPay,
                                        });
                                    });


                                    req.data.items = items;
                                    response.ok(req, res, next);

                                }
                            });
                        }
                        else {
                            response.error(req, res, next, 'اطلاعات یافت نشد');
                        }
                    } else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                });
        }
        else {
            console.log('userId :::::::::::::', userId);
            Model.find({
                userId: userId,
                isPublished: 'confirm',
                isActive: true,
                isDelete: false
            })
                .limit(offsetApi)
                .skip(first)
                .sort({ createdAt: -1 })
                .exec(function (err, docs) {
                    if (docs) {
                        if (docs.length > 0) {
                            var items = [];
                            PeriodMentorPayment.find({ 'userId': visitorId }).exec(function (err2, docs2) {
                                if (docs2) {
                                    docs.forEach(item => {
                                        var isPay = false;

                                        docs2.forEach(item2 => {
                                            console.log('item2.periodMentorId._id.toString() ::::', item2.periodMentorId._id.toString());
                                            if (item2.periodMentorId._id.toString() == item._id.toString()) {
                                                isPay = true;
                                            }
                                        });

                                        var headers = item.headers;
                                        if (typeof headers === 'undefined') {
                                            headers = " ";
                                        }

                                        items.push({
                                            'id': item._id.toString(),
                                            'userId': item.userId,
                                            'image': item.image,
                                            'video': item.video,
                                            'name': item.name,
                                            'headers': headers,
                                            'topic': item.topic,
                                            'grade': item.grade,
                                            'sessionCount': item.sessionCount,
                                            'duration': item.duration,
                                            'description': item.description,
                                            'rate': item.rate,
                                            'paymentCount': item.paymentCount,
                                            'price': item.price,
                                            'isActive': item.isActive,
                                            'isPublished': item.isPublished,
                                            'educationalFieldId': item.educationalFieldId,
                                            'educationalStageId': item.educationalStageId,
                                            'isPay': isPay,
                                        });
                                    });


                                    req.data.items = items;
                                    response.ok(req, res, next);

                                }
                            });
                        }
                        else {
                            response.error(req, res, next, 'اطلاعات یافت نشد');
                        }
                    } else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                });
        }

    },
    GET_PERIOD_MENTOR_BEST: (req, res, next) => {
        var first = req.query.first;
        var type = req.query.type;
        // var tag = req.query.tag;
        var search = req.query.search;
        var educationalFieldId = req.query.educationalFieldId;
        var educationalStageId = req.query.educationalStageId;
        var categoryId = req.query.categoryId;
        var userClass = req.query.userClass;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offsetApi;
        }


        if (typeof type === 'undefined') {
            type = 'mentor';
        }

        var filter = {};

        if (typeof search !== 'undefined' && search != null) {
            console.log('search ::: ', search);
            function escapeRegex(text) {
                return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            };
            const regex = new RegExp(escapeRegex(search), 'gi');
            // filter.name = regex;

            filter = {
                $or: [
                    { name: regex },
                    { userName: regex },
                ],
                $and: [
                    { type: type },
                    { isPublished: 'confirm' },
                    { isActive: true },
                    { isDelete: false }
                ]
            };
        }
        else {
            filter = {
                type: type,
                isPublished: 'confirm',
                isActive: true,
                isDelete: false,
            };
        }

        if (typeof educationalFieldId !== 'undefined' && educationalFieldId != null) {
            console.log('educationalFieldId ::: ', educationalFieldId);
            // filter.push({ $eq: ["$educationalFieldId", config.ObjectIdConvertor(educationalFieldId)] });

            filter.educationalFieldId = educationalFieldId;
        }
        if (typeof educationalStageId !== 'undefined' && educationalStageId != null) {
            console.log('educationalStageId ::: ', educationalStageId);
            // filter.push({ $eq: ["$educationalStageId", config.ObjectIdConvertor(educationalStageId)] });
            filter.educationalStageId = educationalStageId;
        }

        if (typeof categoryId !== 'undefined' && categoryId != null) {
            // filter.push({ $eq: ["$categoryId", config.ObjectIdConvertor(categoryId)] });
            filter.categoryId = categoryId;
        }



        console.log('filter :::: ', filter);

        Model
            .find(filter)
            .sort({ 'rate': -1, createdAt: -1 })
            .limit(offsetApi)
            .skip(first)
            .exec(function (err, docs) {
                if (docs) {
                    if (docs.length > 0) {
                        // var items = [];
                        // docs.forEach(item => {
                        //     if (item.periodMentorData) {
                        //         items.push(item.periodMentorData[0]);
                        //     }
                        // });

                        req.data.items = docs;
                        response.ok(req, res, next);
                    }
                    else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                } else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });

    },
    GET_PERIOD_MENTOR_POPULAR: (req, res, next) => {
        var first = req.query.first;
        var type = req.query.type;
        // var tag = req.query.tag;
        var search = req.query.search;
        var educationalFieldId = req.query.educationalFieldId;
        var educationalStageId = req.query.educationalStageId;
        var categoryId = req.query.categoryId;
        var userClass = req.query.userClass;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offsetApi;
        }


        if (typeof type === 'undefined') {
            type = 'mentor';
        }


        var filter = {};

        // if (typeof tag !== 'undefined') {
        //     function escapeRegex(text) {
        //         return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        //     };
        //     const regex = new RegExp(escapeRegex(tag), 'gi');
        //     // filter.push({ $eq: ["$tags", regex] });
        //     filter.tags = regex;
        // }

        if (typeof search !== 'undefined' && search != null) {
            console.log('search ::: ', search);
            function escapeRegex(text) {
                return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            };
            const regex = new RegExp(escapeRegex(search), 'gi');

            // filter.push({ $regexMatch: { input: "$name", regex: regex } })
            // filter.name = regex;

            filter = {
                $or: [
                    { name: regex },
                    { userName: regex },
                ],
                $and: [
                    { type: type },
                    { isPublished: 'confirm' },
                    { isActive: true },
                    { isDelete: false }
                ]
            };

        }
        else {
            filter = {
                type: type,
                isPublished: 'confirm',
                isActive: true,
                isDelete: false,
            };
        }

        if (typeof educationalFieldId !== 'undefined' && educationalFieldId != null) {
            console.log('educationalFieldId ::: ', educationalFieldId);
            // filter.push({ $eq: ["$educationalFieldId", config.ObjectIdConvertor(educationalFieldId)] });

            filter.educationalFieldId = educationalFieldId;
        }
        if (typeof educationalStageId !== 'undefined' && educationalStageId != null) {
            console.log('educationalStageId ::: ', educationalStageId);
            // filter.push({ $eq: ["$educationalStageId", config.ObjectIdConvertor(educationalStageId)] });
            filter.educationalStageId = educationalStageId;
        }

        if (typeof categoryId !== 'undefined' && categoryId != null) {
            // filter.push({ $eq: ["$categoryId", config.ObjectIdConvertor(categoryId)] });
            filter.categoryId = categoryId;
        }

        Model.find(filter)
            .sort({ 'paymentCount': -1,createdAt: -1 })
            .limit(offsetApi)
            .skip(first)
            .exec(function (err, docs) {
                if (docs) {
                    if (docs.length > 0) {
                        // var items = [];
                        // docs.forEach(item => {
                        //     if (item.periodMentorData) {
                        //         items.push(item.periodMentorData[0]);
                        //     }
                        // });

                        req.data.items = docs;
                        response.ok(req, res, next);
                    }
                    else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                } else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
    },
    GET_PERIOD_MENTOR_NEWEST: (req, res, next) => {
        var first = req.query.first;
        var type = req.query.type;
        // var tag = req.query.tag;
        var search = req.query.search;
        var educationalFieldId = req.query.educationalFieldId;
        var educationalStageId = req.query.educationalStageId;
        var categoryId = req.query.categoryId;
        var userClass = req.query.userClass;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offsetApi;
        }

        if (typeof type === 'undefined') {
            type = 'mentor';
        }





        var filter = {};

        // if (typeof tag !== 'undefined') {
        //     function escapeRegex(text) {
        //         return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        //     };
        //     const regex = new RegExp(escapeRegex(tag), 'gi');
        //     // filter.push({ $eq: ["$tags", regex] });
        //     filter.tags = regex;
        // }

        if (typeof search !== 'undefined' && search != null) {
            console.log('search ::: ', search);
            function escapeRegex(text) {
                return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            };
            const regex = new RegExp(escapeRegex(search), 'gi');
            // filter.push({ $regexMatch: { input: "$name", regex: regex } })
            // filter.name = regex;

            filter = {
                $or: [
                    { name: regex },
                    { userName: regex },
                ],
                $and: [
                    { type: type },
                    { isPublished: 'confirm' },
                    { isActive: true },
                    { isDelete: false }
                ]
            };

        }
        else {
            filter = {
                type: type,
                isPublished: 'confirm',
                isActive: true,
                isDelete: false,
            };

        }

        if (typeof educationalFieldId !== 'undefined' && educationalFieldId != null) {
            console.log('educationalFieldId ::: ', educationalFieldId);
            // filter.push({ $eq: ["$educationalFieldId", config.ObjectIdConvertor(educationalFieldId)] });

            filter.educationalFieldId = educationalFieldId;
        }
        if (typeof educationalStageId !== 'undefined' && educationalStageId != null) {
            console.log('educationalStageId ::: ', educationalStageId);
            // filter.push({ $eq: ["$educationalStageId", config.ObjectIdConvertor(educationalStageId)] });
            filter.educationalStageId = educationalStageId;
        }

        if (typeof categoryId !== 'undefined' && categoryId != null) {
            // filter.push({ $eq: ["$categoryId", config.ObjectIdConvertor(categoryId)] });
            filter.categoryId = categoryId;
        }


        // console.log(' filter  :   ', filter);


        Model.find(filter)
            .sort({ 'createdAt': -1 })
            .limit(offsetApi)
            .skip(first)
            .exec(function (err, docs) {
                if (docs) {
                    if (docs.length > 0) {
                        // var items = [];
                        // docs.forEach(item => {
                        //     if (item.periodMentorData) {
                        //         items.push(item.periodMentorData[0]);
                        //     }
                        // });

                        req.data.items = docs;
                        response.ok(req, res, next);
                    }
                    else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                } else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });

    },
    POST_PUBLISH: (req, res, next) => {
        var itemId = req.body.itemId;
        var price = req.body.price;
        var strClass = req.data.personInfo.class;




        // if(strClass=='support')
        // {
        //     userId = req.data.personInfo.supportMentorId._id;
        // }


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


        async function getList(docs) {
            var items = [];
            var is_published = true;
            var durationVideos = 0;
            var sessionCount = 0;

            for (const item of docs) {
                if (item.status == 'pending' || item.status == 'reject') {
                    // is_published = false;

                    var fileName = item.video;
                    sessionCount++;
                    var absolutePath = BASE_URL + 'uploads/period_media_video/';

                    var video = item.video.replace(BASE_URL, "public");
                    console.log('video ::: ', video);


                    if (fs.existsSync(video)) {
                        const duration = await computeDuration(item.video);
                        durationVideos += duration;
                    }


                }
                else {
                    var fileName = item.video;
                    sessionCount++;
                    var absolutePath = BASE_URL + 'uploads/period_media_video/';

                    var video = item.video.replace(BASE_URL, "public");
                    console.log('video ::: ', video);


                    if (fs.existsSync(video)) {
                        const duration = await computeDuration(item.video);
                        durationVideos += duration;
                    }
                }
            }

            if (durationVideos != 0) {
                durationVideos = durationVideos / 60;
                durationVideos = parseFloat(durationVideos).toFixed(0);
            }



            var minPrice = 0;
            var maxPrice = 0;

            periodMentorPriceList.find({
                // fromSesson: {
                //     $gte: sessionCount,

                // },
                // toSesson: {
                //     $lte: sessionCount,
                // }

            }).exec((err2, docs2) => {
                for (const item of docs2) {
                    if (item.toSesson != -1) {
                        if (durationVideos >= item.fromSesson && durationVideos <= item.toSesson) {
                            minPrice = item.minPrice;
                            maxPrice = item.maxPrice;
                            break;
                        }
                    }
                    else {
                        if (durationVideos >= item.fromSesson) {
                            minPrice = item.minPrice;
                            maxPrice = item.maxPrice;
                            break;
                        }
                    }
                    // console.log('itemmmmmmmmm ::::: ', item);
                }

                console.log('durationVideos ::', durationVideos);
                console.log('minPrice ::', minPrice);
                console.log('maxPrice ::', maxPrice);
                var isPriceValid = false;

                if (maxPrice != -1) {
                    if (parseInt(price) >= minPrice && parseInt(price) <= maxPrice) {
                        isPriceValid = true;
                    }
                }
                else {
                    if (parseInt(price) >= minPrice) {
                        isPriceValid = true;
                    }
                }


                if (is_published == true) {
                    if (isPriceValid == true) {
                        Model.findByIdAndUpdate(itemId, {
                            isPublished: 'pending',
                            duration: durationVideos,
                            price: price,
                            sessionCount: sessionCount,
                        }, {
                            new: true,
                            runValidators: true
                        }).exec((err, doc) => {
                            if (doc) {
                                PeriodMentorMedia.updateMany(
                                    { periodMentorId: itemId },
                                    { $set: { "status": 'pending' } },
                                    { upsert: true }
                                ).exec((err2, doc2) => {
                                    req.data.items = doc;
                                    response.ok(req, res, next);
                                });
                            } else {
                                response.error(req, res, next);
                            }
                        });
                    }
                    else {
                        response.error(req, res, next, 'E001 - مبلغ وارد شده صحیح نیست');
                    }
                }
                else {
                    response.error(req, res, next, 'جلسات دوره تایید نشده است');
                }
            });


            // req.data.items = items;
            // response.ok(req, res, next);
        }


        if (strClass == 'mentor' || strClass == 'teacher' || strClass == 'support') {
            Model.findById(itemId).exec((errPeriod, docPeriod) => {
                if (docPeriod) {
                    var minSessionCount = docPeriod.minSessionCount;
                    PeriodMentorMedia.find({
                        'periodMentorId': itemId
                    }).exec((err2, docs2) => {
                        if (docs2) {

                            var sessionCount = parseInt(docs2.length);
                            if (sessionCount >= minSessionCount) {
                                getList(docs2);
                            }
                            else {
                                response.error(req, res, next, 'حداقل تعداد جلسات دوره رعایت نشده است');
                            }

                        }
                    });

                }

            });
        }
    },

    POST_PUBLISH2: (req, res, next) => {
        var itemId = req.body.itemId;
        var price = req.body.price;
        var strClass = req.data.personInfo.class;
        if (strClass == 'mentor' || strClass == 'teacher' || strClass == 'support') {
            var userId = req.data.personInfo._id;
            var image = req.body.image;
            var video = req.body.video;
            var name = req.body.name;
            var educationalFieldId = req.body.educationalFieldId;
            var educationalStageId = req.body.educationalStageId;
            var type = strClass;
            var description = req.body.description;


            console.log('req.body    :: ', req.body);
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

            if (strClass == 'mentor') {
                if (typeof image !== 'undefined' && typeof video !== 'undefined' && typeof name !== 'undefined' && typeof description !== 'undefined') {
                    var minPrice = 0;
                    var maxPrice = 0;

                    async function getList(docs) {

                        var items = [];
                        var is_published = true;
                        var durationVideos = 0;
                        var sessionCount = 0;

                        for (const item of docs) {
                            if (item.status == 'pending' || item.status == 'reject') {
                                // is_published = false;

                                var fileName = item.video;
                                sessionCount++;
                                var absolutePath = BASE_URL + 'uploads/period_media_video/';

                                var video1 = item.video.replace(BASE_URL, "public");
                                console.log('video ::: ', video1);


                                if (fs.existsSync(video1)) {
                                    const duration = await computeDuration(item.video);
                                    durationVideos += duration;
                                }


                            }
                            else {
                                var fileName = item.video;
                                sessionCount++;
                                var absolutePath = BASE_URL + 'uploads/period_media_video/';

                                var video1 = item.video.replace(BASE_URL, "public");
                                console.log('video ::: ', video1);


                                if (fs.existsSync(video1)) {
                                    const duration = await computeDuration(item.video);
                                    durationVideos += duration;
                                }
                            }
                        }

                        if (durationVideos != 0) {
                            durationVideos = durationVideos / 60;
                            durationVideos = parseFloat(durationVideos).toFixed(0);
                        }


                        periodMentorPriceList.find({}).exec((err2, docs2) => {
                            for (const item of docs2) {
                                if (item.toSesson != -1) {
                                    if (durationVideos >= item.fromSesson && durationVideos <= item.toSesson) {
                                        minPrice = item.minPrice;
                                        maxPrice = item.maxPrice;
                                        break;
                                    }
                                }
                                else {
                                    if (durationVideos >= item.fromSesson) {
                                        minPrice = item.minPrice;
                                        maxPrice = item.maxPrice;
                                        break;
                                    }
                                }
                                // console.log('itemmmmmmmmm ::::: ', item);
                            }

                            console.log('durationVideos ::', durationVideos);
                            console.log('minPrice ::', minPrice);
                            console.log('maxPrice ::', maxPrice);
                            var isPriceValid = false;

                            if (maxPrice != -1) {
                                if (parseInt(price) >= minPrice && parseInt(price) <= maxPrice) {
                                    isPriceValid = true;
                                }
                            }
                            else {
                                if (parseInt(price) >= minPrice) {
                                    isPriceValid = true;
                                }
                            }


                            if (is_published == true) {
                                if (isPriceValid == true) {

                                    var query = {
                                        image: image,
                                        video: video,
                                        name: name,
                                        // type: type,
                                        description: description,
                                        isPublished: 'pending',
                                        duration: durationVideos,
                                        price: price,
                                        sessionCount: sessionCount,
                                    };

                                    console.log('query ::: ', query);



                                    Model.findByIdAndUpdate(itemId, query, {
                                        new: true,
                                        runValidators: true
                                    }).exec((err, doc) => {
                                        if (doc) {
                                            PeriodMentorMedia.updateMany(
                                                { periodMentorId: itemId },
                                                { $set: { "status": 'pending' } },
                                                { upsert: true }
                                            ).exec((err2, doc2) => {
                                                req.data.items = doc;
                                                response.ok(req, res, next);
                                            });
                                        } else {
                                            response.error(req, res, next);
                                        }
                                    });
                                }
                                else {
                                    response.error(req, res, next, 'E002 - مبلغ وارد شده صحیح نیست');
                                }
                            }
                            else {
                                response.error(req, res, next, 'جلسات دوره تایید نشده است');
                            }
                        });

                    }


                    Model.findById(itemId).exec((errPeriod, docPeriod) => {
                        if (docPeriod) {
                            var minSessionCount = docPeriod.minSessionCount;
                            PeriodMentorMedia.find({
                                'periodMentorId': itemId
                            }).exec((err2, docs2) => {
                                if (docs2) {

                                    var sessionCount = parseInt(docs2.length);
                                    if (sessionCount >= minSessionCount) {
                                        getList(docs2);
                                    }
                                    else {
                                        response.error(req, res, next, 'حداقل تعداد جلسات دوره رعایت نشده است');
                                    }

                                }
                            });

                        }

                    });




                    // new Model(query).save((err, doc) => {
                    //     if (doc) {
                    //         req.data.item = doc;
                    //         response.ok(req, res, next, 'دوره با موفقیت ثبت گردید');
                    //     } else {
                    //         response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                    //     }
                    // });
                }
                else {
                    response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                }
            }
            else if (strClass == 'teacher') {
                if (typeof image !== 'undefined' && typeof video !== 'undefined' && typeof name !== 'undefined' && typeof description !== 'undefined' && typeof educationalStageId !== 'undefined' && typeof educationalFieldId !== 'undefined') {

                    async function getList2(docs) {
                        var items = [];
                        var is_published = true;
                        var durationVideos = 0;
                        var sessionCount = 0;

                        for (const item of docs) {
                            if (item.status == 'pending' || item.status == 'reject') {
                                // is_published = false;

                                var fileName = item.video;
                                sessionCount++;
                                var absolutePath = BASE_URL + 'uploads/period_media_video/';

                                var video1 = item.video.replace(BASE_URL, "public");
                                console.log('video ::: ', video1);


                                if (fs.existsSync(video1)) {
                                    const duration = await computeDuration(item.video);
                                    durationVideos += duration;
                                }


                            }
                            else {
                                var fileName = item.video;
                                sessionCount++;
                                var absolutePath = BASE_URL + 'uploads/period_media_video/';

                                var video1 = item.video.replace(BASE_URL, "public");
                                console.log('video ::: ', video1);


                                if (fs.existsSync(video1)) {
                                    const duration = await computeDuration(item.video);
                                    durationVideos += duration;
                                }
                            }
                        }

                        if (durationVideos != 0) {
                            durationVideos = durationVideos / 60;
                            durationVideos = parseFloat(durationVideos).toFixed(0);
                        }

                        var minPrice = 0;
                        var maxPrice = 0;
                        periodMentorPriceList.find({}).exec((err2, docs2) => {
                            for (const item of docs2) {
                                if (item.toSesson != -1) {
                                    if (durationVideos >= item.fromSesson && durationVideos <= item.toSesson) {
                                        minPrice = item.minPrice;
                                        maxPrice = item.maxPrice;
                                        break;
                                    }
                                }
                                else {
                                    if (durationVideos >= item.fromSesson) {
                                        minPrice = item.minPrice;
                                        maxPrice = item.maxPrice;
                                        break;
                                    }
                                }
                                // console.log('itemmmmmmmmm ::::: ', item);
                            }

                            console.log('durationVideos ::', durationVideos);
                            console.log('minPrice ::', minPrice);
                            console.log('maxPrice ::', maxPrice);
                            var isPriceValid = false;

                            if (maxPrice != -1) {
                                if (parseInt(price) >= minPrice && parseInt(price) <= maxPrice) {
                                    isPriceValid = true;
                                }
                            }
                            else {
                                if (parseInt(price) >= minPrice) {
                                    isPriceValid = true;
                                }
                            }


                            if (is_published == true) {
                                if (isPriceValid == true) {
                                    var query = {
                                        image: image,
                                        video: video,
                                        name: name,
                                        // type: type,
                                        educationalStageId: educationalStageId,
                                        educationalFieldId: educationalFieldId,
                                        description: description,
                                        isPublished: 'pending',
                                        duration: durationVideos,
                                        price: price,
                                        sessionCount: sessionCount,
                                    };

                                    console.log('query ::: ', query);



                                    Model.findByIdAndUpdate(itemId, query, {
                                        new: true,
                                        runValidators: true
                                    }).exec((err, doc) => {
                                        if (doc) {
                                            PeriodMentorMedia.updateMany(
                                                { periodMentorId: itemId },
                                                { $set: { "status": 'pending' } },
                                                { upsert: true }
                                            ).exec((err2, doc2) => {
                                                req.data.items = doc;
                                                response.ok(req, res, next);
                                            });
                                        } else {
                                            response.error(req, res, next);
                                        }
                                    });
                                }
                                else {
                                    response.error(req, res, next, 'E003 - مبلغ وارد شده صحیح نیست');
                                }
                            }
                            else {
                                response.error(req, res, next, 'جلسات دوره تایید نشده است');
                            }
                        });
                    }


                    Model.findById(itemId).exec((errPeriod, docPeriod) => {
                        if (docPeriod) {
                            var minSessionCount = docPeriod.minSessionCount;
                            PeriodMentorMedia.find({
                                'periodMentorId': itemId
                            }).exec((err2, docs2) => {
                                if (docs2) {

                                    var sessionCount = parseInt(docs2.length);
                                    if (sessionCount >= minSessionCount) {
                                        getList2(docs2);
                                    }
                                    else {
                                        response.error(req, res, next, 'حداقل تعداد جلسات دوره رعایت نشده است');
                                    }

                                }
                            });

                        }

                    });

                }
                else {
                    response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                }
            }
            else if (strClass == 'support') {
                var supportType = req.data.personInfo.supportType;
                var supportMentorId = req.data.personInfo.supportMentorId._id;
                if (supportType == 'mentor') {
                    if (typeof image !== 'undefined' && typeof video !== 'undefined' && typeof name !== 'undefined' && typeof description !== 'undefined') {

                        async function getList3(docs) {
                            var items = [];
                            var is_published = true;
                            var durationVideos = 0;
                            var sessionCount = 0;

                            for (const item of docs) {
                                if (item.status == 'pending' || item.status == 'reject') {
                                    // is_published = false;

                                    var fileName = item.video;
                                    sessionCount++;
                                    var absolutePath = BASE_URL + 'uploads/period_media_video/';

                                    var video1 = item.video.replace(BASE_URL, "public");
                                    console.log('video ::: ', video1);


                                    if (fs.existsSync(video1)) {
                                        const duration = await computeDuration(item.video);
                                        durationVideos += duration;
                                    }


                                }
                                else {
                                    var fileName = item.video;
                                    sessionCount++;
                                    var absolutePath = BASE_URL + 'uploads/period_media_video/';

                                    var video1 = item.video.replace(BASE_URL, "public");
                                    console.log('video ::: ', video1);


                                    if (fs.existsSync(video1)) {
                                        const duration = await computeDuration(item.video);
                                        durationVideos += duration;
                                    }
                                }
                            }

                            if (durationVideos != 0) {
                                durationVideos = durationVideos / 60;
                                durationVideos = parseFloat(durationVideos).toFixed(0);
                            }

                            var minPrice = 0;
                            var maxPrice = 0;
                            periodMentorPriceList.find({}).exec((err2, docs2) => {
                                for (const item of docs2) {
                                    if (item.toSesson != -1) {
                                        if (durationVideos >= item.fromSesson && durationVideos <= item.toSesson) {
                                            minPrice = item.minPrice;
                                            maxPrice = item.maxPrice;
                                            break;
                                        }
                                    }
                                    else {
                                        if (durationVideos >= item.fromSesson) {
                                            minPrice = item.minPrice;
                                            maxPrice = item.maxPrice;
                                            break;
                                        }
                                    }
                                    // console.log('itemmmmmmmmm ::::: ', item);
                                }

                                console.log('durationVideos ::', durationVideos);
                                console.log('minPrice ::', minPrice);
                                console.log('maxPrice ::', maxPrice);
                                var isPriceValid = false;

                                if (maxPrice != -1) {
                                    if (parseInt(price) >= minPrice && parseInt(price) <= maxPrice) {
                                        isPriceValid = true;
                                    }
                                }
                                else {
                                    if (parseInt(price) >= minPrice) {
                                        isPriceValid = true;
                                    }
                                }


                                if (is_published == true) {
                                    if (isPriceValid == true) {

                                        var query = {
                                            image: image,
                                            video: video,
                                            name: name,
                                            // type: type,
                                            description: description,
                                            isPublished: 'pending',
                                            duration: durationVideos,
                                            price: price,
                                            sessionCount: sessionCount,
                                        };

                                        console.log('query ::: ', query);


                                        Model.findByIdAndUpdate(itemId, query, {
                                            new: true,
                                            runValidators: true
                                        }).exec((err, doc) => {
                                            if (doc) {
                                                PeriodMentorMedia.updateMany(
                                                    { periodMentorId: itemId },
                                                    { $set: { "status": 'pending' } },
                                                    { upsert: true }
                                                ).exec((err2, doc2) => {
                                                    req.data.items = doc;
                                                    response.ok(req, res, next);
                                                });
                                            } else {
                                                response.error(req, res, next);
                                            }
                                        });
                                    }
                                    else {
                                        response.error(req, res, next, 'E004 - مبلغ وارد شده صحیح نیست');
                                    }
                                }
                                else {
                                    response.error(req, res, next, 'جلسات دوره تایید نشده است');
                                }
                            });
                        }


                        Model.findById(itemId).exec((errPeriod, docPeriod) => {
                            if (docPeriod) {
                                var minSessionCount = docPeriod.minSessionCount;
                                PeriodMentorMedia.find({
                                    'periodMentorId': itemId
                                }).exec((err2, docs2) => {
                                    if (docs2) {

                                        var sessionCount = parseInt(docs2.length);
                                        if (sessionCount >= minSessionCount) {
                                            getList3(docs2);
                                        }
                                        else {
                                            response.error(req, res, next, 'حداقل تعداد جلسات دوره رعایت نشده است');
                                        }

                                    }
                                });

                            }

                        });

                        // req.body.type = strClass;
                        // console.log('req.body :::', req.body);

                    }
                    else {
                        response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                    }

                }
                else if (supportType == 'teacher') {
                    if (typeof image !== 'undefined' && typeof video !== 'undefined' && typeof name !== 'undefined' && typeof description !== 'undefined' && typeof educationalStageId !== 'undefined' && typeof educationalFieldId !== 'undefined') {
                        async function getList4(docs) {
                            var items = [];
                            var is_published = true;
                            var durationVideos = 0;
                            var sessionCount = 0;

                            for (const item of docs) {
                                if (item.status == 'pending' || item.status == 'reject') {
                                    // is_published = false;

                                    var fileName = item.video;
                                    sessionCount++;
                                    var absolutePath = BASE_URL + 'uploads/period_media_video/';

                                    var video1 = item.video.replace(BASE_URL, "public");
                                    console.log('video ::: ', video1);


                                    if (fs.existsSync(video1)) {
                                        const duration = await computeDuration(item.video);
                                        durationVideos += duration;
                                    }


                                }
                                else {
                                    var fileName = item.video;
                                    sessionCount++;
                                    var absolutePath = BASE_URL + 'uploads/period_media_video/';

                                    var video1 = item.video.replace(BASE_URL, "public");
                                    console.log('video ::: ', video1);


                                    if (fs.existsSync(video1)) {
                                        const duration = await computeDuration(item.video);
                                        durationVideos += duration;
                                    }
                                }
                            }

                            if (durationVideos != 0) {
                                durationVideos = durationVideos / 60;
                                durationVideos = parseFloat(durationVideos).toFixed(0);
                            }
                            var minPrice = 0;
                            var maxPrice = 0;

                            periodMentorPriceList.find({}).exec((err2, docs2) => {
                                for (const item of docs2) {
                                    if (item.toSesson != -1) {
                                        if (durationVideos >= item.fromSesson && durationVideos <= item.toSesson) {
                                            minPrice = item.minPrice;
                                            maxPrice = item.maxPrice;
                                            break;
                                        }
                                    }
                                    else {
                                        if (durationVideos >= item.fromSesson) {
                                            minPrice = item.minPrice;
                                            maxPrice = item.maxPrice;
                                            break;
                                        }
                                    }
                                    // console.log('itemmmmmmmmm ::::: ', item);
                                }

                                console.log('durationVideos ::', durationVideos);
                                console.log('minPrice ::', minPrice);
                                console.log('maxPrice ::', maxPrice);
                                var isPriceValid = false;

                                if (maxPrice != -1) {
                                    if (parseInt(price) >= minPrice && parseInt(price) <= maxPrice) {
                                        isPriceValid = true;
                                    }
                                }
                                else {
                                    if (parseInt(price) >= minPrice) {
                                        isPriceValid = true;
                                    }
                                }


                                if (is_published == true) {
                                    if (isPriceValid == true) {

                                        var query = {
                                            image: image,
                                            video: video,
                                            name: name,
                                            // type: type,
                                            educationalStageId: educationalStageId,
                                            educationalFieldId: educationalFieldId,
                                            description: description,
                                            isPublished: 'pending',
                                            duration: durationVideos,
                                            price: price,
                                            sessionCount: sessionCount,
                                        };


                                        console.log('query ::: ', query);

                                        Model.findByIdAndUpdate(itemId, query, {
                                            new: true,
                                            runValidators: true
                                        }).exec((err, doc) => {
                                            if (doc) {
                                                PeriodMentorMedia.updateMany(
                                                    { periodMentorId: itemId },
                                                    { $set: { "status": 'pending' } },
                                                    { upsert: true }
                                                ).exec((err2, doc2) => {
                                                    req.data.items = doc;
                                                    response.ok(req, res, next);
                                                });
                                            } else {
                                                response.error(req, res, next);
                                            }
                                        });
                                    }
                                    else {
                                        response.error(req, res, next, 'مبلغ وارد شده صحیح نیست');
                                    }
                                }
                                else {
                                    response.error(req, res, next, 'جلسات دوره تایید نشده است');
                                }
                            });

                        }


                        Model.findById(itemId).exec((errPeriod, docPeriod) => {
                            if (docPeriod) {
                                var minSessionCount = docPeriod.minSessionCount;
                                PeriodMentorMedia.find({
                                    'periodMentorId': itemId
                                }).exec((err2, docs2) => {
                                    if (docs2) {

                                        var sessionCount = parseInt(docs2.length);
                                        if (sessionCount >= minSessionCount) {
                                            getList4(docs2);
                                        }
                                        else {
                                            response.error(req, res, next, 'حداقل تعداد جلسات دوره رعایت نشده است');
                                        }

                                    }
                                });

                            }

                        });
                    }
                    else {
                        response.error(req, res, next, 'مشکل در ثبت اطلاعات');
                    }
                }
            }
        }
        else {
            response.error(req, res, next, 'برای ثبت دوره دسترسی ندارید');
        }




        // function getVideoDuration(fileName) {
        //     return new Promise((resolve) => {
        //         getVideoDurationInSeconds(fileName).then((duration) => {
        //             console.log('duration :', duration);
        //             resolve(duration);
        //         });
        //     });
        // }

        // async function f1(fileName) {
        //     const duration = await getVideoDuration(fileName);
        //     console.log('duration :: ', duration);
        //     return duration;

        // }
        // async function computeDuration(itemId) {
        //     return await f1(itemId);
        // }


        // async function getList(docs) {
        //     var items = [];
        //     var is_published = true;
        //     var durationVideos = 0;
        //     var sessionCount = 0;

        //     for (const item of docs) {
        //         if (item.status == 'pending' || item.status == 'reject') {
        //             // is_published = false;

        //             var fileName = item.video;
        //             sessionCount++;
        //             var absolutePath = BASE_URL + 'uploads/period_media_video/';

        //             var video = item.video.replace(BASE_URL, "public");
        //             console.log('video ::: ', video);


        //             if (fs.existsSync(video)) {
        //                 const duration = await computeDuration(item.video);
        //                 durationVideos += duration;
        //             }


        //         }
        //         else {
        //             var fileName = item.video;
        //             sessionCount++;
        //             var absolutePath = BASE_URL + 'uploads/period_media_video/';

        //             var video = item.video.replace(BASE_URL, "public");
        //             console.log('video ::: ', video);


        //             if (fs.existsSync(video)) {
        //                 const duration = await computeDuration(item.video);
        //                 durationVideos += duration;
        //             }
        //         }
        //     }

        //     if (durationVideos != 0) {
        //         durationVideos = durationVideos / 60;
        //         durationVideos = parseFloat(durationVideos).toFixed(0);
        //     }





        //     // req.data.items = items;
        //     // response.ok(req, res, next);
        // }


        // if (strClass == 'mentor' || strClass == 'teacher' || strClass == 'support') {
        //     Model.findById(itemId).exec((errPeriod, docPeriod) => {
        //         if (docPeriod) {
        //             var minSessionCount = docPeriod.minSessionCount;
        //             PeriodMentorMedia.find({
        //                 'periodMentorId': itemId
        //             }).exec((err2, docs2) => {
        //                 if (docs2) {
        //                     var sessionCount = parseInt(docs2.length);
        //                     if (sessionCount >= minSessionCount) {
        //                         getList(docs2);
        //                     }
        //                     else {
        //                         response.error(req, res, next, 'حداقل تعداد جلسات دوره رعایت نشده است');
        //                     }

        //                 }
        //             });

        //         }

        //     });
        // }
    },
    DELETE_ITEM: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }

        var itemId = req.query.itemId;
        Model.findById(itemId).exec((err, doc) => {
            if (err) {
                response.error(req, res, next);
            } else {
                if (doc) {
                    if (doc.userId._id.toString() == userId.toString()) {
                        var query = {
                            'periodMentorId': itemId,
                        };

                        PeriodMentorMedia.findOneAndDelete(query).exec();
                        query = {
                            '_id': itemId,
                        };
                        Model.findOneAndDelete(query).exec((err, doc) => {
                            if (err) {
                                response.error(req, res, next);
                            } else {
                                response.ok(req, res, next);
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
    PUT_ITEM_PERIOD_MENTOR: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }

        var itemId = req.body.itemId;
        Model.findById(itemId).exec((err, doc) => {
            if (err) {
                response.error(req, res, next);
            } else {
                if (doc) {
                    if (doc.userId._id.toString() == userId) {
                        Model.findByIdAndUpdate(itemId, req.body, {
                            new: true,
                            runValidators: true
                        }).exec((err, doc) => {
                            if (doc) {
                                response.ok(req, res, next);
                            } else {
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
    GET_PERIOD_MENTOR_ITEM: (req, res, next) => {
        var itemId = req.params.itemId;
        Model.findById(itemId).exec((err, doc) => {
            if (err) {
                response.error(req, res, next);
            } else {
                if (doc) {
                    res.render('periodMentor', { data: doc });
                } else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            }
        });

    },

};