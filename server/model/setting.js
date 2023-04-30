require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        bannerId: {
            type: config.ObjectId,
            ref: "banner",
            autopopulate: true,
            default: null
        },
        mottoId: {
            type: config.ObjectId,
            ref: "motto",
            autopopulate: true,
            default: null
        },
        lastTimeUpdate: {
            type: Date,
            default: null
        },
        siteTitle: {
            type: String,
            default: null,
        },
        siteKeyword: {
            type: String,
            default: true,
        },
        siteDescription: {
            type: String,
            default: true,
        },
        ruleAcademicAdvice: {
            type: String,
            default: null,
        },
        termsConditions: {
            type: String,
            default: null,
        },
        aboutApp: {
            type: String,
            default: null,
        },
        privacyApp: {
            type: String,
            default: null,
        },
        updateText: {
            type: String,
            default: null,
        },
    },
    config.mongooseOptions
);
var Setting = mongoose.model("setting", schema);
module.exports = Setting;