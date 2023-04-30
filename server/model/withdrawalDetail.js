require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");

require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({

    ownerId: {
        type: config.ObjectId,
        ref: "person",
        autopopulate: true
    },

    date: {
        type: Date,
        default: new Date(),
    },

    amount: {
        type: String,
        default: "0",
    },

    status:{
        type:String,
        default : "pending",
        enum:['pending','accept','reject',]
    },

},
    config.mongooseOptions
);
var WithdrawalDetail = mongoose.model("withdrawalDetail", schema);

module.exports = WithdrawalDetail;