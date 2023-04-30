require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var moment = require('moment');

var schema = new mongoose.Schema({
    periodMentorId: {
        type: config.ObjectId,
        ref: "periodmentor",
        required: true
    },
    userId: {
        type: config.ObjectId,
        ref: "person",
        required: true
    },
    replyId: {
        type: config.ObjectId,
        ref: "periodmentorcomment",
        required: false,
        default: null,
    },
    type: {
        type: String,
        enum: ['text', 'reply'],
        default: 'text',
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
var PeriodMentorComment = mongoose.model("periodmentorcomment", schema);

module.exports = PeriodMentorComment;