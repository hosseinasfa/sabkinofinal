require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);

var schema = new mongoose.Schema({
        userId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate : true
        },
        title: {
            type : String,
            default : ""
        },
        workBookDate: {
            type: Date,
            default: Date.now(),
        },

        totalPercentage: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false
        },
    },
    config.mongooseOptions
);
var WorkBook = mongoose.model("workbook", schema);
module.exports = WorkBook;