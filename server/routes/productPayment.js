var express = require('express');
const controller = require('../controller/api/productPayment');

const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router({
    mergeParams:true,
});
router.use(isExistToken);
router.use(isExistUser);
router.use(isActiveUser);
router.use(isDeleteUser);
// router.get('/verification',controller.paymentVerification);
router.get('/getUserProductPayments',controller.GET_USER_PRODUCT_PAYMENTS);
router.post('/',controller.PRODUCT_PAYMENT);


module.exports = router;