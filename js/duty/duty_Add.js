layui.use(['layer', 'form', 'element','laydate','tree'], function() {
    layer = parent.layer === undefined ? layui.layer : top.layer
    form = layui.form
    overtime_set().getTeacher($('#student_Score'));
    var pp1= new choose_Student('Choice',{
        url:'/classgrade/getClassgrades.action',
        field:1,
        title:'选择班级',
        treeType:1   //以年级tree为开头
    },2);
    var dutyAdd =(function () {
        var _m = {};
        var self= _m;
        //初始化
        _m.init = function () {
            self.sumbit();
        }
        //提交
        _m.sumbit = function () {
            form.on('submit(formDemo)', function(data) {
                classgrade_ids=$('#Choice').attr('data-id');
                if(!classgrade_ids){sl_Mask.NoTip('请选择班级'); return}
                var params={
                    token:token,
                    faid:userId,
                    time:new Date(data.field.time.replace(/-/g,"/")+" 00:00:00").getTime(),
                    teacher_account_id:data.field.teacher_account_id,
                    type:data.field.type,
                    classgrade_ids:classgrade_ids,
                    school_district_id:data.field.school_district_id
                }
                if(data.field.des){
                    params.des=data.field.des;
                }
                self.create(params);
            })
        }
        _m.create = function (params) {
            tool().Switched_Roles('images1/Score.png','确定提交本次值班申请',function () {
                var loadings= top.layui.layer.load(2);
                $.axse(urls + '/duty/create.action', params, function (result) {
                    top.layui.layer.close(loadings);
                    sl_Mask.YesTip('提交成功');
                    //清空内容
                    $('select[name="teacher_account_id"]').val('')
                    $('select[name="type"]').val('')
                    $('.beizhu').val('');
                    $('#Choice').attr('data-id','');
                    $('#Choice').attr('title','');
                    $('#Choice').html('').text('请选择班级');
                    layui.form.render();
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);//关闭当前页
                    parent.mainPage.all_table(parent.$('#addOverTime').attr('data-time'));
                },function () {
                    top.layui.layer.close(loadings);
                })
            })
        }
        return _m;
    })();
    dutyAdd.init();
})