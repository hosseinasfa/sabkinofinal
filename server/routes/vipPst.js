var express = require('express');
var router = express.Router();
const controller = require('../controller/api/vipPst');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]

const response = require('../response');
const VipPst = require('../model/vipPst');
const config = require('../config.js');
var bodyParser = require('body-parser');
var moment = require('jalali-moment');

/* GET home page. */

router.get('/getUserPosts',checkAuth,controller.GET_USER_POSTS);
router.get('/getPstItem/:itemId',controller.GET_PST_ITEM);
router.put('/editPst',checkAuth,controller.PUT_VIP_PST_ITEM);
router.delete('/deletePost',checkAuth,controller.DELETE_POST_ITEM);
router.get('/getHome',checkAuth,controller.GET_HOME_POST);
router.get('/getExplore',checkAuth,controller.GET_EXPOLORE_POST);
router.get('/:userId/:visitUserId',checkAuth,controller.GET_BY_USERID);
// router.get('/:userId/:visitUserId/:postId',checkAuth,controller.GET_BY_USERID2);


router.get('/:itemId',checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId',checkAuth, controller.PUT_EACH_ITEM);
router.put('/:itemId/active',checkAuth, controller.PUT_ITEM_ACTIVE);
router.put('/:itemId/deActive',checkAuth, controller.PUT_ITEM_DE_ACTIVE);
router.get('/',checkAuth, controller.GET_ALL_ITEMS);
// router.post('/',checkAuth, controller.POST_ITEM);
router.post('/',checkAuth, controller.POST_CUSTOM_ITEM);

module.exports = router;
