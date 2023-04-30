require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
    name: {
        type: String,
    },
    type: {
        type: String,
    },
    address: {
        type: String,
    },
    phone: {
        type: String,

    },
    city: {
        type: String,
    },

    ostan: {
        type: String,
    },

    gender: {
        type: String,
    },

    nahieh: {
        type: String,
    },
},
    config.mongooseOptions
);
var SchoolTemp = mongoose.model("schoolTemp", schema);

module.exports = SchoolTemp;