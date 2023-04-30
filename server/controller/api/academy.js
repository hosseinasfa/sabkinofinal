const response = require("../../response");
var config = require('../../config');
const Academy = require('../../model/academy');
const Person = require('../../model/person').Person;
var moment = require('moment');
var offset = parseInt(process.env.ROW_NUMBER_API);
module.exports = {
    GET_ALL_ACADEMY: (req, res, next) => {
        var first = req.params.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }


        Academy.find({})
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {

                    req.data.items = docs.reverse();
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next);
                }
            })
    },

    GET_EACH_ACADEMY: (req, res, next) => {
        Academy.findById(req.params.academyId).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },

    GET_MY_ACADEMY: (req, res, next) => {
        var Userid = req.data.personInfo._id;
        Academy.findOne({ bossId: Userid }).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },

    NEW_ACADEMY: (req, res, next) => {
        var Userid = req.data.personInfo._id;
        new Academy(req.body).save((err, doc) => {
            if (doc) {
                req.data.items = doc;
                response.ok(req, res, next);
            } else {
                console.log('error :', err)
                response.error(req, res, next);
            }
        });
    },

    SEARCH_ACADEMY: (req, res, next) => {

        // var MentorId = req.data.personInfo._id;
        function escapeRegex(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        };

        // var first = req.query.first;
        // if (typeof first === 'undefined') {
        //     first = 0;
        // } else {
        //     first = parseInt(first) * offset;
        // }

        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Academy.find({ "title": regex, isActive: true, isDelete: false })
            // .limit(offset)
            // .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    res.send(err)
                }
            })
    },

    FILTER_ACADEMY: (req, res, next) => {
        var first = req.query.first;
        var search = req.query.search;
        var filter = {};
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        function escapeRegex(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        };


        const ReqprovinceId = req.query.provinceId;
        const ReqcityId = req.query.cityId;
        const Reqgender = req.query.gender;
        const Reqtype = req.query.type;

        filter = {
            isActive: true,
            isDelete: false,
        };

        if (typeof ReqprovinceId !== 'undefined') {
            filter.provinceId = ReqprovinceId;
        }

        if (typeof ReqcityId !== 'undefined') {
            filter.cityId = ReqcityId;
        }

        if (typeof Reqgender !== 'undefined') {
            filter.gender = Reqgender;
        }

        if (typeof Reqtype !== 'undefined') {
            filter.type = Reqtype;
        }

        if (typeof search !== 'undefined') {
            const regex = new RegExp(escapeRegex(search), 'gi');
            filter.title = regex;
        }

        Academy.find(filter)
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    if (docs.length > 0) {
                        req.data.items = docs;
                        response.ok(req, res, next);
                    }
                    else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                } else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            })
    },


    CHECK_ACADEMY: (req, res, next) => {
        const UserId = req.data.personInfo._id
        const HasAcademy = req.data.personInfo.hasAcademy
        Person.findById(UserId).exec((err, doc) => {
            if (HasAcademy === true) {
                req.data.item = doc;
                response.ok(req, res, next, 'دارد');
            } else if (HasAcademy === false || typeof hasschool === "undefined") {
                response.ok(req, res, next, 'ندارد');

            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },

    PUT_EACH_ACADEMY: (req, res, next) => {
        var userClass = req.data.personInfo.class;
        var bossId = req.data.personInfo._id
        var ItemId = req.params.itemId;
        var updateQuery = req.body;
        if (userClass === "educationalInstitutions") {
            Academy.findById(ItemId).exec((err1, doc1) => {
                if (doc1) {
                    if (doc1.bossId.toString() == bossId.toString()) {
                        Academy.findByIdAndUpdate(ItemId, updateQuery, config.mongooseUpdateOptions)
                            .exec((err, doc) => {
                                if (doc) {
                                    req.data.item = doc;
                                    response.ok(req, res, next, 'آموزشگاه با موفقیت بروزرسانی شد');
                                } else {
                                    response.error(req, res, next, 'مشکل در بروزرسانی آموزشگاه');
                                }
                            })

                    }
                    else {
                        response.error(req, res, next, 'شما دسترسی برای ویرایش ندارید');
                    }
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
        } else {
            response.error(req, res, next, 'امکان بروزرسانی برای کاربری شما وجود ندارد');
        }
    },




};

