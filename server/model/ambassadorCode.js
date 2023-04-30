require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var rand = require("random-key");
var schema = new mongoose.Schema({

    
    firstName: {
        type: String,
        default: ""
    },
    lastName: {
        type: String,
        default: ""
    },
    nationalCode: {
        type: String,
        default: ""
    },
    fatherName: {
        type: String,
        default: ""
    },

    phone: {
        type: String,
        validate: {
            validator: function (v) {
                return /09\d{9}/.test(v);
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
        required: [true, "شماره تماس نیاز است"],
        unique: true,
    },

    referalCode: {
        type: String,
        unique: true,
        default: () => {
            return `${rand.generateDigits(5)}`
        }
    },

    citie: {
        type: String,
        default: ""
    },

    province: {
        type: String,
        default: ""
    },

    isActive: {
        type: Boolean,
        default: true
    },

    // userCount: {
    //     type: Number,
    //     default: 0
    // },

    // familyCount: {
    //     type: Number,
    //     default: 0
    // },

    // mentorCount: {
    //     type: Number,
    //     default: 0
    // },

    // teacherCount: {
    //     type: Number,
    //     default: 0
    // },

    // schoolBossCount: {
    //     type: Number,
    //     default: 0
    // },
    // EducationalInstitutions: {
    //     type: Number,
    //     default: 0
    // },
    

    },
    config.mongooseOptions
);
var AmbassadorCode = mongoose.model("ambassadorCode", schema);

module.exports = AmbassadorCode;