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
        callDate: {
            type: Date,
            default:Date.now(),
            required: true,
        },
        startTime: {
            type: String,
            default:"",
            required: true,
        },
        endTime: {
            type: String,
            default:"",
            required: true,
        },
        mentorId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        mentoravailabletimeId: {
            type: config.ObjectId,
            ref: "mentoravailabletime",
            autopopulate: true
        },
        status: {
            type: String,
            enum: ['success', 'absenceUser','absenceMentor', 'technical_issues','reserved'],
            default: 'reserved'
        }
    },
    config.mongooseOptions
);
var CallLog = mongoose.model("calllog", schema);
module.exports = CallLog;