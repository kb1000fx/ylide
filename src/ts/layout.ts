import DarkMode from "./layout/DarkMode";
import Notice from "./layout/Notice"
import LogOut from "./layout/LogOut"

console.log(`jQuery version: ${jQuery.fn.jquery}`);

$(function(){
    //夜间模式
    DarkMode.init();
    $("#sidebar-light").on("click", DarkMode.delDark);
    $("#sidebar-dark").on("click", DarkMode.addDark);

    //退出
    $(".sign-out").on("click", LogOut);

    //公告
    $("#sidebar-notice").on("click", function(){
        //console.log("notice");
        Notice.showNotice()
    });
});
