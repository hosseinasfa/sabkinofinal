const Model = require("../../model/userBookMark");
const response = require("../../response");
var config = require('../../config');
var offset = parseInt(process.env.ROW_NUMBER);
var moment = require('jalali-moment');

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
        var first = req.params.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        Model.find({})
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
            })
    },
    POST_ITEM: (req, res, next) => {

        var mentorId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var userId = req.body.userId;

        if(strClass=='mentor')
        {
            if(typeof userId !== 'undefined' || userId!=null)
            {
                var query = {
                    'mentorId': mentorId,
                    'userId' : userId
                };

                new Model(query).save((err, doc) => {
                    if (doc) {
                        req.data.item = doc;
                        response.ok(req, res, next);
                    } else {
                        response.error(req, res, next);
                    }
                });
            }
            else
            {
                response.error(req, res, next,'اطلاعات وارد شده صحیح نیست');
            }
        }
        else
        {
            response.error(req, res, next,'دسترسی ندارید');
        }
    
    },
    DELETE_BOOK_ITEM: (req, res, next) => {
        var mentorId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var itemId = req.query.itemId;
        console.log('itemId :::::::', itemId);

        if(strClass=='mentor')
        {
            Model.findById(itemId).exec((errUser, docUser) => {
                if (errUser) {
                    response.error(req, res, next);
                } else {
                    if (docUser) {
                        if(docUser.mentorId._id.toString()==mentorId.toString())
                        {
                            var query = {
                                '_id': itemId,
                            };

                            Model.findOneAndDelete(query).exec((err, doc) => {
                                if (err) {
                                    response.error(req, res, next);
                                } else {
                                    response.ok(req, res, next);
                                }
                            });
                        }
                        else
                        {
                            response.error(req, res, next,'دسترسی ندارید');
                        }
                    } else {
                        response.error(req, res, next);
                    }
                }
            });
        }
        else
        {
            response.error(req, res, next,'دسترسی ندارید');
        }
    },
    GET_ALL_BOOK_ITEM: (req, res, next) => {
        var mentorId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;

        var first = req.params.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        if(strClass=='mentor')
        {
            Model.find({"mentorId":mentorId})
                .limit(offset)
                .skip(first)
                .exec((err, docs) => {
                    req.data.items = docs;
                    response.ok(req, res, next);
                });
        }
        else
        {
            response.error(req, res, next,'دسترسی ندارید');
        }
    },

};