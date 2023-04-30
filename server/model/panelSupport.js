require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
var rand = require("random-key");

require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: [true, 'User lastName required']
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
    
    password: {
        type: String,
        minlength: 6,
        bcrypt: true,
        default: () => {
            return `${rand.generate(6)}`
        },
    },

    isActive: {
        type: Boolean,
        default: true,
    },

    isDelete: {
        type: Boolean,
        default: false
    },

    class: {
        type: String,
        enum: ['admin', 'productManager','support','accounting','scientificGeneral','scientificEntertainment','scienceNnews'],
        required: [true, 'educationalInstitution type required']
    },

},
    config.mongooseOptions
);
var PanelSupport = mongoose.model("panelSupport", schema);

module.exports = PanelSupport;