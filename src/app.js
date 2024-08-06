import express from 'express'

const app=express();

app.use(express.json({limit:"16kb"}));

import studentRouter from "../src/routes/student.route.js"

app.use('/api/v1/student',studentRouter)

export {app}