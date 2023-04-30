var express = require('express');
const controller = require('../controller/api/packageList');

const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]
var router = express.Router({
    mergeParams:true,
});

router.get('/:packageListId', checkAuth,controller.GET_EACH_ITEM);
router.get('/',checkAuth, controller.GET_ALL_ITEMS);
router.post('/',checkAuth,controller.POST_ITEM);

module.exports = router;