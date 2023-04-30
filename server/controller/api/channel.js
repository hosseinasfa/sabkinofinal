const Channel = require("../../model/channel");
const ChannelContent = require("../../model/channelContent");
const response = require("../../response");
const Category = require("../../model/category");
var config = require('../../config');
const Mentor = require('../../model/person').Mentor;
const Person = require('../../model/person').Person;
const PersonUser = require('../../model/person').User;
const MalisonList = require('../../model/malisonList');
var FCM = require('fcm-node');
const SERVER_KEY = process.env.SERVER_KEY;
var offset = parseInt(process.env.ROW_NUMBER);
const fetch = require("node-fetch");

var moment = require('moment');
var mongoose = require('mongoose');
const { Console } = require("console");

function subscribeTokenToTopic(token, topic) {
    fetch('https://iid.googleapis.com/iid/v1/' + token + '/rel/topics/' + topic, {
        method: 'POST',
        headers: {
            'Authorization': 'key=' + SERVER_KEY
        }
    }).then(response => {
        if (response.status < 200 || response.status >= 400) {
            throw 'Error subscribing to topic: ' + response.status + ' - ' + response.text();
        }
        console.log('Subscribed to "' + topic + '"');
    }).catch(error => {
        console.error(error);
    })
}


module.exports = {

    GET_ALL_CHANNEL: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        Channel.find({
            isActive: true,
            isDelete: false
        })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    res.send(docs)
                } else {
                    res.send(err)
                }
            })
    },

    SEARCH_TEXT: (req, res, next) => {
        const chanelId = req.data.personInfo.channelId

        // var MentorId = req.data.personInfo._id;
        function escapeRegex(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        };

        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        ChannelContent.find({
            "channelId": chanelId,
            "text": regex,
            "isActive": true,
            "isDelete": false
        })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    res.send(docs)
                } else {
                    res.send(err)
                }
            })
    },

    GET_ALL_POSTS: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        ChannelContent.find({
            isActive: true,
            isDelete: false
        })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    res.send(docs)
                } else {
                    res.send(err)
                }
            })
    },

    GET_ALL_POST: (req, res, next) => {
        var first = req.params.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        var Class = req.data.personInfo.class;

        if (Class === 'mentor') {

            var MentorId = req.data.personInfo._id;
            var ChannelId = req.data.personInfo.channelId;
            ChannelContent.find({
                mentorId: MentorId,
                channelId: ChannelId,
                isActive: true,
                isDelete: false
            })
                .sort({ 'createdAt': 1 })
                .limit(offset)
                .skip(first)
                .exec((err, docs) => {
                    if (docs) {
                        res.send(docs)
                    } else {
                        res.send(err)
                    }
                })
        }
        else if (Class === 'support') {
            var MentorId = req.data.personInfo.supportMentorId._id;
            var ChannelId = req.data.personInfo.supportMentorId.channelId._id;
            ChannelContent.find({
                mentorId: MentorId,
                channelId: ChannelId,
                isActive: true,
                isDelete: false
            })
                .sort({ 'createdAt': 1 })
                .limit(offset)
                .skip(first)
                .exec((err, docs) => {
                    if (docs) {
                        res.send(docs)
                    } else {
                        res.send(err)
                    }
                })
        }
        else {
            var ChannelId = req.data.personInfo.channelId._id;
            ChannelContent.find({
                channelId: ChannelId,
                isActive: true,
                isDelete: false
            })
                .sort({ 'createdAt': 1 })
                .limit(offset)
                .skip(first)
                .exec((err, docs) => {
                    if (docs) {
                        res.send(docs)
                    } else {
                        res.send(err)
                    }
                })
        }

    },

    POST_NEW_CHANNEL: (req, res, next) => {
        var MentorId = req.data.personInfo._id.toString();
        var strClass = req.data.personInfo.class;
        if (strClass == 'mentor') {

            // console.log('MentorId :::', MentorId);
            if (typeof req.data.personInfo.channelId == 'undefined' || req.data.personInfo.channelId === null) {
                new Channel({
                    mentorId: MentorId,
                    channelName: `${req.data.personInfo.firstName} ' ' ${req.data.personInfo.firstName}}`,
                    channelAvatar: req.data.personInfo.avatar,
                }).save((err, doc) => {
                    if (doc) {
                        Mentor.findByIdAndUpdate(MentorId, {
                            channelId: doc._id
                        }, {
                            new: true,
                            runValidators: true
                        }).exec((err3, doc3) => {
                            if (doc3) {

                                res.json({
                                    channelId: doc3.channelId,
                                    mentorId: doc.mentorId._id.toString(),
                                    channelName: doc.channelName,
                                    channelAvatar: req.data.personInfo.avatar,
                                    message: "کانال با موفقیت ساخته شد",
                                })

                            } else {
                                response.error(req, res, next, 'اطلاعات یافت نشد');
                                console.log(err3)
                            }
                        })
                    } else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }

                })
            } else {


                var channelName = req.data.personInfo.firstName + ' ' + req.data.personInfo.lastName;
                var channelId = {
                    "status": req.data.personInfo.channelId.status,
                    "isActive": req.data.personInfo.channelId.isActive,
                    "isDelete": req.data.personInfo.channelId.isDelete,
                    "_id": req.data.personInfo.channelId._id,
                    "mentorId": MentorId,
                    "channelName": channelName,
                    "channelAvatar": req.data.personInfo.avatar,
                    "createdAt": req.data.personInfo.channelId.createdAt,
                    "updatedAt": req.data.personInfo.channelId.updatedAt,
                    "id": req.data.personInfo.channelId._id.toString()
                }
                res.json({
                    channelId: channelId,
                    message: "کانال برای مشاور قبلا ایجاد شده است"
                })
            }

        }
        else if (strClass == 'support') {
            var MentorId = req.data.personInfo.supportMentorId._id.toString();
            // console.log('supportMentorId :::', MentorId);
            // console.log('req.data.personInfo.supportMentorId.channelId :::', req.data.personInfo.supportMentorId.channelId);
            if (typeof req.data.personInfo.supportMentorId.channelId == 'undefined' || req.data.personInfo.supportMentorId.channelId === null) {
                new Channel({
                    mentorId: MentorId,
                    channelName: `${req.data.personInfo.supportMentorId.firstName} ' ' ${req.data.personInfo.supportMentorId.firstName}}`,
                    channelAvatar: req.data.personInfo.supportMentorId.avatar,
                }).save((err, doc) => {
                    if (doc) {
                        Mentor.findByIdAndUpdate(MentorId, {
                            channelId: doc._id
                        }, {
                            new: true,
                            runValidators: true
                        }).exec((err3, doc3) => {
                            if (doc3) {

                                res.json({
                                    channelId: doc3.channelId,
                                    mentorId: doc.mentorId._id.toString(),
                                    channelName: doc.channelName,
                                    channelAvatar: req.data.personInfo.avatar,
                                    message: "کانال با موفقیت ساخته شد",
                                })

                            } else {
                                response.error(req, res, next, 'اطلاعات یافت نشد');
                                console.log(err3)
                            }
                        })
                    } else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }

                })
            } else {


                var channelName = req.data.personInfo.supportMentorId.firstName + ' ' + req.data.personInfo.supportMentorId.lastName;
                var channelId = {
                    "status": req.data.personInfo.supportMentorId.channelId.status,
                    "isActive": req.data.personInfo.supportMentorId.channelId.isActive,
                    "isDelete": req.data.personInfo.supportMentorId.channelId.isDelete,
                    "_id": req.data.personInfo.supportMentorId.channelId._id,
                    "mentorId": MentorId,
                    "channelName": channelName,
                    "channelAvatar": req.data.personInfo.supportMentorId.avatar,
                    "createdAt": req.data.personInfo.supportMentorId.channelId.createdAt,
                    "updatedAt": req.data.personInfo.supportMentorId.channelId.updatedAt,
                    "id": req.data.personInfo.supportMentorId.channelId._id.toString()
                }
                res.json({
                    channelId: channelId,
                    message: "کانال برای مشاور قبلا ایجاد شده است"
                })
            }
        }
        else {
            response.error(req, res, next, 'اطلاعات یافت نشد');
        }
    },


    NEW_POST: (req, res, next) => {

        var MentorId = req.data.personInfo._id;
        var chId = "";
        var FirstName = "";
        var strClass = req.data.personInfo.class;
        console.log('strClass ::::: ',strClass);
        if (strClass == 'support') {
            MentorId = req.data.personInfo.supportMentorId._id;
            chId = req.data.personInfo.supportMentorId.channelId._id;
            FirstName = req.data.personInfo.supportMentorId.firstName;
            AVatar = req.data.personInfo.supportMentorId.avatar;

            console.log('MentorId ::::: ',MentorId);
            console.log('chId ::::: ',chId);
            console.log('FirstName ::::: ',FirstName);
            console.log('AVatar ::::: ',AVatar);
        }
        else if (strClass == 'mentor') 
        {
            chId = req.data.personInfo.channelId._id;
            FirstName = req.data.personInfo.firstName;
            AVatar = req.data.personInfo.avatar;
        }

        function escapeRegex(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        };

        const regex = new RegExp(escapeRegex(req.body.text), 'gi');
        if (strClass == 'mentor' || strClass == 'support') {
            MalisonList.find({ text: regex }).exec((err1, docs1) => {

                if (docs1.length > 0 && docs1.length < 250) {
                    res.json({
                        message: "پست به دلیل استفاده از کلمات رکیک ایجاد نشد"
                    })
                } else {

                    new ChannelContent({
                        mentorId: MentorId,
                        channelId: chId,
                        text: req.body.text,
                        media: req.body.media,
                    }).save((err, doc) => {
                        if (doc) {

                            console.log('channel data ::::::::::: ', doc.channelId);
                            var fcm = new FCM(SERVER_KEY);

                            console.log('chId.toString() ::: ', chId.toString());
                            var topic = '/topics/channel' + chId.toString();
                            var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                                to: topic,
                                collapse_key: 'your_collapse_key',

                                notification: {
                                    title: FirstName,
                                    body: doc.text,
                                    sound: 'default',
                                    "click_action": "FCM_PLUGIN_ACTIVITY",
                                    "icon": AVatar,
                                },

                                data: {  //you can send only notification or only data(or include both)
                                    type: 'channel',
                                    channelName: doc.channelId.channelName,
                                    avatar: doc.channelId.channelAvatar,
                                    userId: doc.channelId.mentorId,
                                }
                            };

                            fcm.send(message, function (err, res2) {
                                if (err) {
                                    console.log("Something has gone wrong!");
                                } else {
                                    console.log("Successfully sent with response: ", res2);
                                }
                            });


                            res.json({
                                doc,
                                message: "پست با موفقیت ایجاد شد"
                            });

                        } else {
                            console.log('errorr :', err)
                            response.error(req, res, next);
                        }
                    })
                }
            })
        }
        else {
            response.error(req, res, next, 'دسترسی ندارید');
        }
    },

    DELETE_EACH_POST: (req, res, next) => {
        var MentorId = req.data.personInfo._id
        Person.findById(MentorId).exec((err, docs) => {
            if (docs) {
                ChannelContent.findByIdAndRemove(req.params.postId).exec((err, doc) => {
                    if (doc) {


                        res.json({
                            status: 204,
                            message: "پست با موفقیت حذف شد"
                        })
                    } else {
                        res.json({
                            message: "چنین پستی وجود ندارد"
                        })
                    }
                })


            } else {
                res.json({
                    message: "اکانت  شما قابلیت حذف کردن را ندارد"
                })
            }
        })
    },


    DELETE_ALL_POST: (req, res, next) => {
        var MentorId = req.data.personInfo._id
        Person.findById(MentorId).exec((err, docs) => {
            if (docs) {
                ChannelContent.remove({ channelId: req.params.channelId }).exec((err, doc) => {
                    if (doc) {
                        // res.status(204).json({
                        //     status : 204,
                        //     message : "پست با موفقیت حذف شد"
                        // })

                        res.json({
                            status: 204,
                            message: "تمام پست ها با موفقیت حذف شد"
                        })
                    } else {
                        res.json({
                            message: "چنین پستی وجود ندارد"
                        })
                    }
                })


            } else {
                res.json({
                    message: "اکانت  شما قابلیت حذف کردن را ندارد"
                })
            }
        })
    },


    PUT_EACHITEM_REPLY: (req, res, next) => {
        var replyId = mongoose.Types.ObjectId();
        var MentorId = req.data.personInfo._id
        Mentor.findById(MentorId).exec((err, docs) => {

            if (docs) {
                ChannelContent.findByIdAndUpdate(req.params.replyId, {
                    "reply.replyId": replyId,
                    "reply.replyText": req.body.replyText,
                    "reply.replyMedia": req.body.replyMedia
                    //  "$set":{"reply.replyText": req.body.replyText } 
                }, {
                    new: true,
                    runValidators: true,
                    upsert: true,
                }).exec((err3, doc3) => {
                    if (doc3) {

                        res.send(doc3)
                    } else {
                        response.error(req, res, next);
                        console.log(err3)
                    }
                })

            } else {

                res.json({
                    message: "اکانت  شما قابلیت ریپلای کردن را ندارد"
                })
            }
        })
    },

    PUT_STATUS_CHANNEL: (req, res, next) => {
        var UserId = req.data.personInfo._id
        Person.findById(UserId).exec((err, docs) => {

            if (docs.class === "manager") {

                Channel.findByIdAndUpdate(req.params.channelId, {
                    status: req.body.status
                }, {
                    new: true,
                    runValidators: true,
                }).exec((err3, doc3) => {
                    if (doc3) {
                        res.json({
                            status: 200,
                            message: "وضعیت کانال با موفقیت تغییر کرد"
                        })
                    } else {
                        response.error(req, res, next);
                        console.log(err3)
                    }
                })

            } else {

                res.json({
                    message: "اکانت  شما قابلیت ریپلای کردن را ندارد"
                })
            }
        })
    },

    PUT_CHANNEL_USER: (req, res, next) => {
        var UserId = req.data.personInfo._id
        // Person.findById(UserId).exec((err, docs) => {

        // if (docs) {

        PersonUser.findByIdAndUpdate(req.params.userId, {
            isChannel: req.body.isChannel,
            channelId: req.body.channelId,
        }, {
            new: true,
            runValidators: true,
        }).exec((err3, doc4) => {
            if (doc4) {

                req.data.item = doc4;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
                console.log(err3)
            }
        });

        //     } else {
        //         response.error(req, res, next, 'اکانت  شما امکان انجام این کار را ندارد');
        //         // res.json({
        //         //     message : "اکانت  شما امکان انجام این کار را ندارد"
        //         // })
        //     }
        // // })
    },


    POST_FCM: (req, res, next) => {
        let fcm = new FCM(SERVER_KEY);
        let message = {
            to: 'efFeRmXjTtekswesNk04k6:APA91bFRUSZl04TKrRtiwZ2w8aHwlOdDBn_nIkAY3T33WWYGsBh8n4reJIG82d_SSRhRirQBIMbNe2pZ0s6gTHHoBmQEt26RIcPTrGsSE6igZqGNYWButsjLmGWXvShyhyFdNELHr9kK',
            notification: {
                title: req.body.title,
                body: req.body.body,
                sound: 'default',
                "click_action": "FCM_PLUGIN_ACTIVITY",
                "icon": "fcm_push_icon",
            },
        }

        fcm.send(message, (err, response) => {
            if (err) {
                next(err);
            } else {
                res.json(
                    message.notification
                );
            }
        });
    },

    //     POST_FCMM : (req, res, next) => {

    //   fMessaging.getToken().then((currentToken) => {
    //     if (currentToken) {
    //       const FIREBASE_API_KEY = `AAAA*******:********************************************************************************************************************************************`;
    //       // Subscribe to the topic
    //       const topicURL = `https://iid.googleapis.com/iid/v1/${currentToken}/rel/topics/`;
    //       return fetch({
    //         url: topicURL,
    //         method: "POST",
    //         headers: {
    //           Authorization: `key=${FIREBASE_API_KEY}`,
    //         },
    //       })
    //         .then((response) => {
    //           fMessaging.onMessage(
    //             (payload) => {
    //               handler(payload);
    //             },
    //             (error) => {
    //               console.log(error);
    //             }
    //           );
    //         })
    //         .catch(() => {
    //           console.error(`Can't subscribe to ${topicName} topic`);
    //         });
    //     }
    //   });

    //     }


}

