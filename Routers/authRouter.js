const express = require('express');

const Router = express.Router();
const authController = require('../Controllers/authController');
 

Router.route('/signup').post(authController.signup);
Router.route('/login').post(authController.login);

Router.route('/all').get(authController.protect, authController.getAllUsers);

module.exports = Router;
