require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);

var schema = new mongoose.Schema({
        educationalStageId: {
            type: config.ObjectId,
            ref: "educationalStage",
            autopopulate: true
        },
        title: {
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
        cover: {
            type: String,
            default: "defaultUser.jpg",
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
            }
        },
        topsPdf: {
            type: String,
            default: "default.pdf",
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
            }
        },
        questionPdf: {
            type: String,
            default: "default.pdf",
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
            }
        },
        questionCount: {
            type: Number,
            default: 0,
            min: 0
        },
        optionCount: {
            type: Number,
            default: 0,
            min: 0
        },
        startDate: Date,
        responseTime: {
            type: Number,
            default: 0,
            min: 0
        },
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
var Quiz = mongoose.model("quiz", schema);
module.exports = Quiz