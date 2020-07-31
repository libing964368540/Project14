layui.use(['layer', 'form', 'element','laydate'], function() {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element
        , laydate = layui.laydate
          date =new Date();
    laydate.render({
        elem: '#time', //指定元素
        format: 'yyyy-MM-dd',
        max: 'date',
        done: function(value, date, endDate){
            mainPage.query();
        }
    });

    //移除按钮
    //添加账户
    mainPage = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            $('#time').val(tool().getSmpFormatDateByLong(new Date(),false));
            self.all_table();
            self.school();
            // self.query();
        }
        //当日住校名单查询
        _m.nowtable = function (filed) {
            if(!filed.token||!sessionStorage.identity_id){
                tool().judge_token(function () {
                    parent.location.href=loginSrc;
                })
                return;
            }
            if(filed) $.extend(filed,pclogin);
            $('#account').find('#table1').bootstrapTable('destroy');
            $('#table1').bootstrapTable({
                url: urls + '/accountStudent/getStudentForInResidenceToday.action',
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
                // striped:true,
                columns:
                    [{
                        field: '',
                        align: "left",
                        title: '序号',
                        width: '180px',
                        formatter: function (value, row, index) {
                            var pageSize=$('#table1').bootstrapTable('getOptions').pageSize;
                            //通过表的#id 可以得到每页多少条
                            var pageNumber=$('#table1').bootstrapTable('getOptions').pageNumber;
                            //通过表的#id 可以得到当前第几页
                            return pageSize * (pageNumber - 1) + index + 1;
                            //返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
                        }
                    },{
                        field: 'group',
                        align: "left",
                        title: '专业部',
                        width: '180px',
                        formatter: function (value, row, index) {
                            var  a= row.major.group.name;
                            return a;
                        }
                    }, {
                        field: 'classgrade',
                        align: "left",
                        title: '班级',
                        formatter: function (value, row, index) {
                            var a=row.classgrade.name;
                            return a;
                        }
                    }, {
                        field: '',
                        align: "left",
                        title: '班主任',
                        formatter: function (value, row, index) {
                            if(row.classgrade.director){
                                var a=row.classgrade.director.rname;
                                return a;
                            }

                        }
                    }, {
                        field: 'rname',
                        align: "left",
                        title: '学生',
                        formatter: function (value, row, index) {
                            var a=row.rname;
                            return a;
                        }
                    }, {
                        field: 'dormitory',
                        align: "left",
                        title: '住宿信息',
                        formatter: function (value, row, index) {
                            if(row.dormitory){
                                var obj={1:'男生寝室',2:'女生寝室'};
                                var dormitory=row.dormitory.dormitory;
                                var a=obj[dormitory.dormitory_type]+'-'+dormitory.number+'-'+row.dormitory.index;
                                return a;
                            }else {
                                return '暂无'
                            }
                        }
                    }],
                responseHandler: function (result) {
                    if (result.error) {
                        if (400 <= result.error.errorCode && result.error.errorCode <= 500) {
                            tool().judge_token(function () {
                                parent.location.href=loginSrc;
                            })
                        } else {
                            sl_Mask.NoTip(result.error.message);
                            return {
                                "rows":'',
                                "total":''
                            }
                        }
                    } else {
                        self.fillStop(result.data.checkSotpStudents,$('.stopStudents'));
                        self.fill(result.data.leaveStudents,$('.leaveStudents'));
                        $('.searchDate').text($('#time').val());
                        $('.total').text(result.data.count);
                        // return result.inResidenceStudents
                        return {
                            "rows":result.data.inResidenceStudents,
                            "total":result.data.count
                        }
                    }
                },
                formatLoadingMessage: function(){
                    return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
                }
            })
        }
        //往日住校名单查询
        _m.Oldtable = function (filed) {
            if(!filed.token||!sessionStorage.identity_id){
                tool().judge_token(function () {
                    parent.location.href=loginSrc;
                })
                return;
            }
            if(filed) $.extend(filed,pclogin);
            $('#account').find('#table1').bootstrapTable('destroy');
            $('#table1').bootstrapTable({
                url: urls + '/accountStudent/getStudentForInResidenceHistory.action',
                queryParams: function () {
                    return filed;
                },
                sidePagination: "client",
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
                            var index = index+1;
                            return index;
                        }
                    },{
                        field: 'group',
                        align: "center",
                        title: '专业部',
                        width: '180px',
                        formatter: function (value, row, index) {
                           var  a= row.major.group.name;
                           return a;
                        }
                    }, {
                        field: 'classgrade',
                        align: "center",
                        title: '班级',
                        formatter: function (value, row, index) {
                           var a=row.classgrade.name;
                           return a;
                        }
                    }, {
                        field: '',
                        align: "center",
                        title: '班主任',
                        formatter: function (value, row, index) {
                            if(row.classgrade.director){
                                var a=row.classgrade.director.rname;
                                return a;
                            }

                        }
                    }, {
                        field: 'rname',
                        align: "center",
                        title: '学生',
                        formatter: function (value, row, index) {
                            var a=row.rname;
                            return a;
                        }
                    }, {
                        field: 'dormitory',
                        align: "center",
                        title: '住宿信息',
                        formatter: function (value, row, index) {
                            if(row.dormitory){
                                var obj={1:'男生寝室',2:'女生寝室'};
                                var dormitory=row.dormitory.dormitory;
                                var a=obj[dormitory.dormitory_type]+'-'+dormitory.number+'-'+row.dormitory.index;
                                return a;
                            }else {
                                return '暂无'
                            }

                        }
                    }],
                responseHandler: function (result) {
                    if (result.error) {
                        if (400 <= result.error.errorCode && result.error.errorCode <= 500) {
                            tool().judge_token(function () {
                                parent.location.href=loginSrc;
                            })
                        } else {
                            sl_Mask.NoTip(result.error.message);;
                          return [];
                        }

                    } else {
                        self.fill(result.checkSotpStudents,$('.stopStudents'));
                        self.fill(result.leaveStudents,$('.leaveStudents'));
                         $('.searchDate').text($('#time').val());
                         $('.total').text(result.inResidenceStudents.length);
                        return result.inResidenceStudents
                    }
                },
                formatLoadingMessage: function(){
                    return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
                }
            })

        }
        //给学期表格传参
        _m.all_table = function () {
            var params = {
                faid: userId,
                token: token
            }
            self.nowtable(params);
        }
        //查询功能
        _m.query = function () {
            // $('#search').unbind('click').bind('click',function () {
                var time=$('#time').val();
                var school_district_id=$('select[name="school_district_id"]').val();
                if(time||school_district_id){
                    var params={
                        token:token,
                        faid:userId
                    }
                    if(time){
                        params.time=new Date(time.replace(/-/g, "/")+' 23:00:00').getTime()
                    }
                    if(school_district_id){
                        params.school_district_id=school_district_id;
                    }
                    var nowTime=new Date().getTime()
                    if(params.time<nowTime){
                         self.Oldtable(params);
                    }else {
                        self.all_table();
                    }
                }else {
                    sl_Mask.NoTip('请选择全部查询条件');
                }
            // })

        }
        //填充停住
        _m.fill= function (data,obj) {
            if(data&&data.length>0){
                var arr=[];
                var objs={1:'男生寝室',2:'女生寝室'};
               for(var i=0;i<data.length;i++){
                   if(data[i].dormitory){
                       var dormitory=data[i].dormitory.dormitory;
                       arr.push(data[i].rname+'【'+data[i].classgrade.name+'】'+'【'+objs[dormitory.dormitory_type]+dormitory.number+'-'+data[i].dormitory.index+'】');
                   }else {
                       arr.push(data[i].rname+'【'+data[i].classgrade.name+'】'+'【暂无】');
                   }
               }
                obj.empty();
               obj.append(arr.join('；'));
            }else {
                obj.text('暂无');
            }
        }
        //填充停住
        _m.fillStop = function (data,obj) {
            if(data&&data.length>0){
                var arr=[];
                var objs={1:'男生寝室',2:'女生寝室'};
                for(var i=0;i<data.length;i++){
                    var classgradeName =data[i].classgrade.name;
                    var accounts=data[i].accounts;
                    for(var j=0;j<accounts.length;j++){
                        var account = accounts[j].account;
                        var dormitory = accounts[j].dormitory;
                        if(dormitory.dormitory.number){
                            arr.push(account.rname+'【'+classgradeName+'】'+'【'+objs[dormitory.dormitory.dormitory_type]+dormitory.dormitory.number+'-'+dormitory.index+'】');
                        }else {
                            arr.push(account.rname+'【'+classgradeName+'】'+'【暂无】');
                        }
                    }
                }
                obj.empty();
                obj.append(arr.join('；'));

            }else {
                obj.text('暂无');
            }
        }
        //通过选择校区去选择
        _m.school = function () {
            form.on('select(school_district_id)', function (data) {
                self.query();
            })
        }
        return _m;

    })();
    mainPage.init();
})