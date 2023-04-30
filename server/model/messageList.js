require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        sendUserId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        reciveUserId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        message: {
            type: String,
            required: true,
        },
        replyId: {
            type: config.ObjectId,
            ref: "messageList",
            autopopulate: true,
            default:null
        },
        is_delete: {
            type: Boolean,
            default:false,
            required: false,
        },
        is_delete_receive: {
            type: Boolean,
            default:false,
            required: false,
        },
        is_seen: {
            type: Boolean,
            default:false,
            required: false,
        },
        image: {
            type: String,
            default: '',
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/chat_content/chat_image/${v}`;
            }
        },

        file: {
            type: String,
            default: '',
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/chat_content/chat_file/${v}`;
            }
        },

        video: {
            type: String,
            default: '',
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/chat_content/chat_video/${v}`;
            }
        },

        type: {
            type: String,
            required: true,
        },
    },
    config.mongooseOptions
);
var MessageList = mongoose.model("messageList", schema);
module.exports = MessageList;