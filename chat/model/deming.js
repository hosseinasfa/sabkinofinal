var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        userId: {
            type: config.ObjectId,
            ref: "user",
            autopopulate: true
        },
        title: String,
        date: Date,
        time: String,
        isEducation: Boolean,
        countTest: Number,
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        }
    },
    config.mongooseOptions
);
var Deming = mongoose.model("deming", schema);

module.exports = Deming;