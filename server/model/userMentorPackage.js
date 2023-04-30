require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        mentorPackageId: {
            type: config.ObjectId,
            ref: "mentorpackagelist",
            autopopulate: true
        },
        userId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },

    },
    config.mongooseOptions
);
var UserMentorPackage = mongoose.model("usermentorpackage", schema);
module.exports = UserMentorPackage;