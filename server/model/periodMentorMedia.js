require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var moment = require('moment');

var schema = new mongoose.Schema({
        periodMentorId: {
            type: config.ObjectId,
            ref: "periodmentor",
            required: true,
            autopopulate: true
        },
        title: {
            type: String,
            default: null,
            required: true
        },
        description: {
            type: String,
            default: null,
            required: true
        },
        image: {
            type: String,
            default: '',
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/period_media_image/${v}`;
            }
        },
        video: {
            type: String,
            default: null,
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/period_media_video/${v}`;
            }
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
var PeriodMentorMedia = mongoose.model("periodmentormedia", schema);

module.exports = PeriodMentorMedia;