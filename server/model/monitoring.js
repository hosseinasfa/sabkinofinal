require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");

require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({

    userId: {
        type: config.ObjectId,
        ref: "person",
    },

    ip : {
        type: String,
        default: "",
    },

    method : {
        type: String,
        default: "",
    },

    url : {
        type: String,
        default: "",
    },

    query : {
        type: String,
        default: "",
    }

},
    config.mongooseOptions
);
var Monitoring = mongoose.model("monitoring", schema);

module.exports = Monitoring;