require('dotenv').config()
const { ObjectId, ObjectID } = require('bson');
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
    mentorId: {
        type: config.ObjectId,
        ref: "person",
        autopopulate: true
    },
    channelId: {
        type: config.ObjectId,
        ref: "channel",
        autopopulate: true
    },
    text: {
        type: String,
        default: "",
    },

    media: {                
        type:Array
    },

    reply: {
        type: Object,
    },

    isActive: {
        type: Boolean,
        default:true,
    },

    isDelete: {
        type: Boolean,
        default:false,
    },
    
},
    config.mongooseOptions
);
var ChannelContent = mongoose.model("channelcontent", schema);

module.exports = ChannelContent;