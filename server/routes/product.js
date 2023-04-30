var express = require('express');
const controller = require('../controller/api/product');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]
var router = express.Router();
// router.use(isExistToken);
// router.use(isExistUser);
// router.use(isActiveUser);
// router.use(isDeleteUser);
// router.post('/storeProduct' , checkAuth ,controller.POST_STORE_PRODUCT);

router.get('/info/:itemId',controller.GET_SINGLE_PRODUCT);
router.get('/getProducts',checkAuth,controller.GET_SHOP_PRODUCT);
router.get('/personalProduct',checkAuth,controller.GET_EACH_PRODUCT_ClASS);
router.get('/search',checkAuth,controller.SEARCH_PRODUCT);
router.get('/bestProducts',checkAuth,controller.GET_BEST_PRODUCT);
router.get('/newestProducts',checkAuth,controller.GET_NEWEST_PRODUCT);
router.get('/popularProducts',checkAuth,controller.GET_POPULAR_PRODUCT);
router.get('/',checkAuth,controller.GET_ALL_PRODUCT);
router.delete('/deleteProduct',checkAuth,controller.DELETE_PRODUCT);
router.post('/storeProduct',checkAuth,controller.POST_NEW_PRODUCT);


module.exports = router;