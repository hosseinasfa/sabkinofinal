require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
// var eachFile = new mongoose.Schema({
//     filename: {
//         type: String,
//         default: "",
//         get: (v) => {
//             return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/post_media/${v}`;
//         }
//     },
//     type: {
//         type: String,
//     },
// });

var schema = new mongoose.Schema({
        postId: {
            type: config.ObjectId,
            ref: "vippst",
            autopopulate: true
        },
        type: {
            type: String,
            enum: ['image', 'video'],
            default: 'image',
        },
        filename: {
            type: String,
            default: null,
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
var VipPstMedia = mongoose.model("vippstmedia", schema);
module.exports = VipPstMedia;