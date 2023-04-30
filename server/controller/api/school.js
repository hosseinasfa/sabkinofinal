const response = require("../../response");
var config = require('../../config');
const School = require('../../model/school');
const Person = require('../../model/person').Person;
const District = require('../../model/district');
const Province = require('../../model/province');
const City = require('../../model/city');
var offset = parseInt(process.env.ROW_NUMBER_API);

var moment = require('moment');
module.exports = {
    GET_ALL_SCHOOL: (req, res, next) => {
        var first = req.params.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        School.find({})
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next);
                }
            })
    },

    GET_EACH_SCHOOL: (req, res, next) => {
        School.findById(req.params.schoolId).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },

    GET_MY_SCHOOL: (req, res, next) => {
        var Userid = req.data.personInfo._id;
        School.find({ bossId: Userid }).exec((err, doc) => {
            if (doc) {
                req.data.item = doc[0];
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },

    GET_CITY_PROVINCE: (req, res, next) => {

        School.find({ cityId: req.params.cityId }).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },

    GET_ALL_ITEMS_DISTRICT: (req, res, next) => {
        Province.findById(req.params.provinceId).exec((err, provinceInfo) => {
            City.find({
                province_id: provinceInfo.id
            }).exec((err, cityList) => {
                console.log("ghol1", provinceInfo.id)
                console.log("ghol2", cityList[0].id)
                const filtercityID = cityList.filter((e) => e.metropolis === true)

                District.find({
                    province_id: provinceInfo.id,
                    city_id: filtercityID[0].id,
                }).exec((err, cityListtttt) => {
                    // req.data.title = `ناحیه های استان ${provinceInfo.title}`;
                    // req.data.provinceInfo = provinceInfo;

                    req.data.items = cityListtttt;
                    response.ok(req, res, next, `ناحیه های استان ${provinceInfo.title}`);
                })
            })
        })
    },

    CHECK_SCHOOL: (req, res, next) => {
        const UserId = req.data.personInfo._id
        const hasschool = req.data.personInfo.hasSchool
        Person.findById(UserId).exec((err, doc) => {
            if (hasschool === true) {
                req.data.item = doc;
                response.ok(req, res, next, 'دارد');
            } else if (hasschool === false || typeof hasschool === "undefined") {
                response.ok(req, res, next, 'ندارد');

            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },

    FILTER_SCHOOL: (req, res, next) => {
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
        const Reqdistrict = req.query.district;
        const Reqgender = req.query.gender;
        const Reqtype = req.query.type;

        filter = {
            isActive: true,
            isDelete: false
        };

        if (typeof ReqprovinceId !== 'undefined') {
            filter.provinceId = ReqprovinceId;
        }


        if (typeof ReqcityId !== 'undefined') {
            filter.cityId = ReqcityId;
        }

        if (typeof Reqdistrict !== 'undefined') {
            filter.district = Reqdistrict;
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


        School.find(filter)
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


    NEW_SCHOOL: (req, res, next) => {
        console.log("body", req.body)
        var Userid = req.data.personInfo._id
        new School(req.body).save((err, doc) => {
            if (doc) {
                School.findByIdAndUpdate(doc._id, { bossId: Userid }, config.mongooseUpdateOptions).exec((errr, docs) => {
                    if (docs) {
                        req.data.item = docs;
                        response.ok(req, res, next, 'مدرسه با موفقیت ثبت شد');
                    } else {
                        response.error(req, res, next, 'مشکل در ثبت مدرسه');
                    }
                })
            } else {
                response.error(req, res, next, err);
                console.log("err", err)
            }

        })
    },


    SEARCH_SCHOOL: (req, res, next) => {

        function escapeRegex(text) {
            return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
        };

        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        School.find({
            "title": regex,
            "isActive": true,
            "isDelete": false
        })
            .exec((err, docs) => {
                if (docs) {
                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    res.send(err)
                }
            })
    },

    PUT_EACH_SCHOOL: (req, res, next) => {
        var userClass = req.data.personInfo.class;
        var bossId = req.data.personInfo._id
        var updateQuery = req.body;

        console.log('updateQuery ::: ', updateQuery);
        var itemId = req.query.itemId;
        if (userClass === "schoolBoss") {
            School.findById(itemId).exec((err1, doc1) => {
                if (doc1) {
                    if (doc1.bossId._id.toString() == bossId.toString()) {
                        School.findByIdAndUpdate(itemId, updateQuery, config.mongooseUpdateOptions)
                            .exec((err, doc) => {
                                if (doc) {
                                    req.data.item = doc;
                                    response.ok(req, res, next, 'مدرسه با موفقیت بروزرسانی شد');

                                } else {
                                    response.error(req, res, next, 'مشکل در بروزرسانی مدرسه');
                                }
                            })
                    }
                    else {
                        response.error(req, res, next, 'دسترسی برای ویرایش اطلاعات ندارید');
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

