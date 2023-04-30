const Model = require("../../model/onlineCallMentor");
const Person = require('../../model/person').Person;
const response = require("../../response");
var config = require('../../config');
var querystring = require('querystring');
var serverKey = 'AAAA2wV4VnY:APA91bFosnxEAGCnt-9b8dX893R6hu3_KHF1Xg5Nf_J4SCgPlEqG0QV0DHniv176fQ6J85VoodmejOoNUIT7EEU3uPKCPawc3TL_QMBeIpbpVKNtQ1BKPLvplf12ylznjA0va5AMv6g-'; //put your server key here
const fetch = require("node-fetch");
var offset = parseInt(process.env.ROW_NUMBER);


function subscribeTokenToTopic(token, topic) {
    fetch('https://iid.googleapis.com/iid/v1/' + token + '/rel/topics/' + topic, {
        method: 'POST',
        headers: {
            'Authorization': 'key=' + serverKey
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


function iso7064Mod97_10(iban) {
    var remainder = iban,
        block;

    while (remainder.length > 2) {
        block = remainder.slice(0, 9);
        remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
    }

    return parseInt(remainder, 10) % 97;
}

function validateIranianSheba(str) {
    var pattern = /IR[0-9]{24}/;

    if (str.length !== 26) {
        return false;
    }

    if (!pattern.test(str)) {
        return false;
    }

    var newStr = str.substr(4);
    var d1 = str.charCodeAt(0) - 65 + 10;
    var d2 = str.charCodeAt(1) - 65 + 10;
    newStr += d1.toString() + d2.toString() + str.substr(2, 2);

    var remainder = iso7064Mod97_10(newStr);
    if (remainder !== 1) {
        return false;
    }

    return true;
};


function checkMelliCode(varmellicode) {
    var meli_code;
    meli_code = varmellicode;
    if (meli_code.length == 10) {
        if (meli_code == '1111111111' ||
            meli_code == '0000000000' ||
            meli_code == '2222222222' ||
            meli_code == '3333333333' ||
            meli_code == '4444444444' ||
            meli_code == '5555555555' ||
            meli_code == '6666666666' ||
            meli_code == '7777777777' ||
            meli_code == '8888888888' ||
            meli_code == '9999999999') {
            console.log("code is incorrect");
            // objcode.focus();
            // return false;
        }
        c = parseInt(meli_code.charAt(9));
        n = parseInt(meli_code.charAt(0)) * 10 +
            parseInt(meli_code.charAt(1)) * 9 +
            parseInt(meli_code.charAt(2)) * 8 +
            parseInt(meli_code.charAt(3)) * 7 +
            parseInt(meli_code.charAt(4)) * 6 +
            parseInt(meli_code.charAt(5)) * 5 +
            parseInt(meli_code.charAt(6)) * 4 +
            parseInt(meli_code.charAt(7)) * 3 +
            parseInt(meli_code.charAt(8)) * 2;
        r = n - parseInt(n / 11) * 11;
        if ((r == 0 && r == c) || (r == 1 && c == 1) || (r > 1 && c == 11 - r)) {
            console.log("code is correct");
            // return true;
        } else {
            console.log("code is incorrect");
            // objcode.focus();
            // return false;
        }
    } else {
        console.log("code is incorrect");
        // return false;
    }
}


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
        })
    },

    GET_CALL_MENTOR_PACKAGE: (req, res, next) => {
        var query = req.query;
        Model.find(query).exec((err, docs) => {
            if (docs) {
                req.data.items = docs;
                response.ok(req, res, next);
            }
            else {
                response.error(req, res, next, 'اطلاعات یافت نشد');
            }
        });

    },
    GET_CALL_MENTOR_PACKAGE_CALLCOUNT: (req, res, next) => {
        var duration = req.query.duration;
        console.log('duration :::: ',duration);
        Model.find({ duration: duration }).exec((err, docs) => {
            if (docs) {
                var items = [];
                docs.forEach(item => {

                    var isExist = false;
                    items.forEach(i => {
                        if (item.callCount == i) {
                            isExist = true;
                        }
                    })

                    if (isExist == false) {
                        items.push(item.callCount.toString());
                    }
                });

                req.data.items = items;
                response.ok(req, res, next);
            }
            else {
                response.error(req, res, next, 'اطلاعات یافت نشد');
            }
        });

    },

    GET_CALL_MENTOR_PACKAGE_DURATION: (req, res, next) => {

        var items = [];
        items.push({
            'duration': 1,
            'title': 'یک ماهه',
        });
        items.push({
            'duration': 3,
            'title': 'سه ماهه',
        });
        items.push({
            'duration': 6,
            'title': 'شش ماهه',
        });
        items.push({
            'duration': 12,
            'title': 'یکساله',
        });

        req.data.items = items;
        response.ok(req, res, next);
    },



    POST_PRICE: (req, res, next) => {
        // These registration tokens come from the client FCM SDKs.
        var duration = req.body.duration;
        var callCount = req.body.callCount;
        var channel = req.body.channel;
        console.log('duration ::::::', duration);
        console.log('callCount ::::::', callCount);
        console.log('channel ::::::', channel);

        Model.find({
            'duration': duration,
            'callCount': callCount,
            'channel': channel,
        }).exec((err, doc) => {
            if (doc) {
                req.data.items = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    }

};