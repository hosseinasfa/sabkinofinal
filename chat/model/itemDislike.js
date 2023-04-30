require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var postLikeSchema = new mongoose.Schema({
        personId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        refModelName: {
            type: String,
            required: true,
        },
        refId:{
            type: config.ObjectId,
            refPath: 'refModelName',
            autopopulate: true
        },
        rate:{
            type:Number,
            default:1,
        }
    },
    config.mongooseOptions
);
postLikeSchema.index({
    personId: 1,
    refId: 1,
}, {
    unique: true,
});
var ItemDislike = mongoose.model("itemDislike", postLikeSchema);

module.exports = ItemDislike;