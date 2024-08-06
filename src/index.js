import dotenv from "dotenv"
import {app} from "./app.js"
import connectDb from "./db/index.db.js";

dotenv. config({
    path: './.env'
})

connectDb()
.then(()=>{
    app.listen(process.env.PORT || 4000 ,()=>{
        console.log(`Server is listening on port: ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log(`MongoDb Connection Error`);
})





