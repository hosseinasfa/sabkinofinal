require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);

var schema = new mongoose.Schema({
        reason: {
            type: String,
            default: "",
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
var ReasonList = mongoose.model("reasonList", schema);
module.exports = ReasonList