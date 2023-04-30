require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var moment = require('moment');

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
        periodMentorId: {
            type: config.ObjectId,
            ref: "periodmentor",
            autopopulate: true
        },
        price: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDelete: {
            type: Boolean,
            default: false
        }

    },
    config.mongooseOptions
);
var PeriodMentorPayment = mongoose.model("periodmentorpayment", schema);
module.exports = PeriodMentorPayment;