layui.use(['layer', 'form', 'element','laydate'], function() {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element
        , laydate = layui.laydate
    StartEndTime.get();
    //移除按钮
    //添加账户
    mainPage = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            self.all_table();
            self.add();
            self.keyword();
            self.time();
        }
        //生成表格
        _m.table = function (filed) {
            if(!filed.token||!sessionStorage.identity_id){
                tool().judge_token(function () {
                    parent.location.href=loginSrc;
                })
                return;
            }
            if(filed) $.extend(filed,pclogin);
            $('#account').find('#table1').bootstrapTable('destroy');
            $('#table1').bootstrapTable({
                url: urls + '/competition/getCompetition.action',
                queryParams: function (params) {
                    var obj={
                        size:params.limit,
                        page:params.offset/params.limit,
                    }
                    if(filed) $.extend(obj,filed);
                    return obj;
                },
                sidePagination: 'server',
                contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                method: 'POST',
                async:true,
                pagination: true,
                paginationLoop: false,
                pageNumber: 1,
                pageSize: 10,
                pageList: [10, 15, 25],
                striped:true,
                columns:
                    [{
                        field: '',
                        align: "center",
                        title: '序号',
                        width: '80px',
                        formatter: function (value, row, index) {
                            var pageSize=$('#table1').bootstrapTable('getOptions').pageSize;
                            //通过表的#id 可以得到每页多少条
                            var pageNumber=$('#table1').bootstrapTable('getOptions').pageNumber;
                            //通过表的#id 可以得到当前第几页
                            return pageSize * (pageNumber - 1) + index + 1;
                            //返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
                        }

                    },{
                        field: 'name',
                        align: "center",
                        title: '竞赛项目',
                        width: '180px',
                        formatter: function (value, row, index) {
                           var a=row.competition.name;
                           return a;
                        }
                    }, {
                        field: 'type',
                        align: "center",
                        title: '竞赛类型',
                        formatter: function (value, row, index) {
                            var arr=['活动','竞赛']
                            var a=arr[row.competition.type];
                            return a;
                        }
                    }, {
                        field: 'time',
                        align: "center",
                        title: '训练时间',
                        formatter: function (value, row, index) {
                            var etime=tool().getSmpFormatDateByLong(row.competition.etime,false)
                            var stime=tool().getSmpFormatDateByLong(row.competition.stime,false)
                            var a=stime+'至'+etime;
                            return a;
                        }
                    }, {
                        field: 'teacher',
                        align: "center",
                        title: '指导老师',
                        formatter: function (value, row, index) {
                            var a=row.teacher.rname;
                            return a;
                        }
                    }, {
                        field: 'sleep_number',
                        align: "center",
                        title: '操作',
                        formatter: function(value, row, index) {
                            var a='<a class="blue" data-id='+row.competition.id+' data-name='+row.competition.name+' onclick="seat_Mask().match_project_member($(this))">查看</a>';
                            return a;
                        }
                    }],
                responseHandler:function(result){
                    if(result.error){
                        if(400<=result.error.errorCode&&result.error.errorCode<=500){
                            tool().judge_token(function () {
                                parent.location.href=loginSrc;
                            })
                        }else {
                            sl_Mask.NoTip(result.error.message)
                            return {
                                "rows":'',
                                "total":''
                            }
                        }

                    }else{
                        return {
                            "rows":result.data.list,
                            "total":result.data.count
                        }
                    }
                },
                formatLoadingMessage: function(){
                    return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
                }
            })

        }
        //给学期表格传参
        _m.all_table = function () {
            var stime= new Date($("#s_time").val().replace(/-/g, "/")+' 00:00:00').getTime();
            var etime= new Date($("#e_time").val().replace(/-/g, "/")+' 00:00:00').getTime();
            var keyVal = $('#search').val();
            var params = {
                faid: userId,
                token: token
            }
            if(stime&&etime){ params.stime=stime; params.etime=etime};
            if($.trim(keyVal)){ params.keyword = keyVal};
            self.table(params);
        }
        //搜索
        _m.search = function () {
            var val1=$('#search').val();
            if($.trim(val1)){
                var params={
                    faid:userId,
                    token:token,
                    keyword:val1
                }
                self.table(params);
            }else{
                self.all_table();
            }
        }
        //键盘事件
        _m.keyword = function () {
            $(document).keyup(function(event) {
                var e=event||window.event;
                if(e.keyCode == 13) {
                    self.search();
                }
            });
        }
        //通过时间刷选
        _m.time = function () {
            $('#TimeSearch').unbind('click').bind('click',function () {
                var stime= new Date($("#s_time").val().replace(/-/g, "/")+' 00:00:00').getTime();
                var etime= new Date($("#e_time").val().replace(/-/g, "/")+' 00:00:00').getTime();
                if(stime&&etime){
                    var params = {
                        faid: userId,
                        token: token,
                        stime:stime,
                        etime:etime
                    }
                    self.table(params);
                }else {
                    self.all_table();
                }

            })
        }
        //添加
        _m.add = function () {
            $('.addBtn').unbind('click').bind('click',function () {
                var index = top.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shadeClose: false,
                    skin:'add_director',
                    area: ['400px', 'auto'],
                    content: '<div style="padding:30px 50px 24px;color:#898989;position:relative"class="layui-form major_set">' +
                    '<p class="self_Mask_title" style="padding-bottom:20px;">新增竞赛项目</p>' +
                    '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close">&#x1006;</i> '+
                    '<div style="padding:20px 0 20px">' +
                    '<ul >' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">竞赛项目</label><input class="layui-input rg" type="text"  placeholder="请输入专业部名称"style="width:220px;border: none;background: #f3f5f8;" lay-verify="required" name="name"></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">竞赛类型</label><select lay-verify="required"name="type"><option value="">选择竞赛类型</option><option value="0">活动</option><option value="1">竞赛</option></select></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">开始时间</label><input class="layui-input rg" type="text"  placeholder="请选择开始时间"style="width:220px;border: none;background: #f3f5f8;" lay-verify="required" id="s_time"name="stime" readonly></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">结束时间</label><input class="layui-input rg" type="text"  placeholder="请选择结束时间"style="width:220px;border: none;background: #f3f5f8;" lay-verify="required" id="e_time"name="etime" readonly></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">指导老师</label><select name="teacher_account_id" lay-search=""></select></li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>' +
                    '</div>',
                    success: function(layero,index) {
                        StartEndTime.topGet($(layero));
                        top.layui.form.render();
                        seat_Mask().getTeacher($(layero));
                        //确定按钮
                        top.layui.form.on('submit(formDemo)', function(data){

                            var param={
                                faid:userId,
                                token:token,
                                stime:new Date(data.field.stime.replace(/-/g, "/")+' 00:00:00').getTime(),
                                etime:new Date(data.field.etime.replace(/-/g, "/")+' 00:00:00').getTime(),
                                type:data.field.type,
                                teacher_account_id:data.field.teacher_account_id,
                                name:data.field.name
                            }
                            $.axse(urls+'/competition/create.action',param,function(result){
                                sl_Mask.YesTip('创建成功');
                                self.all_table();
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
        //增加竞赛项目的请求
        _m.addAjax = function () {
            var params={

            }
            $.axse(urls+'/major/createMajor.action',params,function(result){})
        }
        return _m;
    })();
    mainPage.init();
    // input搜索
    var query = new Query_table('QueryWrap',{
        tip:'请输入学生姓名',
        successFn:mainPage.search
    })
})