const response = require("../../response");
const Model = require("../../model/periodMentorMedia");
const PeriodMentor = require("../../model/periodMentor");
require('dotenv').config()
module.exports = {
    POST_FILE: (req, res, next) => {
        if (req.file) {
            req.file.url = `${process.env.BASE_URL}/uploads/period_media/${req.file.filename}`;
            req.data.file = req.file;
            response.ok(req, res, next);
        } else {
            response.error(req, res, next);
        }
    },
    GET_ALL_SESSION: (req, res, next) => {
        var periodMentorId = req.params.periodMentorId;
        var userId = req.data.personInfo._id.toString();

        PeriodMentor.findById(periodMentorId).exec((errPeriod, docPeriod) => {
            if (docPeriod) {
                if (docPeriod.userId._id.toString() == userId) {

                    console.log('periodMentorId :::::::', periodMentorId);
                    Model.find({
                        'periodMentorId': periodMentorId,
                    }).exec((err, docs) => {
                        if (docs) {
                            var items = [];
                            docs.forEach(item => {
                                items.push({
                                    title: item.title,
                                    description: item.description,
                                    image: item.image,
                                    video: item.video,
                                    price: docPeriod.price,
                                    educationalFieldId: docPeriod.educationalFieldId,
                                    educationalStageId: docPeriod.educationalStageId,
                                    categoryId: docPeriod.categoryId,
                                    counter: item.counter,
                                    reason: item.reason,
                                    status: item.status,
                                    isActive: item.isActive,
                                    isDelete: item.isDelete,
                                    _id: item._id,
                                    periodMentorId: item.periodMentorId._id,
                                    mentorId: item.periodMentorId.userId._id,
                                });
                            })
                            req.data.items = items;
                            response.ok(req, res, next);
                        } else {
                            console.log(err);
                            response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                        }
                    });
                }
                else {

                    console.log('periodMentorId :::::::', periodMentorId);
                    Model.find({
                        'periodMentorId': periodMentorId,
                        'isActive': true,
                        'status': 'confirm',
                    }).exec((err, docs) => {
                        if (docs) {
                            var items = [];
                            docs.forEach(item => {
                                items.push({
                                    title: item.title,
                                    description: item.description,
                                    image: item.image,
                                    video: item.video,
                                    price: docPeriod.price,
                                    educationalFieldId: docPeriod.educationalFieldId,
                                    educationalStageId: docPeriod.educationalStageId,
                                    categoryId: docPeriod.categoryId,
                                    counter: item.counter,
                                    reason: item.reason,
                                    status: item.status,
                                    isActive: item.isActive,
                                    isDelete: item.isDelete,
                                    _id: item._id,
                                    periodMentorId: item.periodMentorId._id,
                                    mentorId: item.periodMentorId.userId._id,
                                });
                            })
                            req.data.items = items;
                            response.ok(req, res, next);
                        } else {
                            console.log(err);
                            response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                        }
                    });
                }
            }
        });

    }
}