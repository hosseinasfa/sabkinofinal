var mongoose = require("mongoose");
const config = require("../config");
var schema = new mongoose.Schema({
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
        code: String,
    },
    config.mongooseOptions
);
var OTP = mongoose.model("otp", schema);
module.exports = OTP;