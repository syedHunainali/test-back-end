// importing mongoose
const mongoose = require('mongoose');
// importing dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// importing app.js file
const app = require('./app');
// console.log(app.get('env'))
// for local server log use below command
// console.log(process.env)

mongoose.connect(
    process.env.CONN_STR,{
        useNewUrlParser: true
    }
).then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ Connection error:", err));


//creating a server
const port = process.env.port || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})