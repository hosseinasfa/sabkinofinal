const Model = require("../../model/mentorPackageList");
const onlineCallMentor = require("../../model/onlineCallMentor");
const SetProgramPayment = require("../../model/setProgramPayment");
const response = require("../../response");
var config = require('../../config');
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
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
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
    POST_ITEM_CUSTOM: (req, res, next) => {
        var duration = req.body.duration;
        var channel = req.body.channel;
        var callCount = req.body.callCount;
        var setProgram = req.body.setProgram;
        var getReport = req.body.getReport;
        var mentorId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var name = req.body.name;
        var price = req.body.price;
        var callId = null;

        if (strClass == 'mentor') {
            Model.find({ name: name }).exec((errMentorPackage, docMentorPackage) => {
                if (docMentorPackage) {
                    if (docMentorPackage.length == 0) {
                        onlineCallMentor.find({
                            'duration': duration,
                            'channel': channel,
                            'callCount': callCount,
                        }).exec((err, docs) => {
                            console.log('aaaaaaaaaaaaaaaaaaaaaaaa' , callCount)
                            callId = docs[0]._id.toString();

                            var query = {
                                "duration": duration,
                                "channel": channel,
                                "setProgram": setProgram,
                                "getReport": getReport,
                                "mentorId": mentorId,
                                "name": name,
                                "callId": callId,
                                "price": price
                            };


                            new Model(query).save((err, doc) => {
                                if (doc) {

                                    var packageItem = [];
                                    var strDuration = "";
                                    if (duration == 1) {
                                        strDuration = 'یک ماهه'
                                    } else if (duration == 3) {
                                        strDuration = 'سه ماهه';
                                    } else if (duration == 6) {
                                        strDuration = 'شش ماهه';
                                    } else if (duration == 12) {
                                        strDuration = 'یک ساله';
                                    }

                                    var strChannel = "";
                                    if (channel == true) {
                                        strChannel = 'دارد';
                                    } else {
                                        strChannel = 'ندارد';
                                    }

                                    var strSetProgram = '';
                                    if (setProgram == 1) {
                                        strSetProgram = 'روزانه';
                                    } else if (setProgram == 2) {
                                        strSetProgram = 'هفتگی';
                                    } else if (setProgram == 3) {
                                        strSetProgram = 'دو هفته ای';
                                    } else if (setProgram == 4) {
                                        strSetProgram = 'ماهیانه';
                                    }

                                    var strGetReport = '';
                                    if (getReport == 1) {
                                        strGetReport = 'روزانه';
                                    } else if (getReport == 2) {
                                        strGetReport = 'هفتگی';
                                    } else if (getReport == 3) {
                                        strGetReport = 'دو هفته ای';
                                    } else if (getReport == 4) {
                                        strGetReport = 'ماهیانه';
                                    }

					var callCount = "0";

                    			if (doc.callId != null) {
                    		    callCount = doc.callId.callCount.toString();
                   			 }

                                    packageItem.push({
                                        id: doc._id,
                                        mentorId: doc.mentorId._id,
                                        callCount: callCount,
                                        duration: strDuration,
                                        channel: strChannel,
                                        setProgram: strSetProgram,
                                        getReport: strGetReport,
                                        price: doc.price,
                                        name: doc.name,
                                        isActive: doc.isActive,
                                        isDelete: doc.isDelete,
                                    });

                                    req.data.doc = packageItem;
                                    response.ok(req, res, next);
                                } else {
                                    response.error(req, res, next);
                                }
                            })

                        });
                    }
                    else {
                        response.error(req, res, next, 'عنوان بسته تکراری است');
                    }
                }
                else {
                    response.error(req, res, next);
                }
            });

        } else {
            response.error(req, res, next, 'متاسفانه دسترسی به ثبت پکیج ندارید');
        }
    },
    DELETE_PACKAGE: (req, res, next) => {
        var itemId = req.query.itemId;
        var mentorId = req.data.personInfo._id;
        console.log('itemId ::::::::', itemId);
        Model.findById(itemId).exec(function (err, doc) {
            if (err) {
                response.error(req, res, next);
            } else {
                if (doc) {
                    if (doc.mentorId._id.toString() == mentorId.toString()) {
                        SetProgramPayment.find({ 'mentorPackageId': itemId }).exec(function (err2, docs) {
                            if (docs) {
                                console.log('docs.length ::::', docs.length);
                                if (docs.length == 0) {
                                    var query = {
                                        '_id': itemId,
                                    };

                                    Model.findOneAndDelete(query).exec(() => {
                                        response.ok(req, res, next);
                                    });
                                } else {
                                    response.error(req, res, next, 'نمیتوانید حذف کنید بسته قبلا خریداری شده');
                                }
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
    },
    GET_PACKAGE_ITEM: (req, res, next) => {
        // var mentorId = req.data.personInfo._id.toString();
        var mentorId = req.query.mentorId;
        // var strClass = req.data.personInfo.class;

        // if (strClass == 'mentor') {
        Model.find({
            'mentorId': mentorId,
            'isActive': true,
            'isDelete': false
        }).exec(function (err, docs) {
            if (docs) {
                var packageItem = [];
                docs.forEach(item => {
                    var strDuration = "";
                    if (item.duration == 1) {
                        strDuration = 'یک ماهه'
                    } else if (item.duration == 3) {
                        strDuration = 'سه ماهه';
                    } else if (item.duration == 6) {
                        strDuration = 'شش ماهه';
                    } else if (item.duration == 12) {
                        strDuration = 'یکساله';
                    }

                    var strChannel = "";
                    if (item.channel == true) {
                        strChannel = 'دارد';
                    } else if (item.channel == false) {
                        strChannel = 'ندارد';
                    }

                    var strSetProgram = '';
                    if (item.setProgram == 1) {
                        strSetProgram = 'روزانه';
                    } else if (item.setProgram == 2) {
                        strSetProgram = 'هفتگی';
                    } else if (item.setProgram == 3) {
                        strSetProgram = 'دو هفته ای';
                    } else if (item.setProgram == 4) {
                        strSetProgram = 'ماهیانه';
                    }

                    var strGetReport = '';
                    if (item.getReport == 1) {
                        strGetReport = 'روزانه';
                    } else if (item.getReport == 2) {
                        strGetReport = 'هفتگی';
                    } else if (item.getReport == 3) {
                        strGetReport = 'دو هفته ای';
                    } else if (item.getReport == 4) {
                        strGetReport = 'ماهیانه';
                    }

                    var callCount = "0";

                    if (item.callId != null) {
                        callCount = item.callId.callCount.toString();
                    }
                    packageItem.push({
                        id: item._id,
                        mentorId: item.mentorId._id,
                        callCount: callCount,
                        duration: strDuration,
                        channel: strChannel,
                        setProgram: strSetProgram,
                        getReport: strGetReport,
                        price: item.price,
                        name: item.name,
                        isActive: item.isActive,
                        isDelete: item.isDelete,
                    });
                });

                req.data.item = packageItem;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }

        });
        // }
        // else {
        //     response.error(req, res, next, 'دسترسی ندارید');
        // }

    },

};