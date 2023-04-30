var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        commissionPrice: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        },

        userType:{
            type:String,
            enum:['user','family','teacher','mentor','education','school']
        },
    },
    config.mongooseOptions
);
var CommissionRef = mongoose.model("commissionRef", schema);

module.exports = CommissionRef;

