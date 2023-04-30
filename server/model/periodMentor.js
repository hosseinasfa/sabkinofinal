require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var moment = require('moment');

var schema = new mongoose.Schema({
    userId: {
        type: config.ObjectId,
        ref: "person",
        autopopulate: true
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
        default: '',
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/period_media_video/${v}`;
        }
    },
    name: {
        type: String,
        default: null,
        required: true,
    },
    type: {
        type: String,
        enum:['mentor','teacher'],
        default: 'mentor',
        required: true,
    },
    headers: {
        type: String,
        default: null,
    },
    userName: {
        type: String,
        default: null,
    },
    // grade: {
    //     type: Number,
    //     default: 0,
    //     required: true,
    // },
    sessionCount: {
        type: Number,
        default: 0,
        required: true,
    },
    maxSessionCount: {
        type: Number,
        default: 0,
        required: true,
    },
    minSessionCount: {
        type: Number,
        default: 0,
        required: true,
    },
    duration: {
        type: Number,
        default: 0,
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
    // tags: {
    //     type: [String],
    //     default: null,
    // },
    rate: {
        type: Number,
        default: 0
    },
    paymentCount: {
        type: Number,
        default: 0
    },
    shareCount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: String,
        enum: ["draft","pending","confirm","reject"],
        default:"draft"
    },
    reason: {
        type: String,
        default: ""
    },

    educationalFieldId: {
        type: config.ObjectId,
        ref: "educationalField",
        autopopulate: true,
        default: null
    },
    educationalStageId: {
        type: config.ObjectId,
        ref: "educationalStage",
        autopopulate: true,
        default: null
    },
    // categoryId: {
    //     type: config.ObjectId,
    //     ref: "category",
    //     autopopulate: true,
    //     default: null
    // },
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
var PeriodMentor = mongoose.model("periodmentor", schema);

module.exports = PeriodMentor;