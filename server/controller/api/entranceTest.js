var moment = require('moment');
const EntranceExam = require("../../model/entranceExam");
const EntranceTest = require("../../model/entranceTest");
const EducationalField = require("../../model/educationalField");
const EducationalStage = require("../../model/educationalStage");
const Person = require("../../model/person").Person;
const response = require("../../response");
var config = require('../../config');
var offset = parseInt(process.env.ROW_NUMBER);
var offsetApi = parseInt(process.env.ROW_NUMBER_API);
var BASE_URL = process.env.BASE_URL;
var fs = require('fs');


module.exports = {
    CREATE_ENTRANCE_TEST_ALL: (req , res , next) => {
        EntranceExam.find({}).populate('educationalStage').exec((err , doc) => {
            if(doc) {
                
                req.data.entranceExam = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'مشکل در بارگذاری صفحه');
            }
        });
        // EducationalField.find({}).exec((err , doc) => {
        //     if(doc) {
        //         req.data.educationalField = doc;
        //         response.ok(req, res, next);
        //     } else {
        //         response.error(req, res, next, 'مشکل در بارگذاری صفحه');
        //     }
        // })
    },
    POST_ENTRANCE_TEST: (req , res , next) => {
        // req.body.userId = req.data.personInfo._id;
        // var updateQuery = req.body;

        // var birth = updateQuery.birth;
        // var new_date_user = moment.from(birth, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');

        new EntranceTest(req.body).save((err, doc) => {
            
            if (doc) {
                // return console.log(doc.name);
                EntranceTest.findByIdAndUpdate(doc.id , doc.avatar = doc.entranceExamId.avatar ,  config.mongooseUpdateOptions).exec((err , docs) => {
                    if(docs) {
                        req.data.item = doc;
                        response.ok(req, res, next);
                    } else {
                        response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
                    }
                })
                
            } else {
                response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
            }
        })
    },
    GET_ENTRANCE_TEST_ALL: (req, res, next) => {
        var first = req.params.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }


        EntranceTest.find({})
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {

                    // return console.log(docs.entranceExamId)
                    // var someData = {
                    //     image : docs.entranceExamId,
                    // };
                    // req.data.otherItems = someData;

                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next);
                }
            })
    },
    GET_ENTRANCE_TEST_ITEM: (req, res, next) => {
        EntranceTest.findById(req.params.itemId)
            .exec((err, docs) => {
                if (docs) {
                    // return console.log(docs.entranceTestFileId)
                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next);
                }
            })
    },
    PUT_ENTRANCE_TEST_ITEM: (req, res, next) => {
        var updateQuery = req.body;
        EntranceTest
            .findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
            .exec((err, doc) => {
                if (doc) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
                }
            })
    },
    ACTIVE_ENTRANCE_TEST_ITEM: (req, res, next) => {
        EntranceTest.findByIdAndUpdate(req.params.itemId, {
            isActive: true
        }, {
            new: true,
            runValidators: true
        }).exec((err, doc) => {
            if (doc) {
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
    },
    DE_ACTIVE_ENTRANCE_TEST_ITEM: (req, res, next) => {
        EntranceTest.findByIdAndUpdate(req.params.itemId, {
            isActive: false
        }, {
            new: true,
            runValidators: true
        }).exec((err, doc) => {
            if (doc) {
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
    },
};