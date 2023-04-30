require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        UserIdA: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        UserIdB: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        Mute: {
            type: Boolean,
            default: false,
        },
        Block: {
            type: Boolean,
            default: false,
        },
        message_count: {
            type: Number,
            required: true,
        }, last_message: {
            type: String,
            required: false,
        },

    },
    config.mongooseOptions
);
var ChatList = mongoose.model("chatList", schema);
module.exports = ChatList;