require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");

require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: true,
        default:true,
    }

},
    config.mongooseOptions
);
var MalisonList = mongoose.model("malisonList", schema);

module.exports = MalisonList;