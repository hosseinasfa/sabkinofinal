require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var moment = require('moment');

var schema = new mongoose.Schema({
        periodMentorMediaId: {
            type: config.ObjectId,
            ref: "periodmentormedia",
            required: true,
            autopopulate:true
        },
        userId: {
            type: config.ObjectId,
            ref: "person",
            required: true,
            autopopulate:true
        },
        replyId: {
            type: config.ObjectId,
            ref: "periodmentormediacomment",
            required: false,
            default: null,
        },
        commentText: {
            type: String,
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDelete: {
            type: Boolean,
            default: false
        },
    },
    config.mongooseOptions
);
var PeriodMentorMediaComment = mongoose.model("periodmentormediacomment", schema);

module.exports = PeriodMentorMediaComment;