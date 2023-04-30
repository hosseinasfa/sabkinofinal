var express = require('express');
const controller = require('../controller/api/channel');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router();
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser];
// var checkAuth = [isExistToken];
const response = require('../response');
const config = require('../config.js');
var bodyParser = require('body-parser');

router.post('/newPost',checkAuth,controller.NEW_POST);
router.post('/newChannel',checkAuth,controller.POST_NEW_CHANNEL);
router.get('/allChannels',checkAuth, controller.GET_ALL_CHANNEL);
router.get('/',checkAuth, controller.GET_ALL_POST);
router.get('/allPost',checkAuth, controller.GET_ALL_POSTS);
router.get('/search',checkAuth, controller.SEARCH_TEXT);
router.put('/isChannel/:userId',checkAuth,controller.PUT_CHANNEL_USER);
router.put('/post/:replyId',checkAuth,controller.PUT_EACHITEM_REPLY);
router.put('/eachChannel/:channelId',checkAuth,isExistToken,controller.PUT_STATUS_CHANNEL);
router.delete('/post/:postId',checkAuth,controller.DELETE_EACH_POST);
router.delete('/DeleteAllPost/:channelId',checkAuth,controller.DELETE_ALL_POST);


router.post('/fcm',checkAuth,controller.POST_FCM);



module.exports = router;
