layui.use(['layer', 'form', 'element','laydate'], function() {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element
    var stay_state = (function () {
        var _m={};
        var self=_m;
        //初始化
        _m.init=function () {
            self.agreeMsg();
            self.NoAgreeMsg();
        }
        //查看图片
        //审批弹框
        _m.agreeMsg = function () {
            //新建评比项目
            $('#AgreeBtn').unbind('click').bind('click', function () {
                var ids= $(this).attr('data-id');
                var index = top.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shadeClose: false,
                    area: ['400px', '300px'],
                    content: '<div style="padding:30px 30px 50px;color:#000000;opacity:0.87;position:relative;padding-bottom: 27px" class="layui-form">' +
                    '<i class="layui-icon layui-icon-close closeBtn" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;">&#x1006;</i> '+
                    '<div style="height: 80px;margin-bottom: 25px;width: 80px;margin: 0 auto;margin-top: 10px;"><img src="images1/passIcon.png" alt=""width="100%"height="100%"></div>'+
                    '<p style="margin:50px 20px 23px;"><input type="text"style="border: none;border-bottom: 2px solid #bdbdbd;width: 300px;line-height: 35px;height: 35px;" placeholder="请输入备注内容" name="des"></p>'+
                    '<div class="yesTip"style="width:300px;text-align:center;line-height:35px;color:#ffffff;cursor: pointer;background:#2387f9;margin: 0 auto;" lay-filter="formDemo" lay-submit>通过<div>' +
                    '</div>',
                    success: function(layero, index) {
                        top.layui.form.on('submit(formDemo)', function(data){
                            self.agree(data.field,ids,index);
                        })
                        $(layero).find('.closeBtn').unbind('click').bind('click', function() {
                            top.layer.close(index);
                        })
                    }
                })
            })
        }
        //驳回弹框
        _m.NoAgreeMsg = function () {
            //新建评比项目
            $('#NoAgree').unbind('click').bind('click', function () {
                var ids= $(this).attr('data-id');
                var index = top.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shadeClose: false,
                    area: ['400px', '300px'],
                    content: '<div style="padding:30px 30px 50px;color:#000000;opacity:0.87;position:relative;padding-bottom: 27px" class="layui-form">' +
                    '<i class="layui-icon layui-icon-close closeBtn" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;">&#x1006;</i> '+
                    '<div style="height: 80px;margin-bottom: 25px;width: 80px;margin: 0 auto;margin-top: 10px;"><img src="images1/passIcon.png" alt=""width="100%"height="100%"></div>'+
                    '<p style="margin:50px 20px 23px;"><input type="text"style="border: none;border-bottom: 2px solid #bdbdbd;width: 300px;line-height: 35px;height: 35px;" placeholder="请输入备注内容" name="des"></p>'+
                    '<div class="yesTip"style="width:300px;text-align:center;line-height:35px;color:#ffffff;cursor: pointer;background:#ff4747;margin: 0 auto;" lay-filter="formDemo" lay-submit>驳回<div>' +
                    '</div>',
                    success: function(layero, index) {
                        top.layui.form.on('submit(formDemo)', function(data){
                            self.NoAgree(data.field,ids,index);
                        })
                        $(layero).find('.closeBtn').unbind('click').bind('click', function() {
                            top.layer.close(index);
                        })
                    }

                })


            })


        }
        //审批通过
        _m.agree = function (data,id,index) {
            var des=data.des;
            var params= {
                token:token,
                faid:userId,
                id:id,       //请假id
                agree:1
            }
            if(des){
                params.des = des;
            }
            self.ajax(params,index);
        }
        //驳回
        _m.NoAgree = function (data,id,index) {
            var des=data.des;
            var params = {
                token:token,
                faid:userId,
                id:id,       //请假id
                agree:-1
            }
            if(des){
                params.des =  des;
            }
            self.ajax(params,index);
        }
        //审批的ajax
        _m.ajax = function (params,index) {
            var loadings= top.layui.layer.load(2);
            setTimeout(function () {
                top.layui.layer.close(loadings);
            }, 3000)
            $.axse(urls+'/leave/examine.action',params,function(result){
                top.layui.layer.close(loadings);
                sl_Mask.YesTip('提交成功');
                top.layer.close(index);
                $('.AgreeWrap').hide();
                leave_Mask().fill($('#stay_state'),params.id);
            },function () {
                top.layui.layer.close(loadings);
            })
        }

        return _m;
    })();
    stay_state.init();
})