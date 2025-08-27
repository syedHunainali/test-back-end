//import express
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const authRouter = require('./Routers/authRouter');
const teamRouter = require('./Routers/teamRouter'); // Import the new team router

let app = express()

app.use(express.static(path.join(__dirname, '../frontend')));

app.use(express.json());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// Use the routers
app.use('/api/v1/users', authRouter); // auth router to handle user authentication
app.use('/api/v1/teams', teamRouter); // Add the team router to the middleware stack

module.exports = app;
