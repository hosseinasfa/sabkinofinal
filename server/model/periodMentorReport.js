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
        periodMentorId: {
            type: config.ObjectId,
            ref: "periodmentor",
            autopopulate: true
        },
        reportTitle:{
            type:String,
            enum:['Fraud','Copyright','Swear','Spam','Aggressive','Other']
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDelete: {
            type: Boolean,
            default: false
        }

    },
    config.mongooseOptions
);
var PeriodMentorReport = mongoose.model("periodmentorreport", schema);
module.exports = PeriodMentorReport;