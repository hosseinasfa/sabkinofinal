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
    releaseDate: {
        type: Date,
        default: null,
    },
    avatar: {
        type: String,
        default: 'default.jpg',
        get: (v) => {
            return `${v}`;
        }
    },
    entranceExamId: {
        type: config.ObjectId,
        ref: "entranceExam",
        autopopulate: true,
        required : true,
        default: null
    },
    name: {
        type: String,
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
    // type: {
    //     type: String,
    //     enum:['mentor','teacher' , 'user'],
    //     default: 'user',
    //     required: true,
    // },
    // headers: {
    //     type: String,
    //     default: null,
    // },
    // userName: {
    //     type: String,
    //     default: null,
    // },
    // grade: {
    //     type: Number,
    //     default: 0,
    //     required: true,
    // },
    // sessionCount: {
    //     type: Number,
    //     default: 0,
    //     required: true,
    // },
    // maxSessionCount: {
    //     type: Number,
    //     default: 0,
    //     required: true,
    // },
    // minSessionCount: {
    //     type: Number,
    //     default: 0,
    //     required: true,
    // },
    // duration: {
    //     type: Number,
    //     default: 0,
    //     required: true,
    // },
    // description: {
    //     type: String,
    //     default: null,
    // },
    // tags: {
    //     type: [String],
    //     default: null,
    // },
    downloadCount: {
        type: Number,
        default: 0
    },
    viewCount: {
        type: Number,
        default: 0
    },
    // shareCount: {
    //     type: Number,
    //     default: 0
    // },
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
    entranceTestFileId: [{
        type: config.ObjectId,
        ref: "entranceTestFile",
        autopopulate: true,
    }],
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
var EntranceTest = mongoose.model("entranceTest", schema);

module.exports = EntranceTest;