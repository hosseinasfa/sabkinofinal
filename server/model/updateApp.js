require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        os: {
            type: String,
            enum:["android","ios"],
            default: "android",
        },
        mode: {
            type: String,
            enum:["normal","force"],
            default: 'normal',
        },
        title: {
            type: String,
            default: null,
        },
        name: {
            type: String,
            default: null,
        },
        link: {
            type: String,
            default: null,
        },
        code: {
            type: String,
            default: null,
        },
        description: {
            type: String,
            default: null,
        },
        isActive:{
            type:Boolean,
            default:true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
    },
    config.mongooseOptions
);
var UpdateApp = mongoose.model("updateapp", schema);
module.exports = UpdateApp;