require('dotenv').config()
const {ObjectId, ObjectID} = require('bson');
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
        status: {
            type: String,
            enum: ['success', 'absenceUser','absenceMentor', 'technical_issues','reserved'],
            default: "reserved",
        },
        customer_satisfaction: {
            type: Number,
            default: 0
        },
        callPaymentId:{
            type: config.ObjectId,
            ref: "callpayment",
            autopopulate: true
        },
        critics: {
            type: String,
            default: null
        }

    },
    config.mongooseOptions
);

var feedbackCall = mongoose.model("feedbackCall", schema);
module.exports = feedbackCall;