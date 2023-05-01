var express = require('express');
var router = express.Router();
const {isExistToken, isActiveUser, isDeleteUser, isExistUser} = require('../middleware/api');
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser]
const controller = require('../controller/api/entranceTestFile');
const response = require('../response');

const config = require('../config.js');
var bodyParser = require('body-parser');
var moment = require('jalali-moment');

router.post('/postEntranceTestFile',controller.POST_ENTRANCE_TEST_FILE);
router.get('/getEntranceTestFileAll', controller.GET_ENTRANCE_TEST_FILE_ALL);
router.delete('/deleteEntranceTestFile', controller.DELETE_FILE);


module.exports = router;
