var express = require('express');
var router = express.Router();
const {isExistToken, isActiveUser, isDeleteUser, isExistUser} = require('../middleware/api');
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser]
const controller = require('../controller/api/entranceTest');
const response = require('../response');

const config = require('../config.js');
var bodyParser = require('body-parser');
var moment = require('jalali-moment');



router.post('/postEntranceTest',controller.POST_ENTRANCE_TEST);
router.get('/getEntranceTestAll', controller.GET_ENTRANCE_TEST_ALL);
router.get('/getEntranceTest/:itemId', controller.GET_ENTRANCE_TEST_ITEM);
router.put('/putEntranceTest/:itemId',controller.PUT_ENTRANCE_TEST_ITEM);
router.put('/putEntranceTest/:itemId/active', controller.ACTIVE_ENTRANCE_TEST_ITEM);
router.put('/putEntranceTest/:itemId/deActive', controller.DE_ACTIVE_ENTRANCE_TEST_ITEM);
/* router.get('/getEntranceTestBest', checkAuth, controller.GET_ENTRANCE_TEST_BEST);
router.get('/getEntranceTestPopular', checkAuth, controller.GET_ENTRANCE_TEST_POPULAR);
router.get('/getEntranceTestNewest', checkAuth, controller.GET_ENTRANCE_TEST_NEWEST); */
/* router.get('/filter',checkAuth, controller.FILTER_ENTRANCE_TEST);
router.get('/searchAll',checkAuth, controller.SEARCH_ENTRANCE_TEST_ALL);
router.get('/searchBest',checkAuth, controller.SEARCH_ENTRANCE_TEST_BEST);
router.get('/searchPopular',checkAuth, controller.SEARCH_ENTRANCE_TEST_POPULAR);
router.get('/searchNewest',checkAuth, controller.SEARCH_ENTRANCE_TEST_NEWEST); */









module.exports = router;