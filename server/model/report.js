require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);
var schema = new mongoose.Schema({
    // userId: {
    //     type: config.ObjectId,
    //     ref: "person",
    // },
    channelId: {
        type: config.ObjectId,
        ref: "channel",
        autopopulate: true
    },
    contentId: {
        type: config.ObjectId,
        ref: "channelcontent",
        autopopulate: true
        
    },
    productId: {
        type: config.ObjectId,
        ref: "product",
        autopopulate: true
        
    },

    reportUserId: {
        type: config.ObjectId,
        ref: "person",
        autopopulate: true
    },

    postId: {
        type: config.ObjectId,
        ref: "post",
        autopopulate: true
    },
    postCommentId: {
        type: config.ObjectId,
        ref: "itemComment",
        autopopulate: true
    },
    reportTitle:{
        type:String,
        enum:['Fraud','Copyright','Swear','Spam','Aggressive','Other',]
    },

    type:{
        type:String,
        enum:['decor','onlineCourses','channel','shop','postQuestion','postComment','scheduling']
    },
    Handling: {
        type: Boolean,
        default: false,
    },
},
    config.mongooseOptions
);
var Report = mongoose.model("report", schema);

module.exports = Report;