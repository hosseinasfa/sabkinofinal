const Model = require("../../model/periodMentorMedia");
const PeriodMentor = require("../../model/periodMentor");
const PeriodMentorMedia = require("../../model/periodMentorMedia");
const EntranceTest = require("../../model/entranceTest");
const EntranceTestFile = require("../../model/entranceTestFile");
const response = require("../../response");
var config = require('../../config');
const PeriodMentorMediaFile = require('../../model/periodMentorMediaFile');
const { getVideoDurationInSeconds } = require('get-video-duration');
var offset = parseInt(process.env.ROW_NUMBER);
var BASE_URL = process.env.BASE_URL;
var fs = require('fs');

module.exports = {
    GET_ENTRANCE_TEST_FILE_ALL: (req, res, next) => {
        var first = req.params.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }


        EntranceTestFile.find({})
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
    POST_ENTRANCE_EXAM_FILE: (req , res , next) => {
        // req.body.userId = req.data.personInfo._id;
        
        // let EntranceTestFile = new EntranceTestFile(req.body);

        // EntranceTestFile.save((err, doc) => {
        //     if (doc) {
        //         let entranceTest = EntranceTest.findById(req.body.entranceTestId, (err , entranceTest) => {

        //         // if (!Array.isArray(entranceTest.EntranceTestFileId)) {
        //         //     entranceTest.EntranceTestFileId = [];
        //         // }
        //         // entranceTest.EntranceTestFileId.push(EntranceTestFile._id);

        //         entranceTest.EntranceTestFileId.push(EntranceTestFile._id);
        //         entranceTest.save();
        //     })
        //         req.data.item = doc;
        //         response.ok(req, res, next);
        //     } else {
        //         response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
        //     }
        // })

        let entranceTest = EntranceTest.findById(req.body.entranceTestId , (err , entranceTest) => {
            // return console.log(entranceTest)
            // let images = req.file;
            // return console.log(req.file.file)
            let EntranceTestFile = new EntranceTestFile({
                entranceTestId : entranceTest._id,
                name : req.body.name,
                description : req.body.description,
                // file : req.file.file
            });

            EntranceTestFile.save((err, doc) => {
                if(doc) {
                
                // return console.log(EntranceTestFile._id)
                
                // entranceTest["EntranceTestFileId"] = EntranceTestFile._id
                entranceTest.EntranceTestFileId.push(EntranceTestFile._id );
                entranceTest.save();

                req.data.item = doc;
                response.ok(req, res, next);

            } else {
                response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
            }
                
            })

        })

    },
};