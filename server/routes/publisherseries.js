var express = require('express');
const controller = require('../controller/api/publisherseries');

const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser];
var router = express.Router({
    mergeParams:true,
});

router.get('/seriesInfo',checkAuth, controller.GET_PUBLISHER_SINGLE_ITEM);
router.get('/info/:itemId', controller.GET_SINGLE_ITEM);
router.get('/searchHashtag',checkAuth, controller.SEARCH_HASHTAG);
router.post('/rateTime',checkAuth, controller.POST_RATE_TIME);
router.get('/:publisherId',checkAuth, controller.GET_PUBLISHERID);



// router.post('/newReport', controller.NEW_REPORT);

module.exports = router;