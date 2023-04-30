var express = require('express');
const controller = require('../controller/api/payment');

const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router({
    mergeParams:true,
});
router.use(isExistToken);
router.use(isExistUser);
router.use(isActiveUser);
router.use(isDeleteUser);
router.get('/verification',controller.paymentVerification);
router.post('/',controller.createPaymentUrl);
module.exports = router;