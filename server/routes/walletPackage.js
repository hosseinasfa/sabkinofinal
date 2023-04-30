var express = require('express');
const controller = require('../controller/api/walletPackage');

const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router({
    mergeParams:true,
});
router.use(isExistToken);
router.use(isExistUser);
router.use(isActiveUser);
router.use(isDeleteUser);
 router.get('/:walletPackageId', controller.GET_EACH_ITEM);
// router.put('/:cityId', controller.PUT_EACH_ITEM);
// router.put('/:cityId/active', controller.PUT_ITEM_ACTIVE);
// router.put('/:cityId/deActive', controller.PUT_ITEM_DE_ACTIVE);
router.get('/', controller.GET_ALL_ITEMS);
router.post('/',controller.POST_ITEM);
module.exports = router;