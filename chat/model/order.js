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
        vendorId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        productId:{
            type: config.ObjectId,
            ref: "product",
            autopopulate: true
        },
        invoiceNumber: {
            type: String,
            default:""
        },
        amount: {
            type: Number,
            default: 0,
        },
        onlineAmount: {
            type: Number,
            default: 0,
        },
        walletAmount: {
            type: Number,
            default: 0,
        },
        authority: {
            type: String,
            default: ""
        },
        refId: {
            type: Number,
            default: 0
        },

    },
    config.mongooseOptions
);
var Order = mongoose.model("order", schema);

module.exports = Order;