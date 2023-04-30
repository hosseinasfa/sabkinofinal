require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");

require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
    title: {
        type: String,
        default: "",
    },
    url: {
        type: String,
        default: "",
        required: [true, 'Why no url?']
    },
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
var EducationalFilm = mongoose.model("educationalFilm", schema);

module.exports = EducationalFilm;