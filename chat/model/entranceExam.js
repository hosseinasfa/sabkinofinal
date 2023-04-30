require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        parent: {
            type: config.ObjectId,
            ref: "entranceExam",
            autopopulate: true
        },
        title: {
            type: String,
            default: "",
        },
        caption: {
            type: String,
            default: "",
        },
        avatar: {
            type: String,
            default: "defaultUser.jpg",
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
            }
        },
        date: Date,
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
    },
    config.mongooseOptions
);
var EntranceExam = mongoose.model("entranceExam", schema);

module.exports = EntranceExam;