require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        userIdReport: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        mentorIdReport: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        setPackageId: {
            type: config.ObjectId,
            ref: "setprogrampayment",
            autopopulate: true
        },
        reportTitle:{
            type:String,
            enum:['Fraud','Copyright','Swear','Spam','Aggressive','Other']
        },
        Handling: {
            type: Boolean,
            default: false,
        },

    },
    config.mongooseOptions
);
var SetProgramListReport = mongoose.model("setprogramlistreport", schema);
module.exports = SetProgramListReport;