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
},
    config.mongooseOptions
);
var PeriodMentorBookmark = mongoose.model("periodmentorbookmark", schema);

module.exports = PeriodMentorBookmark;