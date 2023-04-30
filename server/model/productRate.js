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
        productId: {
            type: config.ObjectId,
            ref: "product",
            autopopulate: true
        },
        rate: {
            type: Number,
            default: 0
        },

    },
    config.mongooseOptions
);
var ProductRate = mongoose.model("productrate", schema);

module.exports = ProductRate;