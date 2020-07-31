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
                url: urls+'/dormitoryCheck/getCheckOut.action',
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
                        field: 'accounts',
                        align: "center",
                        title: '退住学生',
                        width: '180px',
                        formatter: function(value, row, index) {
                            if(filed.keyword){var key = filed.keyword}else {var key = ""};
                            var accounts=row.accounts;
                            var keyArr =[];
                                if(accounts&&accounts.length>0){
                                   var lengths=accounts.length;
                                    if(lengths>1){
                                        if(key){
                                            for(var i=0;i<accounts.length;i++){
                                                if(accounts[i].rname.indexOf(key)!=-1){
                                                    keyArr.push(accounts[i].rname)}
                                            }
                                            var a= keyArr[0]+'等'+lengths+'人'
                                        }else {
                                            var a = accounts[0].rname + '等' + lengths + '人'
                                        }
                                    }else {
                                        var a=accounts[0].rname;
                                    }
                                }
                                return a;
                        }
                    }, {
                        field: 'classgrade',
                        align: "center",
                        title: '班级',
                        formatter: function(value, row, index) {
                             var a = row.classgrade.name;
                             return a;
                        }
                    }, {
                        field: 'time',
                        align: "center",
                        title: '退住时间',
                        formatter: function(value, row, index) {
                            var a = tool().getSmpFormatDateByLong(row.time,false);
                            return a;
                        }
                    }, {
                        field: 'type',
                        align: "center",
                        title: '退住类型',
                        formatter: function(value, row, index) {
                            var arr=['违纪退住','学生申请']
                            var a= arr[row.type];
                            return a;
                        }
                    }, {
                        field: '',
                        align: "center",
                        title: '操作',
                        formatter: function(value, row, index) {
                            var accounts=row.accounts;
                            var des=row.des||'';
                            var account='';
                            if(accounts&&accounts.length>0){
                                var lengths=accounts.length;
                                if(lengths>1){
                                    for(var i=0;i<lengths;i++){
                                        account +=accounts[i].rname+'；'
                                    }
                                }else {
                                    account=accounts[0].rname;
                                }
                            }
                            //提交人
                            var commit_account = row.commit_account.rname;
                            var commit_time=tool().getSmpFormatDateByLong(row.commit_time,true);
                            var a ='<a class="blue" onclick="dormitory_mask().sleephome_back_one($(this))"data-id='+row.id+' data-type='+row.type+' data-time='+row.time+' data-state='+row.state+' data-account='+account+' data-classgrade='+row.classgrade.name+' data-commit_time='+commit_time+' data-commit_account ='+commit_account+' data-des="'+des+'">查看</a>'
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
            var stime= tool().AdaptIEforTime($("#s_time").val());
            var etime= tool().AdaptIEforTime($("#e_time").val());
            var keyVal=$('#search').val();
            var params = {
                faid: userId,
                token: token
            }
            if(stime&&etime){ params.stime=stime; params.etime=etime};
            if($.trim(keyVal)){ params.keyword = keyVal};
            self.table(params);
        }
        //通过时间刷选
        _m.time = function () {
            $('#TimeSearch').unbind('click').bind('click',function () {
                self.all_table();
            })
        }
        //keyword筛选
        //搜索
        _m.search_table = function () {
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
    var query = new Query_table('QueryWrap',{
        tip:'请输入学生姓名',
        successFn:mainPage.search_table
    })
})