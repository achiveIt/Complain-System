import ApiError from "./ApiError.js";

const checkPassword = (password) => {
    if(password.length < 8){
        throw new ApiError(400, "Password should be atleast of length 8")
    }
    let smallCharacter = false;
    let capitalCharacter = false;
    let number = false;
    let specialCharacter = false;

    for (let index = 0; index < password.length; index++) {
        const element = array[index];

        if(element >= 'a' && element <= 'z'){
            smallCharacter = true;
        }
        else if(element >= 'A' && element <= 'Z'){
            capitalCharacter = true;
        }
        else if(element >= '0' && element <= '9'){
            number = true;
        }
        else{
            specialCharacter = true;
        } 
    }

    if(!smallCharacter){
        throw new ApiError(400, "Password should contain atleast one small alphabet")
    }
    if(!capitalCharacter){
        throw new ApiError(400, "Password should contain atleast one capital alphabet")
    }
    if(!number){
        throw new ApiError(400, "Password should contain atleast one digit")
    }
    if(!specialCharacter){
        throw new ApiError(400, "Password should contain atleast one special character")
    }

    return true;
}

export{
    checkPassword
}