var $ = mdui.$;


$(function (){ 
    if (localStorage.getItem('RS4SOFC-dark')=='true') {
        $('body').addClass('mdui-theme-layout-dark');
        $('#user-menu-darkmode a').html('<i class="mdui-menu-item-icon mdui-icon material-icons">brightness_5</i>日间模式');
        $('#top-container').removeClass('mdui-color-blue-600');
    }
    if (window.location.pathname=='/') {
        $('body').addClass('mdui-appbar-with-toolbar mdui-appbar-with-tab');
        initItemPanel();    
        showAnnouncement(false);
    }
});

function changeNightMode(){
    if ($('body').hasClass('mdui-theme-layout-dark')) {
        $('body').removeClass('mdui-theme-layout-dark');
        $('#user-menu-darkmode a').html('<i class="mdui-menu-item-icon mdui-icon material-icons">brightness_2</i>夜间模式');
        $('#top-container').toggleClass('mdui-color-blue-600');
        localStorage.removeItem('RS4SOFC-dark');
    } else {
        $('body').addClass('mdui-theme-layout-dark');
        $('#user-menu-darkmode a').html('<i class="mdui-menu-item-icon mdui-icon material-icons">brightness_5</i>日间模式');
        $('#top-container').toggleClass('mdui-color-blue-600');
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

function checkRePWD() {
    var error = false;
    var pwd = $('#signup-pwd input').val();
    var repwd = $('#signup-repwd input').val();

    if (repwd=="") {
        error = true;
        $('#signup-repwd .mdui-textfield-error').text('重复密码不能为空');
    } else if(repwd != pwd){
        error = true;
        $('#signup-repwd .mdui-textfield-error').text('两次输入密码不同');
    } 
    if (error) {
        $('#signup-repwd').addClass('mdui-textfield-invalid');
    } else {
        $('#signup-repwd').removeClass('mdui-textfield-invalid');
    }
};

function login() {
    var user = $('#login-user input').val();
    var pwd = $('#login-pwd input').val();
    var isRemember = $('#login-check').is(':checked');
    var hashPWD = CryptoJS.SHA256(pwd).toString()

    $.ajax({
        method: 'POST',
        url: '/api/login',
        data: {
            id: user,
            pwd: hashPWD,
            isRemember: isRemember,
        },
        success: function (response) {
            var loginStatus = JSON.parse(response)
            if (!loginStatus.isAccountExist) {
                $('#login-pwd .mdui-textfield-error').text('用户不存在');
                $('#login-pwd').addClass('mdui-textfield-invalid');
            } else if(loginStatus.isLogin==true){
                window.location.href="/"
            }else{
                $('#login-pwd .mdui-textfield-error').text('密码错误');
                $('#login-pwd').addClass('mdui-textfield-invalid');
            }
        }
    });
};

function signup(){
    var user = $('#signup-user input').val();
    var name = $('#signup-name input').val();
    var pwd = $('#signup-pwd input').val();
    var repwd = $('#signup-repwd input').val();

    if((user!="")&&(name!="")&&(pwd!="")&&(repwd!="")&&(pwd==repwd)){
        var hashPWD = CryptoJS.SHA256(pwd).toString()
        $.ajax({
            method: 'POST',
            url: '/api/signup',
            data: {
                id: user,
                name: name,
                pwd: hashPWD, 
            },
            success: function (response) {
                var res = JSON.parse(response);
                var dialog = new mdui.Dialog('#login-card-dialog');
                if (!res.enableSignUp) {
                    initDialog($('#login-card-dialog'), '注册已关闭', '注册功能已关闭', ()=>{
                        $('#tab-signup').find('.mdui-textfield-input').val('');
                    });
                } else if (res.isNameExist) {
                    initDialog($('#login-card-dialog'), '账户已存在', '账户已存在', ()=>{
                        $('#tab-signup').find('.mdui-textfield-input').val('');
                    });
                } else {
                    initDialog($('#login-card-dialog'), '注册成功', '注册成功，请登录', ()=>{
                        $('#tab-signup').find('.mdui-textfield-input').val('');
                        new mdui.Tab('#tab-head').show(0);          
                    });
                }
                dialog.open(); 
            }
        });
    }
};

function initDialog(dialog, title, content, callback){
    dialog.find('.mdui-dialog-title').text(title);
    dialog.find('.mdui-dialog-content').text(content);
    if (callback!=undefined) {
        dialog.on('closed.mdui.dialog', function(){
            callback();
            dialog.off('closed.mdui.dialog');  
        });
    } 
};

function initItemPanel(){
    $.ajax({
        method: 'GET',
        url: '/api/itemList',
        success: function (response) {
            var res = JSON.parse(response); 
            var list = [];

            for (let eTab of res) {
                console.log(eTab)
                let tabStr = '<a href="#tab-' + eTab.tab + '" class="mdui-ripple mdui-ripple-white">' + eTab.tab + '</a>';
                let tabContent= '<div id="tab-' + eTab.tab + '" class="mdui-panel mdui-shadow-0 mdui-panel-gapless" mdui-panel="{accordion:true}">'+
                                    '<div class="mdui-panel-item">'+
                                        '<div class="mdui-panel-item-header">'+
                                            '<label class="mdui-radio"></label>'+
                                            '<div class="mdui-panel-item-summary head-font">设备</div>'+
                                            '<div class="mdui-panel-item-summary head-font">状态</div>'+
                                            '<div class="mdui-panel-item-summary head-font">使用者</div>'+
                                            eTab.header.map(e => {
                                                return '<div class="mdui-panel-item-summary panel-material head-font">' + e + '</div>'
                                            }).join('') +
                                            ((eTab.showTimeInfo)?(
                                                '<div class="mdui-panel-item-summary panel-rented head-font">预约开始时间</div><div class="mdui-panel-item-summary panel-expired head-font">预约结束时间</div>'
                                            ):(''))+
                                            '<i class="mdui-panel-item-arrow mdui-icon material-icons" style="visibility: hidden;">keyboard_arrow_down</i>'+
                                        '</div>'+
                                    '</div>';   
                let inputStr =  '<div class="input-row mdui-row">'+    
                                ((eTab.showTimeInfo)?(
                                    '<div class="mdui-col-xs-' + Math.floor(12/(eTab.header.length + ((eTab.showTimeInfo)?1:0))) + '">'+
                                        '<div class="mdui-textfield  mdui-textfield-floating-label">'+
                                            '<label class="mdui-textfield-label">预约日期</label>'+
                                            '<input id="datepicker-'+eTab.tab+'" autocomplete="off" class="datepicker mdui-textfield-input" type="text" required/>'+
                                            '<div class="mdui-textfield-error">请选择预约日期</div>'+
                                        '</div>'+
                                    '</div>'
                                ):(''))+          
                                eTab.header.map(e => {
                                    return  '<div class="mdui-col-xs-' + Math.floor(12/(eTab.header.length + ((eTab.showTimeInfo)?1:0))) + '">'+
                                                '<div class="mdui-textfield mdui-textfield-floating-label">'+
                                                    '<label class="mdui-textfield-label">' + e + '</label>'+
                                                    '<input class="' + e + '-input mdui-textfield-input" type="text" required/>'+
                                                    '<div class="mdui-textfield-error">请输入' + e + '</div>'+
                                                '</div>'+
                                            '</div>'
                                }).join('')+
                                '</div>';
                for (let obj of eTab.list) {
                    obj.Attach = JSON.parse(obj.Attach);
                    list.push({id: obj.ItemID,header: eTab.header, showTimeInfo: eTab.showTimeInfo});
                    let status, statusClass;
                    let expiredDate = new Date(obj.Expired);

                    if (expiredDate>new Date()) {
                        status = "已预约";
                        statusClass = "status-busy";
                    } else {
                        status = "可预约";
                        statusClass = "status-idle";
                        obj.UserName = "无"; 
                        obj.Rented = "无"; 
                        obj.Expired = "无"; 
                        eTab.header.forEach(e => {
                            obj.Attach[e] = '无';
                        });
                    }

                    tabContent += 
                        '<div id="panel-item-' + obj.ItemID + '" class="mdui-panel-item">'+
                            '<div class="mdui-panel-item-header">'+
                                '<label class="mdui-radio">'+
                                    '<input id="selector-' + obj.ItemID + '" type="radio" name="panel-selector"/>'+
                                    '<i class="mdui-radio-icon"></i>'+
                                '</label>'+
                                '<div class="mdui-panel-item-summary">'+ 
                                    ((obj.Description)?('<div class="panel-item">'+obj.Item+'</div>'+'<div class="panel-description">'+obj.Description+'</div>'):('<div class="panel-item">'+obj.Item+'</div>')) +
                                '</div>'+
                                '<div class="mdui-panel-item-summary ' + statusClass + '">'+ status + '</div>'+
                                '<div class="mdui-panel-item-summary">' + obj.UserName + '</div>'+
                                eTab.header.map(e => {
                                    return '<div class="mdui-panel-item-summary panel-attach">' + obj.Attach[e] + '</div>'
                                }).join('') +
                                ((eTab.showTimeInfo)?(
                                    '<div class="mdui-panel-item-summary panel-rented">' + obj.Rented + '</div>'+
                                    '<div class="mdui-panel-item-summary panel-expired">' + obj.Expired + '</div>'
                                ):(''))+
                                '<i class="mdui-panel-item-arrow mdui-icon material-icons">keyboard_arrow_down</i>'+
                            '</div>'+
                            '<div class="mdui-panel-item-body">'+
                                '<div class="mdui-spinner mdui-center"></div>'+
                            '</div>'+
                        '</div>';   
                }                          
                tabContent = tabContent + '<div class="mdui-divider"></div>' + inputStr + '</div>';
                $('header .mdui-tab').append(tabStr);
                $('#main-card').prepend(tabContent); 
                laydate.render({
                    elem: '#datepicker-' + eTab.tab, 
                    theme: '#3F51B5',
                    calendar: true,
                    type: 'datetime',
                    range: true,
                    min: 0,
                    trigger: 'click',
                    done: function(){
                        setTimeout(function(){ 
                            $('.datepicker').trigger('blur') 
                        }, 20);
                    },
                });
            }

            $('header .mdui-tab').attr('mdui-tab','')
            mdui.mutation();
            for (let item of list) {
                $('#panel-item-' + item.id).on('opened.mdui.panel', function(){
                    initHistory(item);
                });  
            }
        }
    });
};

function initHistory(item){
    $.ajax({
        method: 'GET',
        url: '/api/history',
        data: {
            id: item.id,
        },
        success: function (response) {
            var history = JSON.parse(response).history;
            var order = JSON.parse(response).order;
            var str = "";
            for (let obj of history) {
                let status, statusClass;
                if (new Date(obj.Expired) > new Date()) {
                    statusClass = "status-undone"
                    status = "待完成"
                } else {
                    statusClass = "status-done"
                    status = "已完成"
                }
                let appendStr = '<tr>'+
                                '<td class="col-time">' + obj.Time + '</td>'+
                                '<td class="' + statusClass + '">' + status + '</td>'+
                                '<td>' + obj.UserName + '</td>'+
                                '<td>' + obj.Material + '</td>'+
                                '<td>' + obj.Temperature + '</td>'+
                                '<td>' + obj.Rented + '</td>'+
                                '<td>' + obj.Expired + '</td>'+               
                                '</tr>';
                if (order=='asc') {
                    str = str + appendStr;
                } else if(order=='desc'){
                    str = appendStr + str;
                } else {
                    console.error("History Order Error!");
                    break; 
                }
            }
            str =   '<div class="mdui-table-fluid mdui-shadow-0 mdui-table-hoverable">'+
                        '<table class="mdui-table mdui-table-selectable">'+
                            '<thead><tr>'+
                                '<th>预约时间</th>'+
                                '<th>预约状态</th>'+
                                '<th>使用者</th>'+
                                item.header.map(e => {
                                    return '<th>' + e + '</th>'
                                }).join('') +
                                ((item.showTimeInfo)?(
                                    '<th>开始时间</th><th>结束时间</th>'
                                ):(''))+                        
                            '</tr></thead>'+
                            '<tbody>'+
                                str+
                            "</tbody>"+
                        "</table>"+
                    "</div>";
            $('#panel-item-' + item.id + ' .mdui-panel-item-body').empty();
            $('#panel-item-' + item.id + ' .mdui-panel-item-body').append(str);          
            mdui.mutation();
        }
    });
};

function submit(){
    var tabActive = $('.mdui-tab-active').text()
    var datetime = $('#datepicker-'+tabActive).val();
    console.log(typeof datetime)

    var temperature = $('#temperature-input').val();
    var material = $('#material-input').val();
    var itemID;
    for (let radio of document.getElementsByName("panel-selector")) {
        if (radio.checked) {
            itemID = Number(radio.getAttribute("id").split("-")[1]);
        }
    }

    if ((datetime && temperature && material && itemID)) {
        var begin  = datetime.split(" - ")[0];
        var end = datetime.split(" - ")[1];
        $.ajax({
            method: 'POST',
            url: '/api/submit',
            data: {
                ItemID: itemID,
                Material: material,
                Temperature: temperature,
                Rented: begin,
                Expired: end,
            },
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
    initItemPanel();
};

function deleteHistory(){
    var history = [];
    $('.mdui-table-row-selected .col-time').text(function(index,content){
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