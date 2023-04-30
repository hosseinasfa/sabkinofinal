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
            enum: ['success', 'absence','absenceMentor', 'technical_issues'],
            default: "",
        },
        customer_satisfaction: {
            type: Number,
            default: 0
        },
        mentor_skill: {
            type: Number,
            default: 0
        },
        ethics_fundamental: {
            type: Number,
            default: 0
        },
        mentor_result: {
            type: Number,
            default: 0
        },
        availability_conditions: {
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

var feedbackCallUser = mongoose.model("feedbackcalluser", schema);
module.exports = feedbackCallUser;