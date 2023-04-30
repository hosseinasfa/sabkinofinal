require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var moment = require('moment');

var schema = new mongoose.Schema({
        periodMentorMediaId: {
            type: config.ObjectId,
            ref: "periodmentormedia",
            required: true
        },
        title: {
            type: String,
            default: null,
        },
        file: {
            type: String,
            default: null,
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/period_media_file/${v}`;
            }
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDelete: {
            type: Boolean,
            default: false
        }
    },
    config.mongooseOptions
);
var PeriodMentorMediaFile = mongoose.model("periodmentormediafile", schema);

module.exports = PeriodMentorMediaFile;