var express = require('express');
const controller = require('../controller/api/field');
const {isExistToken, isActiveUser, isDeleteUser, isExistUser} = require('../middleware/api');
var router = express.Router({
    mergeParams: true,
});
router.use(isExistToken);
router.use(isExistUser);
router.use(isActiveUser);
router.use(isDeleteUser);

router.get('/getField',controller.GET_FEILD_ITEMS);


module.exports = router;



