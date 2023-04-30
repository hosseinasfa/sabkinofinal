var express = require('express');
const controller = require('../controller/api/setProgramPayment');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]

var router = express.Router();
router.get('/getUserPackage',checkAuth, controller.GET_USER_PACKAGE);
router.post('/exitUser',checkAuth, controller.EXIT_USER);
router.delete('/delete',checkAuth, controller.DELETE_USER);
router.post('/checkValidPackage',checkAuth, controller.GET_CHECK_VALID_PACKAGE);
router.get('/getProgramUser',checkAuth, controller.GET_PROGRAM_USER);
router.get('/getActivePackage',checkAuth, controller.GET_ACTIVE_PACKAGE);
router.post('/payment',checkAuth, controller.PAYMENT);
router.get('/:itemId',checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId',checkAuth, controller.PUT_EACH_ITEM);
router.put('/:itemId/active',checkAuth, controller.PUT_ITEM_ACTIVE);
router.put('/:itemId/deActive',checkAuth, controller.PUT_ITEM_DE_ACTIVE);
router.get('/',checkAuth, controller.GET_ALL_ITEMS);
router.post('/',checkAuth, controller.POST_ITEM);
module.exports = router;