var express = require('express');
var router = express.Router();
const {isExistToken, isActiveUser, isDeleteUser, isExistUser} = require('../middleware/api');
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser]
const controller = require('../controller/api/periodMentor');
const response = require('../response');

const config = require('../config.js');
var bodyParser = require('body-parser');
var moment = require('jalali-moment');


router.get('/getPeriodItem/:itemId', controller.GET_PERIOD_MENTOR_ITEM);
router.get('/getPeriodCount',checkAuth, controller.GET_PERIOD_COUNT_ITEM);
router.put('/edit', checkAuth, controller.PUT_PERIOD_ITEM);
router.put('/editCover', checkAuth, controller.PUT_COVER_ITEM);
router.put('/editPreview', checkAuth, controller.PUT_PREVIEW_ITEM);
router.put('/editPeriodMentor', checkAuth, controller.PUT_ITEM_PERIOD_MENTOR);
router.delete('/deleteItem', checkAuth, controller.DELETE_ITEM);
router.post('/publish', checkAuth, controller.POST_PUBLISH2);
router.put('/sharePeriod', checkAuth, controller.PUT_SHARE_PERIOD);
router.get('/getById', checkAuth, controller.GET_SINGLE_ITEMS);
router.get('/getPeriodMentor', checkAuth, controller.GET_PERIOD_MENTOR);
router.get('/getPeriodUser', checkAuth, controller.GET_PERIOD_USER);
router.get('/getPeriodMentorBest', checkAuth, controller.GET_PERIOD_MENTOR_BEST);
router.get('/getPeriodMentorPopular', checkAuth, controller.GET_PERIOD_MENTOR_POPULAR);
router.get('/getPeriodMentorNewest', checkAuth, controller.GET_PERIOD_MENTOR_NEWEST);
router.get('/:itemId', checkAuth, controller.GET_EACH_ITEM);
router.put('/cancelItem', checkAuth, controller.PUT_CANCEL_ITEM);
router.put('/:itemId', checkAuth, controller.PUT_EACH_ITEM);
router.put('/:itemId/active', checkAuth, controller.PUT_ITEM_ACTIVE);
router.put('/:itemId/deActive', checkAuth, controller.PUT_ITEM_DE_ACTIVE);
router.get('/', checkAuth, controller.GET_ALL_ITEMS);
router.post('/', checkAuth, controller.POST_ITEM);


module.exports = router;
