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
            self.time();
            self.keyword();
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
                url: urls + '/dormitoryCheck/getCheckStops.action',
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
                        field: 'classgrade',
                        align: "center",
                        title: '班级',
                        formatter: function (value, row, index) {
                            var a=row.classgrade.name;
                            return a;
                        }
                    }, {
                        field: 'door_number',
                        align: "center",
                        title: '学生',
                        formatter: function (value, row, index) {
                            if(filed.keyword){var key = filed.keyword}else {var key = ""};
                            var keyArr =[];
                            var accounts = row.accounts;
                            if(accounts&&accounts.length>0){
                                var lengths=accounts.length;
                                 if(accounts.length>1){
                                     if(key){
                                        for(var i=0;i<accounts.length;i++){
                                            if(accounts[i].account.rname.indexOf(key)!=-1){
                                                keyArr.push(accounts[i].account.rname)}
                                        }
                                        var a= keyArr[0]+'等'+lengths+'人'
                                     }else {
                                         var a=accounts[1].account.rname+'等'+lengths+'人'
                                     }
                                 }else {
                                   var a=accounts[0].account.rname;
                                 }
                            }
                            return a;
                        }

                    }, {
                        field: 'floor',
                        align: "center",
                        title: '停住时间',
                        formatter: function (value, row, index) {
                            var a=tool().getSmpFormatDateByLong(row.stime,false)+"至"+tool().getSmpFormatDateByLong(row.etime,false);
                            return a;
                        }
                    }, {
                        field: 'type',
                        align: "center",
                        title: '停住类型',
                        formatter: function (value, row, index) {
                            var arr=['违纪','其他'];
                            var a= arr[row.type];
                            return a;
                        }
                     }, {
                        field: '',
                        align: "center",
                        title: '操作',
                        formatter: function (value, row, index) {
                            var classgrade=row.classgrade.name;
                            var accounts=row.accounts;
                            var account='';
                            if(accounts&&accounts.length>0){
                                var lengths=accounts.length;
                                if(lengths>1){
                                    for(var i=0;i<lengths;i++){
                                        account +=accounts[i].account.rname+'；'
                                    }
                                }else {
                                     account= accounts[0].account.rname;
                                }
                            }
                            var commit_account = row.commit_account.rname;
                            var time=tool().getSmpFormatDateByLong(row.stime,false)+"至"+tool().getSmpFormatDateByLong(row.etime,false);
                            var commit_time=tool().getSmpFormatDateByLong(row.commit_time,true);
                            var des=row.des||"";
                            var a='<a class="blue" data-classgrade='+classgrade+' onclick="dormitory_mask().sleephome_stop_one($(this))" data-id='+row.id+' data-account='+account+' data-time='+time+' data-des="'+des+'" data-type='+row.type+' data-commit_time='+commit_time+' data-commit_account='+commit_account+'>查看</a>';
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
                        return {
                            "rows":'',
                            "total":''
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
        //给学期表格传参
        _m.all_table = function () {
            var stime= new Date($("#s_time").val().replace(/-/g, "/")+' 00:00:00').getTime(); //开始时间
            var etime= new Date($("#e_time").val().replace(/-/g, "/")+' 00:00:00').getTime();  //结束时间
            var keyVal = $('#search').val();                                                                                   //keyword
            var params = {
                faid: userId,
                token: token
            }
            if(stime&&etime){ params.stime=stime; params.etime=etime};
            if($.trim(keyVal)){ params.keyword = keyVal};
            self.table(params);
        }
        //搜索功能
        _m.search = function () {
            
        }
        //查询功能
        //通过时间刷选
        _m.time = function () {
            $('#TimeSearch').unbind('click').bind('click',function () {
                // var stime= new Date($("#s_time").val().replace(/-/g, "/")+' 00:00:00').getTime(); //开始时间
                // var etime= new Date($("#e_time").val().replace(/-/g, "/")+' 00:00:00').getTime(); //结束时间
                // if(stime&&etime){
                //     var params = {
                //         faid: userId,
                //         token: token,
                //         stime:stime,
                //         etime:etime
                //     }
                //     self.table(params);
                // }else {
                //     self.all_table();
                // }
                self.all_table();
            })

        }
        //搜索
        _m.search_table = function () {
            // var val1=$('#search').val();
            // if($.trim(val1)){
            //     $('#account').find('#table1').bootstrapTable('destroy');
            //     var params={
            //         faid:userId,
            //         token:token,
            //         keyword:val1
            //     }
            //     self.table(params);
            // }else{
            //     self.all_table();
            // }
            self.all_table();
        }
        //键盘事件
        _m.keyword = function () {
            $(document).keyup(function(event) {
                var e=event||window.event;
                if(e.keyCode == 13) {
                    self.search_table();
                }
            });
        }
        return _m;

    })();
    mainPage.init();
    // input搜索
    var query = new Query_table('QueryWrap',{
        tip:'请输入学生姓名',
        successFn:mainPage.search_table
    })
})