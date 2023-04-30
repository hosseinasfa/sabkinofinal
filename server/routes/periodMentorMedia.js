var express = require('express');
var router = express.Router();
const {isExistToken, isActiveUser, isDeleteUser, isExistUser} = require('../middleware/api');
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser]
const controller = require('../controller/api/periodMentorMedia');
const response = require('../response');

const config = require('../config.js');
var bodyParser = require('body-parser');
var moment = require('jalali-moment');


router.put('/editItem', checkAuth, controller.PUT_SESSION_ITEM);
router.delete('/deleteItem', checkAuth, controller.DELETE_SESSION_ITEM);
router.get('/getById', checkAuth, controller.GET_SINGLE_ITEM);
router.get('/:periodMentorId', checkAuth, controller.PERIOD_MENTOR_ID);
router.post('/storeSession', checkAuth, controller.POST_CUSTOM_ITEM);
// router.post('/sessionCounter', checkAuth, controller.Session_Counter);
router.get('/:itemId', checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId', checkAuth, controller.PUT_EACH_ITEM);
router.put('/:itemId/active', checkAuth, controller.PUT_ITEM_ACTIVE);
router.put('/:itemId/deActive', checkAuth, controller.PUT_ITEM_DE_ACTIVE);
router.get('/', checkAuth, controller.GET_ALL_ITEMS);
router.post('/', checkAuth, controller.POST_ITEM);

module.exports = router;
