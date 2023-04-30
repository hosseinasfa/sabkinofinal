require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var moment = require('moment');

var schema = new mongoose.Schema({
        userId: {
            type: config.ObjectId,
            ref: "person",
            required: true
        },
        PackageId: {
            type: config.ObjectId,
            ref: "package",
            required: [true, 'Why no PackageId?']
        },

        reservePackage: {
            type: Boolean,
            default: false,
        },

        duration: {
            type: Number,
            default: 0,
        },
        startPackage: {
            type: Date,
            default: new Date()
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        },

    },
    config.mongooseOptions
);
var PackageList = mongoose.model("packageList", schema);

module.exports = PackageList;