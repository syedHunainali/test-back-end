//import express
const express = require('express');
const morgan = require('morgan');
const authRouter = require('./Routers/authRouter')
// const { request } = require('http');

let app = express()


app.use(express.json()); // to parse JSON bodies or to add json input in body 
if(process.env.NODE_ENV=== 'development'){
    // morgan is used for printing the out put or log information/output  
    app.use(morgan('dev'))
}
// after making to run the middleware we will e useing this key 
app.use('/api/v1/users',authRouter);

module.exports = app;