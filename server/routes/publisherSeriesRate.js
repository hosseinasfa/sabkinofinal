var express = require('express');
const controller = require('../controller/api/publisherSeriesRate');

const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser];
var router = express.Router({
    mergeParams:true,
});

// router.get('/publisherSeriesId/:publisherSeriesId',checkAuth, controller.GET_PUBLISHER_SERIESBOOK);
 router.post('/rate',checkAuth, controller.NEW_PUBLISHERSERIESRATE);
 router.get('/rateUser',checkAuth, controller.GET_PUBLISHERSERIESRATE_USER);


// router.post('/newReport', controller.NEW_REPORT);

module.exports = router;