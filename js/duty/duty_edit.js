layui.use(['layer', 'form', 'element','laydate','tree'], function() {
    layer = parent.layer === undefined ? layui.layer : top.layer
    form = layui.form
    var pp1= new choose_Student('Choice',{
        url:'/classgrade/getClassgrades.action',
        field:1,
        title:'选择班级',
        treeType:1   //以年级tree为开头
    },2);
    var dutyEdit =(function () {
        var _m = {};
        var self= _m;
        //初始化
        _m.init = function () {
            self.sumbit();
            self.del();
        }
        //提交
        _m.sumbit = function () {
            form.on('submit(formDemo)', function(data) {
                var params={
                    token:token,
                    faid:userId,
                    time:new Date(data.field.time.replace(/-/g,"/")+' 00:00:00').getTime(),
                    teacher_account_id:data.field.teacher_account_id,
                    duty_id:$('.delBtn').attr('data-id'),
                    type:data.field.type,
                    school_district_id:data.field.school_district_id
                }
                if(data.field.des){
                    params.des=data.field.des;
                }
                if(self.filter_del()){
                    params.remove_classgrade_ids=self.filter_del();
                }
                if(self.filter_add()){
                    params.add_classgrade_ids=self.filter_add();
                }
                self.edit(params);
            })
        }
        _m.edit = function (params) {
            tool().Switched_Roles('images1/Score.png','确定修改本次值班申请',function () {
                var loadings= top.layui.layer.load(2);
                $.axse(urls + '/duty/modification.action', params, function (result) {
                    top.layui.layer.close(loadings);
                    sl_Mask.YesTip('修改成功');
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);//关闭当前页
                    parent.mainPage.all_table(parent.$('#addOverTime').attr('data-time'));
                },function () {
                    top.layui.layer.close(loadings);
                })
            })
        }
        //删除
        _m.del = function () {
            $('.delBtn').unbind('click').bind('click',function () {
                var ids=$(this).attr('data-id');
                tool().Switched_Roles('images1/out.png','确定删除值班？', function() {
                    var params = {
                        token: token,
                        faid: userId,
                        duty_id: ids
                    }
                    $.axse(urls + '/duty/remove.action', params, function (result) {
                        sl_Mask.YesTip('删除成功');
                        var index = parent.layer.getFrameIndex(window.name);
                        parent.layer.close(index);//关闭当前页
                        parent.mainPage.all_table(parent.$('#addOverTime').attr('data-time'));
                    })
                })
            })
        }
        //筛选出修改后被删除的班级
        _m.filter_del = function () {
            var oldstr=$('.oldstr').val();
//                var chooseClass=$('.chooseClass').val();
            var chooseClass = $('#Choice').attr('data-id').split('-');
            var arr=oldstr.split('-');
            var arr_del=[];
            for(var i=0;i<arr.length;i++){
                if(chooseClass.indexOf(arr[i])==-1){
                    arr_del.push(arr[i]);
                }
            }
            var delstr=arr_del.join('-');
            return delstr;

        }
        //筛选出添加的班级
        _m.filter_add = function () {
            var oldstr=$('.oldstr').val();
//                var newstr=$('.chooseClass').val();
            var newstr=$('#Choice').attr('data-id')
            var arr=[];
            var arr_old = oldstr.split('-');
            var arr_new = newstr.split('-');
            for(var i=0;i<arr_new.length;i++){
                for(var j=0;j<arr_old.length;j++){
                    if(arr_new[i]==arr_old[j]){
                        arr_new.remove(arr_new[i]);
                    }
                }
            }
            var addstr=arr_new.join('-');
            return addstr;
        }
        return _m;
    })();
    dutyEdit.init();

})