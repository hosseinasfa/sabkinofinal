var express = require('express');
var router = express.Router();
const response = require('../response');
// const Person = require('../model/person').Person;
// const Person = require('../model/person').Person;
/* GET home page. */
router.get('/:userId', function (req, res, next) {
    var userId = req.params.userId;

    // Person.findById(userId).exec()
    //     console.log('doc :',doc);
    // });
    response.ok(req, res, next);
});

module.exports = router;
