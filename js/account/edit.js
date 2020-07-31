layui.use(['layer', 'form', 'element','laydate'], function(){
   var layer = parent.layer === undefined ? layui.layer : top.layer
    laydate =layui.laydate
    form = layui.form
    laydate.render({
        elem: '#birthday' //指定元素
    });
    var dom_post ="<div class='publicMsg' style='padding-bottom: 40px'>"+
        "<div class='title clear'>"+
        "<p class='lf'style='color: #010101;font-size: 20px;font-weight: bold'>添加岗位</p>"+
        "<div class='rg'>"+
        "<span class='yesBtn layui-layer-btn0'style='vertical-align: bottom;margin-top: 8px'>确认添加</span>"+
        "<span class='NoBtn layui-layer-btn1'style='vertical-align: bottom;margin-top: 8px;padding-right: 0;'>取消</span>"+
        "</div>"+
        "</div>"+
        "<div class='PostBtn' style='width: 530px'>"+
        // "<p style='font-size:12px;color:#c9c9c9;padding-top:10px;'>已选择1个岗位</p>"+
        "</div>"+

        "<div class='title clear' >"+
        "<p class='lf' style='width:100%'>创建新的岗位</p>"+

        "</div>"+
        "<div style='overflow: hidden;'><input type='text' placeholder='请在此输入新的岗位名称'style='width:425px' name='name'><span class='create school_Btn'style='width: 94px'>确认创建</span></div>"

    "</div>";
    var dom = "<div class='publicMsg'>"+
        "<div class='title clear'>"+
        "<p class='lf'style='color: #010101;font-size: 20px;font-weight: bold'>账户权限</p>"+
        "<div class='rg'>"+
        "<span class='yesBtn layui-layer-btn0' style='margin-top: 8px'>确认添加</span>"+
        "<span class='NoBtn layui-layer-btn1' style='margin-top: 8px'>取消</span>"+
        "</div>"+
        "</div>"+
        "<div class='PostBtn'style='width: 558px'>"+
        "</div>"+
    "</div>";

    $('#addPost').unbind('click').bind('click',function(){
        var index = top.layer.open({
            type:1,
            title:false,
            closeBtn:0,
            skin:'',
            shadeClose: false,
            content:dom_post,
            area: ['600px','auto'],
            success:function(layero,index){
                  $(layero).find('.layui-layer-content').css('height','auto')
                //获取系统岗位
                  edit.getUserPost( $(layero).find('.PostBtn'));
                //创建岗位
                $(layero).find('.create').unbind('click').bind('click',function () {
                         var val1 =$(layero).find('input[name="name"]').val();
                    if($.trim(val1)){
                        edit.createUserPost(val1,$(layero).find('.PostBtn'));
                    }else{
                        sl_Mask.NoTip('请输入要创建的内容');
                    }
                })
                //确认添加事件
                var flag=true
                $(layero).find('.yesBtn').unbind('click').bind('click',function(){
                    if(flag){
                        flag=false;
                        var taid = $('#addpower').attr('data-taid');
                        var postid = $(layero).find('.PostBtn button.blue').attr('data-id');
                        edit.addUserPost(taid,postid,index);
                    }else {
                        sl_Mask.NoTip('您点击过快，请2秒后再试')
                    }
                })
                //取消
                $(layero).find('.NoBtn').unbind('click').bind('click',function(){
                    top.layer.close(index);
                })
            }
        })
    });
     $('#addpower').unbind('click').bind('click',function(){
        var index = top.layer.open({
            type:1,
            title:false,
            closeBtn:0,
            skin:'yourClass',
            shadeClose: false,
            content:dom,
            area: ['620px','280px'],
            success:function(layero,index){
                var group =  $('#addpower').attr('data-group');
                edit.getidentitys(layero,group);
                //确认添加事件
                $(layero).find('.yesBtn').unbind('click').bind('click',function(){
                    var iid='';
                    var taid=$('#addpower').attr('data-taid');
                    var params={
                        faid:userId, // 操作ID
                        token:token, //操作token
                        taid:taid,  //目标ID
                        add:1  // 添加／删除 0删除 1添加
                    }
                    var ids=$(layero).find('.PostBtn button.blue').attr('data-id');
                    params.iids=ids;
                    $.axse(urls+'/identity/addidentityForAccount.action',params,function(result){
                               var data = result.data[0];
                               var dom="<li class='lf del addEle'><button class='layui-btn del magLeft10 magLeft0' >"+data.name+"<i class='material-icons'style='font-size: 16px' data-id="+data.id+">clear</i></button></li>"
                               $('.powerParents').prepend(dom);
                               $('.powerParents li.del.addEle i').unbind('click').bind('click',function (e) {
                                   //如果提供了事件对象，则这是一个非IE浏览器
                                   if (e && e.stopPropagation) {
                                       e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
                                   }
                                   else {
                                       window.event.cancelBubble = true;//否则，我们需要使用IE的方式来取消事件冒泡
                                       return false;
                                   }
                                   if($('.powerParents li.del').length==1){
                                       sl_Mask.NoTip('权限唯一时不能删除');
                                       return;
                                   }else {
                                       edit.Delpower($(this));
                                   }
                               })


                    },function () {

                    })
                    top.layer.close(index);
                })

                //取消
                $(layero).find('.NoBtn').unbind('click').bind('click',function(){
                    top.layer.close(index);
                })
            }

        })
    })
})

var edit=(function () {
    var _m={};
    var self=_m;
    //初始化
    _m.init=function () {
        self.againPassword();
    }
    //获取身份列表
    _m.getidentitys = function (layero,group) {
        var params = {
            faid:userId,
            token:token,
            group:group
        }
        var loadings= top.layui.layer.load(2);
        $.axse(urls+'/identity/getidentitys.action',params,function(result){
            top.layui.layer.close(loadings);
            var data=result.data;
            var dom="";
                for(var i=0;i<data.length;i++){
                    dom+="<button class='layui-btn gray magb15 magLeft10 magLeft0' data-id="+data[i].id+">"+data[i].name+"</button>"
                }
            $(layero).find('.PostBtn').append(dom);
            $(layero).find('.PostBtn button').unbind('click').bind('click',function(){
                $(layero).find('.PostBtn button').removeClass('blue').addClass('gray');
                $(this).removeClass('gray').addClass('blue');
            })
        },function () {
            top.layui.layer.close(loadings);
        })
    }
    //删除权限
    _m.Delpower =function (that) {
        tool().Switched_Roles('images1/del.png',' 确定移除此权限？', function() {
            var iid = that.attr('data-id');
            var taid = $('#addpower').attr('data-taid');
            var params = {
                faid: userId, // 操作ID
                token: token, //操作token
                iids: iid,   //目标身份
                taid: taid,  //目标ID
                add: 0  // 添加／删除 0删除 1添加
            }
            var loadings= top.layui.layer.load(2);
            $.axse(urls + '/identity/addidentityForAccount.action', params, function (result) {
                    top.layui.layer.close(loadings);
                    sl_Mask.YesTip('删除成功');
                    that.parent().parent().remove();
            }, function () {
                   top.layui.layer.close(loadings);
            })
        })
    }
    //获取岗位
    _m.getUserPost=function (obj) {
        var params={
              faid:userId,
              token:token
        }
        var loadings= top.layui.layer.load(2);
        $.axse(urls+'/post/getposts.action',params,function(result){
            top.layui.layer.close(loadings);
            var data=result.data;
            var dom="";
            for(var i=0;i<data.length;i++){
                dom+="<button class='layui-btn gray magb15 magLeft10 magLeft0' data-id="+data[i].id+">"+data[i].name+"</button>";
            }
            obj.prepend(dom);
            self.UserPostclick(obj);
        },function () {
            top.layui.layer.close(loadings);
        })
    }
    //创建岗位
    _m.createUserPost=function (name,obj) {
        var params={
            faid:userId,
            token:token,
            name:name      //岗位名称
        }
        var loadings= top.layui.layer.load(2);
        $.axse(urls+'/post/create.action',params,function(result){
                top.layui.layer.close(loadings);
                sl_Mask.YesTip('创建成功');
                var data=result.data;
               var dom="<button class='layui-btn gray magb15 magLeft10 magLeft0' data-id="+data.id+">"+data.name+"</button>";
                obj.prepend(dom);
                self.UserPostclick(obj);
        },function () {
            top.layui.layer.close(loadings);
        })
    }
    //给获取岗位和创建岗位动态添加事件
    _m.UserPostclick=function (obj) {
        obj.find('button').unbind('click').bind('click',function(){
            obj.find('button').removeClass('blue').addClass('gray');
            $(this).removeClass('gray').addClass('blue');
        })
    }
    //删除系统岗位
    _m.delsystemPost=function () {
        var params={
            faid:userId,
            token:token,
            postid:postid    //岗位id
        }
        $.axse(urls+'/post/remove.action',params,function(result){

        })
    }
    //删除账号岗位
    _m.deluserPost = function (that) {
        tool().Switched_Roles('images1/del.png','确定移除此岗位？',function() {
            var taid = $('#addPost').attr('data-taid');
            var postid = that.attr('data-id');
            var params = {
                faid: userId,
                token: token,
                taid: taid,
                postid: postid,
                iid: $('.powerParents').find('li.del').eq(0).attr('data-id'),
                add: 0
            }
            var loadings= top.layui.layer.load(2);
            $.axse(urls + '/post/addforaccount.action', params, function (result) {
                    top.layui.layer.close(loadings);
                    sl_Mask.NoTip('删除成功');
                    that.parent().parent().remove();
            })
        })
    }
    //添加岗位
    _m.addUserPost=function (taid,postid,index) {
        var params={
            faid:userId,
            token:token,
            taid:taid,
            postid:postid,
            iid:$('.powerParents').find('li.del').eq(0).attr('data-id')
        }
        var loadings= top.layui.layer.load(2);
        $.axse(urls+'/post/addforaccount.action',params,function(result){
            top.layui.layer.close(loadings);
                sl_Mask.YesTip('添加成功');
                 var dom = "";
                 $('.postParents .publicPost').remove();
                 var data = result.data;
                 for(var i=0;i<data.length;i++){
                     dom+="<li class='lf del addelem publicPost'><button class='layui-btn del' >"+data[i].name+"<i class='material-icons'style='font-size: 16px' data-id="+data[i].id+">clear</i></button></li>"
                 }
                 $('#addPost').before(dom);
                 $('.postParents li.del.addelem i').unbind('click').bind('click',function (e) {
                     //如果提供了事件对象，则这是一个非IE浏览器
                     if (e && e.stopPropagation) {
                         e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
                     }
                     else {
                         window.event.cancelBubble = true;//否则，我们需要使用IE的方式来取消事件冒泡
                         return false;
                     }
                     edit.deluserPost($(this));
                 })
                 top.layer.close(index);
        },function () {
            top.layui.layer.close(loadings);
        })
    }
    //重置密码
    _m.againPassword = function () {
        $('#edit .ResetPassword').unbind('click').bind('click',function () {
            tool().Switched_Roles('images1/againpassword.png', '确认重置此账户密码为123456？', function () {
                var said = $('.ResetPassword').attr('data-taid');
                var params = {
                    faid: userId,
                    token: token,
                    taid: said,
                    npw: '123456'
                }
                var loadings= top.layui.layer.load(2);
                $.axse(urls + '/account/modificationPassword.action', params, function (result) {
                        top.layui.layer.close(loadings);
                        sl_Mask.YesTip('修改成功');
                }, function () {
                        top.layui.layer.close(loadings);
                })
            })
        })
    }
    //弃用账号接口
    _m.removeUser = function (that) {
        var taid=that.attr('data-taid');
        var state=that.attr('data-state');
        if(state==1){
            tool().Switched_Roles('images1/out.png','确定弃用此账号？', function() {
                var params={
                    token:token,
                    faid:userId,
                    taid:taid,
                    recycle:0
                }
                $.axse(urls+'/account/recycle.action',params,function(result){
                       sl_Mask.YesTip('弃用成功');
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);//关闭当前页
                        parent.$('#table1').bootstrapTable('refresh');
                })
            })
        }else if(state==2){
            sl_Mask.NoTip('该账号已弃用');
        }else {
            sl_Mask.NoTip('请稍后再试');
        }

    }

 return _m;
})();
edit.init();