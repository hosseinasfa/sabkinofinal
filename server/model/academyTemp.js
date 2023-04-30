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
},
    config.mongooseOptions
);
var AcademyTemp = mongoose.model("academyTemp", schema);

module.exports = AcademyTemp;