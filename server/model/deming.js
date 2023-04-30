var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        userId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        title: String,
        date: Date,
        time: Number,
        isEducation: Boolean,
        testCount: Number,
        educationalStageId: {
            type: config.ObjectId,
            ref: "educationalStage",
            autopopulate: true,
            required: false,
            defualt:null
        },
        educationalFieldId: {
            type: config.ObjectId,
            ref: "educationalField",
            autopopulate: true,
            required: false,
            defualt:null
        },
        categoryId: {
            type: config.ObjectId,
            ref: "category",
            autopopulate: true,
            required: false,
            defualt:null
        },
        
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        },

        type:{
            type:String,
            enum:['study','rest','test','special']
        },
    },
    config.mongooseOptions
);
var Deming = mongoose.model("deming", schema);

module.exports = Deming;

