var express = require('express');
const controller = require('../controller/api/register');
const {isExistToken, isActiveUser, isDeleteUser, isExistUser} = require('../middleware/api');
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser];
var router = express.Router();
const response = require('../response');
const config = require('../config.js');
var bodyParser = require('body-parser');


router.post('/student',controller.PUT_PRRSON_USER);
module.exports = router;


