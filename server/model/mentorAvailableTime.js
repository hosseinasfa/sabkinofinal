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
        date: {
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
        lastTimeReserved: {
            type: String,
            default:null,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
        isDelete: {
            type: Boolean,
            default: false,
        }
    },
    config.mongooseOptions
);
var MentorAvailableTime = mongoose.model("mentoravailabletime", schema);
module.exports = MentorAvailableTime;