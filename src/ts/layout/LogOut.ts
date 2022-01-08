import axios from "axios";

export default ()=>{
    axios({
        url: '/api/logout',
        method: 'get', 
    }).then(function(response) {
        console.log(response);
    }).catch(function(e){console.log(e.response)});

    localStorage.removeItem("Token");
    window.location.href = "/login";
}