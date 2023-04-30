require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var eachFile = new mongoose.Schema({
    filename: {
        type: String,
        default: "",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/post_media/${v}`;
        }
    },
    type: {
        type: String,
    },
})
var schema = new mongoose.Schema({
        userId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        title: {
            type: String,
            default: "",
        },
        caption: {
            type: String,
            default: "",
        },
        avatar: {
            type: String,
            default: "",
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/pst_media/${v}`;
            }
        },
        tags: [String],
        description: {
            type: String,
            required: false,
            default:""
        },
        postLike: {
            type: Number,
            default: 0
        },
        postSaved: {
            type: Number,
            default: 0
        },
        userName: {
            type: String,
            default: null
        },
        postComment: {
            type: Number,
            default: 0
        },
        postTopRate: {
            type: Number,
            default: 0
        },
        sort: {
            type: Number,
            default: 0,
        },
        startDate: {
            type: Date,
            default:Date.now(),
        },
        endDate: {
            type: Date,
            default:Date.now(),
        },
        startTime: {
            type: String,
            default:null,
        },
        endTime: {
            type: String,
            default:null,

        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false
        },
    },
    config.mongooseOptions
);
var VipPst= mongoose.model("vippst", schema);
module.exports = VipPst;