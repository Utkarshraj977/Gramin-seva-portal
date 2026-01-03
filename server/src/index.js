// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";

// CHANGE 1: Import 'server' instead of 'app'
import { server } from './app.js' 

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    // CHANGE 2: Use server.listen instead of app.listen
    server.listen(process.env.PORT || 8000, () => {
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        console.log(`Socket.io is ready for connections`);
    })
})
.catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
})