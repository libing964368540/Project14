layui.use(['layer', 'form', 'element','laydate'], function() {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element
        , laydate = layui.laydate
     sleephome_back_setting=(function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            self.add();
            self.edit();
        }
        //添加学生
        _m.add = function () {
            $('.addBtn').unbind('click').bind('click', function () {
                var that = $(this);
                var dormitory_C_S = new dormitory_choose_student({
                    obj: that,
                    url: Get_classStudent,
                    treeType:1,
                    fn: function (data) {
                        var params = {
                            faid: userId,
                            token: token,
                            student_account_id: data,
                            competition_id: that.attr('data-competition_id')
                        }
                        $.axse(urls + '/competition/addStudent.action', params, function (result) {
                            seat_Mask().match_project_GetStudent($('#account'), that.attr('data-competition_id'));
                            sl_Mask.YesTip('添加成功');
                        })

                    }
                })
            })
        }
        //编辑竞赛项目
        _m.edit = function () {
            $('.editBtn').unbind('click').bind('click',function () {
                var that=$(this);
                var index = top.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shadeClose: false,
                    skin:'add_director',
                    area: ['400px', 'auto'],
                    content: '<div style="padding:30px 50px 24px;color:#898989;position:relative"class="layui-form major_set">' +
                    '<p class="self_Mask_title" style="padding-bottom:20px;">编辑竞赛项目</p>' +
                    '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close">&#x1006;</i> '+
                    '<div style="padding:20px 0 20px">' +
                    '<ul >' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">竞赛项目</label><input class="layui-input rg name" type="text"  placeholder="请输入专业部名称"style="width:220px;border: none;background: #f3f5f8;" lay-verify="required"  name="name"></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">竞赛类型</label><select lay-verify="required"name="account_ids"lay-filter="account_ids" class="type"><option value="">选择竞赛类型</option><option value="0">活动</option><option value="1">竞赛</option></select></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">开始时间</label><input class="layui-input rg stime" type="text"  placeholder="请选择开始时间"style="width:220px;border: none;background: #f3f5f8;" lay-verify="required" id="s_time"name="stime" readonly></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">结束时间</label><input class="layui-input rg etime" type="text"  placeholder="请选择结束时间"style="width:220px;border: none;background: #f3f5f8;" lay-verify="required" id="e_time"name="etime" readonly></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">指导老师</label><select lay-verify="required"name="teacher_account_id" class="account_id" lay-search=""></select></li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>' +
                    '</div>',
                    success: function(layero,index) {
                        StartEndTime.topGet($(layero));
                        top.layui.form.render();
                        seat_Mask().getTeacher($(layero),that.attr('data-teacher'));
                        seat_Mask().match_project_GetStudent($(layero),that.attr('data-competition_id'),1);
                        top.layui.form.render();
                        //确定按钮
                        top.layui.form.on('submit(formDemo)', function(data){
                            var param={
                                faid:userId,
                                token:token,
                                stime:new Date(data.field.stime.replace(/-/g, "/")+' 00:00:00').getTime(),
                                etime:new Date(data.field.etime.replace(/-/g, "/")+' 00:00:00').getTime(),
                                type:data.field.type,
                                teacher_account_id:data.field.teacher_account_id,
                                name:data.field.name,
                                competition_id:that.attr('data-competition_id')
                            }
                            $.axse(urls+'/competition/modification.action',param,function(result){
                                seat_Mask().match_project_GetStudent($('#account'),that.attr('data-competition_id'));
                                sl_Mask.YesTip('编辑成功');
                                top.layer.close(index);
                            },function () {
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
        return _m;
    })();
    sleephome_back_setting.init();
})