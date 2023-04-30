require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        parent: {
            type: config.ObjectId,
            ref: "education",
            autopopulate: true
        },
        publisherId: {
            type: config.ObjectId,
            ref: "publisher",
            autopopulate: true
        },
        publisherSeriesId: {
            type: config.ObjectId,
            ref: "publisherSeries",
            autopopulate: true
        },
        title: {
            type: String,
            default: "",
        },
        stage: {
            type: String,
            default: "",
        },
        field: {
            type: String,
            default: "",
        },
        avatar: {
            type: String,
            default: "defaultUser.jpg",
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
            }
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
var PublisherSeriesBook = mongoose.model("publisherSeriesBook", schema);

module.exports = PublisherSeriesBook;