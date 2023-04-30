require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        userId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true,
            required: true
        },
        academyId: {
            type: config.ObjectId,
            ref: "academy",
            autopopulate: true,
            required : true
        },
        commentText: {
            type: String,
            default: null,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
    },
    config.mongooseOptions
);
var AcademyComment = mongoose.model("academyComment", schema);
module.exports = AcademyComment;