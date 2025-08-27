const express = require('express');
const teamController = require('../Controllers/teamController');
const authController = require('../Controllers/authController');

const router = express.Router();

// All routes below this point will be protected by the authController.protect middleware
router.use(authController.protect);

router
    .route('/')
    .get(teamController.getMyTeams)
    .post(teamController.createTeam);

module.exports = router;
