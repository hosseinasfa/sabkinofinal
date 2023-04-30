require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({

    personId: {
        type: config.ObjectId,
        ref: "person",
        autopopulate: true
    },
    publisherseriesId: {
        type: config.ObjectId,
        ref: 'publisherSeries',
        autopopulate: true
    },

    rate: {
        type: Number,
        default: 0,
    },

    type: {
        type: String,
        enum : ['Hardship','Rate'],
    },

    isActive: {
            type: Boolean,
            default: true,
    },
    isDelete: {
            type: Boolean,
            default: false,
        }
    },
    config.mongooseOptions
);
var PublisherSeriesRate = mongoose.model("publisherSeriesRate", schema);

module.exports = PublisherSeriesRate;