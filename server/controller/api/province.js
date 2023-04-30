const City = require("../../model/city");
const Province = require("../../model/province");
const response = require("../../response");
module.exports = {
    provinceList: (req, res, next) => {
        Province.find({}).lean().exec((err, docs) => {
            req.data.provinceList = docs;
            response.ok(req, res, next);
        })
    },
    cityList: (req, res, next) => {
        Province.findById(req.params.provinceId).lean().exec((err, doc) => {
            if (doc) {
                City.find({
                    province_id: doc.id
                }).exec((err, docs) => {
                    req.data.provinceInfo = doc;
                    req.data.cityList = docs;
                    response.ok(req, res, next);
                })
            } else {
                response.error(req, res, next,'استانی پیدا نشد');
            }
        })
    }
}