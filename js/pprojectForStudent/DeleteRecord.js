layui.use(['layer', 'form', 'element','laydate'], function() {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element
        , laydate = layui.laydate
    StartEndTime.get();
    var downFileData=null;
    //填充学期
    mainPage = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            self.all_table();
            self.time();
            self.keyword();
            self.downFile();
            self.ScoreUser();
        }
        //去除删除按钮
        _m.ScoreUser = function () {
            if(sessionStorage.identity_id==13){
                $('#ScoreUser').hide();
            }else {
                $('#ScoreUser').show();
            }

        }
        //下载报告
        _m.downFile = function () {
            if(!downFileData){
                return;
            }
            delete downFileData.page;
            delete downFileData.size;
            var val1=$('#search').val();
            if(!$.trim(val1)){ delete downFileData.keyword};
            var download_Score = new DownLoadTemplate('DownFile',{
                url:'/fileAccount/getStudentPerformanceRecord.action',
                filed:downFileData
            })
        }
        //生成表格
        _m.table = function (filed) {
            $('#account').find('#table1').bootstrapTable('destroy');
            if (!filed.token || !sessionStorage.identity_id) {
                tool().judge_token(function () {
                    parent.location.href = loginSrc;
                })
                return;
            }
            if (filed) $.extend(filed, pclogin);
            $('#table1').bootstrapTable({
                url: urls + '/performance/getForOperationAccountId.action',
                queryParams: function (params) {
                    var obj = {
                        size: params.limit,
                        page: params.offset / params.limit,
                    }
                    if (filed) $.extend(obj, filed);
                    downFileData = obj;
                    return obj;
                },
                sidePagination: "server",
                contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                method: 'POST',
                async: true,
                striped: true,
                paginationShowPageGo: true,
                pagination: true,
                paginationLoop: false,
                pageNumber: 1,
                cache: false,
                pageSize: 10,
                pageList: [10, 20, 50, 100],
                columns:
                    [{
                        field: 'variablevalue',
                        checkbox: true,
                        width: '43px',
                        visible: false
                    }, {
                        field: '',
                        align: "center",
                        width: '',
                        title: '打分时间',
                        formatter: function (value, row, index) {
                            var a = tool().getSmpFormatDateByLong(row.commit_time, false);
                            return a;
                        }
                    }, {
                        field: 'rname',
                        align: "center",
                        width: '',
                        title: '学生姓名',
                        formatter: function (value, row, index) {
                            var a = row.account_name;
                            return a;
                        }
                    }, {
                        field: '',
                        align: "center",
                        title: '打分项',
                        formatter: function (value, row, index) {
                            var a = row.project_name;
                            return a;
                        }
                    }, {
                        field: 'student_main_number',
                        align: "center",
                        title: '打分内容',
                        formatter: function (value, row, index) {
                            var a = row.rule_name;
                            return a;
                        }
                    }, {
                        field: '',
                        align: "center",
                        title: '分值',
                        formatter: function (value, row, index) {
                            if (row.operation == 1) {
                                var a = '+' + row.value;
                            }
                            if (row.operation == 2) {
                                var a = '-' + row.value;
                            }
                            return a;
                        }
                    },
                        {
                            field: 'root_value',
                            align: "center",
                            title: '总分',
                            formatter: function (value, row, index) {
                               var a= row.root_value;
                                return a;
                            }
                        },
                        {
                            field: 'des',
                            align: "center",
                            title: '打分人',
                            formatter: function (value, row, index) {
                                var a = row.operation_account_rname;
                                return a;
                            }
                        }
                    ],
                responseHandler: function (result) {
                    if (result.error) {
                        if (400 <= result.error.errorCode && result.error.errorCode <= 500) {
                            tool().judge_token(function () {
                                parent.location.href = loginSrc;
                            })
                        } else {
                            sl_Mask.NoTip(result.error.message);
                            return {
                                "rows": '',
                                "total": ''
                            }
                        }
                    } else {
                        return {
                            "rows": result.data.list,
                            "total": result.data.count
                        }
                    }
                },
                formatLoadingMessage: function () {
                    return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
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
                },
                onLoadSuccess:function (data) {
                    if(data.rows.length>0){
                        $('#table1').bootstrapTable('showColumn', 'variablevalue');
                    }else {
                        $('#table1').bootstrapTable('hideColumn', 'variablevalue');
                    }
                }
            })
        }
        //全部
        _m.all_table = function () {
            var stime = new Date($("#s_time").val().replace(/-/g, "/") + ' 00:00:00').getTime(); //开始时间
            var etime = new Date($("#e_time").val().replace(/-/g, "/") + ' 00:00:00').getTime();  //结束时间
            var keyVal = $('#search').val(); //keyword
            var params = {
                faid: userId,
                token: token
            }
            if (stime && etime) {
                params.s_time = stime;
                params.e_time = etime
            };
            if ($.trim(keyVal)) {
                params.keyword = keyVal
            };
            if(self.judge(params)){
                self.table(params);
            };
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
                    // params. operation_account_id=userId;
                }
            }
            if(identityId==8){//专业部
                var majorGroup= positionId['8'].majorGroup
                if(!majorGroup){
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
        //搜索
        _m.search_table = function () {
            self.all_table();
            self.downFile();
        }
        //添加新用户
        //键盘事件
        _m.keyword = function () {
            $(document).keyup(function (event) {
                var e = event || window.event;
                if (e.keyCode == 13) {
                    self.search_table();
                }
            });
            self.downFile();
        }
        //通过时间刷选
        _m.time = function () {
            $('#TimeSearch').unbind('click').bind('click', function () {
                self.all_table();
                self.downFile();
            })
        }
        //批量删除
        _m.deleteUserList = function (type) {
            //获取所有被选中的记录
            var rows = $("#table1").bootstrapTable('getSelections');
            var arr0 = [];
            var identityId=sessionStorage.identity_id
            if (rows.length == 0) {
                sl_Mask.NoTip("请先选择打分记录");
                return;
            } else {
                for (var i = 0; i < rows.length; i++) {
                    for (var i = 0; i < rows.length; i++) {
                        if(identityId==3) {
                            arr0.push(rows[i]['id'])
                        }else {
                            if(rows[i]['operation_account_id']==userId){
                                arr0.push(rows[i]['id'])
                            }
                        }
                    }//正常状态
                     }//正常状态
                }
                 if (arr0.length > 0) {
                     tool().Switched_Roles('images1/Score.png', '确定提交本次批量删除', function () {
                         self.ApplyMore(arr0.join('-'));
                         })
                 } else {
                     sl_Mask.NoTip("请选择自己的打分记录");
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
            $.axse(urls + '/pprojectForStudent/recover.action', params, function (result) {
                top.layui.layer.close(loadings);
                sl_Mask.YesTip('删除成功');
                $('#table1').bootstrapTable('refresh');
                $('#table1 th label').removeClass('active');
            }, function () {
                top.layui.layer.close(loadings);
            })
        }
        return _m;
    })();
    mainPage.init();
//
// input搜索
    var query = new Query_table('QueryWrap', {
        tip: '请输入学生姓名',
        successFn: mainPage.search_table
    })
// 点击状态搜索
    var ForState = new ForState_Totable('ForState');
})