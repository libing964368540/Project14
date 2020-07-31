duty_mask = function () {
    var _m = {};
    var self = _m;
    //新增值班弹框
    _m.teacher_Work_Add = function (that) {
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>值班设置<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>新增值班</a>",
            type: 2,
            content: "duty_Add.html",
            area: ['100%', '100%'],
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                var time = that.attr('data-time');
                body.find('.time').val(time);
            },
            cancel: function (layero, index) {
                mainPage.all_table($('#addOverTime').attr('data-time'));
            }
        })
    }
    //班级值班弹框
    _m.teacher_Work_edit = function (that) {
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>值班设置<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>编辑值班</a>",
            type: 2,
            content: "duty_edit.html",
            area: ['100%', '100%'],
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                var iframeWins = layero.find('iframe')[0].contentWindow;     // 新iframe窗口的对象
                var time = that.attr('data-time');
                var teacherId = that.attr('data-teacher')
                body.find('.time').val(tool().getSmpFormatDateByLong(parseInt(time),false));
                overtime_set().getTeacher(body,teacherId,iframeWins);
                body.find('.delBtn').attr('data-id',that.attr('data-id'));
                body.find('.des').val(that.attr('data-des'));
                // body.find('.classgrade_ids').val(that.attr('data-class_name'));
                // body.find('.chooseClass').val(that.attr('data-class_id'));
                // body.find('.oldstr').val(that.attr('data-class_id'));
                body.find('#Choice').attr('data-id',that.attr('data-class_id'));
                body.find('#Choice').attr('title',that.attr('data-class_name'));
                tool().fill_More_ToPage(that.attr('data-class_name').split('-'), body.find('#Choice'));
                body.find('.oldstr').val(that.attr('data-class_id'));
                body.find('.school_district_id').val(that.attr('data-school_district_id'));
                body.find('.type').val(that.attr('data-type'));
                // 重新渲染checkbox,select同理
                iframeWins.layui.form.render();
            },
            cancel: function (layero, index) {
                mainPage.all_table($('#addOverTime').attr('data-time'));
            }
        })
    }
    //获取全部教师
    _m.getTeacher = function (obj,value,tips,iframeWins) {
        var params={
            token: token,
            faid: userId,
            iids: '3-4-5',
            size:200
        }
        $.axse(urls+'/account/getAccountsStaff.action',params,function(result){
            var list=result.data.list;
            obj.find('select[name="teacher"]').empty();
            var dom="<option value=''>"+tips+"</option>";
            for(var i=0;i<list.length;i++){
                if(list[i].accountData.rname){
                    dom+='<option value='+list[i].id+'>'+list[i].accountData.rname+'</option>';
                }else {
                    dom+='<option value='+list[i].id+'>'+list[i].username+'</option>';
                }

            }
            obj.find('select[name="teacher_account_id"]').html(dom);
            if(iframeWins){
                iframeWins.layui.form.render();
                if(value){
                    obj.find('select[name="teacher_account_id"]').val(value);
                    iframeWins.layui.form.render();
                }
            }else{
                layui.form.render();
                if(value){
                    obj.find('select[name="teacher_account_id"]').val(value);
                    layui.form.render();
                }
            }
        })
    }
    return _m;
}