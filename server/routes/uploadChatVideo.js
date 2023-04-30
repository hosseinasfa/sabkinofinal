var express = require('express');
const controller = require('../controller/api/uploadChatVideo');
const { fileUpload } = require('../libs/uploadChatVideo');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router();
router.use(isExistToken);
router.use(isExistUser);
router.use(isActiveUser);
router.use(isDeleteUser);

router.post('/file',fileUpload.single('file'),controller.POST_FILE);
module.exports = router;