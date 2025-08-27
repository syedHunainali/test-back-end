const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'A team must have a name.'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A team must have a creator.']
    },
    members: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;