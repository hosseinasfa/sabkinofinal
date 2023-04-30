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
    downloadLink: {
        type: String,
        default: "default.pdf",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
        }
    },
    generalitiesAndDefinitions:{
        type: String,
        default: "",
    },
    applications:{
        type: String,
        default: "",
    },
    difficulties:{
        type: String,
        default: "",
    },
    continueEducation:{
        type: String,
        default: "",
    },
    careerFuture:{
        type: String,
        default: "",
    },
    universityCourses:{
        type: String,
        default: "",
    },
    skillsRequired:{
        type: String,
        default: "",
    },
    personalityType:{
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
var Field = mongoose.model("field", schema);

module.exports = Field;