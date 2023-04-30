const PackageList = require("../../model/packageList");
const Package = require("../../model/package");
const response = require("../../response");
var config = require('../../config');
const Person = require('../../model/person').Person;
var moment = require('moment');
module.exports = {

    GET_ALL_ITEMS: (req, res, next) => {
        var x = req.data.personInfo._id
        PackageList.find({
            userId: x,
            isActive: true,
            isDelete: false
        }).exec((err, docs) => {
            if (docs) {
                req.data.provinceList = docs;
                console.log('aaaaa');
                //  response.ok(req, res, next);

                var length = docs.length;
                for (var i = 0; i < length; i++) {
                    console.log('data :', docs[i]['startPackage']);
                }
                var list = [];
                var liveDate = moment().format('YYYY/MM/DD HH:mm');

                docs.forEach(item => {
                    var duration = item.duration;
                    // Package.find({'_id': item.PackageId}).exec((err, docs2) => {
                    //     duration = docs2.duration;
                    // });
                    //       console.log('duration :', item.Package.duration);
                    var startPackage = moment(item.startPackage).format('YYYY/MM/DD HH:mm');
                    var diff = moment.utc(moment(liveDate, "YYYY/MM/DD HH:mm").diff(moment(startPackage, "YYYY/MM/DD HH:mm"))).format("DD");
                    console.log('diff :', diff);
                    //var diff = startPackage.diff(liveDate);
                    var remainingTime = duration - parseInt(diff);
                    if (parseInt(remainingTime) < 0) {
                        remainingTime = 0;
                    }

                    list.push({
                        "_id": item._id.toString(),
                        "reservePackage": item.reservePackage,
                        "startPackage": moment(item.startPackage).format('YYYY/MM/DD HH:mm'),
                        "remainingTime": remainingTime,
                        "duration": duration,
                        "userId": item.userId,
                        "PackageId": item.PackageId,
                    });
                });

                res.json({
                    list
                })
                console.log(docs)
            } else {
                response.error(req, res, next, 'آیتمی پیدا  نشد');
            }

        })
    },
    // PackageList.aggregate([
    //     { 
    //       $match: { 
    //         'userId': x 
    //       }
    //     },
    //     { 
    //       $project: {
    //         comments: {
    //           $slice: [ "$comments", -1 ] 
    //         }
    //       }
    //     }
    //   ]).exec((err, docs) => {
    //         if(docs){
    //             // req.data.provinceList = docs;
    //             // response.ok(req, res, next);
    //             res.send(docs)
    //         }else{
    //             response.error(req, res, next, 'آیتمی پیدا  نشد');
    //         }

    //         })
    //     },  
    GET_EACH_ITEM: (req, res, next) => {
        PackageList.findById(req.params.packageListId).exec((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })
    },


    POST_ITEM: (req, res, next) => {

        new PackageList(req.body).save((err, doc) => {
            if (doc) {
                req.data.item = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
    },


};