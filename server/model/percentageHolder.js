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
        title: {
            type: String,
            default: null,
            required: false,
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
            default: false
        },
        isDelete: {
            type: Boolean,
            default: false
        }
    },
    config.mongooseOptions
);
var PercentageHolder = mongoose.model("percentageholder", schema);

module.exports = PercentageHolder;