const Model = require("../../model/banner");
const response = require("../../response");
var config = require('../../config');
const setting = require('../../model/setting');
// const banner = require('../model/banner');
const motto = require('../../model/motto');
const banner = require("../../model/banner");
var moment = require('jalali-moment');
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
        var first = req.params.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        Model.find({})
            // .limit(offset)
            // .skip(first)
            .exec((err, docs) => {
                req.data.items = docs;
                response.ok(req, res, next);
            })
    },
    POST_ITEM: (req, res, next) => {
        // Model.find({}).exec(function (err, docs) {
        // req.body.id = docs.reverse()[0].id + 1;
        new Model(req.body).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
        // });
    },
    GET_RANDOM_ITEM: (req, res, next) => {
        setting
            .aggregate()
            .match({})
            .lookup({
                from: "banners",
                localField: "bannerId",
                foreignField: "_id",
                as: "bannerData"
            })
            .lookup({
                from: "mottos",
                localField: "mottoId",
                foreignField: "_id",
                as: "mottoData"
            })
            .exec((err, data) => {
                if (data.length == 0) {
                    response.error(req, res, next, 'not found');
                    return;
                } else {
                    if (data[0].bannerId != null && data[0].mottoId != null) {
                        console.log('data::::::::::::: ', data);
                        // console.log('bannerData::::::::::::: ', data[0].bannerData);
                        var responseData = [];
                        var bannerData = [];
                        var mottoData = [];
                        bannerData = data[0].bannerData;
                        mottoData = data[0].mottoData;

                        var now = moment();
                        // var duration = moment.duration(end.diff(startTime));
                        // var hours = duration.asHours();
                        if (typeof bannerData[0].image !== 'undefined') {
                            bannerData[0].image = 'https://api.sabkino.com/uploads/files/' + bannerData[0].image;
                        }
                        var now = moment(new Date()); //todays date
                        var end = moment(data[0].lastTimeUpdate, 'YYYY/MM/DD HH:mm:ss'); // another date
                        var duration = moment.duration(now.diff(end));
                        var hours = duration.asHours();

                        if (hours < 24) {
                            var lastTimeUpdate = moment(data[0].lastTimeUpdate, 'MM/DD HH:mm').locale('fa').format('YYYY/MM/DD HH:mm');
                            console.log('lastTimeUpdate ::::::::', lastTimeUpdate);
                            responseData.push({
                                'bannerData': bannerData,
                                'mottoData': mottoData,
                            });

                            req.data = responseData;
                            response.ok(req, res, next);
                        } else {
                            banner.aggregate().match({}).exec((err2, data2) => {
                                let lenBanner = data2.length;
                                let randomBanner = 0;
                                randomBanner = Math.floor(Math.random() * lenBanner);
                                bannerData = data2[randomBanner];

                                motto.aggregate().match({}).exec((err3, data3) => {
                                    let lenMotto = data3.length;
                                    let randomMotto = Math.floor(Math.random() * lenMotto);
                                    mottoData = data3[randomMotto];

                                    console.log('bannerData :::::::::::::::', bannerData);
                                    if (typeof bannerData.image !== 'undefined') {
                                        bannerData.image = 'https://api.sabkino.com/uploads/files/' + bannerData.image;
                                    }
                                    responseData.push({
                                        'bannerData': bannerData,
                                        'mottoData': mottoData,
                                    });
                                    let lastTimeUpdate = moment().format('YYYY/MM/DD HH:mm:ss');
                                    setting.findByIdAndUpdate(data[0]._id, {
                                        bannerId: bannerData._id,
                                        mottoId: mottoData._id,
                                        lastTimeUpdate: lastTimeUpdate
                                    }, {
                                        new: true,
                                        runValidators: true
                                    }).exec((err, doc) => {
                                        if (doc) {
                                            req.data = responseData;
                                            response.ok(req, res, next);
                                        } else {
                                            response.error(req, res, next);
                                        }
                                    });


                                });


                            });
                        }
                    } else {
                        var responseData = [];
                        var bannerData = [];
                        var mottoData = [];
                        banner.aggregate().match({}).exec((err2, data2) => {
                            let lenBanner = data2.length;
                            let randomBanner = 0;
                            randomBanner = Math.floor(Math.random() * lenBanner);
                            bannerData = data2[randomBanner];

                            motto.aggregate().match({}).exec((err3, data3) => {
                                let lenMotto = data3.length;
                                let randomMotto = Math.floor(Math.random() * lenMotto);
                                mottoData = data3[randomMotto];

                                // console.log('randomMotto :', randomMotto);

                                responseData.push({
                                    'bannerData': bannerData,
                                    'mottoData': mottoData,
                                });
                                let lastTimeUpdate = moment().format('YYYY/MM/DD HH:mm:ss');
                                setting.findByIdAndUpdate(data[0]._id, {
                                    bannerId: bannerData._id,
                                    mottoId: mottoData._id,
                                    lastTimeUpdate: lastTimeUpdate
                                }, {
                                    new: true,
                                    runValidators: true
                                }).exec((err, doc) => {
                                    if (doc) {
                                        req.data = responseData;
                                        response.ok(req, res, next);
                                    } else {
                                        response.error(req, res, next);
                                    }
                                });


                            });


                        });
                    }

                }

            });
    }
};