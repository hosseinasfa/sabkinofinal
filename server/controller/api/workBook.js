const Model = require("../../model/workBook");
const WorkBookDetail = require("../../model/workBookDetail");
const PercentageHolder = require("../../model/percentageHolder");
const response = require("../../response");
var config = require('../../config');
var moment = require('jalali-moment');
const Person = require("../../model/person").Person;
var offset = parseInt(process.env.ROW_NUMBER);

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

        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        Model
            .find({})
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
            })
    },
    DELETE_ITEMS: (req, res, next) => {
        var itemId = req.query.itemId;
        var userId = req.data.personInfo._id;
        // var strClass = req.data.personInfo.class;

        Model.findById(itemId).exec((err, doc) => {
            if (doc) {
                console.log('doc.userId._id :::', doc.userId._id.toString());
                console.log('userId :::', userId);
                if (doc.userId._id.toString() == userId.toString()) {
                    var query = {
                        '_id': itemId,
                    };
                    Model.findOneAndDelete(query).exec(() => {
                        response.ok(req, res, next, 'اطلاعات با موفقیت حذف گردید');
                    });
                } else {
                    response.error(req, res, next, 'دسترسی حذف را ندارید');
                }
            }
            else {
                response.error(req, res, next, 'اطلاعات یافت نشد');
            }
        });
    },
    POST_ITEM: (req, res, next) => {
        new Model(req.body).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        });
    },
    POST_WORKBOOK_ITEM: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }


        var title = req.body.title;
        var percentageHolderIds = JSON.parse(req.body.percentageHolderIds);

        var query = {
            userId: userId,
            title: title,
        };

        var workBookId = '';



        function workBookResult(item, workBookId) {
            return new Promise((resolve) => {
                PercentageHolder.findById(item.id).exec((err2, doc2) => {
                    if(doc2.specialist==true)
                    {
                        var query2 = {
                            workBookId: workBookId,
                            percentageHolderId: item.id,
                            title: doc2.title,
                            specialist: doc2.specialist,
                            coefficient: doc2.coefficient,
                            trueTest: doc2.trueTest,
                            wrongTest: doc2.wrongTest,
                            missTest: doc2.missTest,
                            percentage: doc2.percentage,
                            educationalStageId: doc2.educationalStageId,
                            educationalFieldId: doc2.educationalFieldId,
                            categoryId: doc2.categoryId,
    
                        };
    
                        // totalPercentage += doc2.percentage;
                        new WorkBookDetail(query2).save((err3, doc3) => {
                            // if (err2) {
                            //     response.error(req, res, next);            
                            // }
                            resolve(doc2.percentage);
    
                        });
                    }
                    else
                    {
                        var query2 = {
                            workBookId: workBookId,
                            percentageHolderId: item.id,
                            title: doc2.title,
                            specialist: doc2.specialist,
                            coefficient: doc2.coefficient,
                            trueTest: doc2.trueTest,
                            wrongTest: doc2.wrongTest,
                            missTest: doc2.missTest,
                            percentage: doc2.percentage,
                        };
                        // totalPercentage += doc2.percentage;
                        new WorkBookDetail(query2).save((err3, doc3) => {
                            // if (err2) {
                            //     response.error(req, res, next);            
                            // }
                            resolve(doc2.percentage);
    
                        });
                    }
                    
                });
            });
        }


        async function f2(item, workBookId) {
            const result = await workBookResult(item, workBookId);
            // console.log(result);
            return result;

        }


        async function workBookInsert(item, workBookId) {
            return await f2(item, workBookId);
        }

        async function getList(percentageHolderIds, workBookId) {
            var totalPercentage = 0;
            var index = 0;
            for (var item of percentageHolderIds) {
                index++;
                totalPercentage += await workBookInsert(item, workBookId);

                // PercentageHolder.findById(item.id).exec((err2, doc2) => {
                //     var query2 = {
                //         workBookId: doc._id,
                //         percentageHolderId: item.id,
                //         title: doc2.title,
                //         specialist: doc2.specialist,
                //         coefficient: doc2.coefficient,
                //         trueTest: doc2.trueTest,
                //         wrongTest: doc2.wrongTest,
                //         missTest: doc2.missTest,
                //         percentage: doc2.percentage,
                //         educationalStageId: doc2.educationalStageId,
                //         educationalFieldId: doc2.educationalFieldId,
                //         categoryId: doc2.categoryId,

                //     };

                //     totalPercentage += doc2.percentage;
                //     new WorkBookDetail(query2).save((err3, doc3) => {
                //         // if (err2) {
                //         //     response.error(req, res, next);            
                //         // }
                //     });
                // });





            }

            if (totalPercentage != 0) {
                totalPercentage = totalPercentage / index;
            }
            console.log('totalPercentage ::: ', totalPercentage);
            Model.findByIdAndUpdate(workBookId, {
                totalPercentage: totalPercentage
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


        }



        var totalPercentage = 0;
        new Model(query).save((err, doc) => {
            if (doc) {
                workBookId = doc._id;

                getList(percentageHolderIds, workBookId);

                // percentageHolderIds.forEach(item => {
                //     PercentageHolder.findById(item.id).exec((err2, doc2) => {
                //         var query2 = {
                //             workBookId: doc._id,
                //             percentageHolderId: item.id,
                //             title: doc2.title,
                //             specialist: doc2.specialist,
                //             coefficient: doc2.coefficient,
                //             trueTest: doc2.trueTest,
                //             wrongTest: doc2.wrongTest,
                //             missTest: doc2.missTest,
                //             percentage: doc2.percentage,
                //             educationalStageId: doc2.educationalStageId,
                //             educationalFieldId: doc2.educationalFieldId,
                //             categoryId: doc2.categoryId,

                //         };

                //         totalPercentage += doc2.percentage;
                //         new WorkBookDetail(query2).save((err3, doc3) => {
                //             // if (err2) {
                //             //     response.error(req, res, next);            
                //             // }
                //         });
                //     });
                // });


                // // totalPercentage
                // Model.findByIdAndUpdate(workBookId, {
                //     totalPercentage: totalPercentage
                // }, {
                //     new: true,
                //     runValidators: true
                // }).exec((err, doc) => {
                //     if (doc) {
                //         response.ok(req, res, next);
                //     } else {
                //         response.error(req, res, next);
                //     }
                // })


                // response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        });
    },


    
    GET_WORKBOOK_ITEMS: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }

        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }


        Model.find({
            'userId': userId,
        })
            .limit(offset)
            .skip(first)
            .sort({ createdAt: -1 })
            .exec((err, docs) => {
                if (docs) {
                    moment.locale('en');
                    var items = [];
                    docs.forEach(item => {
                        // var workBookDate = moment.from(item.workBookDate, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');

                        var new_date = item.workBookDate.toISOString().substring(0, 10);
                        // moment.locale('fa');
                        // new_date = moment.from(new_date, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
                        new_date = moment(new_date, 'YYYY-MM-DD').locale('fa').format('YYYY/MM/DD');


                        items.push({
                            '_id': item._id,
                            'title': item.title,
                            'workBookDate': new_date,
                            'totalPercentage': item.totalPercentage,
                            'isActive': item.isActive,
                            'isDelete': item.isDelete,
                            'userId': item.userId,
                            'createdAt': item.createdAt,
                            'updatedAt': item.updatedAt,
                        });
                    });

                    req.data.items = items;
                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next);
                }
            });
    },
    GET_WORKBOOK_DETAIL_ITEMS: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        var workBookId = req.query.workBookId;
        WorkBookDetail.find({
            'workBookId': workBookId,
        })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (docs) {
                    var items = [];
                    var totalTrueTest = 0;
                    var totalWrongTest = 0;
                    var totalMissTest = 0;
                    var totalPercentage = 0;
                    var totalCoefficient = 0;

                    docs.forEach(item => {
                        items.push({
                            id: item._id.toString(),
                            title: item.title,
                            specialist: item.specialist,
                            coefficient: item.coefficient,
                            trueTest: item.trueTest,
                            wrongTest: item.wrongTest,
                            missTest: item.missTest,
                            educationalStageId: item.educationalStageId,
                            educationalFieldId: item.educationalFieldId,
                            categoryId: item.categoryId,
                            percentage: parseFloat((Math.round(item.percentage * 100) / 100).toFixed(2)),
                        });

                        totalTrueTest = totalTrueTest + item.trueTest;
                        totalWrongTest = totalWrongTest + item.wrongTest;
                        totalMissTest = totalMissTest + item.missTest;
                        totalPercentage += item.percentage * item.coefficient;

                        totalCoefficient = totalCoefficient + item.coefficient;
                    });

                    var totalItems = docs.length;
                    totalTrueTest = totalTrueTest / totalItems;
                    totalWrongTest = totalWrongTest / totalItems;
                    totalMissTest = totalMissTest / totalItems;
                    totalPercentage = totalPercentage / totalCoefficient;


                    var totalItem = {
                        title: 'total',
                        specialist: 0,
                        coefficient: totalCoefficient,
                        trueTest: totalTrueTest,
                        wrongTest: totalWrongTest,
                        missTest: totalMissTest,
                        percentage: parseFloat((Math.round(totalPercentage * 100) / 100).toFixed(2)),
                    };

                    req.data.items = items;
                    req.data.totalResult = totalItem;
                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next);
                }
            });

    }

};