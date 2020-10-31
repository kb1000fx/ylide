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