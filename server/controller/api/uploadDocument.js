const response = require("../../response");
const Person = require("../../model/person").Person;
var config = require('../../config');
require('dotenv').config()
module.exports = {
    POST_FILE: (req, res, next) => {
        if (typeof req.body.itemId !== 'undefined') {
            var itemId = req.body.itemId;
            Person.findById(itemId).exec((errPerson, docPerson) => {
                if (docPerson) {
                    if (req.file) {
                        req.file.url = `${process.env.BASE_URL}/uploads/userConfirmDocuments/${req.file.filename}`;

                        var updateQuery = {
                            confirmDocuments: req.file.url,
                            isConfirmDocument:"pending"
                        };
                        Person
                            .findByIdAndUpdate(itemId, updateQuery, config.mongooseUpdateOptions)
                            .exec((err, doc) => {
                                if (doc) {
                                    console.log('req.body.itemId  :::', req.body.itemId);
                                    req.data.file = req.file;
                                    response.ok(req, res, next);
                                } else {
                                    response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
                                }
                            })

                    } else {
                        response.error(req, res, next, 'فایل های ارسالی مشکل دارد');
                    }
                }
                else {
                    response.error(req, res, next, 'کاربر یافت نشد');
                }
            });

        }
        else {
            response.error(req, res, next);
        }
    },

    GET_FILE: (req, res, next) => {
        console.log('GET_FILE');
        var itemId = req.data.personInfo._id;
        if (typeof itemId !== 'undefined') {
            Person.findById(itemId).exec((errPerson, docPerson) => {
                if (docPerson) {
                    var confirmDocuments = docPerson.confirmDocuments;
                    req.data.filename = confirmDocuments;

                    var reason = '';
                    if(docPerson.reason=='0')
                    {
                        reason = 'ثبت نشده';
                    }
                    else if(docPerson.reason=='1')
                    {
                        reason = 'تصویر واضح نیست';
                    }
                    else if(docPerson.reason=='2')
                    {
                        reason = 'عدم تطابق اطلاعات کارت ملی با اطلاعات';
                    }
                    req.data.reason = reason;

                    if (docPerson.isConfirmDocument == "dosentExist") {
                        req.data.step = -1;
                    }
                    else if (docPerson.isConfirmDocument == "confirm") {
                        req.data.step = 2;
                    }
                    else if (docPerson.isConfirmDocument == "pending") {
                        req.data.step = 1;
                    }
                    else if (docPerson.isConfirmDocument == "error") {
                        req.data.step = 0;
                    }
                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
        }
        else {
            response.error(req, res, next, 'اطلاعات ارسالی ناقص هست');
        }

    }
}