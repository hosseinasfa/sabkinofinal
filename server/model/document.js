var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
        title: {
            type: String,
            default: ""
        },
        titleKey: {
            type: String,
            enum: ["AboutUs", "PrivacyApp", "ConsultingContract", "TermsConditions"],
            default: "AboutUs"
        },
        fileAddress: {
            type: String,
            default: '',
            get: (v) => {
                return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/documents/${v}`;
            }
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
var Document = mongoose.model("document", schema);

module.exports = Document;