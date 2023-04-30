var express = require('express');
var router = express.Router();
const response = require('../response');
const VipPstSave = require('../model/vipPstSave');
const VipPst = require('../model/vipPst');
const {isExistToken, isActiveUser, isDeleteUser, isExistUser} = require('../middleware/api');
const controller = require('../controller/api/vipPstSave');
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser]
/* GET home page. */
router.get('/getPostSaved', checkAuth, controller.GET_SAVE_POST);
router.put('/:userId/:postId', checkAuth, controller.PUT_SAVE_DELETE_POST);

module.exports = router;
