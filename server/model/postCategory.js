require('dotenv').config()
var mongoose = require("mongoose");
const config = require("../config");
require('mongoose-schema-jsonschema')(mongoose);

var Schema = new mongoose.Schema({
  title: String,
  avatar: {
    type: String,
    default: "defaultUser.jpg",
    get: (v) => {
        return `${process.env.BASE_URL}${process.env.UPLOAD_URL}/files/${v}`;
    }
  },
  type: {
    type: String,
    enum: ['Posts', 'News', 'Entertiament',]
  },

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
var PostCategory = mongoose.model("postCategory", Schema);
module.exports = PostCategory