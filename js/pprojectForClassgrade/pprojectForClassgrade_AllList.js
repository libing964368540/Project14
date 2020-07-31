layui.use(['layer', 'form', 'element'], function() {
    var layer = layui.layer
        ,form = layui.form
        ,element = layui.element

    school_class = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            self.all();
            self.keyword();
            // self.getbranch(school_class.select);
            self.grade(school_class.select);

        }
        //table
        _m.table = function (filed,project_name) {
            if(!filed.token||!sessionStorage.identity_id){
                tool().judge_token(function () {
                    top.location.href=loginSrc;
                })
                return;
            }
            if(filed) $.extend(filed,pclogin);
            if(!project_name){
                project_name=$('select[name="project_id"]').find("option:selected").text()
            }
            $('#student_all').find('#table1').bootstrapTable('destroy');
            $('#table1').bootstrapTable({
                url: urls + ClassList,
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
                pagination: true,
                paginationLoop: false,
                paginationShowPageGo: true,
                striped : true,
                cache:false,
                pageNumber: 1,
                pageSize: 10,
                pageList: [10, 15, 25],
                columns: [
                    {
                        field: '',
                        align: "center",
                        title: '序号',
                        width:'80px',
                        formatter: function (value, row, index) {
                            var pageSize = $('#table1').bootstrapTable('getOptions').pageSize;
                            //通过表的#id 可以得到每页多少条
                            var pageNumber = $('#table1').bootstrapTable('getOptions').pageNumber;
                            //通过表的#id 可以得到当前第几页
                            return pageSize * (pageNumber - 1) + index + 1;
                            //返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
                        }

                    }, {
                        field: '',
                        align: "center",
                        title: '班级',
                        width:'180px',
                        formatter: function (value, row, index) {
                            var a = row.name;
                            return a;
                        }
                    }, {
                        field: '',
                        align: "center",
                        title: '专业',
                        width:'200px',
                        formatter: function (value, row, index, limit) {
                            var a = row.major.name;
                            return a;
                        }
                    }, {
                        field: '',
                        align: "center",
                        title: '专业部',

                        formatter: function (value, row, index) {
                            var a = row.major.group.name;
                            return a;
                        }
                    }, {
                        field: '',
                        align: "center",
                        title: '班主任',
                        formatter: function (value, row, index) {
                            if(row.director){
                                var a = row.director.accountData.rname;
                                return a;
                            }
                        }
                    }, {
                        field: 'value',
                        align: "center",
                        title: project_name,
                        formatter: function (value, row, index) {
                            var a=row.value+200;
                            return a;
                        }
                    },
                    {
                        field: '',
                        align: "center",
                        title: '操作',
                        formatter: function (value, row, index) {
                            var a = '<a class="blue "style="margin-right: 20px" onclick="pprojectForClassgrade_Mask().classdetail(' + row.id + ')">查看</a>'
                            var identity_id=sessionStorage.identity_id;
                            if(identity_id==4){
                                var a = '<a class="blue" onclick="pprojectForClassgrade_Mask().classdetail(' + row.id + ')">查看</a>'
                                var b='';
                            }else {
                                var b = '<a class="red" onclick="pprojectForClassgrade_Mask().classScore(' + row.id + ')">打分</a>';
                            }

                            return a + b;
                        }
                    }
                ], responseHandler: function (result) {
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
                formatLoadingMessage: function(){
                    return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
                }

            })
        }
        _m.all = function () {
            var params = {
                faid: userId,
                token: token,
                project_id:0
            };
            $.axse(urls + ClassContents, params, function (result) {
                     var data = result.data;
                     if(data.length>0){
                         params.project_id =data[0].id
                         self.table(params,data[0].name);
                         self.AssessmentClass(result,school_class.select);
                     }else {
                         self.table(params);
                     }
            })
        }
        //获取班级根目录填充五项评比
        _m.AssessmentClass=function (result,fn) {
            var data = result.data;
            var dom = "";
            for (var i = 0; i < data.length; i++) {
                dom += '<option value=' + data[i].id + '>' + data[i].name + '</option>'
            }
            $('select[name="project_id"]').html(dom);
            form.render();
            form.on('select(project_id)', function (data) {
                var text=$('select[name="project_id"]').find("option:selected").text()
                // params.project_id = data.value;
                fn(text);
            })
        }
        //获取专业部信息
        _m.getbranch=function (fn) {
            var params ={
                faid:userId,
                token:token
            }
            $.axse(urls+'/major/getMajorGroups.action',params,function(result){
                var dom="<option value=''>选择专业部</option>";
                var data=result.data;
                if(data&&data.length>0){
                    for(var i=0;i<data.length;i++){
                        dom+='<option value="'+data[i].id+'">'+data[i].name+'</option>'
                    }
                    $('select[name="groupid"]').html(dom)
                    layui.form.render();
                    form.on('select(groupid)', function (majordata) {
                        self.getMajor(majordata.value,fn);
                        fn();
                    })
                }
            },function () {

            })

        }
        //选择框的内容
        _m.select = function (project_name) {
            var val1=$('#search').val();
            var params={
                token:token,
                faid:userId,
                major_group_id:$('select[name="groupid"]').val(),
                major_id:$('select[name="major_id"]').val(),
                grade:$('select[name="grade"]').val(),
                project_id:$('select[name="project_id"]').val()
            }
            if($.trim(val1)){params.keyword=val1}
            self.table(params,project_name);
            self.eacharsAjax();
        }
        // 二级联动通过专业部刷选专业
        _m.getMajor=function (groupid,fn) {
            var params = {
                faid: userId,
                token: token,
                groupid:groupid
            }
            $.axse(urls+'/major/getMajorsForGroupId.action', params, function (result) {
                if(!result.error) {
                    var data = result.data;
                    if (data && data.length > 0) {
                        var dom = "<option value=''>选择专业</option>";
                        for (var i = 0; i < data.length; i++) {
                            dom += '<option value=' + data[i].id + '>' + data[i].name + '</option>'
                        }
                        $("select[name='major_id']").html(dom);
                        form.render();
                        form.on('select(major_id)', function (majordata) {
                            fn();
                        })
                    }
                }
            })
        }

        //选择年级
        _m.grade =function (fn) {
            form.on('select(grade)', function (data) {
                fn();
            })
        }
        //选择评比项
        //搜索班级
        _m.search = function () {
            self.select();
                // var val1=$('#search').val();
                // if($.trim(val1)){
                //     $('#student_all').find('#table1').bootstrapTable('destroy');
                //     var params={
                //         faid:userId,
                //         token:token,
                //         keyword:val1
                //     }
                //     self.table(params);
                // }else{
                //     self.all();
                // }
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
        //
        _m.eacharsAjax = function () {
            var params={
                token:token,
                faid:userId,
                major_group_id:$('select[name="groupid"]').val(),
                major_id:$('select[name="major_id"]').val(),
                grade:$('select[name="grade"]').val(),
                project_id:$('select[name="project_id"]').val(),
                size:3000
            }
            $.axse(urls + ClassList,params,function(result){
                      var RecordArr=[];
                      var classNameArr =[];
                      var list=result.data.list;
                      for(var i=0;i<list.length;i++){
                          classNameArr.push(list[i].name);
                          if(!list[i].value){
                              list[i].value=0;
                          }
                          RecordArr.push(200+list[i].value);
                      }

                      self.classEachars(RecordArr,classNameArr);

            })
        }
        //班级图表的echars
        _m.classEachars = function (RecordArr,classNameArr) {
            $("#school_class_echars").css('width',$("#school_class_echars").width());//#school_class_echars为第一个页面的div宽度
            var myChart = echarts.init(document.getElementById('school_class_echars'));
            var obama_budget_2012 ={
                "budget2011List":RecordArr,
                "names":classNameArr
            }
            option={
                tooltip : {
                    // trigger: 'axis',
                    axisPointer: {
                        type: '',
                        label: {
                            show: false
                        }
                    }
                },
                toolbox: {
                    show : false,
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                grid: {
                    top: '10%',
                    left: '1%',
                    right: '10%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type : 'category',
                        data : obama_budget_2012.names,
                        "axisLine":{       //y轴
                            "show":false,
                            'lineStyle':{
                                color:'#6a6a6a'
                            }
                        },
                        "axisTick":{       //y轴刻度线
                            "show":false
                        },
                        "splitLine": {     //网格线
                            "show": false
                        },

                         axisLabel : {
                             rotate:45, //刻度旋转45度角
                            show:true,
                            interval: 'auto',    // {number}
                            margin: 15,
                            textStyle: {
                                color: '#6a6a6a'
                            }
                        }
                    }
                ],
                yAxis: [
                    {
                        type : 'value',
                        name : '',
                        "axisLine":{       //y轴
                            "show":true,
                            "lineStyle":{
                                color:"#f8f8f8"
                            }
                        },
                        "axisTick":{       //y轴刻度线
                            "show":false,
                        },
                        "splitLine": {     //网格线
                            "show": false,
                            "lineStyle":{
                                color:'#f8f8f8'
                            }

                        },
                        axisLabel : {
                            show:true,
                            interval: 'auto',    // {number}
                            rotate:0,
                            margin: 10,
                            textStyle: {
                                color: '#c9c9c9'
                            }
                        }

                    }
                ],
                dataZoom: [
                    {
                        show: false,
                        start: 50,
                        end: 94,
                        minSpan:20,
                        maxSpan:40
                    },
                    {
                        type: 'inside',
                        start: 9,
                        end: 30
                    },
                    {
                        show: false,
                        yAxisIndex: 0,
                        filterMode: 'empty',
                        width: 30,
                        height: '80%',
                        showDataShadow: false,
                        left: '20%'
                    }
                ],
                series : [
                    {
                        name: '总分',
                        type: 'bar',
                        data: obama_budget_2012.budget2011List,
                        barWidth:30,//柱图宽度
                        barCategoryGap:'10',
                        itemStyle: {
                            // 点的颜色。
                            color:function(params){
                                var index_color = params.name;

                                if(index_color=='我的班'){
                                    return '#2387f9'
                                }else{
                                    return '#e0e0e0'
                                }

                            }
                        },
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },

                    }
                ],
            }
            myChart.setOption(option);
        }

        return _m;
    })()
       school_class.init();
    setTimeout(function () {
        // tool().AssessmentClass(school_class.select);
        school_class.getbranch(school_class.select);
    },2000);
     // tool().termSelect(school_class.select);
    // input搜索
    var query = new Query_table('QueryWrap',{
        tip:'请输入班级名称',
        successFn:school_class.search
    })
})

$('#student_all .switchIcon').unbind('click').bind('click', function() {
    $(this).toggleClass('active');
    if($(this).hasClass('active')) {
        $('#student_all .tableWrap').removeClass('active');
        $('#student_all .tableWrap').eq(0).addClass('active');
    } else {
        $('#student_all .tableWrap').removeClass('active');
        $('#student_all .tableWrap').eq(1).addClass('active');
        school_class.eacharsAjax();
    }
})