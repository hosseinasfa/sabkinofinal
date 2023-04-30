var mongoose = require("mongoose");
const config = require("../config");
var schema = new mongoose.Schema({
        personId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        token: {
            type: String,
            unique: true,
        },
        socketId: String,
        notification: String,
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    config.mongooseOptions
);
var Token = mongoose.model("token", schema);
module.exports = Token;