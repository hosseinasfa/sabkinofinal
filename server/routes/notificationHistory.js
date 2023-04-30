var express = require('express');
const controller = require('../controller/api/notificationHistory');
const {isExistToken, isActiveUser, isDeleteUser, isExistUser} = require('../middleware/api');
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser]
var router = express.Router();
const response = require('../response');
const config = require('../config.js');
var bodyParser = require('body-parser');

router.get('/:itemId', checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId', checkAuth, controller.PUT_EACH_ITEM);
router.get('/', checkAuth, controller.GET_ALL_ITEMS);
router.post('/', checkAuth, controller.POST_ITEM);


module.exports = router;


