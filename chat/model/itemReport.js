require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var postReportSchema = new mongoose.Schema({
        personId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        refModelName: {
            type: String,
            required: true,
        },
        refId: {
            type: config.ObjectId,
            refPath: 'refModelName',
            autopopulate: true
        },
        title: {
            type: String,
            default: "",
        },
        caption: {
            type: String,
            default: "",
        },
    },
    config.mongooseOptions
);
var ItemReport = mongoose.model("itemReport", postReportSchema);

module.exports = ItemReport;