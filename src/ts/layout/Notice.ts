import axios from "axios";

class Notice {
    static showNotice(){
        $("#noticeModal").modal("show");
        this.getNotice();     
    };

    static getNotice(){
        axios({
            url: '/api/getNotice',
            method: 'get', 
        }).then(function(response) {
            console.log(response);
            $(".modal-body").html(response.data.msg)
        }).catch(function(e){
            console.log(e.response)
        });
    };
}

export default Notice