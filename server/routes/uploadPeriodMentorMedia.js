var express = require('express');
const controller = require('../controller/api/uploadPeriodMentorMedia');
const { fileUpload } = require('../libs/uploadPeriodMentorMedia');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router();
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]
router.use(isExistToken);
router.use(isExistUser);
router.use(isActiveUser);
router.use(isDeleteUser);

router.get('/getAllSession/:periodMentorId',checkAuth,controller.GET_ALL_SESSION);
router.post('/file',fileUpload.single('file'),controller.POST_FILE);
module.exports = router;