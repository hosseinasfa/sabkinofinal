var express = require('express');
const controller = require('../controller/api/report');

const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router({
    mergeParams:true,
});
router.use(isExistToken);
router.use(isExistUser);
router.use(isActiveUser);
router.use(isDeleteUser);

router.get('/allReport', controller.GET_ALL_REPORT);
router.post('/newReport', controller.NEW_REPORT);

module.exports = router;