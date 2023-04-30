var express = require('express');
var router = express.Router();
const {isExistToken, isActiveUser, isDeleteUser, isExistUser} = require('../middleware/api');
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser]
const controller = require('../controller/api/periodMentorMediaComment');
const response = require('../response');
const config = require('../config.js');
var bodyParser = require('body-parser');
var moment = require('jalali-moment');


router.post('/storeReply',checkAuth,controller.POST_REPLY_ITEM);
router.delete('/deleteComment',checkAuth,controller.DELETE_COMMEMT);
router.get('/getComment',checkAuth,controller.GET_COMMENT);
router.post('/storeComment',checkAuth, controller.POST_CUSTOM_ITEM);

router.get('/:itemId', checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId', checkAuth, controller.PUT_EACH_ITEM);
router.put('/:itemId/active', checkAuth, controller.PUT_ITEM_ACTIVE);
router.put('/:itemId/deActive', checkAuth, controller.PUT_ITEM_DE_ACTIVE);
router.get('/', checkAuth, controller.GET_ALL_ITEMS);
router.post('/', checkAuth, controller.POST_ITEM);
module.exports = router;
