require('dotenv').config()

var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);

var eachFile = new mongoose.Schema({
    filename: {
        type: String,
        default: "",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
        }
    },
    type: {
        type: String,
    },
})

var postSchema = new mongoose.Schema({
    title: {
        type: String,
        default: "",
    },
    avatar: {
        type: String,
        default: "",
    },
    // avatar: {
    //     type: String,
    //     default: "defaultUser.jpg",
    //     get: (v) => {
    //         return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
    //     },

    // },

    caption: {
        type: String,
        default: "",
    },
    rejectionReason: {
        type: String,
        default: "",
    },
    address: {
        type: String,
        default: "",
    },
    tags: [String],
    hashtag :{
        type: String,
        default: "",
    },
    categoryId: {
        type: config.ObjectId,
        ref: "category",
        autopopulate: true
    },
    postCategoryId: {
        type: config.ObjectId,
        ref: "postCategory",
        autopopulate: true
    },
    media: {
        type: Array
    },
    sort: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDelete: {
        type: Boolean,
        default: false
    },
}, {
    ...config.mongooseOptions,
    ...{
        discriminatorKey: 'class',
    }
});
var Post = mongoose.model("post", postSchema);

var postEventSchema = new mongoose.Schema({
    personId: {
        type: config.ObjectId,
        ref: "person",
        autopopulate: true
    },
}, {
    ...config.mongooseOptions,
    ...{
        discriminatorKey: 'class',
    }
})
var PostEvent = Post.discriminator('postEvent', postEventSchema);

var postQuestionSchema = new mongoose.Schema({
    personId: {
        type: config.ObjectId,
        ref: "person",
        autopopulate: true
    },
    selectedCommentId: {
        type: config.ObjectId,
        ref: "postComment",
        autopopulate: true
    },
    categoryId: {
        type: config.ObjectId,
        ref: "category",
        autopopulate: true
    },
    educationalFieldId: {
        type: config.ObjectId,
        ref: "educationalField",
        autopopulate: true,
        default: null
    },
    educationalStageId: {
        type: config.ObjectId,
        ref: "educationalStage",
        autopopulate: true,
        default: null
    },
}, {
    ...config.mongooseOptions,
    ...{
        discriminatorKey: 'class',
    }
})
var PostQuestion = Post.discriminator('postQuestion', postQuestionSchema);

var postEntertainmentSchema = new mongoose.Schema({
    file: {
        type: String,
        default: "defaultUser.jpg",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
        },

    },
    like: {
        type: Number,
        default: 0,
    },
    link: {
        type: String,
        default: "",
    },
    disLike: {
        type: Number,
        default: 0,
    },
}, {
    ...config.mongooseOptions,
    ...{
        discriminatorKey: 'class',
    }
})
var PostEntertainment = Post.discriminator('postEntertainment', postEntertainmentSchema);

var postNewsSchema = new mongoose.Schema({
    file: {
        type: String,
        default: "defaultUser.jpg",
        get: (v) => {
            return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
        }
    },
    like: {
        type: Number,
        default: 0,
    },
    disLike: {
        type: Number,
        default: 0,
    },
    link: {
        type: String,
        default: "",
    },
}, {
    ...config.mongooseOptions,
    ...{
        discriminatorKey: 'class',
    }
})
var PostNews = Post.discriminator('postNews', postNewsSchema);

module.exports = {
    Post,
    PostEvent,
    PostQuestion,
    PostEntertainment,
    PostNews
};