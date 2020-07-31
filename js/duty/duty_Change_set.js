layui.use(['layer', 'form', 'element','laydate'], function() {
    layer = parent.layer === undefined ? layui.layer : top.layer
    form = layui.form;
    laydate = layui.laydate;
    var NowDate = new Date();
    laydate.render({
        elem: '#form_time',//指定元素
        min : 'NowDate'
    });
    laydate.render({
        elem: '#to_time',//指定元素
        min : 'NowDate',
        done: function(value, date, endDate){
            duty_Change_set.getTeacher(value);
        }
    });
    duty_Change_set = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            self.submit();
        }
        //获取目标老师
        _m.getTeacher = function (time) {
            if(time){
                var times=new Date(time+' 00:00:00').getTime();
                var params={
                    token:token,
                    faid:userId,
                    time:times
                }
                $.axse(urls+'/duty/getDuty.action',params,function(result){
                    var data=result.data;
                    var dom="<option value=''>请选择目标教师</option>"
                    for(var i=0;i<data.length;i++){
                        dom+="<option value='"+data[i].teacher.id+"'>"+data[i].teacher.rname+"</option>"
                    }

                    $('select[name="to_teacher_account_id"]').html(dom);
                    form.render();
                })
            }else {
                $('select[name="to_teacher_account_id"]').html("<option value=''>请选择目标教师</option>");
                form.render();
            }

        }
        //提交
        _m.submit = function () {
            form.on('submit(formDemo)', function(data) {
                var that = $(this);
                if($(this).hasClass('NoClick')){
                    return;
                }
                var params={
                    token:token,
                    faid:userId,
                    form_time:new Date(data.field.form_time.replace(/-/g,"/")+' 00:00:00').getTime(),
                    to_time:new Date(data.field.to_time.replace(/-/g,"/")+' 00:00:00').getTime(),
                    to_teacher_account_id:data.field.to_teacher_account_id,
                }

                tool().Switched_Roles('images1/Score.png','确定提交本次申请',function () {
                    self.ajax(params,that)
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
            $.axse(urls+'/dutyImprove/exchange.action',params,function(result){
                that.removeClass('NoClick');
                $('.fading-circle').remove();
                // top.layui.layer.close(loadings);
                sl_Mask.YesTip('提交成功');
                $('input[name="form_time"]').val('');
                $('input[name="to_time"]').val('');
                $('select[name="to_teacher_account_id"]').val('')
                form.render();
            },function () {
                that.removeClass('NoClick');
                $('.fading-circle').remove();
                // top.layui.layer.close(loadings);
            })
        }
        return _m;
    })();
    duty_Change_set.init();
})