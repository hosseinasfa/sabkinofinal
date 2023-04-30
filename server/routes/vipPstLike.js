var express = require('express');
var router = express.Router();
const response = require('../response');
const VipPstLike = require('../model/vipPstLike');
const controller = require('../controller/api/vipPstLike');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
const VipPst = require('../model/vipPst');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]
/* GET home page. */
router.put('/:userId/:postId',checkAuth, controller.PUT_LIKE_DISLIKE_ITEM);
module.exports = router;
