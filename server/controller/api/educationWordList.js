const response = require('../../response');
const config = require('../../config');
var Education = require('../../model/education');

module.exports = {
    PUT_EACH_ITEM: (req, res, next) => {
        Education.updateOne({
            _id: config.ObjectIdConvertor(req.params.itemId),
            "wordList._id": config.ObjectIdConvertor(req.params.wordListId),
        }, {
            $set: {
                "wordList.$.filename": req.body.filename,
                "wordList.$.originWord": req.body.originWord,
                "wordList.$.meaningWord": req.body.meaningWord,
                "wordList.$.caption": req.body.caption,
            }
        }).exec(async (err, doc) => {
            doc = await Education.findById(req.params.itemId).exec();
            if (doc) {
                req.data.item = doc.wordList.find((x) => x._id.toString() == req.params.wordListId);
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در ساخت آیتم');
            }
        })
    },
    ACTIVE_EACH_ITEM: (req, res, next) => {
        Education.updateOne({
            _id: config.ObjectIdConvertor(req.params.itemId),
            "wordList._id": config.ObjectIdConvertor(req.params.wordListId),
        }, {
            $set: {
                "wordList.$.isActive": true,
            }
        }).exec(async (err, doc) => {
            doc = await Education.findById(req.params.itemId).exec();
            if (doc) {
                req.data.item = doc.wordList.find((x) => x._id.toString() == req.params.wordListId);
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در ساخت آیتم');
            }
        })
    },
    DE_ACTIVE_EACH_ITEM: (req, res, next) => {
        Education.updateOne({
            _id: config.ObjectIdConvertor(req.params.itemId),
            "wordList._id": config.ObjectIdConvertor(req.params.wordListId),
        }, {
            $set: {
                "wordList.$.isActive": false,
            }
        }).exec(async (err, doc) => {
            doc = await Education.findById(req.params.itemId).exec();
            if (doc) {
                req.data.item = doc.wordList.find((x) => x._id.toString() == req.params.wordListId);
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در ساخت آیتم');
            }
        })
    },
    POST_ITEM: (req, res, next) => {
        Education.findByIdAndUpdate(req.params.itemId, {
            $push: {
                wordList: {
                    $each: [{
                        filename: req.body.filename,
                        originWord: req.body.originWord,
                        meaningWord: req.body.meaningWord,
                        caption: req.body.caption,
                    }],
                }
            }
        }, {
            new: true,
            runValidators: true
        }).exec((err, doc) => {
            if (doc) {
                req.data.item = doc.wordList.pop();
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در ساخت آیتم');
            }
        })
    },
    GET_SUBS: (req, res, next) => {
        Education.find({
            parent: req.params.itemId
        }).exec((err, docs) => {
            if (docs) {
                req.data.items = docs;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
            }
        })
    },
    POST_SUBS: (req, res, next) => {
        req.body.parent = req.params.itemId;
        new Education(req.body).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
            }
        })
    },
    PUT_SUB_ITEM: (req, res, next) => {
        var updateQuery = req.body;
        Education
            .findByIdAndUpdate(req.params.subId, updateQuery, config.mongooseUpdateOptions)
            .exec((err, doc) => {
                if (doc) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
                }
            })
    },
    ACTIVE_SUB_ITEM: (req, res, next) => {
        Education.findByIdAndUpdate(req.params.subId, {
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
    DE_ACTIVE_SUB_ITEM: (req, res, next) => {
        Education.findByIdAndUpdate(req.params.subId, {
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
}