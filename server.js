// importing mongoose
const mongoose = require('mongoose');
// importing dotenv
const dotenv =require('dotenv');
dotenv.config({path: './config.env'});
// importing app.js file
const app = require('./app');
// console.log(app.get('env'))
console.log(process.env)

mongoose.connect(process.env.CONN_STR,{
    useNewUrlParser:true
}).then((conn)=>{
    // console.log("conn");
    console.log('DB connection sucessfull');
}).catch((error)=> {
    console.log('error is : ',error)
});


//creating a server
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})