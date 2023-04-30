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
        title: {
            type: String,
            default: null,
        },
        isDelete: {
            type: Boolean,
            default: true
        },
    },
    config.mongooseOptions
);
var PeriodMentorHeader = mongoose.model("periodmentorheader", schema);

module.exports = PeriodMentorHeader;