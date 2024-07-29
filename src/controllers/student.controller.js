import { Student } from "../models/student.model.js";

const checkRollNo =  (rollNo)=>{
    let regex = /^\d{2}[a-z]{3}\d{3}$/;
    return regex.test(rollNo);
}

const registerStudent = async(req,res)=>{
    const {name,rollNo,email,phoneNo} = req.body;

    if(!name || name.trim()===""){
        //error throw
    }
    if(!rollNo || rollNo.trim()===""){
        //error throw
    }
    if(!email || email.trim()===""){
        //error throw
    }
    if(!phoneNo || phoneNo.trim()===""){
        //error throw
    }

    if(!checkRollNo(rollNo)){
        //error throw
    }
    


}


export {
    registerStudent
}