const response = require('../../response');
const config = require('../../config');
var Ambassador = require('../../model/ambassador');

module.exports = {
    GET_AMBASSADOR: (req, res, next) => {
        Ambassador.find({
            AmbassadorCodeId: req.params.itemId
        }).exec((err, docs) => {
            if (docs) {
                req.data.items = docs;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
            }
        })
    },
    POST_AMBASSADOR: (req, res, next) => {
        // req.body.AmbassadorCodeId = req.params.itemId;
        new Ambassador(req.body).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در ساخت آیتم');
            }
        })
    },
    // PUT_SUB_ITEM: (req, res, next) => {
    //     var updateQuery = req.body;
    //     AmbassadorCode
    //         .findByIdAndUpdate(req.params.subId, updateQuery, config.mongooseUpdateOptions)
    //         .exec((err, doc) => {
    //             if (doc) {
    //                 req.data.item = doc;
    //                 response.ok(req, res, next);
    //             } else {
    //                 response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
    //             }
    //         })
    // },
    // ACTIVE_SUB_ITEM: (req, res, next) => {
    //     AmbassadorCode.findByIdAndUpdate(req.params.subId, {
    //         isActive: true
    //     }, {
    //         new: true,
    //         runValidators: true
    //     }).exec((err, doc) => {
    //         if (doc) {
    //             response.ok(req, res, next);
    //         } else {
    //             response.error(req, res, next);
    //         }
    //     })
    // },
    // DE_ACTIVE_SUB_ITEM: (req, res, next) => {
    //     AmbassadorCode.findByIdAndUpdate(req.params.subId, {
    //         isActive: false
    //     }, {
    //         new: true,
    //         runValidators: true
    //     }).exec((err, doc) => {
    //         if (doc) {
    //             response.ok(req, res, next);
    //         } else {
    //             response.error(req, res, next);
    //         }
    //     })
    // },
}

