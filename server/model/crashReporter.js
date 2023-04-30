require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        buildVersion: {
            type: String,
            default:null
        },
        errorDate:{
            type: Date,
            default:Date.now(),
        },
        device: {
            type: String,
            default:null
        },
        osVersion:{
            type:String,
        },
        errorDetails:{
            type:String,
            default:null
        }
    },
    config.mongooseOptions
);
var CrashReporter = mongoose.model("crashreporter", schema);
module.exports = CrashReporter;