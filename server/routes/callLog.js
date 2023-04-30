var express = require('express');
const controller = require('../controller/api/callLog');
const {isExistToken, isActiveUser, isDeleteUser, isExistUser} = require('../middleware/api');
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser]
var router = express.Router();
const response = require('../response');
const config = require('../config.js');
var bodyParser = require('body-parser');

router.get('/checkRoom', checkAuth, controller.GetCheckRoom);
router.get('/reservedCall', checkAuth, controller.GetReservedCall);
router.get('/todayCall', checkAuth, controller.GetTodayCall);
router.get('/historyCall', checkAuth, controller.GetHistoryCall);

router.get('/reservedCallMentor', checkAuth, controller.GetReservedCallMentor);
router.get('/todayCallMentor', checkAuth, controller.GetTodayCallMentor);
router.get('/historyCallMentor', checkAuth, controller.GetHistoryCallMentor);

router.post('/call', checkAuth, controller.POST_CALL);

router.get('/:itemId', checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId', checkAuth, controller.PUT_EACH_ITEM);
router.put('/:itemId/active', checkAuth, controller.PUT_ITEM_ACTIVE);
router.put('/:itemId/deActive', checkAuth, controller.PUT_ITEM_DE_ACTIVE);
router.get('/', checkAuth, controller.GET_ALL_ITEMS);
router.post('/', checkAuth, controller.POST_ITEM);
module.exports = router;


