import DarkMode from "./layout/DarkMode";
import Notice from "./layout/Notice"

console.log(`jQuery version: ${jQuery.fn.jquery}`);

$(function(){
    //夜间模式
    DarkMode.init();
    $("#sidebar-light").on("click", DarkMode.delDark);
    $("#sidebar-dark").on("click", DarkMode.addDark);

    //抽屉导航
    //$("body").addClass(["sidebar-mini", "layout-fixed"]);

    //退出
    $(".sign-out").on("click", function(){
        console.log("sign-out")
    });

    //公告
    $("#sidebar-notice").on("click", function(){
        console.log("notice");
        Notice.showNotice()
    });
});
