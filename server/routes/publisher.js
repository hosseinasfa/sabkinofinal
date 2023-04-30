var express = require('express');
const controller = require('../controller/api/publisher');

const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser];
var router = express.Router({
    mergeParams:true,
});

router.get('/',checkAuth, controller.GET_PUBLISHER);



module.exports = router;