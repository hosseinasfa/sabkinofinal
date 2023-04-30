require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        title: {
            type: String,
            default: null,
        },
        image: {
            type: String,
            default: '',
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
            }
        },
        class: {
            type: String,
            enum:['user','teacher','mentor','family','schoolBoss','educationalInstitutions'],
            default: 'user',
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
var DemoTour = mongoose.model("demotour", schema);
module.exports = DemoTour;