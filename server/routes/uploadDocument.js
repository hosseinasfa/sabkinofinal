var express = require('express');
const controller = require('../controller/api/uploadDocument');
const { fileUpload } = require('../libs/uploadDocument');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router();
router.use(isExistToken);
router.use(isExistUser);
router.use(isActiveUser);
router.use(isDeleteUser);

router.get('/getFile',controller.GET_FILE);
router.post('/file',fileUpload.single('file'),controller.POST_FILE);

module.exports = router;