require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        title: {
            type: String,
            default: null,
        },
        message: {
            type: String,
            default: null,
        },
    },
    config.mongooseOptions
);
var NotificationHistory = mongoose.model("notificationHistory", schema);
module.exports = NotificationHistory;