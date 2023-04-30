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
        examPackageId:{
            type: config.ObjectId,
            ref: "exampackage",
            autopopulate: true
        },
        price: {
            type: Number,
            default: 0 
        },
        status: {
            type: Boolean,
            default:false,
        },
    
    },
    config.mongooseOptions
);
var ExamPayment = mongoose.model("exampayment", schema);
module.exports = ExamPayment;