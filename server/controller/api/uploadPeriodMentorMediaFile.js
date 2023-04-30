const response = require("../../response");
const Model = require("../../model/periodMentorMediaFile");
var fs = require('fs');

require('dotenv').config()
module.exports = {
    POST_FILE: (req, res, next) => {
        if (req.file) {
            req.file.url = `${process.env.BASE_URL}/uploads/period_media_file/${req.file.filename}`;
            req.data.file = req.file;
            response.ok(req, res, next);
        } else {
            response.error(req, res, next);
        }
    },
    DELETE_FILE: (req, res, next) => {
        var itemId = req.body.itemId;
        // var file_name = req.body.file_name;
        // var periodMentorMediaId = req.body.periodMentorMediaId;
        console.log('itemId ::::::::', itemId);
        // console.log('periodMentorMediaId ::::::::', periodMentorMediaId);
        Model.findById(itemId).exec((err, doc) => {
            if (doc) {
                var file_name = doc.file;
                var query = {
                    _id: itemId,
                };
                Model.findOneAndDelete(query).exec(() => {
                    console.log('doc ::::::::::::', doc);

                    var filePath = 'public/uploads/period_media_file/' + file_name;
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
    DELETE_BY_FILE_NAME: (req, res, next) => {
        var fileName = req.query.fileName;
        // var file_name = req.body.file_name;
        // var periodMentorMediaId = req.body.periodMentorMediaId;
        console.log('fileName ::::::::', fileName);
        // console.log('periodMentorMediaId ::::::::', periodMentorMediaId);

        if (typeof fileName !== 'undefined' && fileName != null) {
            var filePath = 'public/uploads/period_media_file/' + fileName;
            if (fs.existsSync(filePath)) {

                console.log('exist file');
                fs.unlinkSync(filePath);
                response.ok(req, res, next, 'با موفقیت حذف گردید');
            }
            else {
                response.error(req, res, next, 'فایل مورد نظر یافت نشد');
            }
        }
    },
    GET_FILE_SESSION: (req, res, next) => {
        var periodMentorMediaId = req.params.periodMentorMediaId;
        console.log('periodMentorMediaId :::::::', periodMentorMediaId);
        Model.find({
            'periodMentorMediaId': periodMentorMediaId,
        }).exec((err, doc) => {
            if (doc) {
                req.data.items = doc;
                response.ok(req, res, next);
            } else {
                console.log(err);
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        });
    }
}