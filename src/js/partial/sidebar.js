function changeNightMode(){
    if ($('body').hasClass('mdui-theme-layout-dark')) {
        $('body').removeClass('mdui-theme-layout-dark');
        var darkEl = $('.theme-dark-element'); 
        darkEl.removeClass('theme-dark-element');
        darkEl.addClass('mdui-color-theme-600');
        localStorage.removeItem('RS4SOFC-dark');
    } else {
        $('body').addClass('mdui-theme-layout-dark');
        var themeEl = $('.mdui-color-theme-600');
        themeEl.removeClass('mdui-color-theme-600');
        themeEl.addClass('theme-dark-element');
        localStorage.setItem('RS4SOFC-dark', true);
    }
};

function showAnnouncement(manual){
    $.ajax({
        method: 'GET',
        url: '/api/announcement',
        success: function (response) {
            var res = JSON.parse(response);
            var dialog = new mdui.Dialog('#announcement-dialog', {modal:true, closeOnEsc:false});

            if (manual) {
                initDialog($('#announcement-dialog'), '公告', res.content);
                dialog.open()
            } else if(res.autoShow){
                initDialog($('#announcement-dialog'), '公告', res.content);
                dialog.open()
            }
        }
    });
};

function initDialog(dialog, title, content, callback){
    dialog.find('.mdui-dialog-title').text(title);
    dialog.find('.mdui-dialog-content').text(content);
    if (callback!=undefined) {
        dialog.on('closed.mdui.dialog', ()=>{
            callback();
            dialog.off('closed.mdui.dialog');  
        });
    } 
};