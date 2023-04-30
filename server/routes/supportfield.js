var express = require('express');
const controller = require('../controller/api/supportfeild');

const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser];
var router = express.Router({
    mergeParams:true,
});

router.get('/checkMode',checkAuth, controller.CHECK_MODE);
router.get('/allSupport', checkAuth,controller.GET_ALL_SUPPORT);
router.put('/updateSupport/:id',checkAuth,controller.PUT_ITEM);
router.put('/updateEachSupport',checkAuth,controller.PUT_EACH_SUPPORT)

module.exports = router;