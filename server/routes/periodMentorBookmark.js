var express = require('express');
const controller = require('../controller/api/periodMentorBookmark');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]

var router = express.Router();
router.get('/getBookItems',checkAuth, controller.GET_BOOK_ITEMS);
router.get('/:itemId',checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId',checkAuth, controller.PUT_EACH_ITEM);
router.post('/book',checkAuth, controller.POST_BOOK_ITEM);
module.exports = router;