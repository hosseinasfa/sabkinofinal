require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
    userId: {
        type: config.ObjectId,
        ref: "person",
        autopopulate: true
    },
    walletPackageId : {
            type: config.ObjectId,
            ref: "walletPackage",
            autopopulate: true
    },
    status: {
        type: Boolean,
        // default: "defaultUser.jpg",\
        default: false,
    },
    amount: {
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

    // sellCount:{
    //     type:Number,
    //     default:0,
    // },
    
},
    config.mongooseOptions
);
var WalletPayment = mongoose.model("walletPayment", schema);

module.exports = WalletPayment;