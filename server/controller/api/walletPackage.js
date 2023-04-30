const WalletPackage = require("../../model/walletPackage");
const response = require("../../response");
var config = require('../../config');

module.exports = {

GET_ALL_ITEMS: (req, res, next) => {
    WalletPackage.find({}).sort("sort").exec((err, docs) => {
            req.data.provinceList = docs;
            response.ok(req, res, next);
        })
    },
GET_EACH_ITEM: (req, res, next) => {
    WalletPackage.findById(req.params.walletPackageId).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {    
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },

POST_ITEM: (req, res, next) => {
        
            new WalletPackage(req.body).save((err, doc) => {
                if (doc) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next);
                }
            })
}



};