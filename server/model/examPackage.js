require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        title: {
            type: String,
            default: null,
        },
        price: {
            type: Number,
            default: 0,
        },
        duration:{
            type: Number,
            default:180,
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
var ExamPackage = mongoose.model("exampackage", schema);
module.exports = ExamPackage;