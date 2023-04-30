var express = require('express');
const controller = require('../controller/api/itemCommentRate');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]

var router = express.Router();
router.get('/:itemId',checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId',checkAuth, controller.PUT_EACH_ITEM);
router.get('/',checkAuth, controller.GET_ALL_ITEMS);
router.post('/storeCommentRate',checkAuth, controller.POST_STORE_COMMENT_RATE);
module.exports = router;