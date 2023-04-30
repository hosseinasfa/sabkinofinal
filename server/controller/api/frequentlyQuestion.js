const Model = require("../../model/frequentlyQuestion");
const FequentlyQuestionCategories = require("../../model/frequentlyQuestionCategories");
const response = require("../../response");
var config = require('../../config');
var offset = parseInt(process.env.ROW_NUMBER);

function resolveAfter2Seconds(itemId)
{
    var questions = [];
    Model.find({'cat_id':itemId}).exec((err, docs) => {
        docs.forEach(item2=>{
            questions.push({
                question:item2.question,
                answer:item2.answer,
            });
        });
        // console.log("questions :::::::",questions);
        return questions;
    });

}
async function f1(itemId) {
    var x = await resolveAfter2Seconds(itemId);
    // console.log(x); // 10
}


function f2(items)
{
    FequentlyQuestionCategories.find({}).exec((errCat, docCats) => {
        docCats.forEach(item=>{   
        var questions = f1(item._id);
            items.push({
                catTitle:item.title,
                questions:questions
            });            
        });

        return items;
    });
}


async function f3() {
    var items = [];
    var x = await f2(items);
    console.log("items ::::::::::::::::::",items); // 10
    console.log("x ::::::::::::::::::",x); // 10
    return items;
}


module.exports = {
    GET_EACH_ITEM: (req, res, next) => {
        Model.findById(req.params.itemId).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },
    PUT_EACH_ITEM: (req, res, next) => {
        var updateQuery = req.body;
        Model
            .findByIdAndUpdate(req.params.itemId, updateQuery, config.mongooseUpdateOptions)
            .exec((err, doc) => {
                if (doc) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next, 'مشکل در بروزرسانی آیتم');
                }
            })
    },
    PUT_ITEM_ACTIVE: (req, res, next) => {
        Model.findByIdAndUpdate(req.params.itemId, {
            isActive: true
        }, {
            new: true,
            runValidators: true
        }).exec((err, doc) => {
            if (doc) {
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
    },
    PUT_ITEM_DE_ACTIVE: (req, res, next) => {
        Model.findByIdAndUpdate(req.params.itemId, {
            isActive: false
        }, {
            new: true,
            runValidators: true
        }).exec((err, doc) => {
            if (doc) {
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
    },
    GET_ALL_ITEMS: (req, res, next) => {
        var itemId = req.query.itemId;
        var first = req.params.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        Model.find({'cat_id':itemId})
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
            })
    },
    POST_ITEM: (req, res, next) => {
        var query = {
            cat_id:req.body.itemId,
            question:req.body.question,
            answer:req.body.answer,
            isActive:req.body.isActive,
        }
        new Model(query).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        });
    },
    GET_FREQUENTLY_QUESTIONS: (req, res, next) => {
        FequentlyQuestionCategories.find({
            isActive: true,
            isDelete: false
        }).exec((errCat, docCats) => {
            var itemCats = [];
            var items = [];
            
            docCats.forEach((item, index, array) => {
                itemCats.push({
                    'id':item._id,
                    'catTitle':item.title,
                    'questions':[]
                });
            });
                    
            Model.find({
                isActive: true,
                isDelete: false
            }).exec((err, docs) => {
                var questions = [];

                

                docs.forEach((item2, index2, array2) => {

                    itemCats.forEach(itemCat=>{

                        // console.log("itemCat.id.toString() :::",itemCat.id.toString());
                        // console.log("item2.cat_id.toString() :::::",item2.cat_id.toString());
                        if(itemCat.id.toString()==item2.cat_id._id.toString())
                        {
                            console.log('cat_id ::::',item2.cat_id);
                            itemCat.questions.push({
                                question:item2.question,
                                answer:item2.answer,
                            });
                        }
    
                    });


                    
                });
                
                // items.push({
                //     questions:questions
                // });

                console.log('All done!');
                console.log('items ::::::',itemCats);
                req.data.items = itemCats;
                response.ok(req, res, next);
            });            
            
         
        
            
        
        });
    }

};