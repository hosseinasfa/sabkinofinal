const response = require("../../response");
var config = require('../../config');
const PostBookmark = require('../../model/postBookmark');


var mongoose = require('mongoose');
module.exports = {

   


    GET_BOOKMARK: (req, res, next) => {
        var PersonIdD = req.data.personInfo._id.toString();
        PostBookmark
        .find({personId : PersonIdD,bookMark:true})
        .populate('postId')
        .exec((err, docs) => {
                if (docs) {
                    var items = [];

                    docs.forEach(item=>{
                        items.push({
                            isBookmark:item.bookMark,
                            isActive:item.isActive,
                            isDelete:item.isDelete,
                            personId:item.personId,
                            _id:item._id,
                            personId:item.personId,
                            postId:item.postId,
                            createdAt:item.createdAt,
                            updatedAt:item.updatedAt,
                            id:item.id,
                        });

                    });
                    
                    req.data.item = items;
                    response.ok(req, res, next,'سوالات ذخیره شده');
                } else {
                    res.send(err)
                }
            })
    },


    POST_NEW_BOOKMARK: (req, res, next) => {
        var PersonId = req.data.personInfo._id
        PostBookmark.find({ personId: PersonId,  postId: req.body.postId}).exec((err, docs) => {
            console.log(docs.length)
            if(docs.length <= 0){
                new PostBookmark({
                    personId: PersonId,
                    postId: req.body.postId,
                    bookMark: true,
                }).save((err, doccc) => {
                    if (doccc) {
                        req.data.item = doccc;
                        response.ok(req, res, next,'نشانه گذاری با موفقیت ایجاد شد');
                    } else {
                        response.error(req, res, next,err);
                    }
            
                })
            } else if (docs.length > 0) {
                if(docs[0].bookMark === false) {
                    const updateQuery = {bookMark : true};
                    PostBookmark.findByIdAndUpdate(docs[0]._id, updateQuery, config.mongooseUpdateOptions).exec((errr, docc) => {
                     
                        if (docc) {
                            req.data.data = docc;
                            response.ok(req, res, next,'نشانه گزاری با موفقیت ثبت شد');
                        } else {
                            req.data.error = err;
                            response.error(req, res, next);
                        }
                    })
                }else{
                    const updateQueryy = {bookMark : false};
                    PostBookmark.findByIdAndUpdate(docs[0]._id, updateQueryy, config.mongooseUpdateOptions).exec((errr, docc) => {
                        
                        if (docc) {
                            req.data.data = docc;
                            response.ok(req, res, next,'نشانه گزاری با موفقیت حذف شد');
                        } else {
                            req.data.error = err;
                            response.error(req, res, next);
                        }
                    })
                }
               
                } else {
                             req.data.error = err;
                            response.error(req, res, next);
            }
        })
                      
    },


    

}

