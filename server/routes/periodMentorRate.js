var express = require('express');
var router = express.Router();
const {isExistToken, isActiveUser, isDeleteUser, isExistUser} = require('../middleware/api');
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser]
const controller = require('../controller/api/periodMentorRate');
const response = require('../response');

const config = require('../config.js');
var bodyParser = require('body-parser');
var moment = require('jalali-moment');

router.get('/getPeriodMentorComment', checkAuth, controller.GET_PERIOD_MENTOR_COMMENT);
router.post('/storePeriodMentorRate', checkAuth, controller.POST_PERIOD_MENTOR_RATE);
router.get('/getPeriodMentorRate', checkAuth, controller.GET_PERIOD_MENTOR_RATE);
router.get('/:itemId', checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId', checkAuth, controller.PUT_EACH_ITEM);
router.put('/:itemId/active', checkAuth, controller.PUT_ITEM_ACTIVE);
router.put('/:itemId/deActive', checkAuth, controller.PUT_ITEM_DE_ACTIVE);
router.get('/', checkAuth, controller.GET_ALL_ITEMS);
router.post('/', checkAuth, controller.POST_ITEM);
module.exports = router;
