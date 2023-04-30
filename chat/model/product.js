require('dotenv').config()
var mongoose = require("mongoose");
const {
    ObjectId
} = require("../config");
var config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);

var schema = new mongoose.Schema({
        status:{
            type:String,
            default:'pending',
            enum:['accept','reject','pending']
        },
        rejectCaption:String,
        avatar: {
            type: String,
            default: "defaultUser.png",
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
            },
        },
        title: {
            type: String,
            default: "",
        },
        caption: {
            type: String,
            default: "",
        },
        rate:Number,
        price: {
            type: Number,
            default:0,
            min:0
        },
        educationalFieldId:{
            type: config.ObjectId,
            ref: "educationalField",
            autopopulate: true
        },
        educationalStageId:{
            type: config.ObjectId,
            ref: "educationalStage",
            autopopulate: true
        },
        titleLesson: {
            type: String,
            default: "",
        },
        tags:[String],
        samplePdf: {
            type: String,
            default: "defaultUser.png",
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
            },
        },
        originPdf: {
            type: String,
            default: "defaultUser.png",
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
            },
        },
        author:{
            type: String,
            default: "",
        },
        personId: {
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        sellCount:{
            type:Number,
            default:0,
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
var Product = mongoose.model("product", schema);
module.exports = Product;