var fs = require('fs');
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
    POST_ENTRANCE_TEST_FILE: (req , res , next) => {
        // return console.log(req.file);
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
            var EntranceTestFiles = new EntranceTestFile({
                entranceTestId : entranceTest._id,
                title : req.body.title,
                description : req.body.description,
                file : req.file.filename
            });

            EntranceTestFiles.save((err, doc) => {
                if(doc) {
                    // return console.log(doc.entranceTestId.releaseDate)
                    // EntranceTestFile.findByIdAndUpdate(doc.id ,{ "$set": { "relaseDate": doc.entranceTestId.releaseDate }} ,   config.mongooseUpdateOptions).exec((err , docs) => {
                    //     if(docs) {
                    //         // req.data.item = doc;
                    //         // response.ok(req, res, next);
                    //     } else {
                    //         response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
                    //     }
                    // })
                // return console.log(doc);
                // return console.log(entranceTest.entranceTestFileId);
                
                // entranceTest["EntranceTestFileId"] = EntranceTestFile._id
                entranceTest.entranceTestFileId.push(EntranceTestFiles._id);
                entranceTest.save();

                req.data.item = doc;
                response.ok(req, res, next);

            } else {
                response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
            }
                
            })

        })

    },
    DELETE_FILE: (req, res, next) => {
        var itemId = req.body.itemId;
        // var file_name = req.body.file_name;
        // var periodMentorMediaId = req.body.periodMentorMediaId;
        console.log('itemId ::::::::', itemId);
        // console.log('periodMentorMediaId ::::::::', periodMentorMediaId);
        
        EntranceTestFile.findById(itemId).exec(async (err, doc) => {
            if (doc) {
                let entranceTest = await EntranceTest.findById(doc.entranceTestId).exec();
                entranceTest.entranceTestFileId.pull(itemId);
                entranceTest.save();
                return console.log(doc.entranceTestId);
                var file_name = doc.file;
                var query = {
                    _id: itemId,
                };
                EntranceTestFile.findOneAndDelete(query).exec(() => {
                    console.log('doc ::::::::::::', doc);

                    var filePath = 'public/uploads/entrance_test_file/' + file_name;
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }


                    req.data.item = doc;
                    response.ok(req, res, next);
                });
            } else {
                console.log(err);
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        });
    },
};