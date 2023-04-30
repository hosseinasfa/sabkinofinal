var express = require('express');
const controller = require('../controller/api/register');
const {isExistToken, isActiveUser, isDeleteUser, isExistUser} = require('../middleware/api');
var checkAuth = [isExistToken, isExistUser, isActiveUser, isDeleteUser];
var router = express.Router();
const response = require('../response');
const config = require('../config.js');
var bodyParser = require('body-parser');

var checkAuth=[isExistToken,isExistUser,isActiveUser,isDeleteUser]



//Controllers
const authController = require('./../controller/api/authController');

//Validators
const registerValidator = require('./../validators/registerValidator');
const loginValidator = require('./../validators/loginValidator');



router.put('/register' , checkAuth  , registerValidator.handle() , authController.register);

module.exports = router;


