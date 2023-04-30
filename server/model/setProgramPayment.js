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
        mentorId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        mentorPackageId: {
            type: config.ObjectId,
            ref: "mentorpackagelist",
            autopopulate: true
        },
        channelId: {
            type: config.ObjectId,
            ref: "channel",
            autopopulate: false,
            default: null
        },
        expirePackageDate: {
            type: Date,
            default:Date.now(),
        },        
        status: {
            type: String,
            default: "checking",
            enum:["checking","exit","active","noRenewal","delete"]
        },
        price: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false
        },

    },
    config.mongooseOptions
);
var SetProgramPayment = mongoose.model("setprogrampayment", schema);
module.exports = SetProgramPayment;