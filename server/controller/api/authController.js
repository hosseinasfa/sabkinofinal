const controller = require('./controller');
const userTransform = require('./../../transforms/v1/userTransform');
// const bcrypt = require('bcrypt');
const { check } = require('express-validator');
var config = require('../../config');

module.exports = new class authController extends controller {
    async register(req , res) {

        if(this.validationData(req, res)) {
            return;
        }

    //     const
    //     {
    //         firstName,lastName,personalCode,birth,familyPhone,
    //     provinceId,cityId,schoolId,educationalStageId,educationalFieldId,age
    // } = req.body;

    //         const newUser = new this.model.User({
    //             firstName,lastName,personalCode,birth,familyPhone,
    //         provinceId,cityId,schoolId,educationalStageId,educationalFieldId,age
    //         });

            // await newUser.$set({ password : newUser.hashPassword(req.body.password) });

            await this.model.Person.findByIdAndUpdate(req.params.itemId, { $set : { ...req.body } , changeClass: false }, config.mongooseUpdateOptions ,err => {
            
            // await newUser.save(err => {
                if(err) {
                    
                if(err.code == 11000) {
                    return res.json({
                        data : 'ایمیل نمی تواند تکراری باشد',
                        success : false
                    })
                } else {
                    throw err;
                }
                }
                
                res.json({
                    data : 'کاربر با موفقیت عضو وب سایت شد',
                    success : true
                });
            })
        
        // if(this.showValidationErrors(req, res)) 
        //     return;

        //     const newUser = new this.model.User({
        //         name : req.body.name,
        //         email : req.body.email
        //     });

        //     await newUser.$set({ password : newUser.hashPassword(req.body.password) });

        //     newUser.save(err => {
        //         if(err) {
                    
        //         if(err.code == 11000) {
        //             return res.json({
        //                 data : 'ایمیل نمی تواند تکراری باشد',
        //                 success : false
        //             })
        //         } else {
        //             throw err;
        //         }
        //         }
                
        //         res.json({
        //             data : 'کاربر با موفقیت عضو وب سایت شد',
        //             success : true
        //         });
        //     })

    }


}