const User = require('../Models/usermodel');
const asyncHandler = require('./../Utils/asyncErrorHandler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Function to sign and create a token
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = asyncHandler( async (req,res,next) => {
    // Check if required fields are provided in the request body
    if (!req.body.name || !req.body.email || !req.body.password || !req.body.confirmPassword) {
        return res.status(400).json({
            status: 'fail',
            message: 'Please provide valid name, email, password, and confirmPassword.'
        });
    }

    // 1. Create the new user
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });

    // 2. Create a token for the new user
    const token = signToken(newUser._id);

    // 3. Send the response
    // We remove the password from the output
    newUser.password = undefined;

    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});


exports.login = asyncHandler( async (req,res,next) => {
    const {email, password} = req.body;

    // 1. Check if email and password exist in the request body
    if(!email || !password){
        // In a real app, you'd use a custom error handling middleware
        return res.status(400).json({status: 'fail', message: 'Please provide email and password'});
    }

    // 2. Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    // 3. Compare the provided password with the hashed password in the database
    if(!user || !(await bcrypt.compare(password, user.password))){
        return res.status(401).json({status: 'fail', message: 'Incorrect email or password'});
    }

    // 4. If everything is ok, send token to client
    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    });
});
