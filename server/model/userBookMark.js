require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        mentorId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true,
            required: true
        },
        userId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true,
            required: true
        }
    },
    config.mongooseOptions
);
var UserBookMark = mongoose.model("userbookmark", schema);
module.exports = UserBookMark;