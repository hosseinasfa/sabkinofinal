// const Package = require("../../model/package");
const response = require("../../response");
var config = require('../../config');
const Support = require('../../model/person').Support
const Teacher = require('../../model/person').Teacher
const Mentor = require('../../model/person').Mentor
const Person = require('../../model/person').Person

module.exports = {

    GET_ALL_ITEMS: (req, res, next) => {
        var x = req.data.personInfo._id
        console.log(x)
        Package.find({ roll: x }).exec((err, docs) => {

            req.data.provinceList = docs;
            response.ok(req, res, next);
        })
    },
    CHECK_MODE: (req, res, next) => {
        var x = req.data.personInfo._id
        Support.findById(x).exec((err, doc) => {

            if (doc) {
                var mode = doc.mode
                res.json({
                    mode,
                })
            } else {
                res.json({
                    err,
                    message: "چنین ایتمی موجود نمیباشد"
                })
            }
        })
    },


    GET_ALL_SUPPORT: (req, res, next) => {

        var x = req.data.personInfo.supportCode;
        var strClass = req.data.personInfo.class;
        console.log('xxxx : ', x);


        // supportCode
        // identifierSupportCode

        if (strClass == 'support') {

            Mentor.find({ supportCode: x }).exec((err, doc) => {
                if (doc) {
                    // console.log("ali", doc)
                    // const rejectMode = doc.filter(e => e.mode === 'pending' || e.mode === 'deportPending' || e.mode === 'accept');

                    res.status(200).json({
                        data: doc
                    })
                } else {
                    res.status(400).json({
                        err,
                        message: "چنین ایتمی موجود نمیباشد"
                    })
                }
            })

            // })
        }
        else if (strClass == 'teacher') {
            Support.find({ identifierSupportCode: x }).exec((err, docs) => {
                if (docs) {
                    // console.log("ali", doc)
                    // const rejectMode = doc.filter(e => e.mode === 'pending' || e.mode === 'deportPending' || e.mode === 'accept');

                    res.status(200).json({
                        data: docs
                    })
                } else {
                    res.status(400).json({
                        err,
                        message: "چنین ایتمی موجود نمیباشد"
                    })
                }
            })
        }
        else if (strClass == 'mentor') {
            Support.find({ identifierSupportCode: x }).exec((err, docs) => {
                if (docs) {
                    // console.log("ali", doc)
                    // const rejectMode = doc.filter(e => e.mode === 'pending' || e.mode === 'deportPending' || e.mode === 'accept');

                    res.status(200).json({
                        data: docs
                    })
                } else {
                    res.status(400).json({
                        err,
                        message: "چنین ایتمی موجود نمیباشد"
                    })
                }
            })
        }
        else {
            res.status(400).json({
                err,
                message: "چنین ایتمی موجود نمیباشد"
            })
        }
    },

    PUT_EACH_SUPPORT: (req, res, next) => {
        var mentorId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var supCode = req.data.personInfo.supportCode;
        console.log(req.body)
        if (req.body.mode == 'accept') {
            Support.findOne({ supportMentorId: mentorId, identifierSupportCode: supCode }).exec((err1, doc1) => {

                if (doc1) {
                    Support.findByIdAndUpdate(req.body.supportId, { mode: req.body.mode, supportType: strClass }, config.mongooseUpdateOptions).exec((err532, doc123) => {
                        if (doc123) {

                            req.data.item = doc123;
                            response.ok(req, res, next, message = 'کاربر با موفقیت تایید شد !');

                        } else {
                            response.error(req, res, next);
                            console.log("همچنین کاربری پیدا نشد", err532)
                        }
                    });
                }
                else {
                    Support.findByIdAndUpdate(req.body.supportId, { supportMentorId: mentorId, supportType: strClass, mode: req.body.mode }, config.mongooseUpdateOptions).exec((err532, doc123) => {
                        if (doc123) {
                            req.data.item = doc123;
                            response.ok(req, res, next, message = 'کاربر با موفقیت تایید شد !');

                        } else {
                            response.error(req, res, next);
                            console.log("همچنین کاربری پیدا نشد", err532)
                        }
                    });
                }
            })
        } else if (req.body.mode == 'deportPending') {
            var today = new Date();
            var afterTomorrow = new Date();
            var affterTomorrow = afterTomorrow.setDate(today.getDate() + 2);
            Support.findByIdAndUpdate(req.body.supportId, { mode: req.body.mode, pendingTime: affterTomorrow }, config.mongooseUpdateOptions).exec((err5, doc5) => {
                if (doc5) {
                    req.data.item = doc5;
                    response.ok(req, res, next, message = 'کاربر با موفقیت اخراج شد !');

                } else {
                    response.error(req, res, next);
                    console.log("همچنین کاربری پیدا نشد", err5)
                }
            });

        } else if (req.body.mode == 'reject') {

            console.log('reject area');
            Support.findByIdAndUpdate(req.body.supportId, { identifierSupportCode: "" }, config.mongooseUpdateOptions).exec((err5, doc5) => {
                if (doc5) {

                    console.log('doc5 :::', doc5);
                    req.data.item = doc5;
                    response.ok(req, res, next, message = 'کاربر با موفقیت حذف شد !');
                } else {
                    response.error(req, res, next);
                    console.log("همچنین کاربری پیدا نشد", err5)
                }
            });


        }

    },

    PUT_ITEM: (req, res, next) => {
        console.log("amin", req.body)
        var x = req.data.personInfo._id;
        

        Person.findOne({ supportCode: req.body.supportCode }).exec((err, doc) => {
            if (doc) {
                var strClass = doc.class;
                Person.findByIdAndUpdate(x, { class: req.body.class }, config.mongooseUpdateOptions).exec((err2, doc2) => {
                    if (doc2) {

                        Support.findByIdAndUpdate(x, { mode: 'pending', supportType: strClass, identifierSupportCode: req.body.identifierSupportCode, supportMentorId: doc.id }, config.mongooseUpdateOptions).exec((err3, doc3) => {
                            if (doc3) {
                                req.data.item = doc3;
                                response.ok(req, res, next);
                            } else {
                                response.error(req, res, next);
                                console.log("error support", err3)
                            }
                        })
                    } else {
                        response.error(req, res, next);
                        console.log("error support", err2)
                    }
                })

            } else {
                response.error(req, res, next, message = 'کد وارد شده معتبر نمیباشد !');
            }

        })




    },



};