require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        mentorId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        duration: {
            type: Number,
            default: 0,
            required: true,
        },
        price: {
            type: Number,
            default: 0,
            required: true,
        },
        status: {
            type: String,
            enum: ['success', 'absenceUser','absenceMentor', 'technical_issues','reserve'],
            default: "reserve",
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
var OnlineCallPackage = mongoose.model("onlinecallpackage", schema);
module.exports = OnlineCallPackage;