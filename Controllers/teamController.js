const Team = require('../Models/teamModel');
const asyncHandler = require('../Utils/asyncErrorHandler');

// This controller handles creating a team
exports.createTeam = asyncHandler(async (req, res, next) => {
    const { name, description } = req.body;
    const createdBy = req.user._id; // from protect middleware

    const newTeam = await Team.create({
        name,
        description,
        createdBy,
        members: [createdBy] // The creator is the first member
    });

    res.status(201).json({
        status: 'success',
        data: {
            team: newTeam
        }
    });
});

// This controller gets all teams the current user is a member of
exports.getMyTeams = asyncHandler(async (req, res, next) => {
    const teams = await Team.find({ members: req.user._id });

    res.status(200).json({
        status: 'success',
        results: teams.length,
        data: {
            teams
        }
    });
});
