const User = require('../Models/usermodel');
const asyncHandler = require('./../Utils/asyncErrorHandler');


exports.signup = asyncHandler( async (req,res,next) => {
    const newUser = await User.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    });
});