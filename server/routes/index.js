var express = require('express');
var router = express.Router();
const controller = require('../controller/api/index');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/loaderio-8d88df91094b22eb280b77826e206400.txt', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('loaderio-8d88df91094b22eb280b77826e206400.html', function(req, res, next) {
  res.render('loaderio-8d88df91094b22eb280b77826e206400');
});

router.get('/loaderio-8d88df91094b22eb280b77826e206400/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/rule/:itemId', controller.GET_RULES);
module.exports = router;
