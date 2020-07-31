layui.use(['layer', 'form', 'element'], function() {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element
    var Information = null;
    // tool().editMajorGroup($('#student_all'), '', 2, mainPage.oneClass_table);
    // form.render();
    //搜索按钮
    $('#student_all .search input').focus(function () {
        $(this).css({'padding-left': '15px'}).attr('placeholder', '');
    })
    $('#student_all .search input').blur(function () {
        if (!$.trim($(this).val())) {
            $(this).css({'padding-left': '20px'}).attr('placeholder', '请输入学生姓名');
        }
    })

    mainPage.init();
    var identityid=sessionStorage.identity_id;
    if(identityid==4){
        $('#downLoadRead').show();
    }else {
        $('#downLoadRead').hide();
    }
    var downLoadRead=new DownLoadTemplate('downLoadRead',{
        url:'/file/getMR.action'
    },1)
})
    //移除按钮
    //添加账户
    mainPage = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            if(sessionStorage.identity_id==8){
                 self.majorClass();
                 self.table({token:token,faid:userId});
            }else if(sessionStorage.identity_id==13){
                  self.ScoreUserClass();
            }else {
                self.classSelect();
            }
            self.search();
            self.keyword();
        }
        //通过打分专员填充班级
        _m.ScoreUserClass = function () {
            var positionId = JSON.parse(sessionStorage.positionId);
            var classgrades = positionId['13'].classgrades;
                if(classgrades.length>0){
                    self.getStudent(classgrades[0].id);
                    var dom="";
                    for(var i=0;i<classgrades.length;i++){
                        dom += '<option value="' + classgrades[i].id + '">' + classgrades[i].name + '</option>'
                    }
                    $('select[name="classgaderid"]').html(dom);
                    layui.form.render();
                    layui.form.on('select(classgaderid)', function (majordata) {
                        self.getStudent(majordata.value);
                    })
                }else {
                    sl_Mask.NoTip('打分专员账户下未绑定班级，请绑定后再试')
                }

        }
        //填充班级select
        _m.classSelect = function () {
            var params = {
                token: token,
                faid: userId
            }
            //判断是不是副班主任
            if(sessionStorage.identity_id == 12){
                params.vice_director_aid = userId;
            }else {
                params.director_id = userId;
            }
            $.axse(urls + '/classgrade/getClassgrades.action', params, function (result) {
                    var dom='';
                    var data = result.data.list;
                    if (data && data.length > 0) {
                        self.getStudent(data[0].id);
                        for (var i = 0; i < data.length; i++) {
                            dom += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                        }
                        $('select[name="classgaderid"]').html(dom);
                        layui.form.render();
                        layui.form.on('select(classgaderid)', function (majordata) {
                            self.getStudent(majordata.value);
                        })
                    }else {
                        sl_Mask.NoTip('班主任账户下未绑定班级，请绑定后再试')
                         // self.all_table();
                        // self.getStudent('');
                    }
            })

        }
        //通过班级获取学生
        _m.getStudent= function (cids) {
            $('#student_all').find('#table1').bootstrapTable('destroy');
            var val1 = $('#search').val();
            var params={
                token:token,
                faid:userId,
                cids:cids
            }
            if(val1){params.keyword=val1};
           self.table(params);
        }
        //生成表格
        _m.table = function (filed) {
            if(!filed.token||!sessionStorage.identity_id){
                tool().judge_token(function () {
                    top.location.href=loginSrc;
                })
                return;
            }
            if(filed) $.extend(filed,pclogin);
            $('#student_all').find('#table1').bootstrapTable('destroy');
            $('#table1').bootstrapTable({
                url: urls + studentList,
                queryParams: function (params) {
                    var obj = {
                        size: params.limit,
                        page: params.offset / params.limit,
                    }
                    //核心素养排序
                    if (params.sort == 'total') {
                        obj.sort = 1;
                        obj.sortType = params.order == 'asc' ? 0 : 1;
                    }
                    //学号排序
                    if (params.sort == 'rq') {
                        obj.sort = 4;
                        obj.sortType = params.order == 'asc' ? 0 : 1
                    }
                    //默认值
                    if (!params.sort) {
                        obj.sort = 4;
                        obj.sortType = 0
                    }
                    filed.state=1;
                    if (filed) $.extend(obj, filed);
                    return obj;
                },
                sidePagination: "server",
                contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                method: 'POST',
                async:true,
                pagination: true,
                // striped: true,
                paginationLoop: false,
                paginationShowPageGo: true,
                pageNumber: 1,
                pageSize: 10,
                cache:false,
                pageList: [10, 15, 25],
                columns: [{
                    field: '',
                    align:"left",
                    title: '学生姓名',
                    width:'60px',
                    formatter: function(value, row, index) {
                        if(row.accountData.photopath){
                            var a='<span class="school_imgwrap"><img src="'+ImgurlHttp+row.accountData.photopath+'" alt="" ></span>'
                        }else {
                            var a='<span class="school_imgwrap"><img src="../images1/header.png" alt="" ></span>'
                        }
                        return a;
                    }
                },{
                    field: '',
                    align: "left",
                    title: '',
                    width:'150px',
                    formatter: function (value, row, index) {
                        var a = row.accountData.rname;
                        return a;
                    }
                }, {
                    field: 'rq',
                    align: "left",
                    title: '班内学号',
                    class:'classNumber',
                    // width: '14.2%',
                    sortable: true,
                    formatter: function (value, row, index) {
                        if(row.accountData.identitysData[6]){
                            if(row.accountData.identitysData[6].st_classgrade_number){
                                var a= row.accountData.identitysData[6].st_classgrade_number
                            }else {
                                var a= '0'
                            }
                            return a

                        }else {
                            return '0'
                        }
                    },editable: {
                        type: 'text',
                        title: '班内序号',
                        validate: function (v) {
                            var reg=/[^0-9]/g;
                            if (!v||reg.test(v)) return '班级学号格式不正确';
                        }
                    }
                }, {
                    field: 'msg',
                    align: "left",
                    // width: '14.2%',
                    title: '专业部',
                    formatter: function(value, row, index) {
                        if(row.accountData.identitysData[6]){
                            if(row.accountData.identitysData[6].majors){
                                var a=tool().basicMHandle(row.accountData.identitysData[6].majors,4);
                                return a;
                            }else {
                                return '暂无'
                            }
                        }else {
                            return '暂无'
                        }
                    }
                }, {
                    field: 'banji',
                    align: "left",
                    // width: '14.2%',
                    title: '班级',
                    formatter: function (value, row, index) {
                        if (row.accountData.identitysData[6]) {
                            if (row.accountData.identitysData[6].classgrades) {
                                var a = tool().basicMHandle(row.accountData.identitysData[6].classgrades, 1);
                            } else {
                                var a = '暂无'
                            }
                            return a

                        } else {
                            return '暂无'
                        }
                    }
                },
                    {
                        field: 'total',
                        align: "left",
                        title: '核心素养',
                        class:'SortClass',
                        // width: '14.2%',
                        sortable: true,
                        formatter: function (value, row, index) {
                            if(row.accountData.identitysData[6].st_performance){
                                var st_performance = row.accountData.identitysData[6].st_performance.value ;
                                var grade = row.accountData.identitysData[6].st_performance.grade;
                                var a = '<a class="blue" onclick="ForStudent().SeeClassUser(' + row.id + ')" style="cursor: pointer">'+st_performance+'（'+grade+'）'+'</a>';
                                return a;
                            }else {
                                var a = '<a class="blue" onclick="ForStudent().SeeClassUser(' + row.id + ')" style="cursor: pointer">0'+'（'+grade+'）'+'</a>';
                                return  a;
                            }
                        }
                    },
                    {
                        field: 'classRecord',
                        align: "left",
                        title: '班内打分',
                        // width: '14.2%',
                        formatter: function (value, row, index) {
                            if (row.accountData.identitysData[6].st_classPrivatePerformanceValue) {
                                var st_performance = 600 + row.accountData.identitysData[6].st_classPrivatePerformanceValue;
                                var a = '<a class="blue" onclick="ForStudent().classgradeToStudentRecordHistory(' + row.id + ')" style="cursor: pointer">' + st_performance + '</a>';
                                return a;
                            } else {
                                var a = '<a class="blue" onclick="ForStudent().classgradeToStudentRecordHistory(' + row.id + ')" style="cursor: pointer">600</a>';
                                return a;

                                // var a="<a style='cursor: pointer' class='blue' onclick='ForStudent().classgradeToStudentRecordHistory("+row.id+")'>600</a>"

                            }
                        }
                    },
                    {
                        field: '',
                        align: "left",
                        title: '操作',
                         width: '10%',
                        formatter: function (value, row, index) {
                            var rname = row.accountData.rname;
                            var b = "<a class='red' onclick='ForStudent().classgradeToStudentRecord(" + row.id + ")'>打分</a>";
                            return b;
                        }
                    }
                ],
                responseHandler: function (result) {
                    if (result.error) {
                        if (400 <= result.error.errorCode && result.error.errorCode <= 500) {
                            tool().judge_token(function () {
                                parent.location.href=loginSrc;
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
                onEditableSave: function (field, row, oldValue, $el) {
                    $('#table1').bootstrapTable('resetView');
                      var params={
                          token:token,
                          faid:userId,
                          taid:row.id,
                          classgradenumber:row.rq
                      }
                    $.axse(urls+ modifyStudentMessage,params,function(result){
                           sl_Mask.YesTip('修改成功');
                        $('#table1').bootstrapTable('refresh');
                    })
                },
                 onEditableShown:function (e, editable,c,d) {
                    $('.input-sm').val('').attr('placeholder',d.value);

                 },
                formatLoadingMessage: function(){
                    return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
                },
                onClickRow:function (value, row, index) {

                       Information = value
            }

            })
        }
        //全部
        _m.all_table = function () {
            $('#student_all').find('#table1').bootstrapTable('destroy');
            var params = {
                token: token,
                faid: userId,
                iids: '6',
                director_account_id: userId,
                state:1
            }
            self.table(params);
        }
        //通过班级筛选学生
        _m.oneClass_table = function (cids) {
            $('#student_all').find('#table1').bootstrapTable('destroy');
            if (cids) {
                var params = {
                    token: token,
                    faid: userId,
                    cids: cids
                }
                self.table(params);
            } else {
                self.all_table();
            }
        }
        //搜索
        _m.search = function () {
            $('.search_btn').unbind('click').bind('click', function () {
                var val1 = $('#search').val();
                var  cids=$('select[name="classgaderid"]').val();
                if ($.trim(val1)) {
                    $('#student_all').find('#table1').bootstrapTable('destroy');
                    var params = {
                        faid: userId,
                        token: token,
                        keyword: val1
                    }
                    if(cids){params.cids=cids}
                     self.table(params);
                } else {
                    if(sessionStorage.identity_id==8){
                        var params={faid: userId,token: token}
                        if(cids){params.cids=cids}
                        self.table(params);
                    }else {
                        self.getStudent(cids);
                    }

                }
            })
        }
        //键盘事件
        _m.keyword = function () {
            $(document).keyup(function(event) {
                var e=event||window.event;
                if(e.keyCode == 13) {
                    var val1 = $('#search').val();
                    var  cids=$('select[name="classgaderid"]').val();
                    if ($.trim(val1)) {
                        $('#student_all').find('#table1').bootstrapTable('destroy');
                        var params = {
                            faid: userId,
                            token: token,
                            keyword: val1
                        }
                        if(cids){params.cids=cids}
                        self.table(params);
                    } else {
                        if(sessionStorage.identity_id==8){
                            var params={faid: userId,token: token}
                                if(cids){params.cids=cids}
                            self.table(params);
                        }else{

                            self.getStudent(cids);
                        }

                    }
                }
            });
        }
        //获取班级
        _m.class=function (ids) {
            var params = {
                faid:userId,
                token:token,
                major_id:ids,
                size:100
            }
            $.axse(urls+ Get_MajorClass, params, function (result) {
                var list=result.data.list
                var dom = "<option value=''>选择班级</option>";
                for(var j=0;j<list.length;j++){
                    dom += '<option value="' + list[j].id + '">' + list[j].name + '</option>';
                }
                $('select[name="classgaderid"]').html(dom);
                form.render();
                form.on('select(classgaderid)', function (majordata) {
                    self.getStudent(majordata.value);
                })

            })
        }
        //可编辑表格

        return _m;

    })();

