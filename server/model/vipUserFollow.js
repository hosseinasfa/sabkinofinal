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
        followUserId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
    },
    config.mongooseOptions
);
var VipUserFollow = mongoose.model("vipuserfollow", schema);
module.exports = VipUserFollow;