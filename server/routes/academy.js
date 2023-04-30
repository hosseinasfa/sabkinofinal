var express = require('express');
const controller = require('../controller/api/academy');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]

var router = express.Router();

router.get('/filter',checkAuth, controller.FILTER_ACADEMY);
router.get('/search',checkAuth, controller.SEARCH_ACADEMY);
router.get('/checkAcademy',checkAuth, controller.CHECK_ACADEMY);
router.get('/myAcademy',checkAuth, controller.GET_MY_ACADEMY);
router.get('/:academyId',checkAuth, controller.GET_EACH_ACADEMY);
router.get('/',checkAuth, controller.GET_ALL_ACADEMY);
router.post('/newAcademy',checkAuth ,controller.NEW_ACADEMY);
router.put('/updateAcademy/:itemId',checkAuth ,controller.PUT_EACH_ACADEMY);



module.exports = router;