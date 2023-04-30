require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);

var categorySchema = new mongoose.Schema({
    title: String,
    parent: {
      type: config.ObjectId,
      ref: "category",
      autopopulate: true
    },
    educationalStageId: {
      type: config.ObjectId,
      ref: "educationalStage",
      autopopulate: true
    },
    educationalFieldId:{
      type: config.ObjectId,
      ref: "educationalField",
      autopopulate: true
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: "",
      get: (v) => {
          return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
      }
  },
    type:{
      type:String,
      enum:['Posts','News','Entertiament',]
  },
  },
  config.mongooseOptions
);
var Category = mongoose.model("category", categorySchema);
module.exports = Category