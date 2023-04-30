var express = require('express');
const controller = require('../controller/api/panelSupport');

const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]
var router = express.Router({
    mergeParams:true,
});

router.get('/',checkAuth, controller.GET_ALL_PANEL_SUPP);
router.post('/checkToken', controller.CHECK_TOKEN);
router.post('/checkPhone', controller.CHECK_PHONE);
router.post('/processionaryPanel',checkAuth,controller.NEW_PANEL_SUPPORT);
router.put('/processionaryPanel/:itemId',checkAuth,controller.UPDATE_EACH_ITEM);

module.exports = router;