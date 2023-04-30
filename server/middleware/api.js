const response = require("../response");
const { Person } = require("../model/person");
const SetProgramPayment = require("../model/setProgramPayment");
const Token = require("../model/token");
const Monitoring = require("../model/monitoring")
const { lookup } = require('geoip-lite');

module.exports = {
    isExistToken: (req, res, next) => {
        // console.log('session.api_key ::::' ,req.session);
        Token.findOne({
            token: req.headers['x-api-key']
        }).populate('personId', '-password')
            .exec((err, doc) => {
                if (doc) {
                    // console.log(doc.personId);
                    if (doc.personId) {
                        req.data.personInfo = doc.personId;
                    } else {
                        req.data.personInfo = doc.panelSupportId;
                    }


                    next();
                }
                else {
                    // req.data.personInfo = await Person.findById('620bc60ff10efb7769b70f5b').exec();
                    // console.log(err)
                    // next();
                    response.error(req, res, next, 'کاربر احراز هویت نشده است')
                }
            })
    },
    isExistUser: (req, res, next) => {
        if (req.data.personInfo) {
            next();
        } else {
            response.error(req, res, next, 'این کاربر در پایگاه داده وجود ندارد')
        }
    },
    isActiveUser: (req, res, next) => {
        if (req.data.personInfo.isActive == true) {
            next();
        } else {
            response.error(req, res, next, 'کاربر غیر فعال است');
        }
        // Person
        //     .findById(req.data.personInfo._id, '-password')
        //     .populate('cityId')
        //     .populate('provinceId')
        //     .lean()
        //     .exec((err, doc) => {
        //         if (doc.isActive == true) {
        //             //req.data.personInfo = doc;
        //             next();
        //         } else {
        //             response.error(req, res, next, 'کاربر غیر فعال است')
        //         }
        //     })
    },
    isDeleteUser: (req, res, next) => {
        // var ipp = req.connection.remoteAddress;
        var ipp = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress;
        var userIdd = req.data.personInfo._id;
        var urls = req.originalUrl;
        var queryy = req.query.name;
        var methods = req.method;
        if (req.data.personInfo.isDelete == false) {
            // if (methods == "POST" || methods == "PUT" || methods == "DELETE") {
            //     new Monitoring({
            //         userId: userIdd,
            //         ip: ipp,
            //         method: methods,
            //         url: urls,
            //         query: queryy,
            //     }).save((err, doc) => {
            //         if (doc) {
            //             res.status(200)
            //         } else {
            //             response.error(req, res, next, 'مشکل در ساخت آیتم');
            //         }
            //     })
            // }

            next();
        } else {
            response.error(req, res, next, 'کاربر حذف شده است')
        }
    },


}