var express = require('express');
const controller = require('../controller/api/productRate');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]
var router = express.Router();
// router.use(isExistToken);
// router.use(isExistUser);
// router.use(isActiveUser);
// router.use(isDeleteUser);
// router.post('/storeProduct' , checkAuth ,controller.POST_STORE_PRODUCT);
router.post('/rate',checkAuth,controller.POST_RATE_PRODUCT);


module.exports = router;