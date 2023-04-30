require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        title: String,
        avatar: {
            type: String,
            default: "defaultUser.jpg",
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
            }
        },
        establishedYear: Date,
        rate: {
            type: Number
        },
        caption: String,
        logo: {
            type: String,
            default: "defaultUser.jpg",
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
            }
        },
        sex: {
            type: Boolean,
            default: true,
        },
        phone: String,
        boss: String,
        type:String,
        site:String,
        vendorId: {
            type: config.ObjectId,
            ref: "vendor",
            autopopulate: true
        },
        provinceId: {
            type: config.ObjectId,
            ref: "province",
            autopopulate: true
        },
        cityId: {
            type: config.ObjectId,
            ref: "city",
            autopopulate: true
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        }
    },
    config.mongooseOptions
);
var Academy = mongoose.model("academy", schema);
module.exports = Academy;