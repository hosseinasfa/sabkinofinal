var express = require('express');
const controller = require('../controller/api/postBookmark');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]
var router = express.Router();

router.get('/myBookmark',checkAuth,controller.GET_BOOKMARK);
router.put('/checkBookmark',checkAuth,controller.POST_NEW_BOOKMARK);
module.exports = router;