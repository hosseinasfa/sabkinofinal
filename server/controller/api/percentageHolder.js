const Model = require("../../model/percentageHolder");
const Category = require("../../model/category");
const response = require("../../response");
var config = require('../../config');
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

        Model.find({})
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
            })
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
    POST_PERCENTAGE_ITEM: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        var title = req.body.title;
        var specialist = req.body.specialist;
        var coefficient = req.body.coefficient;
        var trueTest = req.body.trueTest;
        var wrongTest = req.body.wrongTest;
        var missTest = req.body.missTest;
        var educationalStageId = req.body.educationalStageId;
        var educationalFieldId = req.body.educationalFieldId;
        var categoryId = req.body.categoryId;


        console.log('req.body ::: ', req.body);
        console.log('specialist ::: ', specialist);

        // if (strClass == 'user' || strClass == 'family') {
        if (specialist == true) {
            if (typeof educationalStageId !== 'undefined' && typeof educationalFieldId !== 'undefined' && typeof categoryId !== 'undefined') {
                var percentage = 0.0;
                wrongTest = parseFloat(wrongTest);
                var minusTrueTest = parseFloat(wrongTest / 3);
                var totalTest = parseFloat(trueTest) + parseFloat(wrongTest) + parseFloat(missTest);

                console.log('minusTrueTest :::::', minusTrueTest);
                console.log('trueTest :::::', trueTest);
                if (parseFloat(minusTrueTest) < parseFloat(trueTest)) {
                    percentage = parseFloat((parseFloat(trueTest - minusTrueTest) * 100) / totalTest);
                }

                console.log('percentage ::::::', percentage);
                console.log('totalTest ::::::', totalTest);

                Category.findById(categoryId).exec((err, doc) => {
                    if (doc) {
                        var title = doc.title;
                        var query = {
                            userId: userId,
                            title: title,
                            educationalStageId: educationalStageId,
                            educationalFieldId: educationalFieldId,
                            categoryId: categoryId,
                            specialist: specialist,
                            coefficient: coefficient,
                            trueTest: trueTest,
                            wrongTest: wrongTest,
                            missTest: missTest,
                            percentage: percentage,
                        };

                        console.log('query ::: ', query);

                        new Model(query).save((err, doc) => {
                            if (doc) {
                                req.data.item = doc;
                                response.ok(req, res, next);
                            } else {
                                console.log('err ::: ', err);
                                response.error(req, res, next);
                            }
                        });
                    }
                    else {
                        response.error(req, res, next, 'اطلاعات وارد شده ناقص هست');
                    }
                });

            }
            else {
                response.error(req, res, next, 'اطلاعات وارد شده ناقص هست');
            }
        }
        else {
            var percentage = 0.0;
            wrongTest = parseFloat(wrongTest);
            var minusTrueTest = parseFloat(wrongTest / 3);
            var totalTest = parseFloat(trueTest) + parseFloat(wrongTest) + parseFloat(missTest);

            console.log('minusTrueTest :::::', minusTrueTest);
            console.log('trueTest :::::', trueTest);
            if (parseFloat(minusTrueTest) < parseFloat(trueTest)) {
                percentage = parseFloat((parseFloat(trueTest - minusTrueTest) * 100) / totalTest);
            }

            console.log('percentage ::::::', percentage);
            console.log('totalTest ::::::', totalTest);

            var query = {
                userId: userId,
                title: title,
                specialist: specialist,
                coefficient: coefficient,
                trueTest: trueTest,
                wrongTest: wrongTest,
                missTest: missTest,
                percentage: percentage,
            };

            new Model(query).save((err, doc) => {
                if (doc) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    console.log('err ::: ', err);
                    response.error(req, res, next);
                }
            });

        }


        // }
        // else {
        //     response.error(req, res, next, 'دسترسی به ثبت اطلاعات ندارید');
        // }

    },
    GET_PERCENTAGE_LIST_ITEM: (req, res, next) => {
        var userId = req.data.personInfo._id;
        var strClass = req.data.personInfo.class;
        // if (strClass == 'user' || strClass == 'family') {
        Model.find({
            'userId': userId,
        }).exec((err, docs) => {
            if (err) {
                response.error(req, res, next);
            }
            if (docs) {
                var items = [];
                // var totalTrueTest = 0;
                // var totalWrongTest = 0;
                // var totalMissTest = 0;
                // var totalPercentage = 0;
                // var totalCoefficient = 0;

                docs.forEach(item => {

                    if (item.specialist == false) {
                        items.push({
                            id: item._id.toString(),
                            userId: item.userId._id.toString(),
                            title: item.title,
                            specialist: item.specialist,
                            coefficient: item.coefficient,
                            trueTest: item.trueTest,
                            wrongTest: item.wrongTest,
                            missTest: item.missTest,
                            percentage: parseFloat((Math.round(item.percentage * 100) / 100).toFixed(2)),
                        });
                    }
                    else {
                        items.push({
                            id: item._id.toString(),
                            userId: item.userId._id.toString(),
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
                    }

                    // totalTrueTest = totalTrueTest + item.trueTest;
                    // totalWrongTest = totalWrongTest + item.wrongTest;
                    // totalMissTest = totalMissTest + item.missTest;
                    // totalPercentage += item.percentage * item.coefficient;

                    // totalCoefficient  =  totalCoefficient + item.coefficient;
                });

                // var totalItems = docs.length;
                // totalTrueTest = totalTrueTest  / totalItems;
                // totalWrongTest = totalWrongTest  / totalItems;
                // totalMissTest = totalMissTest  / totalItems;
                // totalPercentage = totalPercentage  / totalCoefficient;


                // var totalItem = {
                //     title: 'total',
                //     specialist: 0,
                //     coefficient: 0,
                //     trueTest: totalTrueTest,
                //     wrongTest: totalWrongTest,
                //     missTest : totalMissTest,
                //     percentage : parseFloat((Math.round(totalPercentage * 100) / 100).toFixed(2)),
                // };

                req.data.items = items;
                // req.data.totalResult = totalItem;

                response.ok(req, res, next);
            }
            else {
                response.error(req, res, next);
            }
        });
        // }
        // else {
        //     response.error(req, res, next, 'دسترسی به ثبت اطلاعات ندارید');
        // }

    },
    GET_PERCENTAGE_ITEM: (req, res, next) => {
        Model.findById(req.query.itemId).exec((err, doc) => {
            if (doc) {
                var items = [];
                items.push({
                    id: doc._id.toString(),
                    userId: doc.userId._id.toString(),
                    title: doc.title,
                    specialist: doc.specialist,
                    coefficient: doc.coefficient,
                    trueTest: doc.trueTest,
                    wrongTest: doc.wrongTest,
                    missTest: doc.missTest,
                    percentage: doc.percentage,
                    educationalStageId: doc.educationalStageId,
                    educationalFieldId: doc.educationalFieldId,
                    categoryId: doc.categoryId,
                });

                req.data.items = items;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },
    DELETE_PERCENTAGE_ITEM: (req, res, next) => {
        var itemId = req.query.itemId;
        console.log('itemId :::::::', itemId);

        Model.findById(itemId).exec((err1, doc1) => {
            if (err1) {
                response.error(req, res, next);
            } else {
                if (doc1) {
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
                } else {
                    response.error(req, res, next);
                }
            }
        });
    },



    DELETE_PERCENTAGE_ALL_ITEMS: (req, res, next) => {
        var itemIds = req.query.itemIds;
        var userId = req.data.personInfo._id;

        console.log('itemIds0000 ::: ', itemIds);



        itemIds = JSON.parse(itemIds);

        console.log('itemIds ::: ', itemIds);
        // Model.findOneAndDelete({
        //     _id: { $in: itemIds }
        // }).exec((err, doc) => {
        //     if (err) {
        //         response.error(req, res, next, 'اطلاعات یافت نشد');
        //     } else {
        //         response.ok(req, res, next, 'با موفقیت حذف گردید');
        //     }
        // });

        function deleteItemsResult(itemId) {
            return new Promise((resolve) => {
                Model.findOneAndDelete({ _id: itemId }).exec((err, doc) => {
                    if (err) {
                        response.error(req, res, next);
                    } else {
                        resolve(doc);
                    }
                });
            });
        }


        async function f2(itemId) {
            const result = await deleteItemsResult(itemId);
            return result;

        }
        async function deleteItems(itemId) {
            return await f2(itemId);
        }


        async function deleteListOfItems(docs) {
            for (var item of docs) {
                await deleteItems(item._id);
            }
            response.ok(req, res, next);
        }


        Model.find({ _id: { $in: itemIds } }).exec((err1, docs) => {
            if (err1) {
                response.error(req, res, next);
            } else {
                if (docs) {
                    var isAccess = true;
                    docs.forEach(item => {
                        if (item.userId._id.toString() != userId.toString()) {
                            isAccess = false;
                        }
                    });

                    if (isAccess == true) {
                        deleteListOfItems(docs);
                    }
                    else {
                        response.error(req, res, next, 'دسترسی حذف ندارید');
                    }
                } else {
                    response.error(req, res, next);
                }
            }
        });

    },


};