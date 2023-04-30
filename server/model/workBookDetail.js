require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);

var schema = new mongoose.Schema({
        workBookId:{
            type: config.ObjectId,
            ref: "workbook",
            autopopulate : true
        },
        title: {
            type: String,
            default: null,
            required: true,
        },
        specialist: {
            type: Boolean,
            default: false,
            required: true,
        },
        coefficient: {
            type: Number,
            default: 0,
            required: true,
        },
        trueTest: {
            type: Number,
            default: 0,
            required: true,
        },
        wrongTest: {
            type: Number,
            default: 0,
            required: true,
        },
        missTest: {
            type: Number,
            default: 0,
        },
        percentage: {
            type: Number,
            default: 0,
        },
        educationalStageId: {
            type: config.ObjectId,
            ref: "educationalStage",
            autopopulate: true,
            required: false,
            defualt:null
        },
        educationalFieldId: {
            type: config.ObjectId,
            ref: "educationalField",
            autopopulate: true,
            required: false,
            defualt:null
        },
        categoryId: {
            type: config.ObjectId,
            ref: "category",
            autopopulate: true,
            required: false,
            defualt:null
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false
        },
    },
    config.mongooseOptions
);
var WorkBookDetail = mongoose.model("workbookdetail", schema);
module.exports = WorkBookDetail;