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
        vipUserId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
    },
    config.mongooseOptions
);
var VipPost = mongoose.model("vipPost", schema);
module.exports = VipPost;