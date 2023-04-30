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
        userId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        setProgramPaymentId: {
            type: config.ObjectId,
            ref: "setprogrampayment",
            autopopulate: true
        },
        reportTitle: {
            type: String,
            required: true,
        },
        isExit: {
            type: Boolean,
            default: false,
        },
    },
    config.mongooseOptions
);
var SetProgramExitUser = mongoose.model("setprogramexituser", schema);
module.exports = SetProgramExitUser;