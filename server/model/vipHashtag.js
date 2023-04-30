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
        hashtagId: {
            type: config.ObjectId,
            ref: "hashtag",
            autopopulate: true
        },
    },
    config.mongooseOptions
);
var VipHashtag = mongoose.model("viphashtag", schema);
module.exports = VipHashtag;