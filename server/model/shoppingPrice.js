require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        priceFrom: {
            type: Number,
            default: 0,
            required: true,
        },
        priceTo: {
            type: Number,
            default: 0,
            required: true,
        },
        percent: {
            type: Number,
            default: 0,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: true,
        },
    },
    config.mongooseOptions
);
var ShoppingPrice = mongoose.model("shoppingPrice", schema);
module.exports = ShoppingPrice;