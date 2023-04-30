const Model = require("../../model/category");
const response = require("../../response");
var config = require('../../config');
var persianDate = require('persian-date');
var offset = parseInt(process.env.ROW_NUMBER);
var moment = require('jalali-moment');

module.exports = {
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
    GET_CATEGORIES_ITEMS: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }
        
        var educationalStageId = req.query.educationalStageId;
        var educationalFieldId = req.query.educationalFieldId;

        var filter = {};
        if (typeof educationalStageId !== 'undefined') {
            filter.educationalStageId = educationalStageId;
        }

        if (typeof educationalFieldId !== 'undefined') {
            filter.educationalFieldId = educationalFieldId;
        }


        Model.find(filter)
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                }
            })
    },

    POST_ITEM: (req, res, next) => {
        new Model(req.body).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
                console.log(req.data.item.onlineCallPackageId.price)
            } else {
                response.error(req, res, next);
            }
        })
    },


};