require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({

        personId: {
            type: config.ObjectId,
            ref: "person",
        },

        postId: {
            type: config.ObjectId,
            ref: "post",
        },
        bookMark: {
            type: Boolean,
            required: true,
            default : false,
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDelete: {
            type: Boolean,
            default: false
        }

    },
    config.mongooseOptions
);

var PostBookmark = mongoose.model("postBookmark", schema);

module.exports = PostBookmark;