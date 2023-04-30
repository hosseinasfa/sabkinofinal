require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        userId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true,
            required: true
        },
        productId: {
            type: config.ObjectId,
            ref: "product",
            autopopulate: true,
            required : true
        },
        commentText: {
            type: String,
            default: null,
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
var ShopComment = mongoose.model("shopComment", schema);
module.exports = ShopComment;