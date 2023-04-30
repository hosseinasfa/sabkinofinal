require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
    mentorId: {
        type: config.ObjectId,
        ref: "person",
    },

    channelName : String,
    channelAvatar : String,
    status: {
        type: Boolean,
        default: true,
    },
    isActive:{
        type:Boolean,
        default:true,
    },
    isDelete: {
        type: Boolean,
        default: false,
    },

},
    config.mongooseOptions
);
var Channel = mongoose.model("channel", schema);

module.exports = Channel;