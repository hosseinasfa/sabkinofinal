require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
    AmbassadorCodeId : {
        type: config.ObjectId,
        ref: "ambassadorCode",
        // autopopulate: true
      }, 

    financialId : {
        type: config.ObjectId,
        ref: "financial",
    },

    userCount: {
        type: Number,
        default: 0
    },

    familyCount: {
        type: Number,
        default: 0
    },

    mentorCount: {
        type: Number,
        default: 0
    },

    teacherCount: {
        type: Number,
        default: 0
    },

    schoolBossCount: {
        type: Number,
        default: 0
    },
    EducationalInstitutions: {
        type: Number,
        default: 0
    },  

    status:{
        type:String,
        default : "pending",
        enum:['pending','accept']
    },
    },
    config.mongooseOptions
);
var Ambassador = mongoose.model("ambassador", schema);

module.exports = Ambassador;