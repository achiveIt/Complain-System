class ApiError extends Error{
    constructor(statusCode,message="Something Went Wrong",error=[],callStack = ""){

        super(message)
        this.statusCode = statusCode,
        this.data = null,
        this.message = message,
        this.success = false,
        this.error = error

        if(callStack){
            this.stack=callStack
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}

export default ApiError