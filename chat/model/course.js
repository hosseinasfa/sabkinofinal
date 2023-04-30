require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);

var schema = new mongoose.Schema({
        academyId: {
            type: config.ObjectId,
            ref: "academy",
            autopopulate: true
        },
        title: {
            type: String,
            default: "",
        },
        teacherName:String,
        startDate:String,
        startTime:String,
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
var Course = mongoose.model("course", schema);
module.exports = Course