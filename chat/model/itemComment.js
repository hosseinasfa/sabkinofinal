require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var replySchema = new mongoose.Schema({
        personId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        caption: {
            type: String,
            default: "",
            autopopulate: true
        },
    },
    config.mongooseOptions
);

var schema = new mongoose.Schema({
        personId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        refModelName: {
            type: String,
            required: true,
        },
        refId: {
            type: config.ObjectId,
            refPath: 'refModelName',
            autopopulate: true
        },
        caption: {
            type: String,
            default: "",
        },
        rate: {
            type: Number,
            default: 0,
        },
        reply: [replySchema]
    },
    config.mongooseOptions
);
var ItemComment = mongoose.model("itemComment", schema);

module.exports = ItemComment;