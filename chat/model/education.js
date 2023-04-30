require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var wordListSchema = new mongoose.Schema({
        filename: {
            type: String,
            default: "",
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
            }
        },
        originWord:{
            type:String,
            default:"",
        },
        meaningWord:{
            type:String,
            default:"",
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
        },
    },
    config.mongooseOptions
);
var schema = new mongoose.Schema({
        parent: {
            type: config.ObjectId,
            ref: "education",
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
        caption: {
            type: String,
            default: "",
        },
        educationalFieldId: {
            type: config.ObjectId,
            ref: "educationalField",
            autopopulate: true
        },
        educationalStageId: {
            type: config.ObjectId,
            ref: "educationalStage",
            autopopulate: true
        },
        class: {
            type: String,
                enum: ['words', 'dictation', 'VocabularyTraining'],
        },
        downloadLink: {
            type: String,
            default: "defaultUser.jpg",
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
            }
        },
        wordList:[wordListSchema],
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
var Education = mongoose.model("education", schema);

module.exports = Education;