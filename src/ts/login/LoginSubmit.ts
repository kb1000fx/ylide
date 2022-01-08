import axios from "axios";

class LoginSubmit {
    private static config:Record<string,any>;

    public static submit(){
        this.getConfig();

        axios({
            url: '/api/login',
            method: 'post', 
            data: this.config,
        }).then(function(response) {
            console.log(response);
            if (response.data.status) {
                localStorage.setItem("Token", response.data.token);
                window.location.href = "/";
            } else {
                
            }

        }).catch(function(e){
            console.log(e.response)
        });
    }

    private static getConfig(){
        this.config = {
            studentID: $("#login-studentID-input input").val(),
            password: $("#login-password-input input").val(),        
        }
    }
}

export default LoginSubmit