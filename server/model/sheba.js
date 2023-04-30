require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");

require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
    BankId: {
        type: Number,
        default: 0,
    },
    BankName: {
        type: String,
        default: '',
    },

    BankAvatar: {
        type: String,
    },

},
    config.mongooseOptions
);
var Sheba = mongoose.model("sheba", schema);

module.exports = Sheba;