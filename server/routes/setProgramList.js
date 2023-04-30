var express = require('express');
const controller = require('../controller/api/setProgramList');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]

var router = express.Router();


router.get('/getProgramListTable', controller.GET_PROGRAM_LIST_TABLE);
router.get('/getMentorUsers',checkAuth, controller.GET_MENTOR_USER_ITEMS);
router.post('/reportUserItem',checkAuth, controller.POST_REPORT_ITEM);
router.get('/getSeenUserItem',checkAuth, controller.GET_SEEN_USER_ITEM);
router.get('/getSeenMentorItem',checkAuth, controller.GET_SEEN_MENTOR_ITEM);
router.get('/getWeeklyProgram',checkAuth, controller.GET_WEEKLY_PROGRAM);
router.get('/getDailyProgram',checkAuth, controller.GET_DAYILY_PROGRAM);
router.post('/getDayListOfMonth',checkAuth, controller.GET_DAY_LIST_OF_MONTH);
router.post('/setProgramItem',checkAuth, controller.POST_SET_PROGRAM_ITEM);
router.post('/setProgramReportItem',checkAuth, controller.POST_SET_REPORT_ITEM);
router.post('/setSeenUserItem',checkAuth, controller.POST_SET_SEEN_USER_ITEM);
router.post('/setSeenMentorItem',checkAuth, controller.POST_SET_SEEN_MENTOR_ITEM);

router.get('/:itemId',checkAuth, controller.GET_EACH_ITEM);
router.put('/:itemId',checkAuth, controller.PUT_EACH_ITEM);
router.put('/:itemId/active',checkAuth, controller.PUT_ITEM_ACTIVE);
router.put('/:itemId/deActive',checkAuth, controller.PUT_ITEM_DE_ACTIVE);
router.get('/',checkAuth, controller.GET_ALL_ITEMS);
router.post('/',checkAuth, controller.POST_ITEM);
module.exports = router;