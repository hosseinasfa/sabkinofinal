var express = require('express');
var router = express.Router();
const controller = require('../controller/api/vipUserFollow');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]

const response = require('../response');
const VipPst = require('../model/vipPst');
const config = require('../config.js');
var bodyParser = require('body-parser');
var moment = require('jalali-moment');

/* GET home page. */
router.get('/getFollowUserCheck',checkAuth,controller.GET_FOLLOW_USER_CHECK);
router.get('/getFollower',checkAuth,controller.GET_FOLLOWER);
router.get('/getFollowing',checkAuth,controller.GET_FOLLOWING);
router.get('/unFollowUser',checkAuth,controller.POST_UN_FOLLOW_USER);
router.post('/followUser',checkAuth,controller.POST_FOLLOW_USER);
router.get('/:itemId',checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId',checkAuth, controller.PUT_EACH_ITEM);
router.put('/:itemId/active',checkAuth, controller.PUT_ITEM_ACTIVE);
router.put('/:itemId/deActive',checkAuth, controller.PUT_ITEM_DE_ACTIVE);
router.get('/',checkAuth, controller.GET_ALL_ITEMS);
router.post('/',checkAuth, controller.POST_ITEM);
module.exports = router;
