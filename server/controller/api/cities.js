const Province = require("../../model/province");
const City = require("../../model/city");
const response = require("../../response");
var config = require('../../config');

module.exports = {
    GET_EACH_ITEM: (req, res, next) => {
        City.findById(req.params.cityId).exec((err, doc) => {
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
        City
            .findByIdAndUpdate(req.params.cityId, updateQuery, config.mongooseUpdateOptions)
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
        City.findByIdAndUpdate(req.params.cityId, {
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
        City.findByIdAndUpdate(req.params.cityId, {
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
        Province.findById(req.params.provinceId).exec((err, provinceInfo) => {
            if (provinceInfo) {
                City.find({
                    province_id: provinceInfo.id
                }).exec((err, cityList) => {
                    console.log(cityList)
                    req.data.title = `شهر های استان ${provinceInfo.title}`;
                    req.data.provinceInfo = provinceInfo;
                    req.data.items = cityList;
                    response.ok(req, res, next);
                })
            }
        })
    },
    POST_ITEM: (req, res, next) => {
        console.log('ok')
        Province.findById(req.params.provinceId).exec((err, provinceInfo) => {
            if (provinceInfo) {
                req.body.province_id = provinceInfo.id;
                City.find({}).sort('id').exec(function (err, docs) {
                    req.body.id = docs.reverse()[0].id + 1;
                    new City(req.body).save((err, doc) => {
                        if (doc) {
                            req.data.item = doc;
                            response.ok(req, res, next);
                        } else {
                            response.error(req, res, next);
                        }
                    })
                });
            }
        })
    }
};