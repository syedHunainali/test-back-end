const { promisify } = require('util');
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
            message: 'Please provide name, email, password, and confirmPassword.'
        });
    }

    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });

    const token = signToken(newUser._id);
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

    if(!email || !password){
        return res.status(400).json({status: 'fail', message: 'Please provide email and password'});
    }

    const user = await User.findOne({ email }).select('+password');

    if(!user || !(await bcrypt.compare(password, user.password))){
        return res.status(401).json({status: 'fail', message: 'Incorrect email or password'});
    }

    const token = signToken(user._id);

    res.status(200).json({
        status: 'success',
        token
    });
});

// Middleware to protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    // 1) Getting token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ status: 'fail', message: 'You are not logged in! Please log in to get access.' });
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return res.status(401).json({ status: 'fail', message: 'The user belonging to this token does no longer exist.' });
    }

    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});
