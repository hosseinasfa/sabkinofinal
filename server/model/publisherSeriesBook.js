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
            default:0
        },
        bookRate:{
            type:Number,
            default:0
        },
        bookTimeRate1:{
            type:Number,
            default:0
        },
        bookTimeRate2:{
            type:Number,
            default:0
        },
        bookTimeRate3:{
            type:Number,
            default:0
        },
        bookTimeRate4:{
            type:Number,
            default:0
        },
        bookTimeRate5:{
            type:Number,
            default:0
        },
        bookTimeRate6:{
            type:Number,
            default:0
        },
        bookTimeRate7:{
            type:Number,
            default:0
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
var PublisherSeriesBook = mongoose.model("publisherSeriesBook", schema);

module.exports = PublisherSeriesBook;