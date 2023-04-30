var express = require('express');
const controller = require('../controller/api/walletPayment');

const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router({
    mergeParams:true,
});

router.get('/verification',controller.paymentVerification);
router.get('/verificationExam',controller.paymentVerificationExam);
router.use(isExistToken);
router.use(isExistUser);
router.use(isActiveUser);
router.use(isDeleteUser);
router.get('/getUserPackage',controller.GET_USER_PAYMENT_ITEMS);
router.get('/getActiveUserPackage',controller.GET_ACTIVE_USER_PACKAGE);
router.post('/exam',controller.createPaymentUrlExam);
router.post('/',controller.createPaymentUrl);
router.get('/:walletPaymentId', controller.GET_EACH_ITEM);
router.get('/', controller.GET_ALL_ITEMS);

// router.put('/:cityId', controller.PUT_EACH_ITEM);
// router.put('/:cityId/active', controller.PUT_ITEM_ACTIVE);
// router.put('/:cityId/deActive', controller.PUT_ITEM_DE_ACTIVE);
// router.post('/',controller.POST_ITEM);
module.exports = router;