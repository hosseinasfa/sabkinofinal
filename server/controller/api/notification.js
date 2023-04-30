const Channel = require("../../model/channel");
const ChannelContent = require("../../model/channelContent");
const response = require("../../response");
const Category = require("../../model/category");
var config = require('../../config');
const Mentor = require('../../model/person').Mentor;
const Person = require('../../model/person').Person;
const PersonUser = require('../../model/person').User;
const MalisonList = require('../../model/malisonList');
var offset = parseInt(process.env.ROW_NUMBER);
var FCM = require('fcm-node');
const SERVER_KEY = process.env.SERVER_KEY;
const fetch = require("node-fetch");

function subscribeTokenToTopic(token, topic) {
    if (typeof token !== 'undefined' && token != null) {
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
}

function unsubscribeToTopic(token, topic) {
    if (typeof token !== 'undefined' && token != null) {
        var fcm = new FCM(SERVER_KEY);
        fcm.unsubscribeToTopic([token], topic, (err, res) => {
            console.log(" unSubscribed to:", res);
        });
    }
}
// import { initializeApp } from "firebase/app";
//  const initializeApp  = require ('firebase/app');
//  const getMessaging   = require ('firebase/messaging');
var moment = require('moment');
var mongoose = require('mongoose');

// const firebaseConfig = {
//     apiKey: "AIzaSyBRVddhieaTZDg5maXe2_gl6TCv4UnHKiA",
//     authDomain: "sabkino-1400.firebaseapp.com",
//     projectId: "sabkino-1400",
//     storageBucket: "sabkino-1400.appspot.com",
//     messagingSenderId: "940689610358",
//     appId: "1:940689610358:web:8df88e3ceb725783237157",
//     measurementId: "G-J0VY6RNZ60"
//   };

//   const messaging = getMessaging(app);
module.exports = {
    POST_SUBSCRIBE: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var topic = req.body.topic;
        if (topic == 'isAll') {
            Person.findByIdAndUpdate(userId, {
                isAll: true,
                isChatNotification: true,
                isPublicNotification: true,
                isChannelNotification: true,
                isAlarmNotification: true,
            }, {
                new: true,
                runValidators: true
            }).exec((err, doc) => {
                if (doc) {
                    subscribeTokenToTopic(doc.notificationKey, 'public');
                    if (typeof doc.channelId !== 'undefined' && doc.channelId != null) {
                        var chId = doc.channelId._id.toString();
                        var topic = '/topics/channel' + chId;
                        subscribeTokenToTopic(doc.notificationKey, topic);
                    }

                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });

        }
        else if (topic == 'isChatNotification') {
            Person.findByIdAndUpdate(userId, {
                isChatNotification: true,
            }, {
                new: true,
                runValidators: true
            }).exec((err, doc) => {
                if (doc) {
                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
        }
        else if (topic == 'isPublicNotification') {
            Person.findByIdAndUpdate(userId, {
                isPublicNotification: true,
            }, {
                new: true,
                runValidators: true
            }).exec((err, doc) => {
                if (doc) {
                    subscribeTokenToTopic(doc.notificationKey, 'public');
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
        }
        else if (topic == 'isChannelNotification') {
            Person.findByIdAndUpdate(userId, {
                isChannelNotification: true,
            }, {
                new: true,
                runValidators: true
            }).exec((err, doc) => {
                if (doc) {
                    if (typeof doc.channelId !== 'undefined' && doc.channelId != null) {
                        var chId = doc.channelId._id.toString();
                        var topic = '/topics/channel' + chId;
                        subscribeTokenToTopic(doc.notificationKey, topic);
                    }
                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });

        }
        else if (topic == 'isAlarmNotification') {
            Person.findByIdAndUpdate(userId, {
                isAlarmNotification: true,
            }, {
                new: true,
                runValidators: true
            }).exec((err, doc) => {
                if (doc) {
                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });

        }
        else {
            response.error(req, res, next, 'پارامترهای ارسالی اشتباه است');
        }


    },

    POST_UNSUBSCRIBE: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var topic = req.body.topic;
        if (topic == 'isAll') {
            Person.findByIdAndUpdate(userId, {
                isAll: false,
                isChatNotification: false,
                isPublicNotification: false,
                isChannelNotification: false,
                isAlarmNotification: false,
            }, {
                new: true,
                runValidators: true
            }).exec((err, doc) => {
                if (doc) {

                    unsubscribeToTopic(doc.notificationKey, 'public');
                    if (typeof doc.channelId !== 'undefined' && doc.channelId != null) {
                        var chId = doc.channelId._id.toString();
                        var topic = '/topics/channel' + chId;
                        unsubscribeToTopic(doc.notificationKey, topic);
                    }


                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });

        }
        else if (topic == 'isChatNotification') {
            Person.findByIdAndUpdate(userId, {
                isChatNotification: false,
            }, {
                new: true,
                runValidators: true
            }).exec((err, doc) => {
                if (doc) {
                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
        }
        else if (topic == 'isPublicNotification') {
            Person.findByIdAndUpdate(userId, {
                isPublicNotification: false,
            }, {
                new: true,
                runValidators: true
            }).exec((err, doc) => {
                if (doc) {
                    unsubscribeToTopic(doc.notificationKey, 'public');
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
        }
        else if (topic == 'isChannelNotification') {
            Person.findByIdAndUpdate(userId, {
                isChannelNotification: false,
            }, {
                new: true,
                runValidators: true
            }).exec((err, doc) => {
                if (doc) {
                    if (typeof doc.channelId !== 'undefined' && doc.channelId != null) {
                        var chId = doc.channelId._id.toString();
                        var topic = '/topics/channel' + chId;
                        unsubscribeToTopic(doc.notificationKey, topic);
                    }

                    
                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });

        }
        else if (topic == 'isAlarmNotification') {
            Person.findByIdAndUpdate(userId, {
                isAlarmNotification: false,
            }, {
                new: true,
                runValidators: true
            }).exec((err, doc) => {
                if (doc) {
                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });

        }
        else {
            response.error(req, res, next, 'پارامترهای ارسالی اشتباه است');
        }
    },
    POST_FCM: (req, res, next) => {
        let fcm = new FCM(SERVER_KEY);
        var token = req.body.token;
        let message = {
            to: token,
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


    POST_NOTIFICTION: (req, res, next) => {
        var fcm = new FCM(SERVER_KEY);
        var topic = `/topics/${req.body.topic}`;
        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: topic,
            collapse_key: 'your_collapse_key',

            notification: {
                title: req.body.title,
                body: req.body.body
            },

            data: {  //you can send only notification or only data(or include both)
                offer: req.body.offer,
            }
        };

        fcm.send(message, function (err, res2) {
            if (err) {
                console.log("Something has gone wrong!");
            } else {
                console.log("Successfully sent with response: ", res2);
            }
        });
        // These registration tokens come from the client FCM SDKs.
        response.ok(req, res, null);

    },

    POST_NOTIFICTION2: (req, res, next) => {
        var fcm = new FCM(SERVER_KEY);
        var topic = `/topics/sajad`;
        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: topic,
            collapse_key: 'your_collapse_key',

            notification: {
                title: 'بزرگانی',
                body: 'تست کران جاب هر 1 دقیقه'
            },

            // data: {  //you can send only notification or only data(or include both)
            //     offer: req.body.offer,
            // }
        };

        fcm.send(message, function (err, res2) {
            if (err) {
                console.log("Something has gone wrong!");
            } else {
                console.log("Successfully sent with response: ", res2);
            }
        });
        // These registration tokens come from the client FCM SDKs.
        response.ok(req, res, null);

    },


}




