var express = require('express');
const controller = require('../controller/api/upload');
const { fileUpload } = require('../libs/uploads');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router();
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]


router.post('/file',checkAuth,fileUpload.single('file'),controller.POST_FILE);
module.exports = router;