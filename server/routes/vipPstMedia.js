var express = require('express');
var router = express.Router();
const controller = require('../controller/api/vipPstMedia');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]

const response = require('../response');
const config = require('../config.js');
var bodyParser = require('body-parser');
var moment = require('jalali-moment');

/* GET home page. */
router.get('/getByPostId',checkAuth, controller.GET_BY_POSTID);
router.post('/storeVipPstMediaArray',checkAuth, controller.POST_CUSTOM_ITEM_ARRAY);
router.post('/storeVipPstMedia',checkAuth, controller.POST_CUSTOM_ITEM);
router.get('/:itemId',checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId',checkAuth, controller.PUT_EACH_ITEM);
router.put('/:itemId/active',checkAuth, controller.PUT_ITEM_ACTIVE);
router.put('/:itemId/deActive',checkAuth, controller.PUT_ITEM_DE_ACTIVE);
router.get('/',checkAuth, controller.GET_ALL_ITEMS);
// router.post('/',checkAuth, controller.POST_ITEM);


module.exports = router;
