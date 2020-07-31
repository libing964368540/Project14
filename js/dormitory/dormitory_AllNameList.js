layui.use(['layer', 'form', 'element','laydate'], function() {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element
    //移除按钮
    //添加账户
    mainPage = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            self.all_table();
            // self.search();
            self.keyword();
            self.state();
            self.again_state();
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
                url: urls + get_liveSchool,
                queryParams: function (params) {
                    var obj={
                        size:params.limit,
                        page:params.offset/params.limit
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
                        field: 'rname',
                        align: "center",
                        title: '学生姓名',
                        width: '100px'

                    }, {
                        field: 'classgrade',
                        align: "center",
                        title: '班级',
                        formatter: function (value, row, index) {
                            var a= row.classgrade.name;
                            return a;
                        }
                    }, {
                        field: 'st_number',
                        align: "center",
                        title: '学籍号'

                    }, {
                        field: 'dormitory',
                        align: "center",
                        title: '宿舍楼',
                        formatter: function (value, row, index) {
                            var obj={1:'男生寝室',2:'女生寝室'};
                            if(row.dormitory){
                                var  a=obj[row.dormitory.dormitory.dormitory_type]
                                return a;
                            }
                        }
                    }, {
                        field: 'number',
                        align: "center",
                        title: '宿舍号',
                        formatter: function (value, row, index) {
                            if(row.dormitory){
                                var  a= row.dormitory.dormitory.number
                                return a;
                            }
                        }
                    }, {
                        field: 'index',
                        align: "center",
                        title: '床位号',
                        formatter: function (value, row, index) {
                            if(row.dormitory) {
                                var a = row.dormitory.index;
                                return a;
                            }
                        }
                    }, {
                        field: 'state',
                        align: "center",
                        title: '状态',
                        formatter: function(value, row, index) {
                            if(row.isWay==2){
                                var a='<a class="red">停住</a>'
                            }else {
                                var a='<a>正常</a>'
                            }
                            return a;
                        }
                    }],
                responseHandler: function (result) {
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
                }
            })

        }
        //给学期表格传参
        _m.all_table = function () {
            var classgaderid =$('select[name="classgaderid"]').val() // 班级id
            var checkStop = $('select[name="checkStop"]').val()// 状态
            var keyVal = $('#search').val();// 搜索的值
            var params={
                faid: userId,
                token: token
            }
            if(classgaderid){params.classgrade_ids = classgaderid};
            if(checkStop){params.checkStop = checkStop};
            if($.trim(keyVal)){params.keyword = keyVal};
            self.table(params);
        }
        //通过状态刷选
        _m.state = function () {
            form.on('select(checkStop)', function (data) {
                self.all_table();
            })
        }
        //通过班级刷选
        _m.classgrade = function (classgrade_ids) {
            self.all_table();
        }

        _m.search_table=function () {
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
        //重置住校学生
        _m.again_state =function () {
            $('#AllDel').unbind('click').bind('click',function () {
                tool().Switched_Roles('images1/del.png','确认要重置住校生？', function() {
                    var params = {
                        token:token,
                        faid:userId
                    }
                    var loadings= top.layui.layer.load(2);
                    $.axse(urls+'/dormitoryCheck/clearAll2.action',params,function(result){
                        top.layui.layer.close(loadings);
                        sl_Mask.YesTip('操作成功');
                        mainPage.all_table();
                    },function () {
                        top.layui.layer.close(loadings);
                    })

                })
            })
        }
        return _m;

    })();
    mainPage.init();
    tool().editMajorGroup($('#account'),'',2,function (ids) {
        mainPage.classgrade(ids)
    });
    // input搜索
    var query = new Query_table('QueryWrap',{
        tip:'请输入学生姓名',
        successFn:mainPage.search_table
    })
})