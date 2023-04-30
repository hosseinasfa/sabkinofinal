var express = require('express');
const controller = require('../controller/api/deming');

const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router({
    mergeParams:true,
});
router.use(isExistToken);
router.use(isExistUser);
router.use(isActiveUser);
router.use(isDeleteUser);


router.get('/', controller.GET_EACH_DEMING);
router.post('/', controller.GET_EACH_DEMING_BYDATE);
router.post('/newDeming', controller.POST_NEW_DEMING);
router.post('/chart', controller.GET_DEMING_BY_DATE_TYPE);
router.delete('/deleteItems',controller.DELETE_DEMING_ITEMS);
router.delete('/:demingId',controller.DELETE_EACH_POST);


module.exports = router;
