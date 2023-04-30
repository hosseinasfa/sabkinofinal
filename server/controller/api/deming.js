const Package = require("../../model/package");
const response = require("../../response");
var config = require('../../config');
const Person = require('../../model/person').Person
const Deming = require("../../model/deming");

module.exports = {

    GET_EACH_DEMING: (req, res, next) => {
        var userID = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        if (strClass == 'support') {
            userID = req.data.personInfo.supportMentorId._id;
        }


        Deming.find({
            userId: userID,
            isActive: true,
            isDelete: false
        }).exec((err, docs) => {
            if (docs) {
                req.data.item = docs;
                response.ok(req, res, next);

            } else {
                response.error(req, res, next, 'آیتمی پیدا نشد');
            }
        })
    },


    GET_EACH_DEMING_BYDATE: (req, res, next) => {
        var userId = req.data.personInfo._id;
        Deming.find({
            date:
            {
                $gte: new Date(new Date(req.body.date).setHours(00, 00, 00)),
                $lt: new Date(new Date(req.body.date).setHours(23, 59, 59))
            },
            userId: userId,
            isActive: true,
            isDelete: false
        }).exec((err, docs) => {
            if (docs) {
                res.send(docs)
            } else {
                res.send(err)
            }
        })
    },


    DELETE_DEMING_ITEMS: (req, res, next) => {
        var itemIds = req.query.itemIds;
        itemIds = JSON.parse(itemIds);
        Deming.findOneAndDelete({
            _id: { $in: itemIds }
        }).exec((err, doc) => {
            if (err) {
                response.error(req, res, next, 'اطلاعات یافت نشد');
            } else {
                response.ok(req, res, next, 'با موفقیت حذف گردید');
            }
        });
    },

    POST_NEW_DEMING: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        console.log('req.body :::: ', req.body);
        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }

        var isEducation = (req.body.isEducation === 'true');


        if (isEducation == false) {
            new Deming({
                userId: userId,
                title: req.body.title,
                date: new Date(),
                time: req.body.time,
                isEducation: isEducation,
                testCount: req.body.testCount,
                isActive: req.body.isActive,
                isDelete: req.body.isDelete,
                type: req.body.type,
            }).save((err, doc) => {
                if (doc) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    console.log('err ::: ',err);
                    response.error(req, res, next, 'مشکل در ساخت آیتم');
                }
            })
        }
        else {

            if (typeof req.body.educationalStageId !== 'undefined' && typeof req.body.educationalFieldId !== 'undefined' && typeof req.body.categoryId !== 'undefined') {
                new Deming({
                    userId: userId,
                    title: req.body.title,
                    date: new Date(),
                    time: req.body.time,
                    isEducation: isEducation,
                    testCount: req.body.testCount,
                    educationalStageId: req.body.educationalStageId,
                    educationalFieldId: req.body.educationalFieldId,
                    categoryId: req.body.categoryId,
                    isActive: req.body.isActive,
                    isDelete: req.body.isDelete,
                    type: req.body.type,
                }).save((err, doc) => {
                    if (doc) {
                        req.data.item = doc;
                        response.ok(req, res, next);
                    } else {
                        console.log('err ::: ',err);
                        response.error(req, res, next, 'مشکل در ساخت آیتم');
                    }
                })
            }
            else {
                response.error(req, res, next, 'مشکل در ساخت آیتم');
            }
        }
    },

    GET_DEMING_BY_DATE_TYPE: (req, res, next) => {
        var userId = req.data.personInfo._id;
        let start = new Date(new Date(req.body.date).setHours(00, 00, 00));
        const backdate = start.setDate(start.getDate() - 25)
        let end = new Date(new Date(req.body.date).setHours(59, 59, 59))

        console.log('start :: ',start);
        console.log('end ::',end);
        console.log('req.body.date ::',req.body.date);
        Deming.find({
            date:
            {
                $gte: start,
                $lt: end
            },
            userId: userId,
            type: req.body.type,
            isActive: true,
            isDelete: false
        }).exec((err, docs) => {
            if (docs) {
                res.send(docs)
            } else {
                res.send(err)
            }
        })
    },


    DELETE_EACH_POST: (req, res, next) => {
        var UserId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        if (strClass == 'support') {
            UserId = req.data.personInfo.supportMentorId._id;
        }

        Person.findById(UserId).exec((err, docs) => {
            if (docs) {
                Deming.findByIdAndRemove(req.params.demingId).exec((err, doc) => {
                    if (doc) {
                        res.json({
                            status: 204,
                            message: "دمینگ با موفقیت حذف شد"
                        })
                    } else {
                        res.json({
                            message: "چنین دمینگی وجود ندارد"
                        })
                    }
                })


            } else {
                res.json({
                    message: "اکانت  شما قابلیت حذف کردن را ندارد"
                })
            }
        })
    },


};