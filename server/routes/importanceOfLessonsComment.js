var express = require('express');
const controller = require('../controller/api/importanceOfLessonsComment');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');

var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]

var router = express.Router();
router.get('/getAllComment',checkAuth, controller.GET_ALL_COMMENT_ITEMS);
router.get('/:parentId',checkAuth, controller.GET_PARENT_COMMENT);
router.post('/newComment',checkAuth, controller.POST_NEW_COMMENT);
router.delete('/deleteComment',checkAuth, controller.DELETE_ITEM);
router.get('/:itemId',checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId',checkAuth, controller.PUT_EACH_ITEM);
router.put('/:itemId/active',checkAuth, controller.PUT_ITEM_ACTIVE);
router.put('/:itemId/deActive',checkAuth, controller.PUT_ITEM_DE_ACTIVE);
router.get('/',checkAuth, controller.GET_ALL_ITEMS);

module.exports = router;