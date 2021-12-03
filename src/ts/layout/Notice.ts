class Notice {
    static showNotice(){
        //let a = "";
        $("#noticeModal").modal("show");
        this.getNotice();     
    };

    static getNotice(){
        $.ajax({
            method: "GET",
            url: "/api/getNotice",
        }).done(function( msg ) {
            console.log( msg );
            $(".modal-body").html(msg.msg)
        });
    };
}


export default Notice