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
        reportUserId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        reportTitle:{
            type:String,
            enum:['Fraud','Copyright','Swear','Spam','Aggressive','Other',]
        },
    },
    config.mongooseOptions
);
var ChatUserReport = mongoose.model("chatUserReport", schema);
module.exports = ChatUserReport;