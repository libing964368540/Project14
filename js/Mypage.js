var Information = null;
var MyPage = (function () {
    var  _m={};
    var  self=_m;
    //初始化
    _m.init=function () {
        self.getuserInfo();
        self.modifypassword();
    }
    //重构代码我的页面获取个人信息的思路
    _m.getuserInfo=function () {
        var params={
            token:token,
            faid:userId,
            taid:userId
        }
        var loadings= top.layui.layer.load(2);
        $.axse(urls+onestudentList,params,function(result){
            top.layui.layer.close(loadings);
            var data= result.data;
            var userInformation = new PersonalInformation(data,$('#edit'));
                userInformation.fillPhoto();//填充头像
            var identity_id = sessionStorage.identity_id;
            if(identity_id==6){//学生
                var dom = userInformation.fillStudentMessageTosee();
            }else if(identity_id==7){//家长
                var dom = userInformation.fillFamilyMessageTosee();
            }else {//其他
                var dom = userInformation.fillTeacherMessageTosee();
            }
            $('#edit').find('.basic_M ul').append(dom);
            $('#edit').find('#editBtn').attr('data-taid',userId);
            userInformation.powerTosee();
            userInformation.PostTosee();
            var maskForuser = new MaskForSeePersonalInformation(data, $('#edit').find('#editBtn'))
        },function () {
            top.layui.layer.close(loadings);
        })
    }
    //修改密码
    _m.modifypassword = function () {
        $('#edit .ResetPassword').unbind('click').bind('click',function () {
            var index = top.layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                shadeClose: true,
                skin: 'school_Msg',
                content: '<div class="school_Msg layui-form" style="padding:0 30px;height:100%;position:relative;">' +
                '<p class="titles" style="padding:30px 0 20px;color:#010101;border:1px solid transparent;font-size: 20px;font-weight: bold;">密码设置</p>' +
                '<div class="school_Msgcontnet" style="padding:20px 0 0">' +
                '<ul><li style="padding-bottom: 15px"><input type="password" placeholder="输入原密码" class="layui-input" style="background:#f3f5f8;border: none"lay-verify="required" name="lpw"></li><li style="padding-bottom: 15px"><input type="password" placeholder="输入新密码" class="layui-input" style="background:#f3f5f8;border: none" name="newpassword" lay-verify="required"></li><li><input type="password" placeholder="重复新密码" class="layui-input" id="L_repass"style="background:#f3f5f8;border: none" name="npw" lay-verify="required"></li></ul>' +
                '</div>' +
                '<div class="school_MsgBtn" style="position: absolute;bottom:0;left:0;width:100%;line-height:50px;text-align:center;color:#2488fa;background:#f4f4f4;cursor: pointer;" lay-filter="formDemo" lay-submit>确认修改</div>' +
                '</div>',
                area: ['350px', '330px'],
                success: function (layor,index) {
                    top.layui.form.render();
                    top.layui.form.on('submit(formDemo)', function(data){
                        var newpassword = data.field.newpassword;
                        var repeatpassword = data.field.npw;
                        var lpw=data.field.lpw;
                        if(newpassword==repeatpassword){
                            var taid = $('.ResetPassword').attr('data-taid');
                            var npw = data.field.npw
                            self.modifypasswordajax(npw,lpw,index);
                        }else {
                            top.layer.msg('新密码和确认密码输入不一致');
                        }
                    })
                }
            })
        })

    }
    //修改密码接口
    _m.modifypasswordajax = function (npw,lpw,index) {
        var params ={
            faid:userId,
            token:token,
            taid:userId,
            npw:npw,
            lpw:CryptoJS.MD5(lpw).toString()
        }
        $.axse(urls+'/account/modificationPassword.action',params,function(result){
            if(result.error){
                layer.msg('<i class="material-icons msgIconStyleFail">cancel</i>' + result.error.message, {
                    skin: 'msgStyle',//skin属性可以将layer的标签提取出来，重新定义样式
                });
            }else {
                top.layer.msg('<i class="material-icons msgIconStyle">check_circle</i>' + '修改成功', {
                    skin: 'msgStyle'//skin属性可以将layer的标签提取出来，重新定义样式
                });
                top.layer.close(index);
            }
        },function () {

        })
    }

    return _m;
})()
MyPage.init();