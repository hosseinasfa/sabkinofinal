var express = require('express');
const controller = require('../controller/api/mentorPackageList');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]

var router = express.Router();
router.get('/getPackageList',checkAuth, controller.GET_PACKAGE_ITEM);
router.delete('/deletePackage',checkAuth, controller.DELETE_PACKAGE);
router.get('/:itemId',checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId',checkAuth, controller.PUT_EACH_ITEM);
router.put('/:itemId/active',checkAuth, controller.PUT_ITEM_ACTIVE);
router.put('/:itemId/deActive',checkAuth, controller.PUT_ITEM_DE_ACTIVE);
router.get('/',checkAuth, controller.GET_ALL_ITEMS);
router.post('/',checkAuth, controller.POST_ITEM);
router.post('/storeCustom',checkAuth, controller.POST_ITEM_CUSTOM);
module.exports = router;