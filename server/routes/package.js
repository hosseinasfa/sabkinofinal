var express = require('express');
const controller = require('../controller/api/package');

const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]
var router = express.Router({
    mergeParams:true,
});
// router.use(isExistToken);
// router.use(isExistUser);
// router.use(isActiveUser);
// router.use(isDeleteUser);


router.get('/getUserInfo',checkAuth, controller.GET_USER_INFO);
router.get('/getUserPackage',checkAuth, controller.GET_USER_PACKAGE);
router.get('/:packageId',checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId',checkAuth, controller.PUT_EACH_ITEM);
router.get('/',checkAuth, controller.GET_ALL_ITEMS);
router.post('/checkWallet', checkAuth,controller.CHECK_EACHITEM)
router.post('/',checkAuth,controller.POST_ITEM);

module.exports = router;