var express = require('express');
const controller = require('../controller/api/post');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
var router = express.Router();
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser];

router.get('/getQuestionItem/:itemId', controller.GET_POST_QUESTION_ITEM);
router.get('/searchHashtag',checkAuth, controller.SEARCH_HASHTAG);
router.get('/myQuestions',checkAuth, controller.GET_MY_QUESTION_LIST);
router.get('/serchPostQuestionItems', checkAuth, controller.GET_SEARCH_ITEMS);
router.put('/:itemId/like',checkAuth,controller.PUT_EACH_ITEM_LIKE);

router.put('/newsItemLike',checkAuth,controller.PUT_NEWS_ITEM_LIKE);
router.put('/newsItemDisLike',checkAuth,controller.PUT_NEWS_ITEM_DIS_LIKE);

router.put('/entertainmentItemLike',checkAuth,controller.PUT_ENTERTAINMENT_ITEM_LIKE);
router.put('/entertainmentItemDisLike',checkAuth,controller.PUT_ENTERTAINMENT_ITEM_DIS_LIKE);
router.get('/getAnswerOfQuestions',checkAuth,controller.GET_ANSWER_OF_QUESTION_ITEMS);


router.post('/:itemId/report',checkAuth,controller.POST_EACH_ITEM_REPORT);
router.put('/:itemId/bookmark',checkAuth,controller.PUT_EACH_ITEM_BOOKMARK);
router.post('/comment',checkAuth,controller.POST_EACH_ITEM_COMMENT);
router.get('/getNewsAllComment',checkAuth,controller.GET_NEWS_ALL_COMMENT_ITEMS);
router.get('/getEntertainmentAllComment',checkAuth,controller.GET_ENTERTAINMENT_ALL_COMMENT_ITEMS);
router.get('/getEntertainment',checkAuth,controller.GET_ENTERTAINMENT_ITEMS);
router.delete('/deleteCommentItem',checkAuth,controller.DELETE_COMMENT_ITEM);
router.post('/:itemId/comment/:commentId/reply',checkAuth,controller.POST_EACH_COMMENT_REPLY);
router.get('/:itemId',checkAuth,controller.GET_EACH_ITEM);
router.put('/:itemId',checkAuth,controller.PUT_EACH_ITEM_INFO);
router.post('/postEvent',checkAuth,controller.POST_ITEM_EVENT);
router.post('/postQuestion',checkAuth,controller.POST_ITEM_QUESTION);
router.get('/',checkAuth,controller.GET_ALL_ITEMS);
module.exports = router;