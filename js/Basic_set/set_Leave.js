layui.use(['layer', 'form', 'element','laydate'], function() {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element
    //请假审批设置
     var Leave_setting = (function () {
        var _m={};
        var self=_m;
        //初始化
        _m.init = function () {
           self.add();
           self.get();
           self.look();
        }
        //获取请假规则
        _m.get = function () {
            var params ={
                token:token,
                faid:userId
            }
            $.axse(urls+'/leave/getExamineConfiguration.action',params,function(result){
                    $('.roleWrap').empty();
                    var identities = result.data.identities;
                    var dom='';
                    if(identities&&identities.length>0){
                        for(var i=0; i<identities.length;i++){
                            dom+='<div class="school_Btn roleBtn"data-id='+identities[i].id+' data-identitiesId ='+identities[i].identity.id+' data-time='+identities[i].time+'><span >'+identities[i].identity.name+'</span><i class="material-icons del" style="font-size: 16px" data-id='+identities[i].id+'>clear</i></div>' +
                                '<i class="material-icons" style="vertical-align: middle;margin-right: 30px;color: #bdbdbd">keyboard_arrow_right</i>';
                        }
                        $('.roleWrap').append(dom);
                        $('.roleWrap .roleBtn').unbind('click').bind('click',function (e) {
                            //如果提供了事件对象，则这是一个非IE浏览器
                            if (e && e.stopPropagation) {
                                e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
                            }
                            else {
                                window.event.cancelBubble = true;//否则，我们需要使用IE的方式来取消事件冒泡
                                return false;
                            }
                              self.edit($(this));
                        })
                        $('.roleWrap .roleBtn .del').unbind('click').bind('click',function (e) {
                            //如果提供了事件对象，则这是一个非IE浏览器
                            if (e && e.stopPropagation) {
                                e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
                            }
                            else {
                                window.event.cancelBubble = true;//否则，我们需要使用IE的方式来取消事件冒泡
                                return false;
                            }
                            self.del($(this));
                        })

                        window.leavePostDay =identities[identities.length-1].time

                    }else {
                        window.leavePostDay = 0;
                    }
            })
        }
        //添加
        _m.add = function () {
            $('#account .wrap span.add').unbind('click').bind('click',function () {
                var index = top.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shadeClose: false,
                    skin:'add_director',
                    area: ['400px', 'auto'],
                    content: '<div style="padding:30px 50px 24px;color:#898989;position:relative"class="layui-form major_set">' +
                    '<p class="self_Mask_title" style="padding-bottom:20px;">添加审批人</p>' +
                    '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close" >&#x1006;</i> '+
                    '<div style="padding:20px 0 20px">' +
                    '<ul >' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">审批角色</label><select lay-verify="required" name="examine_identity_id" lay-filter="examine_identity_id" id="examine_identity_id" ></select></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">审批时长</label><input class="layui-input rg" type="number"  placeholder="请输入审批时长"style="width:220px;border: none;background: #f3f5f8;" lay-verify="required" name="time" ></li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>' +
                    '</div>',
                    success: function(layero, index) {
                         self.role($(layero));
                        top.layui.form.render();
                        //确定按钮
                        top.layui.form.on('submit(formDemo)', function(data){
                            if(parseFloat(data.field.time)*86400000<= window.leavePostDay){
                               sl_Mask.NoTip('审批时间不能小于等于下级审批的时间');
                               return;
                            }
                              var params={
                                  token:token,
                                  faid:userId,
                                  examine_identity_id:data.field.examine_identity_id,
                                  time:parseFloat(data.field.time)*86400000
                              }
                            $.axse(urls+'/leave/addExamineConfiguration.action',params,function(result){
                                    sl_Mask.YesTip('添加成功');
                                    top.layer.close(index);
                                    self.get();
                            })
                        });
                        //取消按钮
                        $(layero).find('.NoTip').unbind('click').bind('click',function () {
                            top.layer.close(index);
                        })

                    }
                })
            })


        }
        //获取角色ti
        _m.role = function (obj,value) {
          var params={
              token:token,
              faid:userId,
              group:2
          }
            $.axse(urls+IdentityList,params,function(result){
                  if(!result.error){
                     var dom='<option value="">请选择审批角色</option>';
                     var data=result.data;
                     for(var i=0;i<data.length;i++){
                         dom+='<option value='+data[i].id+'>'+data[i].name+'</option>'
                     }
                      obj.find('select[name="examine_identity_id"]').html(dom);
                      top.layui.form.render();
                      if(value){
                          obj.find('select[name="examine_identity_id"]').val(value);
                      }
                      top.layui.form.render();

                  }
            })

        }
        //编辑
        _m.edit = function (that) {
               var ids = that.attr('data-id');
               var identitiesId= that.attr('data-identitiesId');
               var time = that.attr('data-time')/86400000;
                var index = top.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shadeClose: false,
                    skin:'add_director',
                    area: ['400px', 'auto'],
                    content: '<div style="padding:30px 50px 24px;color:#898989;position:relative"class="layui-form major_set">' +
                    '<p class="self_Mask_title"style="padding-bottom:20px;">编辑审批人</p>' +
                    '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close" >&#x1006;</i> '+
                    '<div style="padding:20px 0 20px">' +
                    '<ul >' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">审批角色</label><select lay-verify="required" name="examine_identity_id" lay-filter="examine_identity_id" id="examine_identity_id" ></select></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">审批时长</label><input class="layui-input rg" type="number"  placeholder="请输入审批时长"style="width:220px;border: none;background: #f3f5f8;" lay-verify="required" name="time" value='+time+'></li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>' +
                    '</div>',
                    success: function(layero, index) {
                        self.role($(layero),identitiesId);
                        top.layui.form.render();
                        //确定按钮
                        top.layui.form.on('submit(formDemo)', function(data){
                            var params={
                                token:token,
                                faid:userId,
                                examine_identity_id:data.field.examine_identity_id,
                                time:parseFloat(data.field.time)*86400000,
                                examine_id:ids
                            }
                            self.editAjax(params,index);
                        });
                        //取消按钮
                        $(layero).find('.NoTip').unbind('click').bind('click',function () {
                            top.layer.close(index);
                        })

                    }
                })
        }
        //删除
        _m.del = function (that) {
              var ids = that.attr('data-id');
            tool().Switched_Roles('images1/del.png',' 确定移除此配置？', function() {
                 var params={
                     token:token,
                     faid:userId,
                     examine_id:ids
                 }
                $.axse(urls+'/leave/removeExamineConfiguration.action',params,function(result){
                        sl_Mask.YesTip('删除成功');
                        self.get();

                })
            })
        }
        //编辑调用的函数
        _m.editAjax = function (params,index) {
            $.axse(urls+'/leave/modificationExamineConfiguration.action',params,function(result){
                     sl_Mask.YesTip('修改成功');
                     top.layer.close(index);
                     self.get();

            })
        }
        //查看流程检查
         _m.look = function () {
            var flag = true;
            $('.ProcessBtn').unbind('click').bind('click',function () {
                if(flag){
                    flag=false;
                    setTimeout(function () {
                        flag=true;
                    },2000)
                    var params ={
                        token:token,
                        faid:userId
                    }
                    $.axse(urls+'/leave/getExamineConfiguration.action',params,function(result){
                        var identities = result.data.identities;
                        var arr=[];
                            for(var i=0;i<identities.length;i++){
                                arr.push({
                                    roles:identities[i].identity.name,
                                    time:identities[i].time/86400000
                                })
                            }
                        self.look_Mask(arr);
                    })
                }else {
                    sl_Mask.NoTip('您点击过快，请2秒后再试');
                }

            })

         }
         //查看流程检查弹框
         _m.look_Mask = function (arr) {
                 var index = top.layer.open({
                     type: 1,
                     title: false,
                     closeBtn: 0,
                     shadeClose: false,
                     skin:'add_director',
                     area: ['400px', 'auto'],
                     content: '<div style="padding:30px 50px 24px;color:#898989;position:relative"class="layui-form major_set">' +
                     '<p class="self_Mask_title" style="padding-bottom:20px;">请假审批流程</p>' +
                     '<div style="padding:20px 0 20px">' +
                     '<ul style="height: 250px;overflow-y: auto">' +
                     '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">审批角色</label><select lay-verify="required" name="examine_identity_id" lay-filter="examine_identity_id" id="examine_identity_id" ></select></li>' +
                     '</ul>' +
                     '</div>' +
                      '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>' +
                     '</div>',
                     success: function(layero, index) {
                         var dom=""
                         if(arr.length>0){
                            for(var i=0;i<arr.length;i++){
                               dom+='<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">'+arr[i].roles+'</label><input class="layui-input rg" type="text" placeholder="请输入专业编号" style="width:220px;border: none;border-radius: 0;" name="number" lay-verify="required" value="'+arr[i].time+' 天" readOnly></li>'
                            }
                         }
                         $(layero).find('ul').html(dom);
                         //确定按钮
                         top.layui.form.on('submit(formDemo)', function(data){
                             top.layer.close(index);
                         });

                     }
                 })
         }
        return _m;
    })();
    Leave_setting.init();
})