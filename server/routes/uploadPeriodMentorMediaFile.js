var express = require('express');
const controller = require('../controller/api/uploadPeriodMentorMediaFile');
const { fileUpload } = require('../libs/uploadPeriodMentorMediaFile');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router();
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]
router.use(isExistToken);
router.use(isExistUser);
router.use(isActiveUser);
router.use(isDeleteUser);

router.get('/getFileSession/:periodMentorMediaId',checkAuth,controller.GET_FILE_SESSION);
router.post('/file',fileUpload.single('file'),controller.POST_FILE);
router.delete('/file',checkAuth,controller.DELETE_FILE);
router.delete('/deleteByFileName',checkAuth,controller.DELETE_BY_FILE_NAME);
module.exports = router;