var express = require('express');
const controller = require('../controller/api/entranceExam');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router({
    mergeParams:true
});
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]
router.put('/subs/:subId/active',checkAuth,controller.ACTIVE_SUB_ITEM);
router.put('/subs/:subId/deActive',checkAuth,controller.DE_ACTIVE_SUB_ITEM);
router.put('/subs/:subId',checkAuth,controller.PUT_SUB_ITEM);
router.get('/subs',checkAuth,controller.GET_SUBS);
router.post('/subs',checkAuth,controller.POST_SUBS);
module.exports = router;