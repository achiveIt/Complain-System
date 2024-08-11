import express from 'express'
import cookieParser from 'cookie-parser';

const app=express();

app.use(express.json({limit:"16kb"}));
app.use(cookieParser());

import studentRouter from "../src/routes/student.route.js"

app.use('/api/v1/student',studentRouter)

export {app}