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
        refModelName: {
            type: String,
            required: true,
        },
        refId: {
            type: config.ObjectId,
            refPath: 'refModelName',
            autopopulate: true
        },
    },
    config.mongooseOptions
);
schema.index({
    personId: 1,
    refId: 1,
}, {
    unique: true,
});
var ItemBookmark = mongoose.model("itemBookmark", schema);

module.exports = ItemBookmark;