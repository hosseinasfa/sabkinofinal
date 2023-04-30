var express = require('express');
const controller = require('../controller/api/categories');

const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router({
    mergeParams:true,
});
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser]
router.use(isExistToken);
router.use(isExistUser);
router.use(isActiveUser);
router.use(isDeleteUser);

router.get('/getCategories',controller.GET_CATEGORIES_ITEMS);
module.exports = router;