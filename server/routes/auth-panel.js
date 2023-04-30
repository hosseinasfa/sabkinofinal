var express = require('express');
const controller = require('../controller/api/auth-panel');
var router = express.Router();
router.post('/verify', controller.verify);
module.exports = router;