const Field = require("../../model/field");
const response = require("../../response");
var config = require('../../config');
var offset = parseInt(process.env.ROW_NUMBER);

module.exports = {
    // GET_EACH_ITEM: (req, res, next) => {
    //     Model.findById(req.params.itemId).exec((err, doc) => {
    //         if (doc) {
    //             req.data.item = doc;
    //             response.ok(req, res, next);
    //         } else {
    //             response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
    //         }
    //     })
    // },
    GET_FEILD_ITEMS: (req, res, next) => {
        var first = req.query.first;
        var title = req.query.title;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        if (typeof title !== 'undefined') {
            Field
                // .find(req.query)
                .find({
                     'title': { '$regex': title, '$options': 'i' },
                     'isActive': true,
                     'isDelete': false
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
        }
        else {
            Field
                .find({
                    isActive: true,
                    isDelete: false
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
                });
        }
    },

};