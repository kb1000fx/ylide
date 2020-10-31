var $ = mdui.$;

$(function (){ 
    if (localStorage.getItem('RS4SOFC-dark')=='true') {
        $('body').addClass('mdui-theme-layout-dark');
        var themeEl = $('.mdui-color-theme-600');
        themeEl.removeClass('mdui-color-theme-600');
        themeEl.addClass('theme-dark-element');
        $('#nightmode_switch').prop('checked', true);
    }
    if (window.location.pathname=='/') {
        $('body').addClass('mdui-appbar-with-toolbar mdui-appbar-with-tab');
        initItemPanel();    
        showAnnouncement(false);
    }
});