var multer = require("multer");
var rand = require("random-key");
var path = require("path");
var mkdirp = require("mkdirp");

module.exports = {
    fileUpload: multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                mkdirp.sync(path.join(__dirname, `../public/uploads/userConfirmDocuments/`));
                cb(null, path.join(__dirname, `../public/uploads/userConfirmDocuments/`));
            },
            filename: function (req, file, cb) {
                cb(
                    null,
                    `${rand.generate(16)}-${Date.now()}${path.extname(file.originalname)}`
                );
            },
        }),
        fileFilter: function (req, file, cb) {
            cb(null, true);
        },
    }),
};