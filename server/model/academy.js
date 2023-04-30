require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);

var schema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'educationalInstitution companyTitle required']
    },
    caption: {
        type: String,
    },
    avatar: {
        type: String,
        default: "defaultUser.jpg",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
        }
    },
    address: {
        type: String,
        required: [false, 'educationalInstitution address required']
    },
    logo: {
        type: String,
        default: "defaultUser.jpg",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
        }
    },
    phone: {
        type: String,
        required: [false, 'educationalInstitution phone required']
    },

    site: {
        type: String,
    },
    boss: {
        type: String,
        required: [true, 'educationalInstitution boss required']
    },
    gender: {
        type: String,
        enum: ['boy', 'girl', 'mixed'],
    },
    type: {
        type: String,
        enum: ['online', 'physical'],
        required: [true, 'educationalInstitution type required']
    },

    establishedYear: {
        type: String,
        required: [true, 'educationalInstitution establishedYear required']
    },

    establishmentNumber: {
        type: String,
        // required: [true, 'educationalInstitution establishmentNumber required']
    },

    // area : {
    //     type: String,
    //     required: [true, 'educationalInstitution area required']
    // },

    rate: {
        type: Number
    },


    bossId: {
        type: config.ObjectId,
        ref: "person",
        autopopulate: false
    },

    // vendorId: {
    //     type: config.ObjectId,
    //     ref: "vendor",
    //     autopopulate: true
    // },
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