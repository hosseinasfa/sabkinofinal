require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({

    // userId: {
    //     type: config.ObjectId,
    //     ref: "person",
    // },
        productId:{
            type: config.ObjectId,
            ref: "product",
            autopopulate: true
        },
        periodMentorId:{
            type: config.ObjectId,
            ref: "periodmentor",
            autopopulate: true
        },

        consultingId:{
            type: config.ObjectId,
            ref: "mentorpackagelist",
            autopopulate: true
        },

        ambassadorId:{
            type: config.ObjectId,
            ref: "ambassador",
            autopopulate: true
        },

        withdrawaldetailId:{
            type: config.ObjectId,
            ref: "withdrawalDetail",
            autopopulate: true
        },
        callPaymentId:{
            type: config.ObjectId,
            ref: "callpayment",
            autopopulate: true
        },
        
        // callPaymentId:{
        //     type: config.ObjectId,
        //     ref: "onlinecallpackage",
        //     autopopulate: true
        // },

        // ownerId : String,

        ownerId:{
            type: config.ObjectId,
            ref: "person",
        },

        userId:{
            type: config.ObjectId,
            ref: "person",
        },

        amount: {
            type: Number,
            default: 0,
        },
        count: {
            type: Number,
            default: 0,
        },

        totalPrice: {
            type: Number,
            default: 0,
        },
        totalPriceMonth: {
            type: Number,
            default: 0,
        },
        adminWithdraw: {
            type: Number,
            default : 0
        },
        adminWithdrawMonth : {
            type:String,
        },

        finalPrice: {
            type: Number,
            default: 0,
        },
        totalSell: {
            type: Number,
            default: 0,
        },
        status:{
            type:String,
            default : "outstanding",
            enum:['outstanding','pending','accept','reject',]
        },
        userCount: {
            type: Number,
            default: 0,
        },
        // status: {
        //     type: Boolean,
        //     default: true,
        // },

        type:{
            type:String,
            enum:['shop','onlineCourse','onlineCall','consulting','ambassador']
        },

    },
    config.mongooseOptions
);
var Financial = mongoose.model("financial", schema);

module.exports = Financial;