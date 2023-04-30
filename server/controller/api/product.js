const Channel = require("../../model/channel");
const ChannelContent = require("../../model/channelContent");
const response = require("../../response");
const Category = require("../../model/category");
var config = require('../../config');
var offset = parseInt(process.env.ROW_NUMBER);
const Product = require('../../model/product');

var moment = require('moment');
var mongoose = require('mongoose');

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = {

    GET_ALL_PRODUCT: (req, res, next) => {
        var first = req.query.first;
        var strclass = req.query.role

        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        if (typeof strclass === 'undefined') {
            strclass = 'mentor';
        }

        Product.find({ 'role': strclass, 'isDelete': false })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    const lastFl = docs.filter((ex) => ex.personId !== null)
                    req.data.items = lastFl;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
    },
    GET_SHOP_PRODUCT: (req, res, next) => {
        var userId = req.query.userId;

        var strClass = req.data.personInfo.class;

        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }

        if (typeof userId !== 'undefined') {
            Product.find({
                'personId': userId,
                'isActive': true,
                'isDelete': false
            })
                .limit(offset)
                .skip(first)
                .sort({ createdAt: -1 })
                .exec((err, docs) => {
                    if (docs) {
                        // console.log(docs)
                        req.data.items = docs;
                        response.ok(req, res, next);
                    } else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                });
        }
        else {
            response.error(req, res, next, 'اطلاعات وارد شده معتبر نیست');
        }
    },
    // POST_STORE_PRODUCT: (req,res,next) =>{
    //     var status = req.body.status;
    //     var avatar = req.body.avatar;
    //     var title = req.body.title;
    //     var caption = req.body.caption;
    //     var price = req.body.price;
    //     var titleLesson = req.body.titleLesson;
    //     var tags = req.body.tags;
    //     var samplePdf = req.body.samplePdf;
    //     var originPdf = req.body.originPdf;
    //     var author = req.body.author;
    //     var sellCount = 0;
    //     var educationalStageId = req.body.educationalStageId;
    //     var educationalFieldId = req.body.educationalFieldId;
    //     var personId = req.body.personId;
    //     var role = req.data.personInfo.clsss;

    //     if(role=='mentor' || role=='teacher')
    //     {
    //         var query = {
    //             status:status,
    //             avatar:avatar,
    //             role:role,
    //             title:title,
    //             caption:caption,
    //             price:price,
    //             titleLesson:titleLesson,
    //             tags:tags,
    //             samplePdf:samplePdf,
    //             originPdf:originPdf,
    //             author:author,
    //             sellCount:sellCount,
    //             educationalStageId:educationalStageId,
    //             educationalFieldId:educationalFieldId,
    //             personId:personId,          
    //         };

    //         new Model(query).save((err, doc) => {
    //             if (doc) {
    //                 req.data.item = doc;
    //                 response.ok(req, res, next);
    //             } else {
    //                 response.error(req, res, next);
    //             }
    //         });
    //     }
    //     else
    //     {
    //         response.error(req, res, next);
    //     }        
    // },
    GET_EACH_PRODUCT_ClASS: (req, res, next) => {
        var x = req.data.personInfo._id
        Product.find({ personId: x }).exec((err, docs) => {
            if (docs) {
                req.data.items = docs;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'اطلاعات یافت نشد');
            }
        })
    },
    GET_SINGLE_PRODUCT: (req, res, next) => {
        var itemId = req.params.itemId;
        Product.findById(itemId).exec((err, doc) => {
            if (doc) {
                res.render('product', { data: doc });
                // response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'اطلاعات یافت نشد');
            }
        })
    },

    SEARCH_PRODUCT: (req, res, next) => {
        var first = req.query.first;
        var strclass = req.query.role;
        var educationalFieldId = req.query.educationalFieldId;
        var educationalStageId = req.query.educationalStageId;
        var search = req.query.search;

        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        if (typeof strclass === 'undefined') {
            strclass = 'mentor';
        }


        if (typeof educationalFieldId !== 'undefined' && typeof educationalStageId !== 'undefined') {
            if (typeof search !== 'undefined') {
                const regex = new RegExp(escapeRegex(search), 'gi');

                Product.find({ "status": "accept", "title": regex, 'role': strclass, 'educationalFieldId': educationalFieldId, 'educationalStageId': educationalStageId, 'isDelete': false })
                    .limit(offset)
                    .skip(first)
                    .sort({ createdAt: -1 })
                    .exec((err, docs) => {
                        if (docs) {
                            req.data.items = docs;
                            response.ok(req, res, next);
                        } else {
                            response.error(req, res, next, 'اطلاعات یافت نشد');
                        }
                    })
            }
            else {
                Product.find({ "status": "accept", 'role': strclass, 'educationalFieldId': educationalFieldId, 'educationalStageId': educationalStageId, 'isDelete': false })
                    .limit(offset)
                    .skip(first)
                    .sort({ createdAt: -1 })
                    .exec((err, docs) => {
                        if (docs) {
                            req.data.items = docs;
                            response.ok(req, res, next);
                        } else {
                            response.error(req, res, next, 'اطلاعات یافت نشد');
                        }
                    })
            }
        }
        else {
            if (typeof search !== 'undefined') {
                const regex = new RegExp(escapeRegex(search), 'gi');
                Product.find({ "status": "accept", "title": regex, 'role': strclass, 'isDelete': false })
                    .limit(offset)
                    .skip(first)
                    .sort({ createdAt: -1 })
                    .exec((err, docs) => {
                        if (docs) {
                            req.data.items = docs;
                            response.ok(req, res, next);
                        } else {
                            response.error(req, res, next, 'اطلاعات یافت نشد');
                        }
                    })
            }
            else {
                Product.find({ "status": "accept", 'role': strclass, 'isDelete': false })
                    .limit(offset)
                    .skip(first)
                    .sort({ createdAt: -1 })
                    .exec((err, docs) => {
                        if (docs) {
                            req.data.items = docs;
                            response.ok(req, res, next);
                        } else {
                            response.error(req, res, next, 'اطلاعات یافت نشد');
                        }
                    })
            }
        }
    },
    POST_NEW_PRODUCT: (req, res, next) => {
        var personId = req.data.personInfo._id;
        var strRole = req.data.personInfo.class;

        // console.log('strRole :',strRole);
        // console.log('personId :',personId);

        if (strRole == 'mentor' || strRole == 'teacher') {
            var query = {
                "status": "pending",
                "avatar": req.body.avatar,
                "title": req.body.title,
                "caption": req.body.caption,
                "price": req.body.price,
                "titleLesson": req.body.titleLesson,
                "tags": req.body.titleLesson,
                "samplePdf": req.body.samplePdf,
                "originPdf": req.body.originPdf,
                "author": req.body.author,
                "role": strRole,
                "sellCount": 0,
                "educationalFieldId": req.body.educationalFieldId,
                "educationalStageId": req.body.educationalStageId,
                "personId": personId,
            };

            new Product(query).save((err, doc) => {
                if (doc) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    console.log('err ::', err);
                    response.error(req, res, next, 'ثبت اطلاعات با مشکل مواجه شد');
                }
            });
        }
        else if (strRole == 'support') {
            personId = req.data.personInfo.supportMentorId._id;
            var supportType = req.data.personInfo.supportType;

            var query = {
                "status": "pending",
                "avatar": req.body.avatar,
                "title": req.body.title,
                "caption": req.body.caption,
                "price": req.body.price,
                "titleLesson": req.body.titleLesson,
                "tags": req.body.titleLesson,
                "samplePdf": req.body.samplePdf,
                "originPdf": req.body.originPdf,
                "author": req.body.author,
                "role": supportType,
                "sellCount": 0,
                "educationalFieldId": req.body.educationalFieldId,
                "educationalStageId": req.body.educationalStageId,
                "personId": personId,
            };

            new Product(query).save((err, doc) => {
                if (doc) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    console.log('err ::', err);
                    response.error(req, res, next, 'ثبت اطلاعات با مشکل مواجه شد');
                }
            });
        }
        else {
            response.error(req, res, next, 'دسترسی برای ثبت اطلاعات ندارید');
        }
    },

    DELETE_PRODUCT: (req, res, next) => {
        var personId = req.data.personInfo._id;
        var itemId = req.query.itemId;
        // ItemLike.findOneAndDelete({ '_id': itemId }).exec(() => {
        //     req.data.isLike = false;
        //     response.ok(req, res, next);
        // });

        Product.findById(itemId)
            .exec((errProduct, docProduct) => {
                if (docProduct) {
                    if (docProduct.personId._id.toString() == personId.toString()) {
                        var updateQuery = {
                            'isDelete': true
                        };
                        Product.findByIdAndUpdate(itemId, updateQuery, config.mongooseUpdateOptions)
                            .exec((err, doc) => {
                                if (doc) {
                                    req.data.item = doc;
                                    response.ok(req, res, next, 'محصول با موفقیت حذف گردید');
                                } else {
                                    response.error(req, res, next, 'مشکل در حذف آیتم');
                                }
                            })
                    }
                    else {
                        response.error(req, res, next, 'دسترسی حذف ندارید');
                    }
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }

            });
    },
    GET_BEST_PRODUCT: (req, res, next) => {
        var first = req.query.first;
        var strclass = req.query.type;
        var educationalFieldId = req.query.educationalFieldId;
        var educationalStageId = req.query.educationalStageId;
        var search = req.query.search;


        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        if (typeof strclass === 'undefined') {
            strclass = 'mentor';
        }

        var filter = {
            role: strclass,
            isActive: true,
            isDelete: false,
        };



        // console.log('filter ::: ', filter);
        if (typeof educationalFieldId !== 'undefined' && educationalFieldId != null && educationalFieldId!="") {
            filter.educationalFieldId = educationalFieldId;
        }

        if (typeof educationalStageId !== 'undefined' && educationalStageId != null && educationalStageId!="") {
            filter.educationalStageId = educationalStageId;
        }

        if (typeof search !== 'undefined' && search != null && search!="") {
            const regex = new RegExp(escapeRegex(search), 'gi');
            filter.title = regex;
        }

        console.log('filter ::: ',filter);


        Product.find(filter)
            .sort({ 'rate': -1,createdAt: -1 })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
    },
    GET_POPULAR_PRODUCT: (req, res, next) => {
        var first = req.query.first;
        var strclass = req.query.type;
        var educationalFieldId = req.query.educationalFieldId;
        var educationalStageId = req.query.educationalStageId;
        var search = req.query.search;

        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        if (typeof strclass === 'undefined') {
            strclass = 'mentor';
        }


        var filter = {
            role: strclass,
            isActive: true,
            isDelete: false,
        };





        console.log('filter ::: ', filter);
        if (typeof educationalFieldId !== 'undefined' && educationalFieldId != null && educationalFieldId!="") {
            filter.educationalFieldId = educationalFieldId;
        }

        if (typeof educationalStageId !== 'undefined' && educationalStageId != null && educationalStageId!="") {
            filter.educationalStageId = educationalStageId;
        }

        if (typeof search !== 'undefined' && search != null && search!="") {
            const regex = new RegExp(escapeRegex(search), 'gi');
            filter.title = regex;
        }

        console.log('filter ::: ',filter);

        Product.find(filter)
            .sort({ 'sellCount': -1,createdAt: -1 })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
    },
    GET_NEWEST_PRODUCT: (req, res, next) => {
        var first = req.query.first;
        var strclass = req.query.type;
        var educationalFieldId = req.query.educationalFieldId;
        var educationalStageId = req.query.educationalStageId;
        var search = req.query.search;

        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        if (typeof strclass === 'undefined') {
            strclass = 'mentor';
        }


        var filter = {
            role: strclass,
            isActive: true,
            isDelete: false,
        };


        console.log('filter ::: ', filter);
        if (typeof educationalFieldId !== 'undefined' && educationalFieldId != null && educationalFieldId!="") {
            filter.educationalFieldId = educationalFieldId;
        }

        if (typeof educationalStageId !== 'undefined' && educationalStageId != null && educationalStageId!="") {
            filter.educationalStageId = educationalStageId;
        }

        if (typeof search !== 'undefined' && search != null && search!="") {
            const regex = new RegExp(escapeRegex(search), 'gi');
            filter.title = regex;
        }


        console.log('filter ::: ',filter);

        Product.find(filter)
            .sort({ 'createdAt': -1 })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    req.data.items = docs;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
    },


}

