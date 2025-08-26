const mongoose = require('mongoose');
// const validate = require('validator');
const bcrypt = require('bcrypt');
// schema for user authentication 
// username,email,password,confirm password
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Username is required field!'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required field!'],
        unique: true,
        lowercase: true,
        // validate: [validate.email, 'Please provide a valid email address!']
    },
    password: {
        type: String,
        required: [true, 'Password is required field!'],
        minlength: [8, 'Password must be at least 8 characters long!']
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm Password is required field!'],
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: 'Passwords do not match!'
        }
    }

})
userSchema.pre('save', async function (next) {
    // Hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;