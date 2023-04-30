require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);

var schema = new mongoose.Schema({
        userId: {
            type: config.ObjectId,
            ref: "user",
            autopopulate: true
        },
        quizId: {
            type: config.ObjectId,
            ref: "quiz",
            autopopulate: true
        },
        answer:[String],
        startDate:Date,
        endDate:Date,
        isActive: {
            type: Boolean,
            default: true,
        },
        isDelete: {
            type: Boolean,
            default: false,
        },
    },
    config.mongooseOptions
);
var QuizAnswer = mongoose.model("quizAnswer", schema);
module.exports = QuizAnswer