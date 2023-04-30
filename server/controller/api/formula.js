var http = require("http");
const axios = require('axios');
const Model = require("../../model/formula");
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
        Model.find({}).sort('id').exec(function (err, docs) {
            req.body.id = docs.reverse()[0].id + 1;
            new Model(req.body).save((err, doc) => {
                if (doc) {
                    req.data.item = doc;
                    response.ok(req, res, next);
                } else {
                    response.error(req, res, next);
                }
            })
        });
    },
    GET_RANDOM_ITEM: (req, res, next) => {
        Model.find({}).exec((err, data) => {
            if (data) {
                let lenFormula = data.length;
                let randomFormula = 0;
                randomFormula = Math.floor(Math.random() * lenFormula);
                formulaData = data[randomFormula];
                req.data.item = formulaData;
                response.ok(req, res, next);

            } else {
                response.error(req, res, next);
            }

        });
    },
    ADD_USER: (req, res, next) => {
        var test = JSON.stringify({
            'user_type': 'SIP',
            'active': 'yes',
            'name': '600',
            'number': '600',
            'cid_number': '600',
            'secret': 'Test123456',
            'call_record': 'no',
            'push_notification': 'no',
            'deny': '0.0.0.0/0.0.0.0',
            'permit': '0.0.0.0/0.0.0.0',
            'dtmfmode': 'rfc2833',
            'canreinvite': 'no',
            'directmedia': 'no',
            'context': 'main_routing',
            'host': 'dynamic',
            'type': 'friend',
            'nat': 'yes',
            'port': '5060',
            'qualify': 'yes',
            'callgroup': '1',
            'pickupgroup': '1',
            'callcounter': 'yes',
            'faxdetect': 'no',
            'call_limit': '',
            'trunk': 'no',
            'transfer': 'no',
            'email': '',
            'more_options': ''
        });

        // console.log('test ::::',test);
        axios({
            method: 'post',
            url: 'http://185.126.16.138:8007/api/v3/pbx/users',
            headers: {'Content-Type': 'application/json', 'Authorization': 'Basic bWh0ZXN0Ok1odGVzdEAxMjM='},
            body: test
        }).then(function (response) {
            // handle success
            console.log('-------------------------------------------------------');
            console.log(response.data);
            response.ok(req, res, next);
        }).catch(function (error) {
            // handle error
            console.log('error :::::', error);
            response.error(req, res, next);
        });

        // var options = {
        //     host: 'http://185.126.16.138:8007/api/v3/pbx/users',
        //     method: 'POST'
        // };
        //
        // var req = http.request(options, function(res) {
        //     console.log('STATUS: ' + res.statusCode);
        //     console.log('HEADERS: ' + JSON.stringify(res.headers));
        //     res.setEncoding('utf8');
        //     res.on('data', function (chunk) {
        //         console.log('BODY: ' + chunk);
        //     });
        // });

        // this.$axios
        //     .get("model/ads",{headers: config})
        //     .then((response) => {
        //         console.log('done add user');
        //         response.ok(req, res, next);
        // })
        // .catch(() => {
        //     console.log('error add user');
        //     response.error(req, res, next);
        // });
    }
};