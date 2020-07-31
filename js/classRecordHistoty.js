layui.use(['layer', 'form', 'element'], function() {
    var layer = layui.layer
    form = layui.form;

    classRecordHistory = (function () {
        var _m= {};
        var self = _m;
        //初始化
        _m.init = function () {
            self.AssessmentClass(function () {
                self.all_table();
            });
            self.MoreDelete();
        }
        //table
        _m.table = function (filed) {
            if(!filed.token||!sessionStorage.identity_id){
                tool().judge_token(function () {
                    parent.location.href=loginSrc;
                })
                return;
            }
            if(filed) $.extend(filed,pclogin);
            $('#table1').bootstrapTable({
                url: urls+ classRecordHistoty,
                queryParams: function (params) {
                    var obj = {
                        size: params.limit,
                        page: params.offset / params.limit,
                    }
                    if (filed) $.extend(obj, filed);
                    return obj;
                },
                sidePagination: "server",
                contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                method: 'POST',
                async:true,
                striped:true,
                sidePagination: "server",
                pagination: true,
                paginationShowPageGo: true,
                paginationLoop: false,
                pageNumber: 1,
                cache:false,
                pageSize: 10,
                pageList: [10, 15, 20],
                columns: [{
                    field:'variablevalue',
                    checkbox:true,
                    width:'43px',
                    visible: false
                },
                    {
                    field: 'classgrade_name',
                    align: "center",
                    title: '班级',
                    },{
                        field: 'project_name',
                        align: "center",
                        title: '考评项',
                    } ,{
                        field: 'rule_name',
                        align: "center",
                        title: '考评内容',
                        formatter: function(value, row, index) {
                            var beizhu=row.annotation||'';
                            var a ='<a onclick="sl_Mask.remind_ForScoreHistoryMask($(this))" style="cursor: pointer" data-annotation='+beizhu+'>'+row.rule_name+"&nbsp;"+row.value+'</a>';
                            return a;
                            // var a=row.rule_name+"&nbsp;"+row.value;
                            // return a;
                        }
                    }, {
                        field: 'student_names',
                        align: "center",
                        title: '相关学生',
                        formatter: function(value, row, index) {
                            if(row.student_names){
                               return  row.student_names;
                            }else {
                                return '无'
                            }
                        }
                    },{
                        field: '',
                        align: "center",
                        title: '关联打分项',
                        formatter: function(value, row, index) {
                            if(row.relevance){
                                var relevance =JSON.parse(row.relevance);
                                var project_name=relevance[0].project_name;
                                return project_name;
                            }

                        }
                    },{
                        field: '',
                        align: "center",
                        title: '打分内容',
                        formatter: function(value, row, index) {
                            if(row.relevance){
                                var relevance =JSON.parse(row.relevance);
                                //判断学生的数量
                                var lengthForStudent = row.student_names.split(" ").length-1;
                                //判断有几条打分规则
                                var lengths = relevance.length/lengthForStudent;
                                var arr=[];
                                for(var i=0;i<lengths;i++){
                                    if(relevance[i].operation == 1){
                                        var a= '+'+relevance[i].value;
                                    }
                                    if(relevance[i].operation == 2){
                                        var a= '-'+relevance[i].value;
                                    }
                                    arr.push(relevance[i].rule_name+'&nbsp;'+a);
                                }
                                var rules=arr.join(' / ');
                                return rules;
                            }
                        }
                    },
                {
                    field: 'commit_time',
                    align: "center",
                    title: '打分时间',
                    formatter: function(value, row, index) {
                        var a=tool().get_date(row.commit_time);
                        return a;
                    }
                }, {
                    field: 'operation_account_rname',
                    align: "center",
                    title: '打分人'
                }
                ],responseHandler:function(result){
                    if(result.error){
                        if(400<=result.error.errorCode&&result.error.errorCode<=500){
                            tool().judge_token(function () {
                                parent.location.href=loginSrc;
                            })
                        }else {
                            sl_Mask.NoTip(result.error.message);
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
                },
                onLoadSuccess: function (data) {
                    if (sessionStorage.identity_id==3&&data.rows.length>0) {
                        $('#table1').bootstrapTable('showColumn', 'variablevalue');//隐藏上述variablevalue列
                        $('#MoreDelete').show();
                    }
                },
                onCheck:function(value, row, index){ //单行
                    $('#table1  tr.selected td label i.material-icons').text('check_box');
                    var flag=$('#table1 th input[type="checkbox"]').prop('checked')
                    if(flag){
                        $('#table1 th label').addClass('active');
                        $('#table1 th label i.material-icons').text('check_box');
                    }else {
                        $('#table1 th label').removeClass('active');
                        $('#table1 th label i.material-icons').text('check_box_outline_blank');
                    }
                    // var a= $('#table1').bootstrapTable('getSelections');
                    // if(a.length==10){
                    //     $('#table1 th label').addClass('active');
                    // }
                },
                onUncheck:function(e){ //单行
                    for(var i=0;i<$('#table1  tr').length;i++){
                        if(!$('#table1  tr').eq(i).hasClass('selected')){
                            $('#table1  tr:nth-child('+i+') td label i.material-icons').text('check_box_outline_blank');
                        }
                    }
                    $('#table1 th label').removeClass('active');
                    $('#table1 th label i.material-icons').text('check_box_outline_blank');
                },
                onCheckAll:function(value, row, index){ //全选
                    $('#table1 th label').addClass('active')
                    $('#table1 th label i.material-icons').text('check_box');
                    $('#table1  tr td label i.material-icons').text('check_box');
                },
                onUncheckAll:function(value, row, index){ //全不选
                    $('#table1 th label').removeClass('active');
                    $('#table1 th label i.material-icons').text('check_box_outline_blank');
                    $('#table1  tr td label i.material-icons').text('check_box_outline_blank');
                }

            })
            if (sessionStorage.identity_id!=3) {
                 // $('#table1').bootstrapTable('showColumn', 'variablevalue');//隐藏上述variablevalue列
             }
        }
        //通过权限判断打分打分记录展示的权限
        _m.judge = function (params) {
            var identityId=sessionStorage.identity_id;
            var arr=[];
            if(sessionStorage.positionId){
                var positionId = JSON.parse(sessionStorage.positionId);
            }
            if(identityId==4){//班主任或副班主任
                var classgrades= positionId['4'].classgrades
                if(classgrades.length==0){
                    sl_Mask.NoTip('班主任权限下未绑定班级，请绑定后重新登录再试');
                    return false;
                }else {
                    for(var i=0;i<classgrades.length;i++){
                        arr.push(classgrades[i].id);
                    }
                    params.classgrade_ids=arr.join('-');
                    // params.operation_account_id=userId;
                }
            }
            if(identityId==8){//专业部
                var majorGroup= positionId['8'].majorGroup
                if(!majorGroup.id){
                    sl_Mask.NoTip('专业部权限下未绑定班级，请绑定后重新登录再试');
                    return false;
                }else {
                    params.major_group_ids=majorGroup.id;
                }
            }
            if(identityId==12){//专业部
                var classgrades= positionId['12'].classgrades
                if(classgrades.length==0){
                    sl_Mask.NoTip('班主任权限下未绑定班级，请绑定后重新登录再试');
                    return false;
                }else {
                    for(var i=0;i<classgrades.length;i++){
                        arr.push(classgrades[i].id);
                    }
                    params.classgrade_ids=arr.join('-');
                    // params.operation_account_id=userId;
                }
            }
            return params;
        }
        //全部打分记录
        _m.all_table=function () {
            $('#student_all').find('#table1').bootstrapTable('destroy');
            //学期
            var semesterId = $('select[name="termid"]').find('option:selected').attr('data-semester');
            //周期
            var weekId = $('select[name="superid"]').find('option:selected').attr('data-week');
            var project_id = $('select[name="project_id"]').val();
            var params={
                token:token,
                faid:userId
            }
            if(semesterId){
               params.semester = semesterId;
            }
            if(weekId){
                params.week = weekId;
            }
            if(project_id){
                params.project_id = project_id;
            }
            if(self.judge(params)){
                self.table(params);
            }
        }
        //通过学期直接获取打分历史记录
        _m.getRecordForTermid = function () {
            $('#student_all').find('#table1').bootstrapTable('destroy');
            //学期
            var semesterId = $('select[name="termid"]').find('option:selected').attr('data-semester');
            var params={
                token:token,
                faid:userId
            }
            if(semesterId){
                params.semester = semesterId;
            }
            self.table(params);
        }
        //获取班级评比填充接口(考核)
        _m.AssessmentClass=function (fn) {
            var params = {
                faid: userId,
                token: token,
                project_id:0
            };
            $.axse(urls + ClassContents, params, function (result) {
                if (!result.error) {
                    var data = result.data;
                    var dom = "";
                    if(data&&data.length>0){
                        self.ItemNow(data[0].id,fn);
                    }
                    for (var i = 0; i < data.length; i++) {
                        dom += '<option value=' + data[i].id + '>' + data[i].name + '</option>'
                    }
                    $('select[name="project_id"]').html(dom);
                    layui.form.render();
                    layui.form.on('select(project_id)', function (data) {
                        var text=$('select[name="project_id"]').find("option:selected").text()
                        params.project_id = data.value;
                        fn();
                    })
                }
            })
        }
        //通过当前的学期和周期
        _m.ItemNow = function (project_id,fn) {
            var nowTime= new Date().getTime();
            var nowTimeS = tool().getSmpFormatDateByLong(nowTime,false).replace(/-/g,"/");
                nowTime = new Date(nowTimeS+' 00:00:00').getTime();
            var params = {
                faid: userId,
                token: token,
                time:nowTime
            }
            $.axse(urls+'/time/getCurrentTime.action', params, function (result) {
                var data= result.data;
                if(data){
                    self.classlist(data,project_id);
                    $('input[name="semesterId"]').val(data.semester.id);
                    $('input[name="weekId"]').val(data.week.id);
                    self.termSelect(fn);
                }
            },function (e) {
                e.error.message ="今天是休息日";
                self.termSelect(fn);
            })
        }
        //获取班级成打分记录
        _m.classlist = function (data,project_id) {
            var params={
                token:token,
                faid:userId
            }
            params.semester = data.semester.index;
            params.week = data.week.index;
            params.project_id = project_id;
            if(self.judge(params)) {
                self.table(params);
            }
        }
        //获取周次
        _m.week = function (superid,fn) {
            var params={
                token:token,
                faid:userId,
                superid:superid
            }
            $.axse(urls+'/time/gettimes.action', params, function (result) {
                var data = result.data;
                var dom = "<option value=''>请选择周次</option>";
                for (var i = 0; i < data.length; i++) {
                    dom += '<option value='+ data[i].id+' data-week='+data[i].index+'>' + data[i].name + '</option>'
                }
                // form.render();
                $('select[name="superid"]').html(dom);
                var weekId = $('input[name="weekId"]').val();
                if(weekId){
                    $('select[name="superid"]').val(weekId);
                }
                form.render();
                form.on('select(superid)', function (data) {
                    if(fn){
                        fn();
                    }
                })
            })
        }
        //获取学期填充接口
        _m.termSelect = function (fn) {
            var params = {
                faid: userId,
                token: token,
                superid:0
            };
            $.axse(urls + termList, params, function (result) {
                if (!result.error) {
                    var data = result.data;
                    var dom = "<option value=''>请选择学期</option>";
                    for (var i = 0; i < data.length; i++) {
                        dom += '<option value=' + data[i].id + ' data-semester='+data[i].index+'>' + data[i].name + '</option>'
                    }
                    $('select[name="termid"]').html(dom);
                    form.render();
                    var semesterId = $('input[name="semesterId"]').val();
                    if(semesterId){
                        $('select[name="termid"]').val(semesterId);
                        form.render();
                        if(data.length>0){
                            self.week(semesterId,fn);
                        }
                    }else {
                        if(data.length>0){
                             // self.week(data[0].id,fn);
                        }
                    }
                    form.on('select(termid)', function (data) {
                        if(data.value){
                            $('input[name="weekId"]').val('');
                            self.week(data.value,fn);
                        }else{
                            $('input[name="weekId"]').val('');
                            $('select[name="superid"]').html('');
                            form.render();
                        }
                        self.getRecordForTermid();
                        // if(fn){
                        //     fn();
                        // }
                    })
                }
            })
        }



        //批量删除的调用
        _m.MoreDelete = function () {
            $('#MoreDelete').unbind('click').bind('click',function () {
                self.deleteUserList();
            })
        }
        //批量删除
        _m.deleteUserList = function (type) {
            //获取所有被选中的记录
            var rows = $("#table1").bootstrapTable('getSelections');
            var arr0 = [];
            var identityId=sessionStorage.identity_id
            if (rows.length == 0) {
                sl_Mask.NoTip("请先选择自己的打分记录");
                return;
            } else {
                for (var i = 0; i < rows.length; i++) {
                    if(identityId==3) {
                        arr0.push(rows[i]['id'])
                    }else {
                        if(rows[i]['operation_account_id']==userId){
                            arr0.push(rows[i]['id'])
                        }
                    }
                }//正常状态
            }
            if (arr0.length > 0) {
                tool().Switched_Roles('images1/Score.png', '确定提交本次批量删除', function () {
                    self.ApplyMore(arr0.join('-'));
                })
            } else {
                sl_Mask.NoTip("只能删除自己的打分记录");
            }
        }
        //批量审批的接口
        _m.ApplyMore = function (record_ids) {
            var params = {
                token: token,
                faid: userId,
                record_ids: record_ids
            }
            var loadings = top.layui.layer.load(2);
            $.axse(urls + '/pprojectForClassgrade/recover.action', params, function (result) {
                top.layui.layer.close(loadings);
                sl_Mask.YesTip('删除成功');
                $('#table1').bootstrapTable('refresh');
                $('#table1 th label').removeClass('active').find('i').text('check_box_outline_blank');
            }, function () {
                top.layui.layer.close(loadings);
            })
        }

        return _m;
    })()
    classRecordHistory.init();
})