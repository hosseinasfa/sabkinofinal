var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        title: String,
        isActive: {
            type: Boolean,
            default: true,
        },
        province_id : {
            type : Number,
        },
        city_id : {
            type : Number,
        },

        isDelete: {
            type: Boolean,
            default: false,
        }
    },
    config.mongooseOptions
);
var District = mongoose.model("district", schema);

module.exports = District;