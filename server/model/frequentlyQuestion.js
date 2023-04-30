require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        cat_id:{
            type: config.ObjectId,
            ref: "frequentlyquestioncategories",
            autopopulate: true
        },
        question: {
            type: String,
            default: null,
        },
        answer: {
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
var FrequentlyQuestion = mongoose.model("frequentlyquestion", schema);
module.exports = FrequentlyQuestion;