var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        title: String,
        slug: String,
        id: Number,
        province_id: {
            type: Number,
            ref: "province",
        },
        latitude: Number,
        longitude: Number,
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
var City = mongoose.model("city", schema);

module.exports =City;