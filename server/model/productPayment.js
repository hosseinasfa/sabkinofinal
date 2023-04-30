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
        price: {
            type: Number,
            default: 0
        },

    },
    config.mongooseOptions
);
var PeroductPayment = mongoose.model("peroductpayment", schema);
module.exports = PeroductPayment;