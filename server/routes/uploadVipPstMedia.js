var express = require('express');
const controller = require('../controller/api/uploadVipPstMedia');
const { fileUpload } = require('../libs/uploadVipPstMedia');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]
var router = express.Router();
router.use(isExistToken);
router.use(isExistUser);
router.use(isActiveUser);
router.use(isDeleteUser);

router.post('/file',fileUpload.single('file'),controller.POST_FILE);
router.delete('/file',checkAuth,controller.DELETE_FILE);
module.exports = router;