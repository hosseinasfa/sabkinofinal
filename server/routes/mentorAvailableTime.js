var express = require('express');
const controller = require('../controller/api/mentorAvailableTime');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]

var router = express.Router();
router.post('/getListOfMonth',checkAuth, controller.GET_DAY_LIST_OF_MONTH);
router.get('/getAvailableTime/:mentorId/:date',checkAuth, controller.GET_AVAILABLE_TIME);
router.delete('/deleteAvailableTime',checkAuth, controller.DELETE_AVAILABLE_TIME);
router.post('/storeAvailableTime',checkAuth, controller.POST_AVAILABLE_TIME);
router.get('/:itemId',checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId',checkAuth, controller.PUT_EACH_ITEM);
router.put('/:itemId/active',checkAuth, controller.PUT_ITEM_ACTIVE);
router.put('/:itemId/deActive',checkAuth, controller.PUT_ITEM_DE_ACTIVE);
router.get('/',checkAuth, controller.GET_ALL_ITEMS);
router.post('/',checkAuth, controller.POST_ITEM);
module.exports = router;