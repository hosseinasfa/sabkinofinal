const Model = require("../../model/chatList");
const response = require("../../response");
var config = require('../../config');
var moment = require('jalali-moment');
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
        var itemId = req.query.itemId;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        console.log('itemId ::::: ', itemId);
        Model.find({
            UserIdA: itemId
        })
            .limit(1000)
            .skip(first)
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
            })
    },
    POST_ITEM: (req, res, next) => {
        // Model.find({}).exec(function (err, docs) {
        // req.body.id = docs.reverse()[0].id + 1;
        new Model(req.body).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
        // });
    },
    GET_CHAT_LIST: (req, res, next) => {
        var first = req.query.first;
        var userId = req.data.personInfo._id.toString();
        var strClass = req.data.personInfo.class;

        if (strClass == 'support') {
            var userId = req.data.personInfo.supportMentorId._id.toString();
        }

        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }


        Model.find({
            UserIdA: userId
        })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    req.data.items = docs;
                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            })
    },
};