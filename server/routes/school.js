var express = require('express');
const controller = require('../controller/api/school');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]

var router = express.Router();

router.get('/filter',checkAuth, controller.FILTER_SCHOOL);
router.get('/checkDistrict/:provinceId',checkAuth, controller.GET_ALL_ITEMS_DISTRICT);
router.get('/checkSchool',checkAuth, controller.CHECK_SCHOOL);
router.get('/mySchool',checkAuth, controller.GET_MY_SCHOOL);
router.get('/search',checkAuth, controller.SEARCH_SCHOOL);
router.get('/:schoolId',checkAuth, controller.GET_EACH_SCHOOL);
router.get('/filter/:cityId',checkAuth, controller.GET_CITY_PROVINCE);
router.get('/',checkAuth, controller.GET_ALL_SCHOOL);
router.post('/newSchool',checkAuth ,controller.NEW_SCHOOL);
router.put('/updateSchool',checkAuth ,controller.PUT_EACH_SCHOOL);



module.exports = router;