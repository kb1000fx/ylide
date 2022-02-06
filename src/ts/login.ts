import LoginSubmit from "./login/LoginSubmit"
import SignUpSubmit from "./login/SignUpSubmit"
import Validate from "./login/Validate"

$(function(){
    $("#login-btn").on("click", ()=>{
        if((Validate.validateLogID())&&(Validate.validateLogPWD())){
            LoginSubmit.submit()
        }
    });

    $("#login-btn").on("click", ()=>{
        //if((Validate.validateLogID())&&(Validate.validateLogPWD())){
            SignUpSubmit.submit()
        //}
    });

    $("#login-studentID-input input").on("blur", Validate.validateLogID);

    $("#login-password-input input").on("blur", Validate.validateLogPWD);

    $("#login-studentID-input input").on("focus", Validate.resumeLogID);

    $("#login-password-input input").on("focus", Validate.resumeLogPWD);
});