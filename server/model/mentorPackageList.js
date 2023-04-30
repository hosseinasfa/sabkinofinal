require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        mentorId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        name: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            default: 0
        },
        callId: {
            type: config.ObjectId,
            ref: "onlinecallmentor",
            autopopulate: true
        },
        channel: {
            type: Boolean,
            required: true,
            default: false
        },
        setProgram: {
            type: Number,
            required: true,
            default: 0
        },
        getReport: {
            type: Number,
            required: true,
            default: 0
        },
        price: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        }
    },
    config.mongooseOptions
);
var MentorPackageList = mongoose.model("mentorpackagelist", schema);
module.exports = MentorPackageList;