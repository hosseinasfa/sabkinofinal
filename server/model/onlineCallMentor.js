require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        title: {
            type: String,
            default:null
        },
        duration: {
            type: Number,
            required: true,
            default:0
        },
        callCount: {
            type: Number,
            required: true,
            default:0
        },
        channel: {
            type:Boolean,
            default:false
        },
        price: {
            type: Number,
            required: true,
            default:0
        },
        percent: {
            type: Number,
            required: true,
            default:0
        },
        finalPrice: {
            type: Number,
            required: true,
            default:0
        },
    },
    config.mongooseOptions
);
var OnlineCallMentor = mongoose.model("onlinecallmentor", schema);
module.exports = OnlineCallMentor;