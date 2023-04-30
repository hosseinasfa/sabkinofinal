var express = require('express');
const controller = require('../controller/api/notification');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]

var router = express.Router();
// router.get('/:itemId',checkAuth, controller.GET_EACH_ITEM);
// router.put('/:itemId',checkAuth, controller.PUT_EACH_ITEM);
// router.put('/:itemId/active',checkAuth, controller.PUT_ITEM_ACTIVE);
// router.put('/:itemId/deActive',checkAuth, controller.PUT_ITEM_DE_ACTIVE);
router.get('/newNotif2',checkAuth, controller.POST_NOTIFICTION2);
 router.post('/subscribe',checkAuth, controller.POST_SUBSCRIBE);
 router.post('/unsubscribe',checkAuth, controller.POST_UNSUBSCRIBE);
 router.post('/newNotif',checkAuth, controller.POST_NOTIFICTION);
 router.post('/sendNotif',checkAuth, controller.POST_FCM);
module.exports = router;