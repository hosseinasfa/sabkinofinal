require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var moment = require('moment');

var schema = new mongoose.Schema({
        fromSesson: {
            type: Number,
            default: 0,
            required: true
        },
        toSesson: {
            type: Number,
            default: 0,
            required: true
        },
        percent: {
            type: Number,
            default: 0
        },
        minPrice: {
            type: Number,
            default: 0
        },
        maxPrice: {
            type: Number,
            default: 0,
        },
        realPrice: {
            type: Number,
            default: 0,
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
var PeriodMentorPriceList = mongoose.model("periodmentorpricelist", schema);

module.exports = PeriodMentorPriceList;