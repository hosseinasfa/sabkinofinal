require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        userId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        postId: {
            type: config.ObjectId,
            ref: "vippst",
            autopopulate: true
        },
        replyId: {
            type: config.ObjectId,
            ref: "vippstcomment",
            autopopulate: true,
            default:null,
        },
        isReply:{
            type:Boolean,
            default:false,
        },
        commentText: {
            type:String
        },
        isActive: {
            type:Boolean,
            default:true,
        },
        isDelete: {
            type:Boolean,
            default:false,
        },
    },
    config.mongooseOptions
);
var VipPstComment = mongoose.model("vippstcomment", schema);
module.exports = VipPstComment;