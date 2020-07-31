layui.use(['form','element','layer'],function(){
    var form = layui.form,
        element = layui.element;
       layer = parent.layer === undefined ? layui.layer : top.layer;
       form.on('submit(formDemo)', function(datas){
                login.positionId(datas.field)
       })
var sl_loginWrapDom='<ul class="">' +
    '<li>' +
         '<span>账号</span>' +
         '<input type="text" placeholder="请输入账号"   name="username">' +
    '</li>' +
    '<li>' +
    '<span>密码</span>' +
    '<input type="password" placeholder="请输入密码"  name="password">' +
    '</li>' +
    '<li class="clear" style="cursor: pointer;position: relative">' +
    '<span  class="lf checked">' +
    '<i class="material-icons">check_box_outline_blank</i>' +
    '</span><p class="lf"style="position: absolute;top: 20px;left: 15px;">记住我</p>' +
    '</li>' +
    '</ul>' +
    '<button id="submit_btn" lay-filter="formDemo" lay-submit>立即登录</button>'
var login=(function () {
    var _m= {};
    var self=_m;
    //初始化
    _m.init=function () {
        self.jump();
        self.keyword();
        self.rememberMe();
        self.switch();
    }
    //错误提示
    _m.errorTip = function (tip) {
         layer.msg('<i class="material-icons msgIconStyleFail">cancel</i>'+tip,{
            skin: 'msgStyle',//skin属性可以将layer的标签提取出来，重新定义样式
        });
    }
    //判断权限
    _m.positionId = function(obj){
        var username =$.trim(obj.username);
        var password =$.trim(obj.password);
        if(!username){
            self.errorTip('请填写用户名');
            $('input[name="username"]').focus().addClass('active');
            return;
        }else {
            $('input[name="username"]').removeClass('active');
        }
        if(!password){
            self.errorTip('请填写密码');
            $('input[name="password"]').focus().addClass('active');
            return;
        }else {
            $('input[name="password"]').removeClass('active');
        }
            password = CryptoJS.MD5(password).toString();
       var params ={
           username:username,
           password:password,
           clientType:0
       }
         self.ajax(params);
    }
    //ajax
    _m.ajax = function(params){
        // var loadings= top.layui.layer.load(2);
        $('#sl_loginWrap').empty();
        $('#sl_loginWrap').append('<img src="../img/loading-2.gif" style="position: absolute;left: 0;top:0;bottom: 0;right: 0;margin: auto;">');
        $.ajax({
            type: "get",
            data: params,
            url: urls+'/account/login.action',
            dataType: "json",
            success: function(result) {
                if (result.error) {
                    $('#sl_loginWrap').empty();
                    $('#sl_loginWrap').append(sl_loginWrapDom);
                    self.errorTip(result.error.message);
                } else {
                    var data = result.data;
                    $.cookie(data.username+'userIds', data.id);
                    $.cookie(data.username+'tokens', data.token);
                    sessionStorage.sl_userIsLogin = true;//token失效后防止弹框保存的值
                    sessionStorage.photopath = data.accountData.photopath;
                    sessionStorage.positionId = JSON.stringify(data.accountData.identitysData);
                    sessionStorage.rname = data.accountData.rname;
                    sessionStorage.username = data.username;
                    if ($('#login ul li .checked').hasClass('active')) {
                        var name = $("input[name='username']").val();
                        var password = $("input[name='password']").val();
                        $.cookie("name", name, {expires: 365, path: '/'});
                        $.cookie("password", password, {expires: 365, path: '/'});
                    }
                       setTimeout(function () {
                           location.href = "../index.html";
                       },100)
                }
            },
            error:function () {
                $('#sl_loginWrap').empty();
                $('#sl_loginWrap').append(sl_loginWrapDom);
                self.errorTip('服务器繁忙，请稍后再试');
            }
    	})
    }
    //关于学校跳转
    _m.jump = function () {
        $('.tell i.schoolLine').unbind('click').bind('click',function () {
            window.open("http://www.itzx.cn/");
        })

    }
    //键盘粗发点击事件
    _m.keyword = function () {
        $(document).keyup(function(event) {
            var e=event||window.event;
            if(e.keyCode == 13) {
                var username =$.trim($('input[name="username"]').val());
                var password =$.trim($('input[name="password"]').val());
                self.positionId({username:username,password:password});
            }
        });
    }
    //记住密码
    _m.rememberMe = function () {
        $(document).ready(function(){
            $('#login ul li .checked').removeClass('active');
            $('#login ul li .checked i').text('check_box_outline_blank');
            if($.cookie("password")!="null"&&$.cookie("password") != ''&&$.cookie("password")){
                $("input[name='password']").val($.cookie("password"));
            }
            if($.cookie("name")!='null'&&$.cookie("name")!= ''&&$.cookie("name")){
                $("input[name='username']").val($.cookie("name"));
                 $('#login ul li .checked').addClass('active');
                $('#login ul li .checked i').text('check_box');
            }
        })
        $('#login ul li p').unbind('click').bind('click',function () {
            $('#login ul li .checked').trigger('click');
        })
        $('#login ul li .checked').unbind('click').bind('click',function (e) {
            //防止浏览器默认行为(W3C)
            if(e && e.preventDefault){
                e.preventDefault();
            }
            //IE中组织浏览器行为
            else{
                window.event.returnValue=fale;
                return false;
            }
            if( $(this).hasClass('active')){
                $(this).removeClass('active');
                $('#login ul li .checked i').text('check_box_outline_blank');
                $.cookie("name",null,{ path: "/" });
                $.cookie("password",null,{ path: "/" });
            }else {
                $(this).addClass('active');
                $('#login ul li .checked i').text('check_box');
                var name = $("input[name='username']").val();
                var password = $("input[name='password']").val();
                $.cookie("name",name,{expires:365,path:'/'});
                $.cookie("password",password,{expires:365,path:'/'});
            }
        })
    }
    //切换登录和下载app
    _m.switch=function () {
        $('#appDownlod').unbind('click').bind('click',function () {
           $('#login .logoWrap').toggleClass('active');
           if($('#login .logoWrap').hasClass('active')){
               $('#appDownlod').text('登录School');
           }else {
               $('#appDownlod').text('下载App');
           }
        })
    }
    return _m;
})();
    login.init();
})

