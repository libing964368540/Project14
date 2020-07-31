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
                url: urls + '/dutyImprove/getReplace.action',
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
                        field: 'old_teacher_account',
                        align: "center",
                        title: '申请教师',
                        formatter: function (value, row, index) {
                           var a=row.old_teacher_account.rname;
                           return a;
                        }
                    }, {
                        field: 'new_teacher_account',
                        align: "center",
                        title: '代班教师',
                        formatter: function (value, row, index) {
                            var a=row.new_teacher_account.rname;
                            return a;
                        }
                    }, {
                        field: 'duty_time',
                        align: "center",
                        title: '代班日期',
                        formatter: function (value, row, index) {
                            var a=tool().getSmpFormatDateByLong(row.duty_time,false);
                            return a;
                        }
                    }, {
                        field: '',
                        align: "center",
                        title: '状态',
                        formatter: function (value, row, index) {
                            if(row.state==1){
                                var a="<a >已审批</a>"
                            }else if(row.state==0){
                                var a="<a class='blue' onclick='mainPage.changeState("+row.id+")'>待审批</a>"
                            }else if(row.state==-1){
                                var a="<a class='red'>已驳回</a>"
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
            var stime= new Date($("#s_time").val()+' 00:00:00').getTime();
            var etime= new Date($("#e_time").val()+' 00:00:00').getTime();
            var keyVal = $('#search').val();
            var params = {
                faid: userId,
                token: token
            }
            if(stime&&etime){ params.s_time=stime; params.e_time=etime};
            if($.trim(keyVal)){ params.keyword = keyVal};
            self.table(params);
        }
        //审批代班申请
        _m.changeState = function (duty_id) {
            var identity_id= sessionStorage.identity_id;
            if(identity_id==3){
                var obj={replace_id:duty_id}
                sl_Mask.duty_StateMask('是否同意本次代班申请',obj,function (params,inxex) {
                    mainPage.changeStateAjax(params,inxex);
                })
            }else {
                sl_Mask.NoTip('无权限审批');
            }
        }
        //审批代班申请的接口
        _m.changeStateAjax = function (params,index) {
            $.axse(urls+'/dutyImprove/replaceExamine.action',params,function(result){
                 if(params.agree==1){
                    sl_Mask.YesTip('审批成功');
                 }else {
                     sl_Mask.YesTip('驳回成功');
                 }
                $('#table1').bootstrapTable('refresh');
                top.layer.close(index);
            })
        }
        //通过时间刷选
        _m.time = function () {
            $('#TimeSearch').unbind('click').bind('click',function () {
                // var stime= new Date($("#s_time").val()+' 00:00:00').getTime();
                // var etime= new Date($("#e_time").val()+' 00:00:00').getTime();
                // if(stime&&etime){
                //     var params = {
                //         faid: userId,
                //         token: token,
                //         s_time:stime,
                //         e_time:etime
                //     }
                //     self.table(params);
                // }else {
                     self.all_table();
                // }
            })

        }
        //搜索
        _m.search_table = function () {
            self.all_table();
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
        tip:'请输入教师姓名',
        successFn:mainPage.search_table
    })

})