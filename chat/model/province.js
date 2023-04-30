var mongoose = require("mongoose");
require('mongoose-schema-jsonschema')(mongoose);
const config = require("../config");
var schema = new mongoose.Schema({
        title: String,
        slug: String,
        id: Number,
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

var Province = mongoose.model("province", schema);
module.exports = Province;