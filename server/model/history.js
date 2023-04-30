require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        
        // date : new Date(),

        amount: {
            type: Number,
            default: 0,
        },
    
    },
    config.mongooseOptions
);
var History = mongoose.model("history", schema);

module.exports = History;