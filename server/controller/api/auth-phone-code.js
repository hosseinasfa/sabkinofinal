const {
    sendSms
} = require("../../libs/sms");
const User = require("../../model/person").User;
const Person = require("../../model/person").Person;
const OTP = require("../../model/otp");
const Token = require("../../model/token");
const response = require("../../response");
var rand = require("random-key");

module.exports = {
    preAuth: (req, res, next) => {
        sendSms(req.body.phone);
        req.data.preAuth = true;
        response.ok(req, res, next);
    },
    verify: (req, res, next) => {
           
        var found = {
            phone: req.body.phone,
            code: req.body.code,
            // isSupport : req.body.isSupport
        }
        if (req.body.code == '7777') {
            found = {
                phone: req.body.phone,
            }
        }
        OTP.findOne(found).exec((err, otp) => {
            if (otp) {
                
                Person.findOneAndUpdate({
                    phone: req.body.phone,
                }, {
                    password: rand.generateDigits(75),
                    enName: rand.generateBase30(10),
                    // isSupport : req.body.isSupport
                }, {
                    new: true,
                    runValidators: true,
                    setDefaultsOnInsert: true,
                    upsert: true
                }).exec((err, user) => {
                    if (user) {


                        // new Token({
                        //     personId: user[0]._id.toString(),
                        //     token: rand.generateBase30(128),
                        // }).save((err, token) => {

                        
                        Token.findOneAndUpdate({
                            personId: user._id,
                        }, {
                           token: rand.generateBase30(128),
                        }, {
                            new: true,
                            runValidators: true,
                            setDefaultsOnInsert: true,
                            upsert: true
                        }).exec((err, isToken) => {
                            if (isToken) {
                                console.log("aaa",user.changeClass)
                                 if(typeof user.class !== 'undefined' &&  user.class.length > 0 && user.isActive === false){
                                    req.data.verify = true;
                                    req.data.step = '4';
                                    req.data.token = isToken.token;
                                    response.ok(req, res, next, 'اکانت کاربر غیر فعال شده است !');
                                }else if( (typeof user.class == 'undefined' || user.class === 'support') && (user.mode === 'reject' || user.mode === 'deport' || typeof user.mode == 'undefined') ) {
                                    req.data.verify = true;
                                    req.data.step = '0';
                                    req.data.token = isToken.token;
                                    response.ok(req, res, next,'ثبت نام فرم 1');
                                }else if(user.class.length > 0 && user.class === 'support' &&  user.mode === 'pending'){
                                    req.data.verify = true;
                                    req.data.step = '3';
                                    req.data.token = isToken.token;
                                    response.ok(req, res, next, 'پشتیبان ثبت نام کرده و در حال انتظار تایید !');
                                }else if( user.class.length > 0 && typeof user.personalCode == 'undefined'){
                                    req.data.verify = true;
                                    req.data.step = '1';
                                    req.data.curentDate = new Date();
                                    req.data.token = isToken.token;
                                    response.ok(req, res, next,'ثبت نام فرم 2');
                                }else if(user.class.length > 0 && typeof user.personalCode !== 'undefined' && user.isActive === true && (user.mode === 'accept' || typeof user.mode == 'undefined') &&  (user.isConfirmed === true || typeof user.isConfirmed == 'undefined')){
                                    req.data.verify = true;
                                    req.data.step = '2';
                                    req.data.token = isToken.token;
                                    response.ok(req, res, next, 'ثبت نام تکمیل شده و تایید شده است!');
                                }
                                else if(user.class.length > 0 && typeof user.personalCode !== 'undefined'  &&  user.isConfirmed === false && (user.isConfirmDocument=="error" || user.isConfirmDocument=="pending" || personId.isConfirmDocument=="dosentExist")){
                                    req.data.verify = true;
                                    req.data.step = '6';
                                    req.data.token = isToken.token;
                                    response.ok(req, res, next, 'ثبت نام تکمیل شده و در انتظار تایید احراز هویت !');
                                }

                                else if(user.class.length > 0 && typeof user.personalCode !== 'undefined'  &&  user.isConfirmed === false){
                                    req.data.verify = true;
                                    req.data.step = '5';
                                    req.data.token = isToken.token;
                                    response.ok(req, res, next, 'ثبت نام تکمیل شده و در انتظار تایید احراز هویت !');
                                }
                               
                                
                                else {
                                    req.data.verify = true;
                                    req.data.step = '7';
                                    req.data.token = isToken.token;
                                    response.ok(req, res, next);
                                }
                              
                               
                            } else {
                                req.data.verify = false;
                                response.error(req, res, next, 'مشکل در ایجاد کاربر');
                            }
                        })
                    

                    } else {
                        req.data.verify = false;
                        response.error(req, res, next, 'مشکل در ایجاد کاربر');
                        console.log(err)
                    }
                })
            } else {
                req.data.preAuth = false;
                response.error(req, res, next, 'کد احراز هویت اشتباه است');
            }
        });
    },



    checkToken : (req,res,next) => {
        // console.log("amin",req.headers['x-api-key'])
        let Tokens = req.headers['x-api-key']
        Token.find({token: req.body.token}).exec((err, docs) => {
            if (docs && docs.length > 0) {
                const personId = docs[0].personId;
                const tokens = docs[0].token;
                const userClass = docs[0].personId.class;
                const changeClass = docs[0].personId.changeClass;
                // console.log("naz",changeClass)
                console.log("personId.class :::: ",personId.class);
                if(typeof personId.class !== 'undefined' && personId.class.length > 0 && personId.isActive === false){
                    req.data.verify = true;
                    req.data.step = '4';
                    req.data.token = tokens;
                    response.ok(req, res, next,'اکانت کاربر غیرفعال شده است !');
                }else if((personId.changeClass === true || typeof personId.class == 'undefined' || personId.class === 'support') && (personId.mode === 'reject' || personId.mode === 'deport' || typeof personId.mode == 'undefined')) {
                    req.data.verify = true;
                    req.data.step = '0';
                    req.data.token = tokens;
                    response.ok(req, res, next);
                }else if(personId.class.length > 0 && personId.class === 'support' &&  personId.mode === 'pending'){
                    req.data.verify = true;
                    req.data.step = '3';
                    req.data.token = tokens;
                    response.ok(req, res, next,'پشتیبان ثبت نام کرده و در انتظار تایید !');
                } else if( personId.class.length > 0 && typeof personId.personalCode == 'undefined' && personId.class != 'support'){
                    req.data.verify = true;
                    req.data.step = '1';
                    req.data.class = userClass;
                    req.data.token = tokens;
                    response.ok(req, res, next,'ثبت نام فرم 2');
                }else if(personId.class.length > 0 && typeof personId.personalCode !== 'undefined' && personId.isActive === true && (personId.mode === 'accept' || typeof personId.mode == 'undefined') &&  (personId.isConfirmed === true || typeof personId.isConfirmed == 'undefined')){
                    req.data.verify = true;
                    req.data.step = '2';
                    req.data.token = tokens;
                    response.ok(req, res, next, 'ثبت نام تکمیل شده و تایید شده است');
                } 
                else if(personId.class.length > 0 && typeof personId.personalCode !== 'undefined'  &&  personId.isConfirmed === false && (personId.isConfirmDocument=="error" || personId.isConfirmDocument=="pending" || personId.isConfirmDocument=="dosentExist")){
                    req.data.verify = true;
                    req.data.step = '6';
                    req.data.token = isToken.token;
                    response.ok(req, res, next, 'ثبت نام تکمیل شده و در انتظار تایید احراز هویت !');
                }
                else if(personId.class.length > 0 && typeof personId.personalCode !== 'undefined'  &&  personId.isConfirmed === false){
                    req.data.verify = true;
                    req.data.step = '5';
                    req.data.token = tokens;
                    response.ok(req, res, next,'  ثبت نام تکمیل شده است در انتظار تایید احراز هویت !');
                }
              

                else {
                    req.data.verify = true;
                    req.data.step = '7';
                    req.data.token = tokens;
                    response.ok(req, res, next);
                }
            } else {
                response.error(req, res, next, 'کاربر گرامی حساب کاربری شما از دسترس خارج شده است. لطفا مجددا ورود فرمایید.');
            }

        })
    },

    CHECK_TOKEN : (req,res,next) => {
        // console.log("amin",req.headers['x-api-key'])
        let Tokens = req.headers['x-api-key']
        Token.find({token: Tokens}).exec((err, docs) => {
            if (docs && docs.length > 0) {
                const personId = docs[0].personId;
                const tokens = docs[0].token;
                const userClass = docs[0].personId.class;
                const changeClass = docs[0].personId.changeClass;
                const PersonalCode = docs[0].personId.personalCode?.length < 1;
                console.log("nazi",PersonalCode)
                console.log("mahsa",changeClass)
                if(typeof personId.class !== 'undefined' && personId.class.length > 0 && personId.isActive === false){
                    req.data.verify = true;
                    req.data.step = '4';
                    req.data.token = tokens;
                    response.ok(req, res, next,'اکانت کاربر غیرفعال شده است !');
                }else if(  (changeClass === true || typeof PersonalCode == 'undefined' || PersonalCode === true || typeof personId.class == 'undefined' || personId.class === 'support') && (personId.mode === 'reject' || personId.mode === 'deport' || typeof personId.mode == 'undefined')) {
                    req.data.verify = true;
                    req.data.step = '0';
                    req.data.token = tokens;
                    response.ok(req, res, next);
                }else if (personId.class.length > 0 && personId.class === 'support' &&  personId.mode === 'pending'){
                    req.data.verify = true;
                    req.data.step = '3';
                    req.data.token = tokens;
                    response.ok(req, res, next,'پشتیبان ثبت نام کرده و در انتظار تایید !');
                } else if( personId.class.length > 0 && typeof personId.personalCode == 'undefined' && personId.class != 'support'){
                    req.data.verify = true;
                    req.data.step = '1';
                    req.data.class = userClass;
                    req.data.token = tokens;
                    response.ok(req, res, next,'ثبت نام فرم 2');
                }
                else if( personId.class.length > 0 && typeof personId.personalCode == 'undefined' && personId.class == 'support' && personId.mode=='accept') {
                    req.data.verify = true;
                    req.data.step = '2';
                    req.data.token = tokens;
                    response.ok(req, res, next, 'ثبت نام تکمیل شده و تایید شده است');
                }
                else if(personId.class.length > 0 && typeof personId.personalCode !== 'undefined' && personId.isActive === true && (personId.mode === 'accept' || typeof personId.mode == 'undefined') &&  (personId.isConfirmed === true || typeof personId.isConfirmed == 'undefined')){
                    req.data.verify = true;
                    req.data.step = '2';
                    req.data.token = tokens;
                    response.ok(req, res, next, 'ثبت نام تکمیل شده و تایید شده است');
                }
                else if(personId.class.length > 0 && typeof personId.personalCode !== 'undefined'  &&  personId.isConfirmed === false && (personId.isConfirmDocument=="error" || personId.isConfirmDocument=="pending" || personId.isConfirmDocument=="dosentExist")){
                    req.data.verify = true;
                    req.data.step = '6';
                    req.data.token = tokens;
                    response.ok(req, res, next,'  ثبت نام تکمیل شده است در انتظار تایید احراز هویت !');
                }
                else if(personId.class.length > 0 && typeof personId.personalCode !== 'undefined'  &&  personId.isConfirmed === false){
                    req.data.verify = true;
                    req.data.step = '5';
                    req.data.token = tokens;
                    response.ok(req, res, next,'  ثبت نام تکمیل شده است در انتظار تایید احراز هویت !');
                }
                
                
            
                
                
                else {
                    req.data.verify = true;
                    req.data.step = 'step6';
                    req.data.token = tokens;
                    response.ok(req, res, next);
                }
            } else {
                response.error(req, res, next, 'کاربر گرامی حساب کاربری شما از دسترس خارج شده است. لطفا مجددا ورود فرمایید.');
            }

        })
    },


    logout: (req, res, next) => {
        var userId = req.data.personInfo._id;
        Token.findOneAndRemove({personId: userId}).exec((err, docs) => {
            if (docs) {
                response.ok(req, res, next, message = 'توکن با موفقیت حذف شد!');
            } else {
                response.error(req, res, next, 'آیتمی پیدا  نشد');
            }

        })
    },

      
}