require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
    
    title: {
        type: String,
        required: [true, 'school companyTitle required']
    },
    caption: {
        type: String,
        // required: [true, 'school companyTitle required']
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
        // required: [true, 'school companyTitle required']
    },

    site: {
        type: String,
        // required: [true, 'school companyTitle required']
    },
    boss: {
        type: String,
        // required: [true, 'school companyTitle required']
    },

    address: {
        type: String,
        // required: [true, 'school companyTitle required']
    },
    

    district: {
        type: config.ObjectId,
        ref: "district",
        autopopulate: true,
    },

    studentCount: {
        type:Number,
       
    },
    yard: {
        type:Number,
     
    },
    classCount: {
        type:Number,
    },

    floorCount: {
        type:Number,
       
    },

    libraryCount:{
        type:Number,
       
    },

    laboratoryCount:{
        type:Number,
       
    },
    smartClassCount:{
        type:Number,
       
    },

    wcCount:{
        type:Number,
       
    },

    prayerRoomCount:{
        type:Number,
       
    },

    conferenceRoomCount:{
        type:Number,
       
    },

    computerSalonCount:{
        type:Number,
       
    },

    stadiumCount:{
        type:Number,
       
    },

    buffetCount:{
        type:Number,
       
    },

    dinningSalonCount:{
        type:Number,
       
    },
    gender: {
        type: String,
        enum: ['boy', 'girl'],
    },

    type: {
        type: String,
        enum: ['Talented', 'Governmental', 'GovernmentSample', 'hOmanayi', 'Witness', 'NonProfit'],
        required: [true, 'schoolBoss type required']
    },
    establishedYear: {
            type: String,
            // required: [true, 'school companyTitle required']
    },
    establishmentNumber: {
        type: String,
        required: [true, 'schoolBoss establishmentNumber required']
    },
    area: {
        type:Number,
    },
    provinceId: {
        type: config.ObjectId,
        ref: "province",
        autopopulate: true,
        required: [true, 'User provinceId required']
    },
    cityId: {
        type: config.ObjectId,
        ref: "city",
        autopopulate: true,
        required: [true, 'User cityId required']
    },
        
    // rate: {
    //         type: Number
    // },
       
        
        
        bossId:{
            type: config.ObjectId,
            ref: "person",
            autopopulate: false
        },
        
        library:{
            type: Boolean,
           
        },
       

        laboratory:{
            type: Boolean,
           
        },
       

        smartClass:{
            type: Boolean,
           
        },
        

        wc:{
            type: Boolean, 
        },
        

        prayerRoom:{
            type: Boolean,
        },
        

        conferenceRoom:{
            type: Boolean,
        },
        

        computerSalon:{
            type: Boolean,
        },
        
        stadium:{
            type: Boolean,
        },
        

        buffet:{
            type: Boolean, 
        },
       

        dinningSalon:{
            type: Boolean,
        },
        

        // academicAdviser:{
        //     type: Boolean,
        //    
        // },
        // academicAdviserCount:{
        //     type:Number,
        //     default:0
        // },

        // psychologicalConsultant:{
        //     type: Boolean,
        //     default: false,
        // },
        // psychologicalConsultantCount:{
        //     type:Number,
        //     default:0
        // },
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