import express from 'express'
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json({limit:"16kb"}));
app.use(cookieParser());

import studentRouter from "../src/routes/student.route.js"
import wardenRouter from "../src/routes/warden.route.js"
import complaintrouter from "../src/routes/complaint.route.js"


app.use('/api/v1/student',studentRouter)
app.use('/api/v1/warden',wardenRouter)
app.use('/api/v1/complaint', complaintrouter)

export {app}