var express = require('express');
const controller = require('../controller/api/apiByModel');
const { isExistToken, isActiveUser, isDeleteUser, isExistUser } = require('../middleware/api');
const { userValidator ,  familyValidator , mentorValidator, schoolBossValidator, teacherValidator, educationalInstitutionValidator, supportValidator, validate} = require('../middleware/validator');
const { check, validationResult  } = require('express-validator');
var router = express.Router({
  mergeParams: true,
});
var _ = require('lodash');
var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser];
router.use((req, res, next) => {
  var splitModelName=req.params.modelName.split('-');
  if(splitModelName.length == 1){
    req.model = require(`../model/${splitModelName[0]}`)
    req.modelName=_.camelCase(splitModelName[0]);
    next();
  }else if(splitModelName.length==2){
    req.model = require(`../model/${splitModelName[0]}`)[splitModelName[1]];
    req.modelName=_.camelCase(splitModelName[1]);
    next();
  }else{
    res.status(400).send({
      msg:'No Model Found'
    })
  }
  
})
router.get('/search/:searchParams',checkAuth,controller.GET_SEARCH);
router.get('/search',checkAuth,controller.GET_SEARCH);
router.get('/table',checkAuth,controller.GET_TABLE);
router.get('/schema',checkAuth,controller.GET_SCHEMA);
router.get('/:itemId',checkAuth,controller.GET_EACH_ITEM);
router.get('/:itemId/commentList',checkAuth,controller.GET_EACH_ITEM_CHILD);
router.get('/:itemId/myQuestions',checkAuth,controller.GET_EACH_ITEM_PERSONID);
router.get('/:itemId/children',checkAuth,controller.GET_EACH_ITEM);
router.get('/:itemId/PostCategory',checkAuth,controller.GET_EACH_ITEM_CATEGORY);
router.get('/myPostCategory/news',checkAuth,controller.GET_EACH_ITEM_TYPE_NEWS);
router.get('/myPostCategory/entertiament',checkAuth,controller.GET_EACH_ITEM_TYPE_ENTERTIAMENT);

router.put('/:itemId/like',checkAuth,controller.PUT_EACH_ITEM_TOGGLE_LIKE);


router.put('/:itemId/like',checkAuth,controller.PUT_EACH_ITEM_TOGGLE_LIKE);
router.put('/:itemId/dislike',checkAuth,controller.PUT_EACH_ITEM_TOGGLE_DISLIKE);
router.put('/:itemId/follow',checkAuth,controller.PUT_EACH_ITEM_TOGGLE_FOLLOW);
router.put('/:itemId/rate',checkAuth,controller.PUT_EACH_ITEM_TOGGLE_RATE);
router.put('/:itemId/bookmark',checkAuth,controller.PUT_EACH_ITEM_TOGGLE_BOOKMARK);
router.post('/:itemId/comment',checkAuth,controller.POST_EACH_ITEM_COMMENT);
router.post('/:itemId/report',checkAuth,controller.POST_EACH_ITEM_REPORT);
router.put('/:itemId/comment',checkAuth,controller.PUT_EACH_ITEM_ITEM_COMMENT);
router.put('/:itemId/active',checkAuth,controller.ACTIVE_EACH_ITEM);
router.put('/:itemId/deActive',checkAuth,controller.DEACTIVE_EACH_ITEM);
router.put('/:itemId',checkAuth,controller.PUT_EACH_ITEM);

// ------------- validation schema for register --------------------

router.put('/:itemId/user',checkAuth,userValidator,validate,controller.PUT_EACH_ITEM_PERSON);
router.put('/:itemId/family',checkAuth,familyValidator,validate,controller.PUT_EACH_ITEM_PERSON);
router.put('/:itemId/mentor',checkAuth,mentorValidator,validate,controller.PUT_EACH_ITEM_PERSON);
router.put('/:itemId/teacher',checkAuth,teacherValidator,validate,controller.PUT_EACH_ITEM_PERSON);
router.put('/:itemId/schoolboss',checkAuth,schoolBossValidator,validate,controller.PUT_EACH_ITEM_PERSON);
router.put('/:itemId/educationalInstitutions',checkAuth,educationalInstitutionValidator,validate,controller.PUT_EACH_ITEM_PERSON);
router.put('/:itemId/support',checkAuth,supportValidator,validate,controller.PUT_EACH_ITEM_PERSON);

// ------------- validation schema for register --------------------


router.post('/',checkAuth,controller.POST_ITEM);
router.get('/',checkAuth,controller.GET_ALL_ITEMS);
module.exports = router;













