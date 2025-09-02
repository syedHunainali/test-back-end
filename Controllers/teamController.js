const Team = require('../Models/teamModel');
const User = require('../Models/usermodel');
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
    const teams = await Team.find({ members: req.user._id }).populate('members', 'name email');

    res.status(200).json({
        status: 'success',
        results: teams.length,
        data: {
            teams,
            userId: req.user._id
        }
    });
});

exports.addTeamMember = asyncHandler(async (req, res, next) => {
    const { teamId } = req.params;
    const { email } = req.body;

    const team = await Team.findById(teamId);

    if (!team) {
        return res.status(404).json({ status: 'fail', message: 'No team found with that ID' });
    }

    if (team.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({ status: 'fail', message: 'Only the team creator can add members' });
    }

    const userToAdd = await User.findOne({ email });

    if (!userToAdd) {
        return res.status(404).json({ status: 'fail', message: 'No user found with that email' });
    }

    if (team.members.includes(userToAdd._id)) {
        return res.status(400).json({ status: 'fail', message: 'User is already in the team' });
    }

    team.members.push(userToAdd._id);
    await team.save();

    // Populate members after adding the new one
    const updatedTeam = await Team.findById(teamId).populate('members', 'name email');

    res.status(200).json({
        status: 'success',
        data: {
            team: updatedTeam
        }
    });
});
