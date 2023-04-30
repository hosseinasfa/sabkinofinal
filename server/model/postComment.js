require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({

        personId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },

        postId: {
            type: config.ObjectId,
            ref: "post",
            autopopulate: true
        },
        type: {
            type: String,
            enum: ["news","entertainment"],
            default:"news"
        },
        caption: {
            type: String,
            required: true,
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

var PostComment = mongoose.model("postComment", schema);

module.exports = PostComment;