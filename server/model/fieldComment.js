var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        commenter: {
            type: config.ObjectId,
            ref: 'person',
            autopopulate: true,
            required:true
        },
        parent: {
            type: config.ObjectId,
            ref: "field",
            autopopulate: true,
            required:true
        },
        caption: {
            type: String,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        }
    },
    config.mongooseOptions
);
var FieldComment = mongoose.model("fieldComment", schema);

module.exports = FieldComment;