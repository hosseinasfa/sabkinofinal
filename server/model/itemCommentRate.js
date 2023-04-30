require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        personId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        refId: {
            type: config.ObjectId,
            ref: "itemComment",
            autopopulate: true
        },
        rate: {
            type: Boolean,
            default: false,
        },
    },
    config.mongooseOptions
);
var ItemCommentRate = mongoose.model("itemCommentRate", schema);

module.exports = ItemCommentRate;