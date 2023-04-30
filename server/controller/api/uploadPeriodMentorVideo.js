const response = require("../../response");
const Model = require("../../model/periodMentorMedia");
var fs = require('fs');


require('dotenv').config()
module.exports = {
    POST_FILE: (req, res, next) => {
        if (req.file) {
            req.file.url = `${process.env.BASE_URL}/uploads/period_media_video/${req.file.filename}`;
            req.data.file = req.file;
            response.ok(req, res, next);
        } else {
            response.error(req, res, next);
        }
    },
    DELETE_FILE: (req, res, next) => {
        var itemId = req.body.itemId;
        // var file_name = req.body.file_name;
        // var periodMentorId = req.body.periodMentorId;
        // console.log('file_name ::::::::', file_name);
        // console.log('periodMentorId ::::::::', periodMentorId);
        Model.findById(itemId).exec((err, doc) => {
            if (doc) {
                var file_name = doc.video;
                var query = {
                    _id: itemId,
                };
                Model.findOneAndDelete(query).exec(() => {
                    console.log('doc ::::::::::::', doc);

                    var filePath = 'public/uploads/period_media_video/' + file_name;
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
    }
}