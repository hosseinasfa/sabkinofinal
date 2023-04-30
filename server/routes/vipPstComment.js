var express = require('express');
var router = express.Router();
const response = require('../response');
const VipPstComment = require('../model/vipPstComment');
const config = require('../config.js');
var moment = require('jalali-moment');

const controller = require('../controller/api/vipPstComment');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]
/* GET home page. */
router.delete('/deletePstComment',checkAuth,controller.DELETE_POST_COMMEMT);
router.get('/post/:postId',checkAuth,controller.GET_POSTID);
router.get('/:postId',checkAuth,controller.GET_BY_POSTID);
router.get('/:itemId',checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId',checkAuth, controller.PUT_EACH_ITEM);
router.put('/:itemId/active',checkAuth, controller.PUT_ITEM_ACTIVE);
router.put('/:itemId/deActive',checkAuth, controller.PUT_ITEM_DE_ACTIVE);
router.get('/',checkAuth, controller.GET_ALL_ITEMS);
router.post('/',checkAuth, controller.POST_ITEM);
router.post('/storeComment',checkAuth, controller.POST_CUSTOM_ITEM);
module.exports = router;
