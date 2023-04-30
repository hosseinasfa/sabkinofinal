require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");

require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
    duration: {
        type: Number,
        default: 0,
    },
    priceAll: {
        type: Number,
        default: 0,
    },

    priceDay: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    status: {
        type: Boolean,
        default: true,
    },
    roll: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDelete: {
        type: Boolean,
        default: false,
    },

},
    config.mongooseOptions
);
var Package = mongoose.model("package", schema);

module.exports = Package;