require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");

require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({

    ownerId: {
        type: config.ObjectId,
        ref: "person",
    },

    date: {
        type: Date,
        default: new Date(),
    },

    amount: {
        type: String,
        default: "0",
    },


},
    config.mongooseOptions
);
var WithdrawalDetails = mongoose.model("withdrawalDetails", schema);

module.exports = WithdrawalDetails;