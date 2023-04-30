var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        title: String,
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
var EducationalStage = mongoose.model("educationalStage", schema);

module.exports = EducationalStage;