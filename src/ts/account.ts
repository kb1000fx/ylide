import SubmitProfile from "./account/SubmitProfile"

$(function(){
    $("#save-profile-btn").on("click", function() {
        new SubmitProfile().submit()
    });



});