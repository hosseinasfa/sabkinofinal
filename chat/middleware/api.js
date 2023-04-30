const response = require("../response");
const {
    Person,
} = require("../model/person");
const Token = require("../model/token")

module.exports = {
    isExistToken: (req, res, next) => {
        console.log('req.headers x-api-key ::::' ,req.headers['x-api-key']);
        Token.findOne({
            token: req.headers['x-api-key']
        }).populate('personId', '-password').exec(async (err, doc) => {
            if (doc) {
                req.data.personInfo = doc.personId;
                next();
            }
            // response.error(req, res, next, 'کاربر احراز هویت نشده است')
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
        Person
            .findById(req.data.personInfo._id)
            .exec((err, doc) => {
                // console.log('doc :::::::::::::',doc);
                if (doc.isActive == true) {
                    req.data.personInfo = doc;
                    next();
                } else {
                    response.error(req, res, next, 'کاربر غیر فعال است')
                }
            })
    },
    isDeleteUser: (req, res, next) => {
        if (req.data.personInfo.isDelete == false) {
            next();
        } else {
            response.error(req, res, next, 'کاربر حذف شده است')
        }
    }
}