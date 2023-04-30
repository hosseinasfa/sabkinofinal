require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        publisherId: {
            type: config.ObjectId,
            ref: "publisher",
            autopopulate: true
        },
        title: {
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
        cover: {
            type: String,
            default: "defaultUser.jpg",
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
            }
        },
        caption: {
            type: String,
            default: "",
        },
        cut: {
            type: String,
            default: "",
        },
        hashtag: {
            type: String,
            default: "",
        },
        season:[Number],
        hardRate:{
            type:Number,
        },
        multipleChoiceQuestions:{
            type:Boolean,
            default:false,
        },
        descriptiveQuestions:{
            type:Boolean,
            default:false,
        },
        textbook:{
            type:Boolean,
            default:false,
        },
        concoursQuestions:{
            type:Boolean,
            default:false,
        },
        freeAttachment:{
            type:Boolean,
            default:false,
        },
        descriptiveAnswer:{
            type:Boolean,
            default:false,
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
var PublisherSeries = mongoose.model("publisherSeries", schema);

module.exports = PublisherSeries;