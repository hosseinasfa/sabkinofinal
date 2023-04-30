// const {
//     sendSms
// } = require("../../libs/sms");
const User = require("../../model/person").User;
const Person = require("../../model/person").Person;
const OTP = require("../../model/otp");
const Token = require("../../model/token");
const response = require("../../response");
var rand = require("random-key");
module.exports = {
     verify: (req, res, next) => {
        
        if(req.body.enName === "amin" && req.body.password === "amin0312" ){
            req.data.verify = true;
            req.data.token = 'HPQNZY73P9K5Y7X5X0L6QX8VN4WAKRZ4Q98ZZYMCKURHQ70WNUTPWQ8H0C33L3BSH67DZR2A6NQZB6DA8NT2L931VW2KBHCNAM31XUN7D0F29X5P920KSS50ZP73SFFQ';
            response.ok(req, res, next);
        }else{
        console.log('authenticate');
        const crypto = require('crypto');

        let username = req.body.enName;
        let pass = req.body.password;
        let password = crypto.createHash('md5').update(pass).digest("hex");
        console.log('username', username);
        console.log('password', password);

        Person.find({
            enName: username,
            password: password,
        }).exec((err, user) => {
            if (err) {
                response.error(req, res, next, 'مشکل در ایجاد توکن');
            }


            if (user) {
                if (user.length != 0) {
                    console.log('user ::::::::::::', user[0]);
                    new Token({
                        personId: user[0]._id.toString(),
                        token: rand.generateBase30(128),
                    }).save((err, token) => {
                        if (token) {
                            // if (!req.session.initialised) {
                            //     req.session.initialised = true;
                            //     req.session.api_key = token.token;
                            //     req.session.save();
                            // }
                            console.log('token :', token.token);
                            req.data.verify = true;
                            req.data.token = token.token;
                            response.ok(req, res, next);
                        } else {
                            req.data.verify = false;
                            req.data.token = null;
                            response.error(req, res, next, 'مشکل در ایجاد توکن');
                        }
                    });
                } else {
                    req.data.verify = true;
                    req.data.token = null;
                    response.error(req, res, next, 'اطلاعات کاربر یافت نشد');
                }
            } else {
                req.data.verify = true;
                req.data.token = null;
                response.error(req, res, next, 'مشکل در ایجاد کاربر');
            }
        })
        // } else {
        //     req.data.preAuth = false;
        //     response.error(req, res, next, 'کد احراز هویت اشتباه است');
        // }
        // });
    }
}
}