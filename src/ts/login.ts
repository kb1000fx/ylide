import LoginSubmit from "./login/LoginSubmit"
import Validate from "./login/Validate"

$(function(){
    $("#login-btn").on("click", ()=>{
        if((Validate.validateLogID())&&(Validate.validateLogPWD())){
            LoginSubmit.submit()
        }
        //console.log($("#login-studentID-input input").hasClass("is-invalid")&&($("#login-password-input input").hasClass("is-invalid")))
        //
        //console.log(flag)
    });

    $("#login-studentID-input input").on("blur", Validate.validateLogID);

    $("#login-password-input input").on("blur", Validate.validateLogPWD);

    $("#login-studentID-input input").on("focus", Validate.resumeLogID);

    $("#login-password-input input").on("focus", Validate.resumeLogPWD);
});