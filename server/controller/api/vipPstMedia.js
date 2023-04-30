const Model = require("../../model/vipPstMedia");
const response = require("../../response");
var config = require('../../config');
var moment = require('jalali-moment');
const Person = require("../../model/person").Person;
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
        var first = req.query.first;
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
    GET_BY_POSTID: (req, res, next) => {
        var postId = req.query.postId;
        var first = req.query.first;
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
            });
    },
    POST_CUSTOM_ITEM: (req, res, next) => {
        var postId = req.body.postId;
        var type = req.body.type;
        var filename = req.body.filename;
        var query = {
            'postId': postId,
            'type': type,
            'filename': filename,
        };
        new Model(query).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })

    },

    POST_CUSTOM_ITEM_ARRAY: (req, res, next) => {
        console.log('req.body.medias :::', req.body.medias);
        if (typeof req.body.medias !== 'undefined' && typeof req.body.postId !== 'undefined') {
            var postId = req.body.postId;
            // var type = req.body.type;
            var medias = JSON.parse(req.body.medias);
            medias.forEach(item => {
                var query = {
                    'postId': postId,
                    'type': item.type,
                    'filename': item.filename,
                };
                new Model(query).save((err, doc) => {
                    if (doc) {

                    } else {
                        response.error(req, res, next);
                    }
                });
            });

            response.ok(req, res, next);
        } else {
            response.error(req, res, next);
        }

    }
};