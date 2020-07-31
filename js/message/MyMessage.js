layui.use(['layer', 'form', 'element','laydate'], function() {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element
    //移除按钮
    //添加账户
    var typeList={
        "0":"打分",
        "1":"请假",
        "2":"值班",
        "3":"签到",
        "4":"班级打分",
        "11":"早退",
        "12":"请假",
        "13":"正常"
    }
    mainPage = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            self.all_table();
            self.allRead();
        }
        //生成表格
        _m.table = function (filed) {
            if(!filed.token){
                tool().judge_token(function () {
                    parent.location.href=loginSrc;
                })
                return;
            }
            if(filed) $.extend(filed,pclogin);
            $('#table1').bootstrapTable({
                url: urls + '/message/getMessagesForAccount.action',
                queryParams: function (params) {
                    var obj={
                        size:params.limit,
                        page:params.offset/params.limit,
                    }
                    if(filed) $.extend(obj,filed);
                    return obj;
                },
                sidePagination: "server",
                contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                method: 'POST',
                async:true,
                pagination: true,
                paginationLoop: false,
                paginationShowPageGo: true,
                pageNumber: 1,
                cache:false,
                striped:true,
                pageSize: 10,
                pageList: [10, 15, 25],
                columns:
                    [{
                        field: 'create_time',
                        align: "center",
                        title: '时间',
                        formatter: function (value, row, index) {
                          var a= tool().getSmpFormatDateByLong(row.create_time);
                          return a;
                        }
                    }, {
                        field: 'type',
                        align: "center",
                        width: '80px',
                        title: '消息类型',
                        formatter: function (value, row, index) {
                            var a= typeList[row.type];
                            return a;
                        }
                    }, {
                        field: '',
                        align: "center",
                        title: '名称',
                        formatter: function (value, row, index) {
                                var data = JSON.parse(row.json);
                            if(row.type==1){
                                var apply_accounts=data.apply_accounts;
                                var a=self.leaveUser(apply_accounts);
                            }
                            if(row.type==0){
                               var a=data.operation_account_rname
                            }
                            if(row.type==2||row.type==3){
                                var classgrades = data.teacher.rname;
                                var a = classgrades;
                            }
                            if(row.type==4){
                                var classgrades = data.classgrade_name;
                                var a = classgrades;
                              }
                           return a;
                        }
                    }, {
                        field: 'outline',
                        align: "center",
                        title: '消息内容',
                        formatter: function (value, row, index) {
                            if(row.type == 4){
                                var data = JSON.parse(row.json);
                                var a=data.project_name+"（"+data.rule_name+data.value+"）"
                            }else{
                                var a= row.outline
                            }
                            return a;
                        }
                    }, {
                        field: 'state',
                        align: "center",
                        title: '结果',
                        formatter: function (value, row, index) {
                            if(row.state==0){
                                var data = JSON.parse(row.json);
                                if(row.type==4){
                                    var a="<a class='red' onclick='mainPage.ClassgradeScore("+row.id+")'>未读</a>";
                                }else {
                                    var a="<a class='red'>未读</a>";
                                }
                            }
                            if(row.state==1){
                                var a="已读";
                            }
                            return a;
                        }
                    }, {
                        field: '',
                        align: "center",
                        title: '操作',
                        // width: '160px',
                        formatter: function (value, row, index) {
                                var data= JSON.parse(row.json);
                                var ids= data.id;
                                if(sessionStorage.identity_id==4){
                                    var a = '<a class="blue"  onclick="leave_Mask().stayTryClass('+ids+','+row.id+')">查看</a>';
                                }else {
                                    var a = '<a class="blue"  onclick="leave_Mask().stayTry('+ids+','+row.id+')">查看</a>';
                                }
                                if(row.type==2||row.type==3){
                                    var JsonData = self.duty_message(data);
                                    var school = JsonData.school;
                                    var a = '<a class="blue" onclick="Message_Mask().look_duty('+ids+','+row.id+',$(this))" data-school="'+school+'" data-time="'+JsonData.time+'" data-type="'+JsonData.type+'" data-teacher="'+JsonData.teacher+'"  data-des="'+JsonData.des+'" data-classgrades="'+JsonData.classgrades+'" data-sign_state="'+JsonData.sign_state+'">查看</a>'
                                }
                                if(row.type == 4){
                                   var a= data.operation_account_rname
                                }
                                return a;
                        }
                    }],
                responseHandler: function (result) {
                    if (result.error) {
                        if (400 <= result.error.errorCode && result.error.errorCode <= 500) {
                            tool().judge_token(function () {
                                parent.location.href=loginSrc;
                            })
                        }else {
                           sl_Mask.NoTip(result.error.message);
                        }
                    } else {
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
        //学生获取消息的表格
        _m.table_student = function (filed) {
            if(!filed.token){
                tool().judge_token(function () {
                    parent.location.href=loginSrc;
                })
                return;
            }
            if(filed) $.extend(filed,pclogin);
            $('#table1').bootstrapTable({
                url: urls + '/message/getMessagesForAccount.action',
                queryParams: function (params) {
                    var obj={
                        size:params.limit,
                        page:params.offset/params.limit,
                    }
                    if(filed) $.extend(obj,filed);
                    return obj;
                },
                sidePagination: "server",
                pagination: true,
                paginationLoop: false,
                paginationShowPageGo: true,
                pageNumber: 1,
                cache:false,
                striped:true,
                pageSize: 10,
                pageList: [10, 15, 25],
                columns:
                    [{
                        field: 'create_time',
                        align: "center",
                        title: '时间',
                        formatter: function (value, row, index) {
                            var a= tool().getSmpFormatDateByLong(row.create_time);
                            return a;
                        }
                    }, {
                        field: 'type',
                        align: "center",
                        width: '80px',
                        title: '消息类型',
                        formatter: function (value, row, index) {
                            var a= typeList[row.type];
                            return a;
                        }
                    }, {
                        field: '',
                        align: "center",
                        title: '名称',
                        formatter: function (value, row, index) {
                            console.log(typeof row.json);
                            if(row.json.indexOf('↵')!=-1){
                                var data = JSON.parse(row.json);
                            }else {
                                var data = JSON.parse(row.json.split('\n'))
                            }
                            if(row.type==0){
                                var a=data.project_name
                            }

                            return a;
                        }
                    }, {
                        field: 'outline',
                        align: "center",
                        // width: '290px',
                        title: '消息内容'
                    }, {
                        field: 'state',
                        align: "center",
                        title: '结果',
                        formatter: function (value, row, index) {
                            if(row.state==0){
                                var a="<a class='red'>未读</a>";
                            }
                            if(row.state==1){
                                var a="已读";
                            }
                            return a;
                        }
                    }, {
                        field: '',
                        align: "center",
                        title: '打分人',
                        // width: '160px',
                        formatter: function (value, row, index) {
                            if(row.json.indexOf('↵')!=-1){
                                var data = JSON.parse(row.json);
                            }else {
                                var data = JSON.parse(row.json.split('\n'))
                            }

                            var a = data.operation_account_rname
                            return a;
                        }
                    }],
                responseHandler: function (result) {
                    if (result.error) {
                        if (400 <= result.error.errorCode && result.error.errorCode <= 500) {
                            tool().judge_token(function () {
                                parent.location.href=loginSrc;
                            })
                        }else {
                            sl_Mask.NoTip(result.error.message);
                        }
                    } else {
                        return {
                            "rows":result.data.list,
                            "total":result.data.count
                        }

                    }
                }
            })

        }
        //给学期表格传参
        _m.all_table = function () {
            $('#account').find('#table1').bootstrapTable('destroy');
            var params = {
                faid: userId,
                token: token
            }
            if(sessionStorage.identity_id==6||sessionStorage.identity_id==7){
                self.table_student(params);
            }else {
                self.table(params);
            }

        }
        //被请假人字段的处理
        _m.leaveUser= function (data) {
            var arr=[];
            if(data.length>0){
                for (var i=0;i<data.length;i++){
                    arr.push(data[i].accountData.rname)
                }
            }
            if(arr.length>1){
                var str=arr[0]+'等'+arr.length+'人'
            }else {
                var str=arr[0]
            }
            return str;
        }
        //被打分人字段的处理
        _m.Dury_dUser = function (data) {
            var arr=[];
            if(data.length>0){
                for (var i=0;i<data.length;i++){
                    arr.push(data[i].name)
                }
            }
            if(arr.length>1){
                var str=arr[0]+'等'+arr.length+'班'
            }else {
                var str=arr[0]
            }
            return str;
        }
        //一键删除
        _m.allRead =function () {
            $('.setReadBtn').unbind('click').bind('click',function () {
                var params={
                    token:token,
                    faid:userId
                }
                $.axse(urls + '/message/setReadStateForAll.action', params, function (result) {
                    sl_Mask.YesTip('标记成功')
                    mainPage.all_table();
                    tool().WorkMessage(1);
                })
            })

        }
        //值班消息的消息的处理
        _m.duty_message = function (data) {
            var obj={
                0:'干部',
                1:'教师'
            }
            var school ={
                0:"",
                1:'丁桥校区',
                2:'翠苑校区'
            }
            var classgrades= data.classgrades;
            var arr= [];
            for(var i=0;i<classgrades.length;i++){
                arr.push(classgrades[i].name);
            }
            var class_name= arr.join('，');
            var des= data.des||"";
            var school_district_id =school[data.school_district_id] ||"";
            var time = data.time;
            var type = obj[data.type];
            var teacher = data.teacher.rname
            return {
                time:tool().getSmpFormatDateByLong(time,false),
                type:type,
                teacher:teacher,
                school:school_district_id,
                des:des,
                classgrades:class_name,
                sign_state:data.sign_state
            }
        }
        //班级打分设置已读状态
        _m.ClassgradeScore = function (message_ids) {
            var params={
                token:token,
                faid:userId,
                message_ids:message_ids
            }
            $.axse(urls+'/message/setReadState.action', params, function (result) {
                $('#table1').bootstrapTable('refresh');
                tool().WorkMessage();
            })
        }
        return _m;

    })();
    mainPage.init();
})
