var multer = require("multer");
var rand = require("random-key");
var path = require("path");
var mkdirp = require("mkdirp");

module.exports = {
    fileUpload: multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                mkdirp.sync(path.join(__dirname, `../public/`));
                cb(null, path.join(__dirname, `../public/`));
            },
            filename: function (req, file, cb) {
                console.log('file.originalname :: ',file.originalname);
                cb(
                    null,
                    file.originalname
                );
            },
        }),
        fileFilter: function (req, file, cb) {
            cb(null, true);
        },
    }),
};