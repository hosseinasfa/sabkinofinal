require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        phoneNumber: {
            type: String,
            default: null,
        },
        IMEI: {
            type: String,
            default: null,
        },
        isActive:{
            type:Boolean,
            default:true,
        },
        isDelete: {
            type: Boolean,
            default: true,
        },
    },
    config.mongooseOptions
);
var UserNumber = mongoose.model("usernumber", schema);
module.exports = UserNumber;