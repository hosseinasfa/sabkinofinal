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
        required: [true, 'educationalInstitution companyTitle required']
    },

    avatar: {
        type: String,
        default: "defaultUser.jpg",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
        }
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
        required: [true, 'educationalInstitution companyTitle required']
    },

    site: {
        type: String,
        required: [true, 'educationalInstitution companyTitle required']
    },
    boss: {
        type: String,
        required: [true, 'educationalInstitution companyTitle required']
    },

    address: {
        type: String,
        required: [true, 'educationalInstitution companyTitle required']
    },

    studentCount: {
        type:Number,
        default:0
    },
    area: {
        type:Number,
        default:0
    },
    classCount: {
        type:Number,
        default:0
    },

    floorCount: {
        type:Number,
        default:0
    },

    libraryCount:{
        type:Number,
        default:0
    },

    laboratoryCount:{
        type:Number,
        default:0
    },
    smartClassCount:{
        type:Number,
        default:0
    },

    wcCount:{
        type:Number,
        default:0
    },

    prayerRoomCount:{
        type:Number,
        default:0
    },

    conferenceRoomCount:{
        type:Number,
        default:0
    },

    computerSalonCount:{
        type:Number,
        default:0
    },

    stadiumCount:{
        type:Number,
        default:0
    },

    buffetCount:{
        type:Number,
        default:0
    },

    dinningSalonCount:{
        type:Number,
        default:0
    },
    sex: {
        type: String,
        enum: ['boyish', 'girly'],
        required: [true, 'educationalInstitution type required']
    },

    type: {
        type: String,
        enum: ['Talented', 'Governmental', 'GovernmentSample', 'hOmanayi', 'Witness', 'NonProfit'],
        required: [true, 'schoolBoss type required']
    },
    establishedYear: {
            type: String,
            required: [true, 'educationalInstitution companyTitle required']
    },
       
        
        
    rate: {
            type: Number
    },
       
        
        
        bossId:{
            type: config.ObjectId,
            ref: "person",
            autopopulate: true
        },
        type:String,
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

        library:{
            type: Boolean,
            default: false,
        },
       

        laboratory:{
            type: Boolean,
            default: false,
        },
       

        smartClass:{
            type: Boolean,
            default: false,
        },
        

        wc:{
            type: Boolean,
            default: false,
        },
        

        prayerRoom:{
            type: Boolean,
            default: false,
        },
        

        conferenceRoom:{
            type: Boolean,
            default: false,
        },
        

        computerSalon:{
            type: Boolean,
            default: false,
        },
        
        stadium:{
            type: Boolean,
            default: false,
        },
        

        buffet:{
            type: Boolean,
            default: false,
        },
       

        dinningSalon:{
            type: Boolean,
            default: false,
        },
        

        academicAdviser:{
            type: Boolean,
            default: false,
        },
        academicAdviserCount:{
            type:Number,
            default:0
        },

        psychologicalConsultant:{
            type: Boolean,
            default: false,
        },
        psychologicalConsultantCount:{
            type:Number,
            default:0
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
var School = mongoose.model("school", schema);

module.exports = School;