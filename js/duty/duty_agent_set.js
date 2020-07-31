layui.use(['layer', 'form', 'element','laydate','tree'], function() {
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        form = layui.form,
        laydate = layui.laydate
    var NowDate = new Date();
    laydate.render({
        elem: '#time',//指定元素
        min : 'NowDate'
    });
    duty_mask().getTeacher($('#duty_Change_set'),"","请选择代班教师");
    duty_Change_set=(function () {
        var _m = {};
        var self = _m;
        _m.init = function () {
            self.sumbit();
        }
        //提交
        _m.sumbit = function () {
            form.on('submit(formDemo)', function(data) {
                var that = $(this);
                if($(this).hasClass('NoClick')){
                    return;
                }
                var params = {
                    token:token,
                    faid:userId,
                    time:new Date(data.field.time.replace(/-/g,"/")+' 00:00:00').getTime(),
                    new_teacher_account_id:data.field.teacher_account_id
                }
                tool().Switched_Roles('images1/Score.png','确定提交本次申请',function () {
                    self.ajax(params,that);
                })
            })
        }
        _m.ajax = function (params,that) {
            // var loadings= top.layui.layer.load(2);
            // setTimeout(function () {
            //     top.layui.layer.close(loadings);
            // }, 3000)
            that.addClass('NoClick');
            tool().onClick(that);
            $.axse(urls+'/dutyImprove/replace.action',params,function(result){
                that.removeClass('NoClick');
                $('.fading-circle').remove();
                // top.layui.layer.close(loadings);
                sl_Mask.YesTip('提交成功');
                $('input[name="time"]').val('');
                $('select[name="teacher_account_id"]').val('')
                form.render();
            },function () {
                that.removeClass('NoClick');
                $('.fading-circle').remove();
                // top.layui.layer.close(loadings);
            })
        }
        return _m;
    })()
    duty_Change_set.init();
})