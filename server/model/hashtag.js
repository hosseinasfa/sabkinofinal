require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        title: {
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
var Hashtag = mongoose.model("hashtag", schema);
module.exports = Hashtag;