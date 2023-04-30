var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        parent: {
            type: config.ObjectId,
            ref: "importanceOfLessons",
            autopopulate: true
        },
        title: String,
        avatar: {
            type: String,
            default: "defaultUser.jpg",
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
            }
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        }
    },
    config.mongooseOptions
);
var ImportanceOfLessons = mongoose.model("importanceOfLessons", schema);

module.exports = ImportanceOfLessons;