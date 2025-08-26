const express = require('express');

const Router = express.Router();
const authController = require('../Controllers/authController');
 

Router.route('/signup').post(authController.signup);
Router.route('/login').post(authController.login);
module.exports = Router;