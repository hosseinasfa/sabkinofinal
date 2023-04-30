var express = require('express');
const controller = require('../controller/api/periodMentorPayment');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]

var router = express.Router();


router.get('/getPaymentList',checkAuth, controller.GET_PAYMENT_LIST);
router.get('/paymentCheckout',checkAuth, controller.PAYMENT_CHECKOUT);
router.get('/paymentCheckoutUser',checkAuth, controller.PAYMENT_CHECKOUT_USER);
router.post('/payment',checkAuth, controller.PAYMENT);
router.get('/:itemId',checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId',checkAuth, controller.PUT_EACH_ITEM);
router.put('/:itemId/active',checkAuth, controller.PUT_ITEM_ACTIVE);
router.put('/:itemId/deActive',checkAuth, controller.PUT_ITEM_DE_ACTIVE);
router.get('/',checkAuth, controller.GET_ALL_ITEMS);
router.post('/',checkAuth, controller.POST_ITEM);
module.exports = router;