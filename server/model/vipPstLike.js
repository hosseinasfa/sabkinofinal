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
        postId: {
            type: config.ObjectId,
            ref: "vippst",
            autopopulate: true
        },
    },
    config.mongooseOptions
);
var VipPstLike = mongoose.model("vippstlike", schema);
module.exports = VipPstLike;