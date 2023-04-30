require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var moment = require('moment');

var schema = new mongoose.Schema({
        entranceTestId: {
            type: config.ObjectId,
            ref: "entranceTest",
            required: true,
            // autopopulate: true
        },
        title: {
            type: String,
            default: null,
            required: true
        },
        description: {
            type: String,
            default: null,
        },
        file: {
            type: String,
            default: null,
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/entrance_test_file/${v}`;
            }
        },
        downloadCount: {
            type: Number,
            default: 0,
        },
        counter: {
            type: Number,
            default: 0
        },
        reason: {
            type: String,
            default: null,
        },
        status: {
            type: String,
            enum: ["draft","pending","confirm","reject"],
            default:"draft"
        },
        isActive: {
            type: Boolean,
            default: false
        },
        isDelete: {
            type: Boolean,
            default: false
        }
    },
    config.mongooseOptions
);
var EntranceTestFile = mongoose.model("entranceTestFile", schema);

module.exports = EntranceTestFile;