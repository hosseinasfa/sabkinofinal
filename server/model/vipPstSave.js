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
var VipPstSave = mongoose.model("vippstsave", schema);
module.exports = VipPstSave;