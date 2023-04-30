require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
    title: {
        type: String,
        default: "",
    },
    price: {
        type: String,
        default: "",
    },
    status: {
        type: Boolean,
        // default: "defaultUser.jpg",\
        default: true,
    },
    type: {
        type: String,
    },
    
},
    config.mongooseOptions
);
var WalletPackage = mongoose.model("walletPackage", schema);

module.exports = WalletPackage;