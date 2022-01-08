class Validate {
    static validateLogID():boolean{
        const studentID:string = $("#login-studentID-input input").val() as string;
        if ((studentID)&&studentID.match(/^[0-9A-Z]*$/i)) {
            return true
        } else {
            $("#login-studentID-input input").addClass("is-invalid");
            return false
        }
    };

    static resumeLogID(){
        $("#login-studentID-input input").removeClass("is-invalid");
    }

    static validateLogPWD():boolean{
        const pwd:string = $("#login-password-input input").val() as string;       
        if ((pwd)&&pwd.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,}$/)) {
            return true
        } else {
            $("#login-password-input input").addClass("is-invalid");
            return false
        }
    };

    static resumeLogPWD(){
        $("#login-password-input input").removeClass("is-invalid");
    }
}

export default Validate