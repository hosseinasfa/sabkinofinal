var express = require('express');
const controller = require('../controller/api/callPayment');

const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router({
    mergeParams:true,
});
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser]
router.use(isExistToken);
router.use(isExistUser);
router.use(isActiveUser);
router.use(isDeleteUser);

router.post('/payment',controller.createPaymentUrl);
router.post('/paymentCheck',controller.checkPaymentCallPackage);
router.get('/', controller.GET_ALL_ITEMS);
module.exports = router;