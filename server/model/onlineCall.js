require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        duration: {
            type: Number,
            default: 0,
            required: true,
        },
        priceFrom: {
            type: Number,
            default: 0,
            required: true,
        },
        priceTo: {
            type: Number,
            default: 0,
            required: true,
        },
        percent: {
            type: Number,
            default: 0,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: true,
        },
    },
    config.mongooseOptions
);
var OnlineCall = mongoose.model("onlinecall", schema);
module.exports = OnlineCall;