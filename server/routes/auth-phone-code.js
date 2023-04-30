var express = require('express');
const controller = require('../controller/api/auth-phone-code');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]

var router = express.Router();

router.get('/CheckToken', controller.CHECK_TOKEN);

router.post('/preAuth', controller.preAuth);
router.post('/verify', controller.verify);
router.post('/checkToken', controller.checkToken);
router.delete('/logout',checkAuth,controller.logout);


module.exports = router;