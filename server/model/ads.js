require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
    title: {
        type: String,
        default: "",
    },
    link: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default: "defaultUser.jpg",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
        }
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDelete: {
        type: Boolean,
        default: false,
    },

    category:{
        type:String,
        enum:['schoolFinder','institutionFinder','shop','course','home']
    },
    startDate: {
        type: Date,
        default:Date.now(),
        required: true,
    },
    endDate: {
        type: Date,
        default:Date.now(),
        required: true,
    },
    startTime: {
        type: String,
        required: false,
    },
    endTime: {
        type: String,
        required: false,
    },
    
},
    config.mongooseOptions
);
var Ads = mongoose.model("ads", schema);

module.exports = Ads;