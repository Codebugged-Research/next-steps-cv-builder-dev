import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import {app} from './app.js';
dotenv.config({
    path: './.env'
});
connectDB().then(()=>{
    app.listen(5000,()=>{
        console.log("Server is running on port 5000");
    });
})
.catch((error)=>{
    console.log("Failed to connect to DB",error);
});