const response = require("../../response");
var config = require('../../config');
const PanelSupport = require('../../model/panelSupport');
const Token = require("../../model/token");
var axios = require('axios');

var rand = require("random-key");
const {
    sendSmss
} = require("../../libs/sms");
module.exports = {

    GET_ALL_PANEL_SUPP: (req, res, next) => {
        PanelSupport.find({
            class: req.query.class
        }).exec((err, docs) => {
            if (docs) {
                req.data.items = docs;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
    },

    CHECK_TOKEN: (req, res, next) => {
        Token.find({
            token: req.body.token
        }).exec((err, docs) => {
            if (docs) {
                req.data.items = docs;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
    },

    CHECK_PHONE: (req, res, next) => {
        PanelSupport.find({
            phone: req.body.phone,
            password: req.body.password,
        }).exec((err, docs) => {
            if (docs) {
                if (docs.length > 0) {
                    //console.log("id", docs)
                    Token.find({
                        panelSupportId: docs[0]._id
                    }).exec((errr, docss) => {
                        //console.log('tok', docss)
                        if (docss) {
                            req.data.status = true;
                            req.data.token = docss[0].token;
                            response.ok(req, res, next);
                        } else {
                            response.error(req, res, next);
                        }
                    });
                }
                else {
                    response.error(req, res, next);
                }
            } else {
                response.error(req, res, next);
            }
        })
    },

    UPDATE_EACH_ITEM: (req, res, next) => {
        PanelSupport.findByIdAndUpdate(req.params.itemId, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            class: req.body.class,
        }).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                req.data.error = err;
                response.error(req, res, next, 'چنین پستی موجود نمی باشد');
            }
        })
    },




    NEW_PANEL_SUPPORT: (req, res, next) => {

        new PanelSupport({

            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            class: req.body.class,
            password: req.body.password

        }).save((err, doc) => {
            if (doc && doc.length != 0) {
                new Token({
                    panelSupportId: doc._id,
                    token: rand.generateBase30(128),
                }).save((err, token) => {
                    if (token) {
                        var phone = doc.phone;
                        var token1 = doc.firstName;
                        var token2 = doc.password;
                        var token3 = doc.lastName
                        var url = encodeURI(`https://api.kavenegar.com/v1/63706E793050766836466F6A4B6C306149314C3574722F42574A732F4D62486D753655523176632F445A673D/verify/lookup.json?receptor=${phone}&token=${token1}&token3=${token3}&token2=${token2}&template=registerUser`)
                        axios.get(url)
                            .then(function (response) { })
                            .catch(function (error) { })
                            .finally(function () { });
                        // sendSmss('09394396061');

                        req.data.verify = true;
                        req.data.item = doc;
                        response.ok(req, res, next, 'کاربر پنل با موفقیت ایجاد شد !');
                    } else {
                        req.data.verify = false;
                        req.data.token = null;
                        response.error(req, res, next, 'مشکل در ایجاد توکن');
                    }
                });
            } else {
                console.log('error :', err)
                response.error(req, res, next);
            }

        })
    },



};

