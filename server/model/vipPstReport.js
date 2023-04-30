require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        userId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        reportTitle:{
            type:String,
            enum:['Fraud','Copyright','Swear','Spam','Aggressive','Other',]
        },
        postId: {
            type: config.ObjectId,
            ref: "vippst",
            autopopulate: true
        },
        
        Handling: {
            type: Boolean,
            default: false,
        },
    },
    config.mongooseOptions
);
var VipPstReport = mongoose.model("vippstreport", schema);
module.exports = VipPstReport;