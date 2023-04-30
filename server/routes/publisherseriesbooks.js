var express = require('express');
const controller = require('../controller/api/publisherseriesbooks');

const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser];
var router = express.Router({
    mergeParams:true,
});

router.get('/search',checkAuth, controller.GET_PUBLISHER_SERIESBOOKITEMS);
router.get('/getUniqueBook',checkAuth, controller.GET_PUBLISHER_UNIQUE_BOOK);
router.get('/publisherSeriesId/:publisherSeriesId',checkAuth, controller.GET_PUBLISHER_SERIESBOOK);

// router.post('/newReport', controller.NEW_REPORT);
module.exports = router;