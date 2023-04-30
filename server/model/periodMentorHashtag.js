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
        periodMentorId: {
            type: config.ObjectId,
            ref: "periodmentor",
            autopopulate: true
        },
        hashtagId: {
            type: config.ObjectId,
            ref: "hashtag",
            autopopulate: true
        },
    },
    config.mongooseOptions
);
var PeriodMentorHashtag = mongoose.model("periodmentorhashtag", schema);
module.exports = PeriodMentorHashtag;