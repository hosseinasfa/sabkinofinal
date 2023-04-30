const Package = require("../../model/package");
const response = require("../../response");
var config = require('../../config');
const Person = require('../../model/person').Person;
const Sheba = require("../../model/sheba");
const Financial = require("../../model/financial");
const shoppingPrice = require("../../model/shoppingPrice");
const CommissionRef = require("../../model/commissionRef");
const WithdrawalDetail = require("../../model/withdrawalDetail");
const Ambassador = require("../../model/ambassador");
const Ambassadorcode = require("../../model/ambassadorCode");


const persianDate = require('persian-date');
var mongoose = require('mongoose');
var idNew = mongoose.Types.ObjectId();
var moment = require('moment');

function iso7064Mod97_10(iban) {
    var remainder = iban,
        block;
    while (remainder.length > 2) {
        block = remainder.slice(0, 9);
        remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
    }

    return parseInt(remainder, 10) % 97;
}

function validateIranianSheba(str) {
    var pattern = /IR[0-9]{24}/;

    if (str.length !== 26) {
        return false;
    }

    if (!pattern.test(str)) {
        return false;
    }

    var newStr = str.substr(4);
    var d1 = str.charCodeAt(0) - 65 + 10;
    var d2 = str.charCodeAt(1) - 65 + 10;
    newStr += d1.toString() + d2.toString() + str.substr(2, 2);

    var remainder = iso7064Mod97_10(newStr);
    if (remainder !== 1) {
        return false;
    }

    return true;
};


module.exports = {

    GET_ALL_ITEMS: (req, res, next) => {
        
        var userClass = req.data.personInfo.class;
        var userIdd = req.data.personInfo._id;
        var refCode = req.data.personInfo.referalCode;
        Financial.find({}).exec((err, docs) => {
            if (userClass === "teacher" || userClass === "mentor") {
                if (docs) {
                    const pricesF = docs.filter((esf) => esf.userId == userIdd.toString())
               
                    const Docs = pricesF.filter(el => el.type === req.body.type);
                   
                    const Doc = pricesF.filter(el => el.type === req.body.type && el.status === "outstanding");
                   
                    const Docc = pricesF.filter(ele => ele.status === "outstanding");

                    const reducer = (accumulator, curr) => accumulator + curr;
                    if(Doc.length > 0) {
                        var pricef = Doc.map(els => els.finalPrice);
                        var finalTotalPrice = pricef.reduce(reducer)
                        
                    }else{
                        var finalTotalPrice = 0
                        
                    }
                    
                    const withdrawn = Docc.map(elss =>  elss.finalPrice);
                     
                  
                    if(withdrawn.length > 0){
                        var Amountwithdrawn = withdrawn.reduce(reducer)
                    }else{
                        var Amountwithdrawn = 0
                    }

                    var index = 0;

                    shoppingPrice
                        .aggregate()
                        .match({})
                        .exec((err2, data2) => {
                    
                            Doc.forEach(itemDoc => {
                                if (typeof itemDoc.productId !== 'undefined') {
                                    let price = 0;
                                    let percent = 0;

                                    price = itemDoc.productId.price;
                                    data2.forEach(item => {
                                        if (price >= item.priceFrom && price <= item.priceTo) {
                                            percent = item.percent;
                                        }
                                    });

                                    price = price - ((price * percent) / 100);

                                    Doc[index].productId.price = price;
                                    // console.log('price :::::::::::;', Doc[index].productId.price);
                                    index++;


                                } else if (typeof itemDoc.consultingId !== 'undefined') {
                                    let price = itemDoc.consultingId.price;
                                    let pricePercent = itemDoc.consultingId.callId.percent;

                                    price = price - ((price * pricePercent) / 100);
                                    Doc[index].consultingId.price = price;
                                    index++;
                                }
                            });

                            
                        });

                    if(req.body.type === "ambassador"){
                        Person.find({identifierCode : refCode}).exec((err, docPerson) => {
                            if (docPerson.length > 0) {
                                CommissionRef.find({}).exec((errrr, docPrice) => {
                                    
                                 if(docPrice)   {
                                
                                var UserRef = docPerson.filter(els => els.class === "user" && els.isPackage === true);
                                var UserRefLenght = UserRef.length;

                                var FamilyRef = docPerson.filter(els => els.class === "family" && els.isPackage === true);
                                var FamilyRefLenght = FamilyRef.length;
    
                                var MentorRef = docPerson.filter(els => els.class === "mentor" && els.isPackage === true);
                                var MentorRefLenght = MentorRef.length;
    
                                var TeacherRef = docPerson.filter(els => els.class === "teacher" && els.isPackage === true);
                                var TeacherRefLenght = TeacherRef.length;
    
                                var SchoolRef = docPerson.filter(els => els.class === "schoolBoss" && els.isPackage === true);
                                var SchoolRefLenght = SchoolRef.length;
    
                                var EducationalInstitutionsRef = docPerson.filter(els => els.class === "educationalInstitutions" && els.isPackage === true);
                                var EducationalInstitutionsRefLenght = EducationalInstitutionsRef.length;

                                var UserPrice = docPrice.filter(elz => elz.userType === 'user');
                                var UserCommissionPrice = UserPrice[0].commissionPrice;
                                var FinalUserCommissionPrice = UserRefLenght * UserCommissionPrice;

                                var FamilyPrice = docPrice.filter(elz => elz.userType === 'family');
                                var FamilyCommissionPrice = FamilyPrice[0].commissionPrice;
                                var FinalFamilyCommissionPrice = FamilyRefLenght * FamilyCommissionPrice;


                                var MentorPrice = docPrice.filter(elz => elz.userType === 'mentor');
                                var MentorCommissionPrice = MentorPrice[0].commissionPrice;
                                var FinalMentorCommissionPrice = MentorRefLenght * MentorCommissionPrice;


                                var TeacherPrice = docPrice.filter(elz => elz.userType === 'teacher');
                                var TeacherCommissionPrice = TeacherPrice[0].commissionPrice
                                var FinalTeacherCommissionPrice = TeacherRefLenght * TeacherCommissionPrice;

                                var EducationPrice = docPrice.filter(elz => elz.userType === 'education');
                                var EducationCommissionPrice = EducationPrice[0].commissionPrice
                                var FinalEducationCommissionPrice = EducationalInstitutionsRefLenght * EducationCommissionPrice;

                                var SchoolPrice = docPrice.filter(elz => elz.userType === 'school');
                                var SchoolCommissionPrice = SchoolPrice[0].commissionPrice
                                var FinalSchoolCommissionPrice = SchoolRefLenght * SchoolCommissionPrice;

                                

                                var sumPrice =  FinalUserCommissionPrice + FinalFamilyCommissionPrice + FinalMentorCommissionPrice + FinalTeacherCommissionPrice + FinalEducationCommissionPrice + FinalSchoolCommissionPrice
                                var sumRef = UserRefLenght + FamilyRefLenght + MentorRefLenght + TeacherRefLenght + SchoolRefLenght + EducationalInstitutionsRefLenght;
                                var Fprice = sumPrice
                                if(sumRef >= 5) {
                                   
                                    Financial.find({type : 'ambassador', userId : userIdd }).exec((err, docPerson) => {
                                        if(docPerson.length <= 0) {
                                            var Fprice = sumPrice
                                            new Financial({
                                                userId : userIdd ,
                                                // ambassadorId: idNew,
                                                type: 'ambassador',
                                                finalPrice : Fprice,
                                            }).save((err, doc) => {
                                                if (doc) {
                                                    new Ambassador({
                                                        financialId : docPerson._id,
                                                        userCount : UserRefLenght,
                                                        familyCount : FamilyRefLenght,
                                                        mentorCount : MentorRefLenght,
                                                        teacherCount : TeacherRefLenght,
                                                        schoolBossCount : SchoolRefLenght,
                                                        EducationalInstitutions : EducationalInstitutionsRefLenght,
                                                        status : 'pending',
                                                    }).save((errs, docs) => {
                                                        if (docs) {
                                                            
                                                           
                                                    }})
                                                } else {
                                                    response.error(req, res, next);
                                                    console.log("no new",err)
                                                }
                                            })
                                        }else{
                                            var flpd = docPerson.filter(gh => gh.status === 'pending');
                                           
                                            if(flpd.length > 0){
                                                Fprice = 0
                                                UserRefLenght = 0
                                                FamilyRefLenght = 0
                                                MentorRefLenght = 0
                                                TeacherRefLenght = 0
                                                SchoolRefLenght = 0
                                                EducationalInstitutionsRefLenght = 0
                                            } else{
                                                var Fprice = sumPrice
                                            }
                                        }

                                        const ambassadorIdd = {
                                            userCount : UserRefLenght,
                                            familyCount : FamilyRefLenght,
                                            mentorCount : MentorRefLenght,
                                            teacherCount : TeacherRefLenght,
                                            schoolBossCount : SchoolRefLenght,
                                            EducationalInstitutions : EducationalInstitutionsRefLenght
                                        }
                                        const Docs = []
                                        Docs.push({
                                            ambassadorId : ambassadorIdd
                                        })
                                        res.json({
                                            Docs,
                                            totalAmount: Fprice?.toString(),
                                            withdrawn : Amountwithdrawn.toString()
                                        });

                                    })
                                }else{
                                    Fprice = 0

                                    const ambassadorIdd = {
                                        userCount : UserRefLenght,
                                        familyCount : FamilyRefLenght,
                                        mentorCount : MentorRefLenght,
                                        teacherCount : TeacherRefLenght,
                                        schoolBossCount : SchoolRefLenght,
                                        EducationalInstitutions : EducationalInstitutionsRefLenght
                                    }
                                    const Docs = []
                                    Docs.push({
                                        ambassadorId : ambassadorIdd
                                    })
                                    res.json({
                                        Docs,
                                        totalAmount: Fprice?.toString(),
                                        withdrawn : Amountwithdrawn.toString()
                                    });
                                }
                                
                           

                                
    
                                }
                           
                            })
    
                            }else if(docPerson.length <= 0){
                                Ambassadorcode.find({referalCode : refCode}).exec((err, docsPerson) => {
                                    if (docsPerson.length > 0) {
                                       
                                        const Doc1 = docPerson.filter(el => el.class === 'user' );
                                        
                                        res.json({
                                            Docs : Doc1,
                                            totalAmount: finalTotalPrice.toString(),
                                            withdrawn : Amountwithdrawn.toString()
                                        });
                                        
                                    }else if(docPerson.length <= 0){
                                        var ambassadorIdd = {
                                            userCount : 0,
                                            familyCount : 0,
                                            mentorCount : 0,
                                            teacherCount : 0,
                                            schoolBossCount : 0,
                                            EducationalInstitutions : 0
                                        }
                                        const Docs = []
                                        Docs.push({
                                            ambassadorId : ambassadorIdd
                                        })
                                        res.json({
                                            Docs,
                                            totalAmount: finalTotalPrice.toString(),
                                            withdrawn : Amountwithdrawn.toString()
                                        });
                                    } else {
                                        response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                                    }
                               
                                
                                });
                            } else {
                                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                            }
                          
                        
                        });
                       
                    }else if(req.body.type === "consulting"){
                       
                        const Doc1 = Doc.filter(el => el.consultingId.duration === 1 );
                        const Doc3 = Doc.filter(el => el.consultingId.duration === 3 );
                        const Doc6 = Doc.filter(el => el.consultingId.duration === 6 );
                        const Doc12 = Doc.filter(el => el.consultingId.duration === 12 );

                        if(Doc1){
                            let pricesFf = Doc1.filter(function (e) {
                                var x = e.finalPrice / 1 ;
                                var y = Math.round( x );
                                return  e.totalPriceMonth = y
                                    
                        });
                      
                        }

                        if(Doc3){
                            let pricesFf = Doc3.filter(function (e) {
                                var x = e.finalPrice / 3 ;
                                var y = Math.round( x );
                                return  e.totalPriceMonth = y
                                
                        });
                        
                        }
                        if(Doc6){
                            let pricesFf = Doc6.filter(function (e) {
                                var x = e.finalPrice / 6 ;
                                var y = Math.round( x );
                                return  e.totalPriceMonth = y
                                
                        });
                        
                        }
                        if(Doc12){
                            let pricesFf = Doc12.filter(function (e) {
                                var x = e.finalPrice / 12 ;
                                var y = Math.round( x );
                                return  e.totalPriceMonth = y
                                
                        });
                        
                        }

                        res.json({
                            Docs,
                            totalAmount: finalTotalPrice.toString(),
                            withdrawn : Amountwithdrawn.toString()
                        });
    
                    }else{
                        res.json({
                            Docs,
                            totalAmount: finalTotalPrice.toString(),
                            withdrawn : Amountwithdrawn.toString()
                        });
                    }

                    
                   

                    
                  
                 


                    

                } else {
                    // const result = docs.filter(asd => asd.productId.personId._id);
                    // res.send(err)
                    response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                }


            } else {
                res.send("عدم دسترسی")
            }
         
        })
    },

    GET_EACH_ITEM: (req, res, next) => {
        Financial.find({ownerId : req.params.itemId}).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },

    GET_EACH_ITEM_FINANCIAL: (req, res, next) => {
    
        Financial.find({ withdrawaldetailId : req.params.itemId }).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },


    POST_ITEM: (req, res, next) => {
        // console.log(req.body)
        var Amount = req.body.amount;
        var Count = req.body.count;
        if(req.body.amount && req.body.count ){
            var Amount = req.body.amount;
            var Count = req.body.count;
            var totalP = Amount * Count
        }else{
            var Amount = 0;
            var Count = 0;
            var totalP = 0
        }
        
            shoppingPrice
                .aggregate()
                .match({})
                .exec((err2, data3) => {

                    let price = Amount * Count;
                    let percent = 0;
                    data3.forEach(item => {
                        if (price >= item.priceFrom && price <= item.priceTo) {
                            percent = item.percent;
                            price = price - ((price * percent) / 100);
                        }
                    }); 
              

                    var fPrice = price;
                    if (req.body.productId) {
                    new Financial({
                        // userId : userIdd,
                        // withdrawaldetailId : req.body.withdrawaldetailId,
                        productId: req.body.productId,
                        ownerId: req.body.ownerId,
                        amount: Amount,
                        count: Count,
                        totalPrice: totalP,
                        finalPrice : fPrice,
                        type: req.body.type,
                    }).save((err, doc) => {
                        if (doc) {
                            req.data.item = doc;
                            response.ok(req, res, next);
                        } else {
                            response.error(req, res, next);
                        }
                    })


        } else if (req.body.ambassadorId) {
            new Financial({
        
                ambassadorId: req.body.ambassadorId,
                ownerId: req.body.ownerId,
                type: req.body.type,
                totalPrice: totalP,
                finalPrice : fPrice,
            }).save((err, doc) => {
                if (doc) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next);
                    console.log(err)
                }
            })
        } else if (req.body.callPaymentId) {
            new Financial({
                
                callPaymentId : req.body.callPaymentId,
                ownerId: req.body.ownerId,
                type: req.body.type,
                totalPrice: totalP,
                finalPrice : fPrice,
            }).save((err, doc) => {
                if (doc) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next);
                    console.log(err)
                }
            })
        }else {
            new Financial({
                periodMentorId: req.body.periodMentorId,
                ownerId: req.body.ownerId,
                amount: Amount,
                count: Count,
                type: req.body.type,
                totalPrice: totalP,
                finalPrice : fPrice,
            }).save((err, doc) => {
                if (doc) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next);
                    console.log(err)
                }
            })
        }
    });
        // var userIdd = req.data.personInfo._id;
    },


    GET_CHECK_SHEBA: (req, res, next) => {
        var sheba = req.query.sheba;
        // console.log('sheba ::::',sheba);
        // randValSheba = req.body.sheba;
        // var newValSheba = randValSheba.toString().substr(3, 2);
        Sheba.find({BankId: sheba}).exec((err, docs) => {
            if (docs) {
                req.data.items = docs;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'آیتمی پیدا  نشد');
            }
        })
    },

    
    PUT_VERIFY_SHEBA: (req, res, next) => {
        var shebaCode = req.body.sheba;
        var userId = req.data.personInfo._id;
        if (!validateIranianSheba('IR'+shebaCode)) {
            res.json({
                message: "شماره شبای وارد شده اشتباه است"
            })
        } else {
            Person.findByIdAndUpdate(userId, {
                sheba: `IR${req.body.sheba}`
            }, {
                new: true,
                runValidators: true
            }).exec((err2, doc2) => {
                if (doc2) {
                    res.json({
                        sheba: doc2.sheba,
                        message: 'شماره شبا با موفقیت ثبت شد.'
                    })
                } else {
                    response.error(req, res, next);
                    console.log("مشکل در ایجاد شماره شبا", err2)
                }
            })
        }

    },


    POST_BANK_TURNOVER: (req, res, next) => {
        var userClass = req.data.personInfo.class;
        var userIdd = req.data.personInfo._id;
        var userSheba = req.data.personInfo.sheba;
        if (userClass === "teacher" || userClass === "mentor") {
            
            // var nowww = new persianDate(new Date(2022,06,22)).date();
            var NewDate = new persianDate(new Date()).date();
            
            if (NewDate >= 1 && NewDate <= 5) {
                // if (NewDate >= 0) {
                     if(userSheba && userSheba.length > 0){

                   
                new WithdrawalDetail({
                    ownerId : userIdd,
                    amount : req.body.amount,
                }).save((err, doc) => {
                    if (doc) {
                        
                        Financial.updateMany({userId : userIdd}, { $set: { status: "pending" , withdrawaldetailId: doc._id } }).exec((err2, doc3) => {
                            if (doc3) {
                                
                                res.json({
                                    status : true,
                                    message: 'برداشت با موفقیت انجام شد'
                                });
                            } else {
                                response.error(req, res, next);
                                console.log("مشکل در برداشت", err2);
                            }
                        })
                        
                        // req.data.item = doc;
                        // response.ok(req, res, next);
                    } else {
                        response.error(req, res, next);
                    }
                })
            }else{
                res.json({
                    status : false,
                    message: 'لطفا شماره شبا خود را وارد کنید !'
                })
            }
              }else{
                  res.json({
                      message : 'برداشت در این تاریخ امکان پذیر نمی باشد.'
                  })
              }
            

        }else{
            res.send("عدم دسترسی")
        }
        
    },

    GET_BANK_TURNOVER: (req, res, next) => {
        
        var userIdd = req.data.personInfo._id
        WithdrawalDetail.find({ownerId : userIdd}).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },

    GET_BANK_TURNOVER_ID: (req, res, next) => {
        
        WithdrawalDetail.find({ownerId : req.params.itemId}).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
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