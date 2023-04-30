// const { ok } = require("../../response")
const response = require('../../response');
const Model = require("../../model/person");
const Academy = require("../../model/academy");
const Person = require("../../model/person").Person;
const Mentor = require("../../model/person").Mentor;
const Teacher = require("../../model/person").Teacher;
const Family = require("../../model/person").Family;
const User = require("../../model/person").User;
const SchoolBoss = require("../../model/person").SchoolBoss;
const Token = require("../../model/token");

const SchoolTemp = require("../../model/schoolTemp");
const AcademyTemp = require("../../model/academyTemp");
const City = require("../../model/city");
const Province = require("../../model/province");
const District = require("../../model/district");
const EntranceExam = require("../../model/entranceExam");
const EntranceExam2 = require("../../model/entranceExam2");
const EducationalStage = require("../../model/educationalStage");
const Category = require("../../model/category");
var rand = require("random-key");
var moment = require('jalali-moment');
// const EducationalInstitutions = require("../../model/person").EducationalInstitutions;
const School = require("../../model/school");
const { type } = require("os");

var fs = require('fs');
var fs2 = require('fs-extra');
var path = require('path');
const { Console } = require("console");
var offset = parseInt(process.env.ROW_NUMBER_API);


const EducationalInstitutions = require("../../model/person").EducationalInstitutions;
// const Person = require("../../model/person");
module.exports = {
    userInfo: (req, res, next) => {
        var strClass = req.data.personInfo.class;
        var personInfo = req.data.personInfo;

        console.log('strClass ::: ', strClass);
        if (strClass == 'educationalInstitutions') {
            console.log('personInfo.academyId :::', personInfo.academyId);
            Academy.findById(personInfo.academyId).exec((err, doc) => {
                if (doc) {
                    personInfo.academyId = doc;
                    console.log('doc :::', doc);
                    req.data.item = personInfo;
                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next);
                }
            });

        }
        else if (strClass == 'user') {
            if (typeof personInfo.schoolId !== 'undefined') {
                console.log('personInfo.schoolId :::: ', personInfo.schoolId);
                School.findById(personInfo.schoolId).exec((err2, doc2) => {
                    personInfo.schoolId = doc2;
                    req.data.item = personInfo;
                    response.ok(req, res, next);
                });
            }
            else {
                response.error(req, res, next, 'اطلاعات یافت نشد');
            }
        }

        else if (strClass == 'schoolBoss') {
            School.findById(personInfo.schoolId).exec((err, doc) => {
                if (doc) {
                    personInfo.schoolId = doc;
                    console.log('doc :::', doc);
                    // req.data.personInfo = personInfo;
                    req.data.item = personInfo;

                    response.ok(req, res, next);
                }
                else {
                    response.error(req, res, next);
                }

            });
        }
        else {
            req.data.item = req.data.personInfo;
            response.ok(req, res, next);
        }
    },
    PUT_ITEM_ACTIVE: (req, res, next) => {

        console.log(' ------------  active  -------------------');
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
        console.log(' ------------  de active  -------------------');
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

    PUT_PERSON: (req, res, next) => {
        UserId = req.data.personInfo._id;
        Person.findByIdAndUpdate(req.params.itemId, req.body, {
            new: true,
            runValidators: true
        }).exec((err, doc) => {
            if (doc) {
                req.data.items = doc;
                response.ok(req, res, next);
            } else {
                response.error(req, res, next);
            }
        })
    },

    GET_USER_INFO: (req, res, next) => {
        var userId = req.query.userId;

        console.log('userId ::::', userId);
        Person.findById(userId).exec((err, doc) => {
            if (doc) {
                if (doc.class == "mentor") {
                    Mentor.findById(userId).exec((err2, docMentor) => {
                        if (docMentor) {
                            req.data.item = docMentor;
                            response.ok(req, res, next);
                        }
                        else {
                            response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                        }
                    });
                }
                else if (doc.class == "teacher") {
                    Teacher.findById(userId).exec((err2, docTeacher) => {
                        if (docTeacher) {
                            req.data.item = docTeacher;
                            response.ok(req, res, next);
                        }
                        else {
                            response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                        }
                    });
                }
                else if (doc.class == "family") {
                    Family.findById(userId).exec((err2, docFamily) => {
                        if (docFamily) {
                            req.data.item = docFamily;
                            if (typeof docFamily.childSchool !== 'undefined') {
                                console.log('docFamily.childSchool :::: ', docFamily.childSchool);
                                School.findById(docFamily.childSchool).exec((err, doc) => {
                                    // console.log('doc ::::',doc);
                                    docFamily.childSchool = doc;
                                    response.ok(req, res, next);
                                });
                            }
                            else {
                                response.error(req, res, next, 'اطلاعات یافت نشد');
                            }
                        }
                        else {
                            response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                        }
                    });
                }
                else if (doc.class == "user") {
                    User.findById(userId).exec((err2, docUser) => {
                        if (docUser) {
                            req.data.item = docUser;

                            if (typeof docUser.schoolId !== 'undefined') {
                                console.log('docUser.schoolId :::: ', docUser.schoolId);
                                School.findById(docUser.schoolId).exec((err2, doc2) => {
                                    // console.log('doc ::::',doc);
                                    docUser.schoolId = doc2;

                                    response.ok(req, res, next);
                                });
                            }
                            else {
                                response.error(req, res, next, 'اطلاعات یافت نشد');
                            }


                        }
                        else {
                            response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                        }
                    });
                }
                else if (doc.class == "educationalInstitutions") {
                    EducationalInstitutions.findById(userId).exec((err2, docUser) => {
                        if (docUser) {
                            req.data.item = docUser;
                            response.ok(req, res, next);
                        }
                        else {
                            response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                        }
                    });
                }
                else if (doc.class == "schoolBoss") {
                    SchoolBoss.findById(userId).exec((err2, docUser) => {
                        if (docUser) {
                            req.data.item = docUser;
                            response.ok(req, res, next);
                        }
                        else {
                            response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
                        }
                    });
                }
            } else {
                response.error(req, res, next, 'چنین آیتمی موجود نمی باشد');
            }
        })



        // Model.findById(userId).exec((err, doc) => {
        //     if (doc) {
        //         req.data.items = doc;
        //         response.ok(req, res, next);
        //     } else {
        //         response.error(req, res, next);
        //     }
        // })

    },

    PUT_EMPTY_ACCOUNT: (req, res, next) => {
        Person.findByIdAndUpdate(req.body.userId, {
            walletBalance: 0,
            expireExamPackageDate: Date.now(),
            expirePackageDate: Date.now(),
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
    IMPORT_SCHOOL_DATA: (req, res, next) => {

        String.prototype.replaceAll = function (search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };

        String.prototype.toPersianCharacter = function () {
            var string = this;
            var obj = {
                'ك': 'ک',
                'دِ': 'د',
                'بِ': 'ب',
                'زِ': 'ز',
                'ذِ': 'ذ',
                'شِ': 'ش',
                'سِ': 'س',
                'ى': 'ی',
                'ي': 'ی',
                '١': '۱',
                '٢': '۲',
                '٣': '۳',
                '٤': '۴',
                '٥': '۵',
                '٦': '۶',
                '٧': '۷',
                '٨': '۸',
                '٩': '۹',
                '٠': '۰',
            };

            Object.keys(obj).forEach(function (key) {
                string = string.replaceAll(key, obj[key]);
            });
            return string
        };

        /**
        * Example
        */

        // var string = 'آذربایجان شرقي';
        // string  =  string.toPersianCharacter();
        // console.log(string); //out put "ک ۴ ۶۶"


        // City.find({}).exec((err, docsCities) => {
        //     for (var item of docsCities) {
        //         var title = item.title;
        //         var string = title.toPersianCharacter();
        //         console.log(string); //out put "ک ۴ ۶۶"
        //         City.findByIdAndUpdate(item._id, {
        //             title: string
        //         }, {
        //             new: true,
        //             runValidators: true
        //         }).exec((err, doc) => {
        //             if (doc) {

        //             } else {
        //                 response.error(req, res, next);
        //             }
        //         })
        //     }
        //     response.ok(req, res, next);
        // });

        // Province.find({}).exec((err, docsProvince) => {

        //     for (var item of docsProvince) {
        //         var title = item.title;
        //         var string = title.toPersianCharacter();
        //         console.log(string); //out put "ک ۴ ۶۶"
        //         Province.findByIdAndUpdate(item._id, {
        //             title: string
        //         }, {
        //             new: true,
        //             runValidators: true
        //         }).exec((err, doc) => {
        //             if (doc) {

        //             } else {
        //                 response.error(req, res, next);
        //             }
        //         })
        //     }
        //     response.ok(req, res, next);
        // });


        District.find({}).exec((err0, docsDistrict) => {
            Province.find({}).exec((err1, docsProvince) => {
                City.find({}).exec((err2, docsCities) => {

                    SchoolTemp.find({})
                        // .limit(10)
                        // .skip(0)
                        .exec((err3, docsSchool) => {
                            if (docsSchool) {
                                docsSchool.forEach(item => {
                                    var cityId = null;
                                    var provinceId = null;
                                    var districtId = null;
                                    for (var item2 of docsCities) {
                                        if (item.city.trim() == item2.title.trim()) {
                                            // console.log('item2_id ::: ', item2._id);
                                            cityId = item2._id;
                                            break;
                                        }
                                    }


                                    for (var item3 of docsProvince) {
                                        if (item.ostan.trim() == item3.title.trim()) {
                                            // console.log('item3 ::: ', item3._id);
                                            provinceId = item3._id;
                                            break;
                                        }
                                    }



                                    for (var item4 of docsDistrict) {
                                        if (item.nahieh.trim() == item4.title.trim()) {
                                            // console.log('item4 ::: ', item4._id);
                                            districtId = item4._id;
                                            break;
                                        }
                                    }

                                    var gender = 'boy';
                                    if (item.gender == 'پسرانه') {
                                        gender = 'boy';
                                    }
                                    else {
                                        gender = 'girl';
                                    }


                                    var type = '';
                                    if (item.type != null && item.type.trim() == 'دولتی') {
                                        type = 'Governmental';
                                    }
                                    else if (item.type != null && item.type.trim() == 'غیر دولتی') {
                                        type = 'NonProfit';
                                    }
                                    else if (item.type != null && item.type.trim() == 'نمونه دولتی') {
                                        type = 'GovernmentSample';
                                    }
                                    else if (item.type != null && item.type.trim() == 'شاهد') {
                                        type = 'Witness';
                                    }
                                    else if (item.type != null && item.type.trim() == 'تیزهوشان') {
                                        type = 'Talented';
                                    }
                                    else if (item.type != null && item.type.trim() == 'هیئت امنایی') {
                                        type = 'hOmanayi';
                                    }
                                    else {
                                        type = 'NonProfit';
                                    }


                                    if (cityId == null) {
                                        console.log('item.city ::: ', item.city);
                                    }

                                    console.log('item.name ::', item.name);

                                    // console.log('cityId ::: ',cityId);
                                    // console.log('provinceId ::: ',provinceId);
                                    // console.log('districtId ::: ',districtId);
                                    if (item.name != null && cityId != null && provinceId != null && districtId != null) {
                                        var query = {
                                            avatar: '',
                                            logo: '',
                                            studentCount: 0,
                                            yard: 0,
                                            classCount: 0,
                                            floorCount: 0,
                                            libraryCount: 0,
                                            laboratoryCount: 0,
                                            smartClassCount: 0,
                                            wcCount: 0,
                                            prayerRoomCount: 0,
                                            conferenceRoomCount: 0,
                                            computerSalonCount: 0,
                                            stadiumCount: 0,
                                            buffetCount: 0,
                                            dinningSalonCount: 0,
                                            area: 0,
                                            library: false,
                                            laboratory: false,
                                            smartClass: false,
                                            wc: false,
                                            prayerRoom: false,
                                            conferenceRoom: false,
                                            computerSalon: false,
                                            stadium: false,
                                            buffet: false,
                                            dinningSalon: false,
                                            isActive: true,
                                            isDelete: false,
                                            title: item.name,
                                            caption: item.name,
                                            phone: item.phone,
                                            site: '',
                                            boss: 'سبکینو',
                                            address: item.address,
                                            establishmentNumber: 0,
                                            gender: gender,
                                            type: type,
                                            establishedYear: 0,
                                            provinceId: provinceId,
                                            district: districtId,
                                            cityId: cityId,
                                            bossId: '635900bd47439f798a53502e',
                                        };

                                        new School(query).save((err, doc) => {
                                            if (doc) {
                                                console.log('inserted school');
                                                // req.data.item = doc;
                                                // response.ok(req, res, next);
                                            } else {
                                                console.log('err :::::::::::: ', err);
                                                response.error(req, res, next);
                                            }
                                        })
                                    }


                                    // SchoolTemp.findByIdAndUpdate(item._id, {
                                    //     // city: cityId
                                    //     ostan: provinceId
                                    // }, {
                                    //     new: true,
                                    //     runValidators: true
                                    // }).exec((err, doc) => {
                                    //     if (doc) {

                                    //     } else {
                                    //         response.error(req, res, next);
                                    //     }
                                    // });
                                });





                                // req.data.items = docs3;
                                // req.data.items2 = docs;
                                // req.data.items3 = docs2;
                                response.ok(req, res, next);
                            } else {
                                response.error(req, res, next);
                            }
                        })
                });

            });
        });
    },

    IMPORT_ACADEMY_DATA: (req, res, next) => {

        String.prototype.replaceAll = function (search, replacement) {
            var target = this;
            return target.replace(new RegExp(search, 'g'), replacement);
        };

        String.prototype.toPersianCharacter = function () {
            var string = this;
            var obj = {
                'ك': 'ک',
                'دِ': 'د',
                'بِ': 'ب',
                'زِ': 'ز',
                'ذِ': 'ذ',
                'شِ': 'ش',
                'سِ': 'س',
                'ى': 'ی',
                'ي': 'ی',
                '١': '۱',
                '٢': '۲',
                '٣': '۳',
                '٤': '۴',
                '٥': '۵',
                '٦': '۶',
                '٧': '۷',
                '٨': '۸',
                '٩': '۹',
                '٠': '۰',
            };

            Object.keys(obj).forEach(function (key) {
                string = string.replaceAll(key, obj[key]);
            });
            return string
        };

        /**
        * Example
        */

        // var string = 'آذربایجان شرقي';
        // string  =  string.toPersianCharacter();
        // console.log(string); //out put "ک ۴ ۶۶"


        // City.find({}).exec((err, docsCities) => {
        //     for (var item of docsCities) {
        //         var title = item.title;
        //         var string = title.toPersianCharacter();
        //         console.log(string); //out put "ک ۴ ۶۶"
        //         City.findByIdAndUpdate(item._id, {
        //             title: string
        //         }, {
        //             new: true,
        //             runValidators: true
        //         }).exec((err, doc) => {
        //             if (doc) {

        //             } else {
        //                 response.error(req, res, next);
        //             }
        //         })
        //     }
        //     response.ok(req, res, next);
        // });

        // Province.find({}).exec((err, docsProvince) => {

        //     for (var item of docsProvince) {
        //         var title = item.title;
        //         var string = title.toPersianCharacter();
        //         console.log(string); //out put "ک ۴ ۶۶"
        //         Province.findByIdAndUpdate(item._id, {
        //             title: string
        //         }, {
        //             new: true,
        //             runValidators: true
        //         }).exec((err, doc) => {
        //             if (doc) {

        //             } else {
        //                 response.error(req, res, next);
        //             }
        //         })
        //     }
        //     response.ok(req, res, next);
        // });

        Province.find({}).exec((err1, docsProvince) => {
            City.find({}).exec((err2, docsCities) => {

                AcademyTemp.find({})
                    // .limit(10)
                    // .skip(0)
                    .exec((err3, docsAcademy) => {

                        console.log('docsAcademy.length ::: ', docsAcademy.length);


                        if (docsAcademy) {
                            docsAcademy.forEach(item => {
                                var cityId = null;
                                var provinceId = null;
                                for (var item2 of docsCities) {
                                    if (item.city != null && item.city.trim() == item2.title.trim()) {
                                        // console.log('item2_id ::: ', item2._id);
                                        cityId = item2._id;
                                        break;
                                    }
                                }


                                for (var item3 of docsProvince) {
                                    if (item.ostan != null && item.ostan.trim() == item3.title.trim()) {
                                        // console.log('item3 ::: ', item3._id);
                                        provinceId = item3._id;
                                        break;
                                    }
                                }



                                var gender = 'boy';
                                if (item.gender != null && item.gender == 'پسرانه') {
                                    gender = 'boy';
                                }
                                else if (item.gender != null && item.gender == 'دخترانه') {
                                    gender = 'girl';
                                }
                                else if (item.gender != null && item.gender == 'مختلط') {
                                    gender = 'mixed';
                                }


                                var type = 'physical';
                                if (cityId == null) {
                                    console.log('item.city ::: ', item.city);
                                }

                                console.log('item.name ::', item.name);

                                console.log('cityId ::: ', cityId);
                                console.log('provinceId ::: ', provinceId);
                                if (item.name != null && cityId != null && provinceId != null) {
                                    var query = {
                                        avatar: '',
                                        logo: '',
                                        isActive: true,
                                        isDelete: false,
                                        title: item.name,
                                        caption: item.name,
                                        phone: item.phone,
                                        site: '',
                                        boss: 'سبکی نو',
                                        gender: gender,
                                        type: type,
                                        establishedYear: 0,
                                        area: 0,
                                        provinceId: provinceId,
                                        cityId: cityId,
                                        bossId: '635d04580a25d657024621ce',
                                    };

                                    new Academy(query).save((err, doc) => {
                                        if (doc) {
                                            console.log('inserted school');
                                            // req.data.item = doc;
                                            // response.ok(req, res, next);
                                        } else {
                                            console.log('err :::::::::::: ', err);
                                            response.error(req, res, next);
                                        }
                                    })
                                }


                                // SchoolTemp.findByIdAndUpdate(item._id, {
                                //     // city: cityId
                                //     ostan: provinceId
                                // }, {
                                //     new: true,
                                //     runValidators: true
                                // }).exec((err, doc) => {
                                //     if (doc) {

                                //     } else {
                                //         response.error(req, res, next);
                                //     }
                                // });
                            });





                            // req.data.items = docs3;
                            // req.data.items2 = docs;
                            // req.data.items3 = docs2;
                            response.ok(req, res, next);
                        } else {
                            response.error(req, res, next);
                        }
                    })
            });

        });




    },

    IMPORT_DATA: (req, res, next) => {
        var parentIdBase = req.query.parentId;

        function getDirectories(path) {
            if (fs.existsSync(path)) {
                return fs.readdirSync(path).filter(function (file) {
                    return fs.statSync(path + '/' + file).isDirectory();
                });
            }
        }



        var path2 = 'public/azmon';
        var directoryList = [];

        function insertEntranceResult(item2, parentId, index2) {
            return new Promise((resolve) => {
                var parentId2 = parentId;
                // console.log('item2 :::: ', item2);
                console.log('parentId2 :::: ', parentId2);
                // if (parentId != null && parentId != '') {
                if (typeof parentId2 === 'undefined' || parentId2 == '' || parentId2 == null) {
                    EntranceExam.findOne({ title: item2.trim() }).exec((err2, doc2) => {
                        if (doc2) {
                            // console.log(' doc2.parent :::::::::: ', doc2.parent);
                            if (doc2.title == item2.trim() && (typeof doc2.parent === 'undefined' || doc2.parent == null)) {
                                parentId2 = doc2._id;
                                console.log('parent id is exist : ', item2);
                                resolve(parentId2);
                            }


                            if (doc2.title != item2.trim() && doc2.parent.toString() != parentId) {
                                // parentId2 = doc2._id;

                                var query = {
                                    title: item2.trim(),
                                    caption: item2.trim(),
                                };

                                console.log('parent 2 id is exist : ', item2);

                                // console.log('parentId :::: ', parentId);
                                // console.log('query :::: ', query);
                                // req.body.id = docs.reverse()[0].id + 1;
                                new EntranceExam(query).save((err, doc) => {
                                    if (doc) {
                                        // req.data.item = doc;
                                        // response.ok(req, res, next);
                                        parentId2 = doc._id;
                                        // console.log('parentId2 :::: ', parentId2);
                                        resolve(parentId2);
                                    } else {
                                        response.error(req, res, next);
                                    }
                                })

                                // console.log('directory is : ', item2);
                            }
                            else {
                                resolve(parentId2);
                            }

                        }
                        else {

                            console.log('parent 3 id is exist : ', item2);
                            var query = {
                                title: item2.trim(),
                                caption: item2.trim(),
                            };

                            // console.log('query :::: ', query);

                            // req.body.id = docs.reverse()[0].id + 1;
                            new EntranceExam(query).save((err, doc) => {
                                if (doc) {
                                    // req.data.item = doc;
                                    parentId2 = doc._id;
                                    // console.log('parentId2 :::: ', parentId2);
                                    resolve(parentId2);

                                } else {
                                    response.error(req, res, next);
                                }
                            });

                            // console.log('directory is : ', item2);

                        }
                    });
                }
                else {
                    EntranceExam.findOne({ title: item2.trim(), parent: parentId }).exec((err2, doc2) => {
                        if (doc2) {

                            // console.log(' doc2.parent :::::::::: ', doc2.parent);
                            // if (doc2.title == item2.trim() && doc2.parent == null) {
                            //     parentId2 = doc2._id;
                            //     resolve(parentId2);
                            //     // console.log('directory is : ', item2);
                            // }
                            // else

                            if (doc2.title != item2.trim() && doc2.parent.toString() != parentId) {
                                parentId2 = doc2._id;

                                var query = {
                                    parent: parentId2,
                                    title: item2.trim(),
                                    caption: item2.trim(),
                                };

                                console.log('parent 4 id is exist : ', item2);
                                // console.log('parentId :::: ', parentId);
                                // console.log('query :::: ', query);
                                // req.body.id = docs.reverse()[0].id + 1;
                                new EntranceExam(query).save((err, doc) => {
                                    if (doc) {
                                        // req.data.item = doc;
                                        // response.ok(req, res, next);
                                        parentId2 = doc._id;
                                        // console.log('parentId2 :::: ', parentId2);
                                        resolve(parentId2);
                                    } else {
                                        response.error(req, res, next);
                                    }
                                })

                                // console.log('directory is : ', item2);
                            }
                            else {
                                parentId2 = doc2._id;
                                resolve(parentId2);
                            }

                        }
                        else {
                            var query;
                            if (parentId2 == '') {
                                query = {
                                    title: item2.trim(),
                                    caption: item2.trim(),
                                };
                            }
                            else {
                                query = {
                                    parent: parentId2,
                                    title: item2.trim(),
                                    caption: item2.trim(),
                                };
                            }

                            console.log('parent 5 id is exist : ', item2);

                            // console.log('query :::: ', query);

                            // req.body.id = docs.reverse()[0].id + 1;
                            new EntranceExam(query).save((err, doc) => {
                                if (doc) {
                                    // req.data.item = doc;
                                    parentId2 = doc._id;
                                    // console.log('parentId2 :::: ', parentId2);
                                    resolve(parentId2);

                                } else {
                                    response.error(req, res, next);
                                }
                            });

                            // console.log('directory is : ', item2);

                        }
                    });
                }

            });
        }

        async function f1(item2, parentId, index2) {
            const result = await insertEntranceResult(item2, parentId, index2);
            // console.log(result);
            return result;

        }
        async function insertEntrance(item2, parentId, index2) {
            return await f1(item2, parentId, index2);
        }



        function insertEntrancePdfResult(parentId, item2) {
            return new Promise((resolve) => {
                EntranceExam.findByIdAndUpdate(parentId, {
                    avatar: item2
                }, {
                    new: true,
                    runValidators: true
                }).exec((err, doc) => {
                    if (doc) {
                        resolve(doc);
                    }
                })
            });
        }


        async function f2(parentId, item2) {
            const result = await insertEntrancePdfResult(parentId, item2);
            // console.log(result);
            return result;

        }
        async function insertEntrancePdf(parentId, item2) {
            return await f2(parentId, item2);
        }

        function renameAndMoveFileResult(originalName, newName, pathFile) {
            return new Promise((resolve) => {
                var path3 = 'public/uploads/files';


                var oldPath = pathFile;
                var newPath = path3 + '/' + newName;

                // // Source file
                // const src = "file.txt";

                // // Destination path
                // const dest = "destination/file.txt";

                // // Function call
                // // Using call back function

                // console.log(' oldPath ::: ', oldPath);
                // console.log(' newPath ::: ', newPath);
                fs.copyFile(oldPath, newPath, (err) => {
                    if (err) return console.log(err);
                    console.log(`File successfully moved!!`);
                    resolve(newName);
                });
            });
        }


        async function f3(originalName, newName, pathFile) {
            const result = await renameAndMoveFileResult(originalName, newName, pathFile);
            // console.log(result);
            return result;

        }
        async function renameAndMoveFile(originalName, newName, pathFile) {
            return await f3(originalName, newName, pathFile);
        }


        async function getList(directoryList, parentId) {
            var items = [];
            var parentIdTemp = parentId;
            for (var item of directoryList) {
                // var index = 0;
                // item = item.replace('/data/sabkino_source/server/public/azmon/', '');
                // directoryList[index] = item;
                // index++;

                const words = item.split('/');
                console.log('words :::: ', words);

                var index2 = 0;
                // for (var item2 of words) {
                for (var item2 of words) {
                    if (item2.includes('.pdf') || item2.includes('.docx') || item2.includes('.doc')) {
                        // console.log('parentId  :::: ', parentId);
                        // console.log('avatar  :::: ', item2);

                        // console.log('::::: item with pdf ::: ', item2);
                        var newName = '';
                        if (item2.includes('.pdf')) {
                            newName = rand.generate(16) + '-' + Date.now() + '.pdf';
                        }
                        else if (item2.includes('.docx')) {
                            newName = rand.generate(16) + '-' + Date.now() + '.docx';
                        }
                        else if (item2.includes('.doc')) {
                            newName = rand.generate(16) + '-' + Date.now() + '.doc';
                        }

                        await insertEntrancePdf(parentIdTemp, newName);
                        await renameAndMoveFile(item2, newName, 'public/azmon/' + item);
                    }



                    else {

                        if (index2 == 0) {
                            // console.log('index2 ::: ', index2);
                            // console.log('item2 ::: ', item2);
                        }
                        // console.log('index2 ::: ', index2);
                        // console.log('::::: parentId  ::: ', parentId);
                        // var parentId2 = parentId;
                        parentIdTemp = await insertEntrance(item2, parentIdTemp, index2);
                        // console.log(' ::::::::::::::::::: parentId  :::::::::::::::::::: ', parentId);
                    }
                    index2++;
                }

                parentIdTemp = parentId;
                // req.data.item = directoryList;
                // response.ok(req, res, next)
            }
            req.data.items = directoryList;
            response.ok(req, res, next);
        }



        var walk = function (dir, done) {
            var results = [];
            fs.readdir(dir, function (err, list) {
                if (err) return done(err);
                var pending = list.length;
                if (!pending) return done(null, results);
                list.forEach(function (file) {
                    file = path.resolve(dir, file);
                    fs.stat(file, function (err, stat) {
                        if (stat && stat.isDirectory()) {
                            walk(file, function (err, res) {
                                results = results.concat(res);
                                if (!--pending) done(null, results);
                            });
                        } else {
                            results.push(file);
                            if (!--pending) done(null, results);
                        }
                    });
                });
            });
        };


        // console.log('path2 ::: ', path2);
        walk(path2, function (err, results) {
            if (err) throw err;
            directoryList = results;

            // console.log('directoryList ::: ', directoryList);

            var directoryListTemp = [];
            for (var item of directoryList) {
                var index = 0;
                item = item.replace('/data/sabkino_source/server/public/azmon/', '');
                // directoryList[index] = item;
                directoryListTemp.push(item);
                index++;
            }

            console.log('directoryListTemp ::: ', directoryListTemp);
            console.log('parentIdBase ::: ', parentIdBase);
            getList(directoryListTemp, parentIdBase);


        })


    },

    IMPORT_DATA_NEW: (req, res, next) => {
        var parentIdBase = req.query.parentId;


        function getDirectories(path) {
            if (fs.existsSync(path)) {
                return fs.readdirSync(path).filter(function (file) {
                    return fs.statSync(path + '/' + file).isDirectory();
                });
            }
        }



        var path2 = 'public/azmon';
        var directoryList = [];

        function insertEntranceResult(item2, parentId, index2) {
            return new Promise((resolve) => {
                var parentId2 = parentId;
                // console.log('item2 :::: ', item2);
                console.log('parentId2 :::: ', parentId2);
                // if (parentId != null && parentId != '') {
                if (typeof parentId2 === 'undefined' || parentId2 == '' || parentId2 == null) {
                    EntranceExam2.findOne({ title: item2.trim() }).exec((err2, doc2) => {
                        if (doc2) {
                            // console.log(' doc2.parent :::::::::: ', doc2.parent);
                            if (doc2.title == item2.trim() && (typeof doc2.parent === 'undefined' || doc2.parent == null)) {
                                parentId2 = doc2._id;
                                console.log('parent id is exist : ', item2);
                                resolve(parentId2);
                            }


                            if (doc2.title != item2.trim() && doc2.parent.toString() != parentId) {
                                // parentId2 = doc2._id;

                                var query = {
                                    title: item2.trim(),
                                    caption: item2.trim(),
                                };

                                console.log('parent 2 id is exist : ', item2);

                                // console.log('parentId :::: ', parentId);
                                // console.log('query :::: ', query);
                                // req.body.id = docs.reverse()[0].id + 1;
                                new EntranceExam2(query).save((err, doc) => {
                                    if (doc) {
                                        // req.data.item = doc;
                                        // response.ok(req, res, next);
                                        parentId2 = doc._id;
                                        // console.log('parentId2 :::: ', parentId2);
                                        resolve(parentId2);
                                    } else {
                                        response.error(req, res, next);
                                    }
                                })

                                // console.log('directory is : ', item2);
                            }
                            else {
                                resolve(parentId2);
                            }

                        }
                        else {

                            console.log('parent 3 id is exist : ', item2);
                            var query = {
                                title: item2.trim(),
                                caption: item2.trim(),
                            };

                            // console.log('query :::: ', query);

                            // req.body.id = docs.reverse()[0].id + 1;
                            new EntranceExam2(query).save((err, doc) => {
                                if (doc) {
                                    // req.data.item = doc;
                                    parentId2 = doc._id;
                                    // console.log('parentId2 :::: ', parentId2);
                                    resolve(parentId2);

                                } else {
                                    response.error(req, res, next);
                                }
                            });

                            // console.log('directory is : ', item2);

                        }
                    });
                }
                else {
                    EntranceExam2.findOne({ title: item2.trim(), parent: parentId }).exec((err2, doc2) => {
                        if (doc2) {

                            // console.log(' doc2.parent :::::::::: ', doc2.parent);
                            // if (doc2.title == item2.trim() && doc2.parent == null) {
                            //     parentId2 = doc2._id;
                            //     resolve(parentId2);
                            //     // console.log('directory is : ', item2);
                            // }
                            // else

                            if (doc2.title != item2.trim() && doc2.parent.toString() != parentId) {
                                parentId2 = doc2._id;

                                var query = {
                                    parent: parentId2,
                                    title: item2.trim(),
                                    caption: item2.trim(),
                                };

                                console.log('parent 4 id is exist : ', item2);
                                // console.log('parentId :::: ', parentId);
                                // console.log('query :::: ', query);
                                // req.body.id = docs.reverse()[0].id + 1;
                                new EntranceExam2(query).save((err, doc) => {
                                    if (doc) {
                                        // req.data.item = doc;
                                        // response.ok(req, res, next);
                                        parentId2 = doc._id;
                                        // console.log('parentId2 :::: ', parentId2);
                                        resolve(parentId2);
                                    } else {
                                        response.error(req, res, next);
                                    }
                                })

                                // console.log('directory is : ', item2);
                            }
                            else {
                                parentId2 = doc2._id;
                                resolve(parentId2);
                            }

                        }
                        else {
                            var query;
                            if (parentId2 == '') {
                                query = {
                                    title: item2.trim(),
                                    caption: item2.trim(),
                                };
                            }
                            else {
                                query = {
                                    parent: parentId2,
                                    title: item2.trim(),
                                    caption: item2.trim(),
                                };
                            }

                            console.log('parent 5 id is exist : ', item2);

                            // console.log('query :::: ', query);

                            // req.body.id = docs.reverse()[0].id + 1;
                            new EntranceExam2(query).save((err, doc) => {
                                if (doc) {
                                    // req.data.item = doc;
                                    parentId2 = doc._id;
                                    // console.log('parentId2 :::: ', parentId2);
                                    resolve(parentId2);

                                } else {
                                    response.error(req, res, next);
                                }
                            });

                            // console.log('directory is : ', item2);

                        }
                    });
                }

            });
        }

        function insertEntranceResultNew(item2, releaseDate, educationalStageId, categoryId, parentId, index2) {
            return new Promise((resolve) => {
                var parentId2 = parentId;
                // console.log('item2 :::: ', item2);
                console.log('parentId2 :::: ', parentId2);
                // if (parentId != null && parentId != '') {

                EntranceExam2.findOne({ title: item2.trim(), parent: parentId, educationalStageId: educationalStageId, categoryId: categoryId }).exec((err2, doc2) => {
                    if (doc2) {
                        resolve(doc2._id);
                    }
                    else {
                        var query = {
                            title: item2.trim(),
                            caption: item2.trim(),
                            releaseDate: releaseDate,
                            educationalStageId: educationalStageId,
                            categoryId: categoryId,
                            parent: parentId2,
                        };
        
                        console.log('parent 2 id is exist : ', item2);
        
                        // console.log('parentId :::: ', parentId);
                        // console.log('query :::: ', query);
                        // req.body.id = docs.reverse()[0].id + 1;
                        new EntranceExam2(query).save((err, doc) => {
                            if (doc) {
                                // req.data.item = doc;
                                // response.ok(req, res, next);
                                parentId2 = doc._id;
                                // console.log('parentId2 :::: ', parentId2);
                                resolve(parentId2);
                            } else {
                                response.error(req, res, next);
                            }
                        })
                    }

                });
                // console.log('directory is : ', item2);
            });
        }

        async function f1(item2, parentId, index2) {
            const result = await insertEntranceResult(item2, parentId, index2);
            // console.log(result);
            return result;

        }
        async function insertEntrance(item2, parentId, index2) {
            return await f1(item2, parentId, index2);
        }


        async function f1New(item2, releaseDate, educationalStageId, categoryId, parentId, index2) {
            const result = await insertEntranceResultNew(item2, releaseDate, educationalStageId, categoryId, parentId, index2);
            // console.log(result);
            return result;

        }





        async function insertEntranceNew(item2, releaseDate, educationalStageId, categoryId, parentId, index2) {
            return await f1New(item2, releaseDate, educationalStageId, categoryId, parentId, index2);
        }



        function insertEntrancePdfResult(parentId, item2) {
            return new Promise((resolve) => {
                EntranceExam2.findByIdAndUpdate(parentId, {
                    avatar: item2
                }, {
                    new: true,
                    runValidators: true
                }).exec((err, doc) => {
                    if (doc) {
                        resolve(doc);
                    }
                })
            });
        }


        function getStageResult(title) {
            return new Promise((resolve) => {
                EducationalStage.find({}).exec((errStage, docStage) => {
                    if (docStage) {
                        // var stageId = null;
                        var titleTemp = null;
                        if (title == "12" || title == "دوازدهم") {
                            titleTemp = '۱۲ ام';
                        }
                        else if (title == "11" || title == "یازدهم") {
                            titleTemp = '۱۱ ام';
                        }
                        else if (title == "10" || title == "دهم") {
                            titleTemp = '۱۰ ام';
                        }
                        docStage.forEach(item => {
                            if (item.title == titleTemp) {
                                resolve(item._id);
                            }
                        })

                    }
                });
            });
        }

        async function funcStage(title) {
            const result = await getStageResult(title);
            // console.log(result);
            return result;

        }
        async function getStage(title) {
            return await funcStage(title);
        }





        function getCategoryResult(title, stageId) {
            return new Promise((resolve) => {
                Category.find({ title: title, educationalStageId: stageId }).exec((errCategory, docCategory) => {
                    if (docCategory) {
                        if (docCategory.length > 0) {
                            resolve(docCategory[0]._id);
                        }
                    }
                })
            });
        }

        async function funcCategory(title, stageId) {
            const result = await getCategoryResult(title, stageId);
            // console.log(result);
            return result;

        }
        async function getCategory(title, stageId) {
            return await funcCategory(title, stageId);
        }




        function ConvertDate(date) {
            moment.locale('en');
            var str = date;
            var arr = str.split("-");

            var year = 0;
            var month = 0;
            var day = 0;
            if (arr.length > 0) {
                year = Number(arr[0]);
                month = Number(arr[1]);
                day = Number(arr[2]);

                if (day <= 9) {
                    day = '0' + day.toString();
                }
                if (month <= 9) {
                    month = '0' + month.toString();
                }
                if (year < 100) {
                    year = '13' + year.toString();
                }
            }

            console.log('year : ', year, ' month : ', month, ' day :', day);
            var programDate = year + '-' + month + '-' + day;
            var new_date = moment.from(programDate, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
            new_date = new_date + 'T00:00:00.000Z';
            return new_date;
        }



        async function f2(parentId, item2) {
            const result = await insertEntrancePdfResult(parentId, item2);
            // console.log(result);
            return result;

        }
        async function insertEntrancePdf(parentId, item2) {
            return await f2(parentId, item2);
        }

        function renameAndMoveFileResult(originalName, newName, pathFile) {
            return new Promise((resolve) => {
                var path3 = 'public/uploads/files';


                var oldPath = pathFile;
                var newPath = path3 + '/' + newName;

                // // Source file
                // const src = "file.txt";

                // // Destination path
                // const dest = "destination/file.txt";

                // // Function call
                // // Using call back function

                // console.log(' oldPath ::: ', oldPath);
                // console.log(' newPath ::: ', newPath);
                fs.copyFile(oldPath, newPath, (err) => {
                    if (err) return console.log(err);
                    console.log(`File successfully moved!!`);
                    resolve(newName);
                });
            });
        }


        async function f3(originalName, newName, pathFile) {
            const result = await renameAndMoveFileResult(originalName, newName, pathFile);
            // console.log(result);
            return result;

        }
        async function renameAndMoveFile(originalName, newName, pathFile) {
            return await f3(originalName, newName, pathFile);
        }


        async function getList(directoryList, parentId) {
            var items = [];
            var parentIdTemp = parentId;
            for (var item of directoryList) {
                // var index = 0;
                // item = item.replace('/data/sabkino_source/server/public/azmon/', '');
                // directoryList[index] = item;
                // index++;

                const words = item.split('/');
                console.log('words :::: ', words);

                var index2 = 0;
                var stage = null;
                var itemStr = null;
                var category = null;
                // for (var item2 of words) {
                for (var item2 of words) {
                    if (item2.includes('.pdf') || item2.includes('.docx') || item2.includes('.doc')) {
                        // console.log('parentId  :::: ', parentId);
                        // console.log('avatar  :::: ', item2);
                        // console.log('::::: item with pdf ::: ', item2);
                        var newName = '';
                        if (item2.includes('.pdf')) {
                            newName = rand.generate(16) + '-' + Date.now() + '.pdf';
                        }
                        else if (item2.includes('.docx')) {
                            newName = rand.generate(16) + '-' + Date.now() + '.docx';
                        }
                        else if (item2.includes('.doc')) {
                            newName = rand.generate(16) + '-' + Date.now() + '.doc';
                        }


                        // console.log('index2 ::: ', index2);

                        await insertEntrancePdf(parentIdTemp, newName);
                        await renameAndMoveFile(item2, newName, 'public/azmon/' + item);
                    }
                    else {
                        if (index2 == 0) {
                            itemStr = ConvertDate(item2);
                            // console.log('item2 ::: ', item2);
                        }
                        else if (index2 == 1) {
                            stage = await getStage(item2);

                        }
                        else if (index2 == 2) {
                            category = await getCategory(item2, stage);
                            item2 = 'سنجش';

                            parentIdTemp = await insertEntranceNew(item2, itemStr, stage, category, parentIdTemp, index2);
                            console.log('index2 ::: ', index2);

                        }



                        if (index2 != 2) {
                        // if (index2 != 0 && index2 != 1 && index2 != 2) {
                            // else if (index2 == 3) {
                            //     console.log('itemStr ::: ', itemStr);
                            //     console.log('stage ::: ', stage);
                            //     console.log('category ::: ', category);
                            //     parentIdTemp = await insertEntrance(item2,itemStr,stage,category, parentIdTemp, index2);
                            // }

                            parentIdTemp = await insertEntrance(item2, parentIdTemp, index2);
                            console.log('index2 ::: ', index2);
                        }
                        // console.log(' ::::::::::::::::::: parentId  :::::::::::::::::::: ', parentId);
                    }
                    index2++;
                }

                parentIdTemp = parentId;
                // req.data.item = directoryList;
                // response.ok(req, res, next)
            }
            req.data.items = directoryList;
            response.ok(req, res, next);
        }



        var walk = function (dir, done) {
            var results = [];
            fs.readdir(dir, function (err, list) {
                if (err) return done(err);
                var pending = list.length;
                if (!pending) return done(null, results);
                list.forEach(function (file) {
                    file = path.resolve(dir, file);
                    fs.stat(file, function (err, stat) {
                        if (stat && stat.isDirectory()) {
                            walk(file, function (err, res) {
                                results = results.concat(res);
                                if (!--pending) done(null, results);
                            });
                        } else {
                            results.push(file);
                            if (!--pending) done(null, results);
                        }
                    });
                });
            });
        };


        // console.log('path2 ::: ', path2);
        walk(path2, function (err, results) {
            if (err) throw err;
            directoryList = results;

            // console.log('directoryList ::: ', directoryList);

            var directoryListTemp = [];
            for (var item of directoryList) {
                var index = 0;
                item = item.replace('/data/sabkino_source/server/public/azmon/', '');
                // directoryList[index] = item;

                directoryListTemp.push(item);
                index++;
            }

            console.log('directoryListTemp ::: ', directoryListTemp);
            console.log('parentIdBase ::: ', parentIdBase);
            getList(directoryListTemp, parentIdBase);


        })


    },

    DELETE_ENTRANCE_EXAM: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * 100;
        }

        function removeFileResult(originalName) {
            return new Promise((resolve) => {
                var path3 = 'public/uploads/files';
                var newPath = path3 + '/' + originalName;
                console.log(' newPath ::: ', newPath);
                if (fs.existsSync(newPath)) {
                    console.log('exist file :', newPath);
                    fs.unlinkSync(newPath);
                }


                resolve(newPath);
                //var filePath = 'c:/book/discovery.docx';

            });
        }


        async function f3(originalName) {
            const result = await removeFileResult(originalName);
            // console.log(result);
            return result;

        }
        async function removeFile(originalName) {
            return await f3(originalName);
        }


        async function getList(docs) {
            for (var item of docs) {
                var avatar = item.avatar.replace('https://api.sabkino.com/uploads/files/', '');
                // console.log('avatar ::: ', avatar);
                if (item.avatar.includes('.pdf')) {
                    await removeFile(avatar);
                }
            }

            response.ok(req, res, next);
        }


        EntranceExam.find({})
            .limit(100)
            .skip(first)
            .exec((err2, docs) => {
                getList(docs);
            });
    },
    POST_USER_EXTRA_DATA: (req, res, next) => {
        if (req.file) {
            req.file.url = `${process.env.BASE_URL}/${req.file.filename}`;
            req.data.file = req.file;
            response.ok(req, res, next);
        } else {
            response.error(req, res, next);
        }
    },

    DELETE_USER_ACCOUNT: (req, res, next) => {
        var userId = req.data.personInfo._id;

        console.log('userId   :::: ', userId);
        var query = {
            _id: userId
        };

        Token.findOneAndDelete({ personId: userId }).exec((errToken, docToken) => {
            if (docToken) {
                Person.findOneAndDelete(query).exec((err, doc) => {
                    if (err) {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    } else {
                        response.ok(req, res, next);
                    }
                });
            }
            else {
                response.error(req, res, next, 'اطلاعات یافت نشد');
            }
        });


    },
    DELETE_IMPORT_DATA: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * 1000;
        }

        EntranceExam.find({})
            .limit(1000)
            .skip(first)
            .exec((err, docs) => {
                console.log('lenght ', docs.length);
                docs.forEach(item => {
                    if (item.title != 'سنجش' && item.title != 'قلمچی' && item.title != 'کنکور سراسری' && item.title != 'گاج' && item.title != 'نهایی') {
                        var avatar = item.avatar;
                        var path = 'public/uploads/files/' + avatar;
                        var query = {
                            _id: item._id
                        };

                        console.log('path :: ', path);
                        if (fs.existsSync(path)) {

                            EntranceExam.findOneAndDelete(query).exec((err, doc) => {
                                if (err) {
                                    // response.error(req, res, next, 'اطلاعات یافت نشد');
                                } else {
                                    // response.ok(req, res, next);
                                }
                            });

                            console.log('exist file');
                            //            fs.unlinkSync(filePath);
                        }
                        else {
                            EntranceExam.findOneAndDelete(query).exec((err, doc) => {
                                if (err) {
                                    // response.error(req, res, next, 'اطلاعات یافت نشد');
                                } else {
                                    // response.ok(req, res, next);
                                }
                            });

                            // console.log('not exist file');
                        }
                    }

                });

                response.ok(req, res, next);

            });



    },
    DELETE_IMPORT_DATA_NEW: (req, res, next) => {
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * 1000;
        }

        EntranceExam.find({})
            .limit(1000)
            .skip(first)
            .exec((err, docs) => {
                console.log('lenght ', docs.length);
                docs.forEach(item => {
                    if (item.title != 'سنجش' && item.title != 'قلمچی' && item.title != 'کنکور سراسری' && item.title != 'گاج' && item.title != 'نهایی') {
                        var avatar = item.avatar;
                        var path = 'public/uploads/files/' + avatar;
                        var query = {
                            _id: item._id
                        };

                        console.log('path :: ', path);
                        if (fs.existsSync(path)) {

                            EntranceExam.findOneAndDelete(query).exec((err, doc) => {
                                if (err) {
                                    // response.error(req, res, next, 'اطلاعات یافت نشد');
                                } else {
                                    // response.ok(req, res, next);
                                }
                            });

                            console.log('exist file');
                            //            fs.unlinkSync(filePath);
                        }
                        else {
                            EntranceExam.findOneAndDelete(query).exec((err, doc) => {
                                if (err) {
                                    // response.error(req, res, next, 'اطلاعات یافت نشد');
                                } else {
                                    // response.ok(req, res, next);
                                }
                            });

                            // console.log('not exist file');
                        }
                    }

                });

                response.ok(req, res, next);

            });



    },
    CONVERT_DATE: (req, res, next) => {
        var first = req.query.first;
        var date = req.query.date;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * 1000;
        }


        moment.locale('en');
        var str = date;
        var arr = str.split("-");

        var year = 0;
        var month = 0;
        var day = 0;
        if (arr.length > 0) {
            year = Number(arr[0]);
            month = Number(arr[1]);
            day = Number(arr[2]);

            if (day <= 9) {
                day = '0' + day.toString();
            }
            if (month <= 9) {
                month = '0' + month.toString();
            }
            if (year < 100) {
                year = '13' + year.toString();
            }
        }

        console.log('year : ', year, ' month : ', month, ' day :', day);
        var programDate = year + '-' + month + '-' + day;
        var new_date = moment.from(programDate, 'fa', 'YYYY-MM-DD').format('YYYY-MM-DD');
        new_date = new_date + 'T00:00:00.000Z';
        console.log('new_date ::::::::', new_date);
        response.ok(req, res, next);
    }



}
