const Model = require('../../model/fieldComment');
const response = require("../../response");
var config = require('../../config');
var offset = parseInt(process.env.ROW_NUMBER);
var moment = require('jalali-moment');
var COMMENT_LIMIT = parseInt(process.env.COMMENT_LIMIT);

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
            // .sort({ createdAt: -1 })
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
            })
    },
    GET_ALL_COMMENT_ITEMS: (req, res, next) => {
        var first = req.query.first;
        var parent = req.query.parent;

        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        Model.find({
            "parent": parent,
            "isActive": true,
            "isDelete": false
        })
            .limit(offset)
            .skip(first)
            .sort({ createdAt: -1 })
            .exec((err, docs) => {
                if (docs) {
                    var len = docs.length;
                    var items = [];
                    for (var i = 0; i < len; i++) {
                        var createdAt = moment(docs[i]['createdAt'], 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm');
                        //docs[i]['createdAt'] = moment(docs[i]['createdAt'], 'YYYY/MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm');

                        items.push({
                            "caption": docs[i]['caption'],
                            "isActive": docs[i]['isActive'],
                            "isDelete": docs[i]['isDelete'],
                            "_id": docs[i]['_id'],
                            "commenter": docs[i]['commenter'],
                            "userId": docs[i]['parent'],
                            "createdAt": createdAt,
                            "updatedAt": docs[i]['updatedAt'],
                            "id": docs[i]['id'],
                        });

                    }

                    req.data.items = items;
                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
    },

    DELETE_ITEM: (req, res, next) => {
        var itemId = req.query.itemId;
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        console.log('itemId :::::::', itemId);

        if(strClass=='support')
        {
            userId = req.data.personInfo.supportMentorId._id;
        }


        Model.findById(itemId).exec((errComment, docComment) => {
            if (errComment) {
                response.error(req, res, next);
            } else {
                if (docComment) {

                    if (userId.toString() == docComment.commenter._id.toString()) {
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
                    else {
                        response.error(req, res, next, 'دسترسی ندارید');
                    }
                } else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            }
        });

    },
    GET_PARENT_COMMENT: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        Model.find({
            parent: req.params.parentId,
            isActive: true,
            isDelete: false
        })
            .limit(offset)
            .skip(first)
            .sort({ createdAt: -1 })
            .exec((err, docs) => {
                if (docs) {
                    req.data.item = docs;
                    response.ok(req, res, next);
                } else {
                    res.send(err)
                }
            })
    },
    POST_NEW_COMMENT: (req, res, next) => {
        var personId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var parent = req.body.parent;
        var caption = req.body.caption;

        if(strClass=='support')
        {
            personId = req.data.personInfo.supportMentorId._id;
        }


        moment.locale('en');
        var current_date = moment().format('YYYY-MM-DD');
        var start_date = current_date;
        var end_date = current_date;


        start_date = start_date + 'T00:00:00.000Z';
        end_date = end_date + 'T23:59:59.000Z';
        console.log('start_date :', start_date);
        console.log('end_date :', end_date);

        if (typeof parent !== 'undefined' && typeof caption !== 'undefined') {

            Model.find({
                'commenter': personId,
                'createdAt': {
                    $gte: start_date,
                    $lt: end_date
                }
            }).exec(function (errCom, docComs) {
                if (docComs) {
                    console.log("docComs.length :::::", docComs.length);
                    if (docComs.length < COMMENT_LIMIT) {
                        new Model({
                            commenter: personId,
                            parent: parent,
                            caption: caption
                        }).save((err, doc) => {
                            if (doc) {
                                req.data.item = doc;
                                response.ok(req, res, next,'با موفقیت ثبت گردید');
                            } else {
                                response.error(req, res, next, err);
                            }

                        });
                    }
                    else {
                        response.error(req, res, next, 'تعداد کامنت های ثبت شده بیش از حد مجاز است');
                    }
                }
                else {
                    response.error(req, res, next);
                }
            });
        }
        else {
            response.error(req, res, next, 'اطلاعات وارد شده معتبر نیست');
        }
    },




}

