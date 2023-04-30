require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({

    personId: {
        type: config.ObjectId,
        ref: "person",
        autopopulate: false
    },
    publisherSeriesBookId: {
        type: config.ObjectId,
        ref: 'publisherSeriesBook',
        autopopulate: false
    },
    rate: {
        type: Number,
        default: 0,
    },

    type: {
        type: String,
        enum : ['bookTimeRate1','bookTimeRate2','bookTimeRate3','bookTimeRate4','bookTimeRate5','bookTimeRate6','bookTimeRate7'],
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
var PublisherSeriesBookTimeRate = mongoose.model("publisherSeriesBookTimeRate", schema);

module.exports = PublisherSeriesBookTimeRate;