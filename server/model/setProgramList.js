require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        userId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        mentorId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        programDate: {
            type: Date,
            default:Date.now(),
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            default: null
        },
        startTime: {
            type: String,
            default: null
        },
        endTime: {
            type: String,
            default: null
        },
        color: {
            type: String,
            required: true
        },
        programType: {
            type: Boolean,
            default: false
        },
        duration: {
            type: Number,
            default: 0
        },
        reportText: {
            type: String,
            default: ''
        },
        is_seen: {
            type: Boolean,
            default: false
        },
        is_seen_mentor: {
            type: Boolean,
            default: false
        }
    },
    config.mongooseOptions
);
var SetProgramList = mongoose.model("setprogramlist", schema);
module.exports = SetProgramList;