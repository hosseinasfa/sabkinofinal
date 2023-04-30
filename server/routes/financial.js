var express = require('express');
const controller = require('../controller/api/financial');
const {isExistToken, isActiveUser, isDeleteUser, isExistUser} = require('../middleware/api');
var router = express.Router({
    mergeParams: true,
});
router.use(isExistToken);
router.use(isExistUser);
router.use(isActiveUser);
router.use(isDeleteUser);

router.get('/checkSheba', controller.GET_CHECK_SHEBA)
router.get('/withdrawal',controller.GET_BANK_TURNOVER);
router.get('/withdrawal/:itemId',controller.GET_BANK_TURNOVER_ID);
router.get('/eachItem/:itemId', controller.GET_EACH_ITEM_FINANCIAL);
router.get('/:itemId', controller.GET_EACH_ITEM);
router.post('/', controller.GET_ALL_ITEMS);
router.put('/verifySheba', controller.PUT_VERIFY_SHEBA)

router.post('/create',controller.POST_ITEM);
router.post('/withdrawal',controller.POST_BANK_TURNOVER);

module.exports = router;



