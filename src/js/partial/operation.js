function submit(){  
    var attachData = {};
    var postData = {};
    var tabActive = $('.mdui-tab-active').text();
    var datepicker = $('#input-row-' + tabActive + ' .datepicker');
    var isItemID, isTime, isAttach = true;

    if(datepicker.val()==undefined){
        isTime = true;
        postData['Rented'] = '1970-01-01 00:00:00';
        postData['Expired'] = '1970-01-01 00:00:01';
    }else if(datepicker.val()!=''){
        isTime = true;
        postData['Rented'] = datepicker.val().split(" - ")[0];
        postData['Expired'] = datepicker.val().split(" - ")[1];
    }
    $('input[name="panel-selector"]').each((index, element)=>{
        var radio = $(element);
        if(radio.prop('checked')){
            postData['ItemID'] = Number(radio.attr("id").split("-")[1]);
            isItemID = true;
        }
    });
    $('#input-row-' + tabActive + ' input').not('.datepicker').each((index, element)=>{
        var keyName = $(element).attr('class').split('-')[0];
        var keyValue = $(element).val();
        
        if (keyValue) {
            attachData[keyName] = $(element).val();
            isAttach = true;
        } else {
            isAttach = false;
        }
    });
    postData['Attach'] = attachData;
    postData['Tab'] = tabActive;

    if(!isItemID){
        mdui.snackbar("请选择预约的设备！");
    }else if(!(isAttach && isTime)){
        mdui.snackbar("请填写预约信息！");
    }else{
        $.ajax({
            method: 'POST',
            url: '/api/submit',
            data: postData,
            success: function (response) {
                if (JSON.parse(response).success) {
                    refreshPanel();
                    mdui.snackbar("预约成功！");
                } else {
                    mdui.snackbar("该设备已被预约！");
                }           
            }
        });
    }
};

function refreshPanel(){
    $('#main-card .mdui-panel').remove();
    $('header .mdui-tab').remove();
    $('header').append('<div class="mdui-tab mdui-tab-full-width mdui-color-blue-600"></div>');
    initItemPanel();
};

function deleteHistory(){
    var history = [];
    $('.mdui-table-row-selected .col-time').text((index,content)=>{
        history.push(content)
    });
    if (history.length) {
        $.ajax({
            method: 'POST',
            url: '/api/delete',
            data: {
                history: history,
            },
            success: function (response) {
                if (JSON.parse(response).isAdmin){
                    refreshPanel();
                    mdui.snackbar("删除成功！");
                } else {
                    mdui.snackbar("改完还是无权进行操作，请联系管理员");
                }
            }
        });
    } else {
        mdui.snackbar("未选中需删除的记录");
    }
};