const Model = require("../../model/vipUserFollow");
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
    GET_FOLLOWER: (req, res, next) => {
        var strClass = req.data.personInfo.class;
        var userId = req.query.userId;
        // var userId = req.query.userId;
        var first = req.query.first;
        if (typeof first === 'undefined') {
            first = 0;
        } else {
            first = parseInt(first) * offset;
        }

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }

        Model.find({ 'followUserId': userId })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (err) {
                    response.error(req, res, next);
                } else {
                    req.data.items = docs;
                    response.ok(req, res, next);
                }

            })
    },
    GET_FOLLOWING: (req, res, next) => {
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

        Model.find({ 'userId': userId })
            .limit(offset)
            .skip(first)
            .exec((err, docs) => {
                if (err) {
                    response.error(req, res, next);
                } else {
                    req.data.items = docs;
                    response.ok(req, res, next);
                }

            })
    },
    POST_UN_FOLLOW_USER: (req, res, next) => {
        var userId = req.query.userId;
        var strClass = req.data.personInfo.class;
        var followUserId = req.query.followUserId;

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }

        if (userId.toString() != followUserId.toString()) {
            var query = {
                'userId': userId,
                'followUserId': followUserId,
            };

            Model.find(query).exec((errFollow, docFollow) => {
                if (docFollow) {
                    console.log('docFollow.length ::::::', docFollow.length);
                    if (docFollow.length != 0) {
                        Model.findOneAndDelete(query).exec((err, doc) => {
                            if (err) {
                                response.error(req, res, next);
                            } else {
                                Person.findById(followUserId).exec((errUser, docUser) => {
                                    var follower = docUser.follower;
                                    follower = parseInt(follower) - 1;
                                    if (follower >= 0) {
                                        Person.findByIdAndUpdate(followUserId, {
                                            follower: follower
                                        }, {
                                            new: true,
                                            runValidators: true
                                        }).exec((errUpdate, docUpdate) => {
                                            if (errUpdate) {
                                                response.error(req, res, next);
                                            }
                                        });
                                    } else {
                                        response.error(req, res, next);
                                    }
                                });

                                Person.findById(userId).exec((errUser, docUser) => {
                                    var following = docUser.following;
                                    following = parseInt(following) - 1;
                                    if (following >= 0) {
                                        Person.findByIdAndUpdate(userId, {
                                            following: following
                                        }, {
                                            new: true,
                                            runValidators: true
                                        }).exec((errUpdate, docUpdate) => {
                                            if (errUpdate) {
                                                response.error(req, res, next);
                                            }
                                        });
                                    } else {
                                        response.error(req, res, next);
                                    }
                                });

                                req.data.item = doc;
                                response.ok(req, res, next);
                            }
                        });
                    } else {
                        response.error(req, res, next, 'اطلاعات یافت نشد');
                    }
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
        } else {
            response.error(req, res, next, 'دسترسی ندارید');
        }
    },
    POST_FOLLOW_USER: (req, res, next) => {
        var userId = req.body.userId;
        var strClass = req.data.personInfo.class;
        var followUserId = req.query.followUserId;

        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }

        var followUserId = req.body.followUserId;
        if (userId.toString() != followUserId.toString()) {
            var query = {
                'userId': userId,
                'followUserId': followUserId,
            };

            Model.find(query).exec((errFollow, docFollow) => {
                if (docFollow) {
                    if (docFollow.length == 0) {
                        new Model(query).save((err, doc) => {
                            if (doc) {
                                Person.findById(followUserId).exec((errUser, docUser) => {
                                    var follower = docUser.follower;
                                    follower = parseInt(follower) + 1;
                                    Person.findByIdAndUpdate(followUserId, {
                                        follower: follower
                                    }, {
                                        new: true,
                                        runValidators: true
                                    }).exec((errUpdate, docUpdate) => {
                                        if (errUpdate) {
                                            response.error(req, res, next);
                                        }
                                    });
                                });


                                Person.findById(userId).exec((errUser, docUser) => {
                                    var following = docUser.following;
                                    following = parseInt(following) + 1;
                                    Person.findByIdAndUpdate(userId, {
                                        following: following
                                    }, {
                                        new: true,
                                        runValidators: true
                                    }).exec((errUpdate, docUpdate) => {
                                        if (errUpdate) {
                                            response.error(req, res, next);
                                        }
                                    });
                                });


                                req.data.item = doc;
                                response.ok(req, res, next);
                            } else {
                                response.error(req, res, next, 'مشکل در ساخت آیتم');
                            }
                        });
                    } else {
                        response.error(req, res, next, 'قبلا ثبت شده');
                    }
                }
                else {
                    response.error(req, res, next, 'اطلاعات یافت نشد');
                }
            });
        } else {
            response.error(req, res, next, 'دسترسی ندارید');
        }
    },
    GET_FOLLOW_USER_CHECK: (req, res, next) => {
        var userId = req.query.userId;
        var strClass = req.data.personInfo.class;
        if (strClass == 'support') {
            userId = req.data.personInfo.supportMentorId._id;
        }

        var followUserId = req.query.followUserId;
        if (userId.toString() != followUserId.toString()) {
            var query = {
                'userId': userId,
                'followUserId': followUserId,
            };

            Model.find(query).exec((errFollow, docFollow) => {
                if (errFollow) {
                    response.ok(req, res, next, 'اطلاعات یافت نشد');
                }

                if (docFollow.length == 0) {
                    req.data.item = { 'is_follow': false };
                    response.ok(req, res, next);
                } else {
                    req.data.item = { 'is_follow': true };
                    response.ok(req, res, next);
                }
            });
        } else {
            response.error(req, res, next, 'دسترسی ندارید');
        }
    },

};