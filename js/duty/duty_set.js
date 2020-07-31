//Demo
layui.use(['layer', 'form', 'element', 'laydate','upload'], function() {
    var layer = layui.layer,
        form = layui.form,
        element = layui.element,
        laydate = layui.laydate
    laydate.render({
        elem: '#s_time'
        ,type: 'time'
    });
    laydate.render({
        elem: '#e_time'
        ,type: 'time'
    });
    var Push_Message = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            self.get();
            self.sumbit();
        }
        //提交推送
        _m.sumbit = function () {
            form.on('submit(formDemo)', function(data) {
                if($(this).hasClass('NoClick')){
                    return;
                }
                if(data.field.day<0){
                    sl_Mask.NoTip('提前天数天数有误');
                    return;
                }
                var params={
                    token:token,
                    faid:userId,
                    day:data.field.day,
                    push_time:new Date('2018/11/09 '+data.field.push_time).getTime(),
                    sign_time:new Date('2018/11/09 '+data.field.sign_time).getTime(),
                    push_content:data.field.push_content,
                    sign_content:data.field.sign_content
                }
                self.sumbit_ajax(params,$(this));
            })
        }
        _m.sumbit_ajax = function (params,that) {
            tool().Switched_Roles('images1/Score.png','确定修改本次值班提醒设置？',function () {
                // var loadings= top.layui.layer.load(2);
                that.addClass('NoClick');
                tool().onClick(that);
                return
                $.axse(urls + '/duty/modificationConfiguration.action', params, function (result) {
                    that.removeClass('NoClick');
                    $('.fading-circle').remove();
                    // top.layui.layer.close(loadings);
                    sl_Mask.YesTip('提交成功');
                },function () {
                    that.removeClass('NoClick');
                    $('.fading-circle').remove();
                    // top.layui.layer.close(loadings);
                })
            })
        }
        //获取推送
        _m.get = function () {
            var params={
                token:token,
                faid:userId
            }
            $.axse(urls + '/duty/getPushConfiguration.action', params, function (result) {
//                       console.log(result);
                var data=result.data;
                var datas={
                    day:data.day,
                    time:data.time,
                    push_content:data.push_content,
                    sign_content:data.sign_content,
                    push_time:tool().getSmpFormatDateByLong(data.push_time,true).split(' ')[1],
                    sign_time:tool().getSmpFormatDateByLong(data.sign_time,true).split(' ')[1]
                }
                for(var i in datas){
                    $('#leaveprocess .'+ i).val(datas[i]);
                }
            })
        }
        return _m;
    })();
    Push_Message.init();
});