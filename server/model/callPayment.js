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
        onlineCallPackageId: {
            type: config.ObjectId,
            ref: "onlinecallpackage",
            autopopulate: true
        },
        status: {
            type: String,
            enum: ['success', 'absenceUser','absenceMentor', 'technical_issues','reserve'],
            default: "reserve",
        },
        amount: {
            type: Number,
            default: 0
        }
    },
    config.mongooseOptions
);
var CallPayment = mongoose.model("callpayment", schema);
module.exports = CallPayment;