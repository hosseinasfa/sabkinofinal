var express = require('express');
const controller = require('../controller/api/ambassador');
const {isExistToken, isActiveUser, isDeleteUser, isExistUser} = require('../middleware/api');
var router = express.Router({
    mergeParams: true,
});
router.use(isExistToken);
router.use(isExistUser);
router.use(isActiveUser);
router.use(isDeleteUser);
router.post('/', controller.POST_AMBASSADOR)
router.get('/:itemId', controller.GET_AMBASSADOR);
// router.put('/verifySheba', controller.PUT_VERIFY_SHEBA)

// router.post('/create',controller.POST_ITEM);
// router.post('/withdrawal',controller.POST_BANK_TURNOVER);
// router.get('/withdrawal',controller.GET_BANK_TURNOVER);
module.exports = router;



