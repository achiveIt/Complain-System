import { Warden } from '../models/warden.model.js'
import asyncHandler from '../utils/asyncHandler.js'

const registerWarden = asyncHandler((req,res)=>{
    const {name,position,phoneNo,email,hostel,password}= req.body;

    

})