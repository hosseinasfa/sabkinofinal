var express = require('express');
const controller = require('../controller/api/user');
const { fileUpload } = require('../libs/upUserExtraData');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router();
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser];

router.get('/convertDate',controller.CONVERT_DATE);
router.get('/deleteData',controller.DELETE_IMPORT_DATA);
router.get('/deleteDataNew',controller.DELETE_IMPORT_DATA_NEW);
router.delete('/deleteUserAccount',checkAuth,controller.DELETE_USER_ACCOUNT);
router.delete('/deleteImport',controller.DELETE_ENTRANCE_EXAM);
router.get('/importSchool',controller.IMPORT_SCHOOL_DATA);
router.get('/importAcademy',controller.IMPORT_ACADEMY_DATA);
router.get('/import',controller.IMPORT_DATA);
router.get('/importNew',controller.IMPORT_DATA_NEW);
router.put('/putEmptyAccount',controller.PUT_EMPTY_ACCOUNT);
router.get('/getUserInfo',checkAuth,controller.GET_USER_INFO);
router.get('/',checkAuth,controller.userInfo);
router.put('/:itemId',checkAuth,controller.PUT_PERSON);
router.post('/userExtraData',fileUpload.single('file'),controller.POST_USER_EXTRA_DATA);

module.exports = router;