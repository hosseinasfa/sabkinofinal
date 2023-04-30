const Model = require("../../model/notificationHistory");
const response = require("../../response");
var config = require('../../config');
var moment = require('jalali-moment');
var offset = parseInt(process.env.ROW_NUMBER);
var FCM = require('fcm-node');
const SERVER_KEY = process.env.SERVER_KEY;
const fetch = require("node-fetch");


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
        var title = req.body.title;
        var strMessage = req.body.message;
        new Model(req.body).save((err, doc) => {
            if (doc) {
                var fcm = new FCM(SERVER_KEY);
                var topic = '/topics/public';
                var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    to: topic,
                    collapse_key: 'your_collapse_key',

                    notification: {
                        title: title,
                        body: strMessage,
                        sound: 'default',
                        "click_action": "FCM_PLUGIN_ACTIVITY",
                        "icon": "",
                    },

                    data: {  //you can send only notification or only data(or include both)
                        name: 'تست',
                        family: 'تست '
                    }
                };

                fcm.send(message, function (err, res2) {
                    if (err) {
                        console.log("Something has gone wrong!");
                    } else {
                        console.log("Successfully sent with response: ", res2);
                    }
                });

                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
    },
};