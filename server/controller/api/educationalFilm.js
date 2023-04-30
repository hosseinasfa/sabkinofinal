const Package = require("../../model/package");
const response = require("../../response");
var config = require('../../config');
const Person = require('../../model/person').Person
const EducationalFilm = require("../../model/educationalFilm");

module.exports = {

GET_ALL_ITEMS: (req, res, next) => {
    
    EducationalFilm.find({}).exec((err, docs) => {
            req.data.data = docs;
            response.ok(req, res, next);
        })
    },
    
// GET_EACH_ITEM: (req, res, next) => {
//     Package.findById(req.params.PackageId).exec((err, doc) => {
//             if (doc) {
//                 req.data.item = doc;
//                 response.ok(req, res, next);
//             } else {    
//                 response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
//             }
//         })
//     },

POST_ITEM: (req, res, next) => {
        
            new EducationalFilm({
                title : req.body.title,
                url : req.body.url
            }).save((err, doc) => {
                if (doc) {
                    res.send({
                        doc
                    })
                } else {
                    response.error(req, res, next);
                    console.log("error , ", err)
                }
            })
},


// CHECK_EACHITEM: (req, res, next) => {
//     Package.findById(req.body.PackageId).exec((err, doc) => {
//         if (doc) {  
//             console.log(req.data.personInfo.walletBalance) 
//             console.log(doc.priceAll)
//            if(doc.priceAll <= req.data.personInfo.walletBalance){
//                console.log(req.data.personInfo.walletBalance - doc.priceAll )
//             Person.findByIdAndUpdate(req.data.personInfo._id, {
//                 walletBalance: req.data.personInfo.walletBalance - doc.priceAll 
//             }, {
//                 new: true,
//                 runValidators: true
//             }).exec((err2, doc2) => {
//                 if (doc2) {

//                     new PackageList({
//                         userId : req.data.personInfo._id,
//                         PackageId : req.body.PackageId,
//                         reservePackage : true,
//                         duration : doc.duration
//                     }).save((err, doc) => {
//                         if (doc) {
//                             res.status(200).json({
//                                 message:"خرید بسته شما با موفقیت انجام شد",
//                                 status : true
//                            })
//                         } else {
//                             response.error(req, res, next);
//                         }
//                     })
//                 } else {
//                     response.error(req, res, next);
//                     console.log("error walletBalance",err)
//                 }
//             })
//            }else{
//             res.status(200).json({
//                 message:"موجودی حساب شما از قیمت بسته مورد نظر کمتر می باشد",
//                 status : false
//             })
//            }         
//             //  req.data.item = doc;
//             //  response.ok(req, res, next);
//         } else {    
//             response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
//             console.log(err)
//         }
//     })
// },


};