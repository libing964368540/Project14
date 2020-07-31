ForStudent = function () {
    var _m = {};
    var self = _m;
    //查看班级学生信息
    _m.SeeClassUser = function(taid) {
        var htmlDom ="pprojectRorStudent_Message.html?"+new Date().getTime();
        var index=layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative;line-height: 43px'>学生列表<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px;line-height: 43px;'>个人详情</a>",
            type: 2,
            content: htmlDom,
            area: ['100%', '100%'],
            success:function (layero,index) {
                var bodys = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                bodys.find('#personal_data').attr('data-taid',taid)
                bodys.find('.history').attr('data-taid',taid);
                var identity_id=sessionStorage.getItem('identity_id');
                    if(identity_id==4||identity_id==12||identity_id==13||identity_id==6||identity_id==7){
                        bodys.find('#canvas_top').hide();
                        bodys.find('#canvas_top_majorGroup').hide();
                    }else {
                        bodys.find('#canvas_top').show();
                        bodys.find('#canvas_top_majorGroup').show();
                    }
                
                var studentInformation = new PersonalInformation(Information,bodys);
                    studentInformation.fillPhoto();//填充头像
                var dom = studentInformation.ForTeacherToMessage();
                    bodys.find('.basic_M').append(dom);
                    studentInformation.fillCodeData();//填充二维码
                var LookMessage= new MaskForStudent(bodys.find('#personal_data')); //查看详细信息
                var code = new exportCode(bodys.find('#codeBtn')); //生成二维码
                var wayNum = Information.accountData.identitysData[6].st_way;
                    self.fill_Score(bodys,taid,wayNum);
            },
            cancel: function(layero,index){
                $('#table1').bootstrapTable('refresh');
                $(window).unbind("resize");
            }
        })
        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function() {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    //学生核心素养六大要素考核eachars图
    _m.echarsLD = function (bodys,indicatorArr,studentRecordArr,values) {

        var myChart = echarts.init(bodys.find('#student_eachars')[0]);
        option = {
            title : {},
            tooltip: {},
            radar: {
                name: {
                    textStyle: {
                        color: '#fff',
                        backgroundColor: '#999',
                        borderRadius: 3,
                        padding: [3, 5]
                    }
                },
                indicator:indicatorArr
            },
            series: [{
                name: '',
                type: 'radar',
                data: [{
                    value: studentRecordArr,
                    name: values
                }
                ]
            }]
        }
        myChart.setOption(option);
    }
    //学生核心素养得分排名的填充
    _m.ranking = function (bodys,projectPerformanc,wayNum) {
        var arr = [0,0,0];
        var Num = arr[wayNum];
          // canvas_echars.render(bodys,projectPerformanc);
        canvas_echars.PercentPie(bodys,projectPerformanc);
        //总分
        bodys.find('.project_name').text(projectPerformanc.project_name+'总评分')
        //总得分
        bodys.find('.project_name_value').text(Num+projectPerformanc.value||Num);
    }
    //核心素养单项考核排名填充
    _m.singleRanking = function (bodys,subProjectPerformanc){
        var RankingArr=[];
        var GoodArr=[];
        var PercentageArr =[];
        var failArr =[];
        // var LastRankingArr=[];
        // var LastGoodArr=[];
        // var LastPercentageArr =[];
        // var LastfailArr =[];
        for(var i=0;i<subProjectPerformanc.length;i++){
            //评分名称
            var name =subProjectPerformanc[i].statistics.project_name;
            var top_name= name+'全校排名第';
            var top_major_name=name+'全专业排名第';
            var top_classgrade_name= name+'全班级排名第';
            var top_majorGroup_name = name+'全专业部第'
            var top = subProjectPerformanc[i].statistics.top||0           //全校
            var top_major = subProjectPerformanc[i].statistics.top_major||0        //全专业
            var top_classgrade = subProjectPerformanc[i].statistics.top_classgrade||0    //班级
            var top_majorGroup = subProjectPerformanc[i].statistics.top_majorGroup||0    //全专业部
            RankingArr.push([
                {name:top_name,num:top},
                {name:top_majorGroup_name,num:top_majorGroup},
                {name:top_major_name,num:top_major},
                {name:top_classgrade_name,num:top_classgrade}
            ])
            var top_Percentage_name = name + '低于全校90%的同学'
            var top_major_Percentage_name = name + '低于全专业90%的同学'
            var top_classgrade_Percentage_name = name + '低于全班90%的同学'
            var top_majorGroup_Percentage_name = name +'低于全专业部90%的同学'
            var top_Percentage = top/subProjectPerformanc[i].statistics.population||0;         //全校百分比
            var top_major_Percentage = top_major/subProjectPerformanc[i].statistics.population_major||0; //全专业百分比
            var top_classgrade_Percentage = top_classgrade/subProjectPerformanc[i].statistics.population_classgrade||0;//全年级百分比
            var top_majorGroup_Percentage = top_majorGroup/subProjectPerformanc[i].statistics.population_majorGroup||0;
            PercentageArr.push([
                {name:top_Percentage_name,num:top_Percentage},
                {name:top_majorGroup_Percentage_name,num:top_majorGroup_Percentage},
                {name:top_major_Percentage_name,num:top_major_Percentage},
                {name:top_classgrade_Percentage_name,num:top_classgrade_Percentage}
            ])
        }
        //填充表现
        bodys.find('.behavior_title').text('表现')
        var good=self.fillGood(RankingArr,GoodArr,bodys);
        var fail=self.fillFail(PercentageArr,failArr,bodys);

    }
    //核心素养表现统计
    _m.fillGood = function (RankingArr,GoodArr,bodys) {
        var bigNum =['','一','二','三','四','五']
        for(var i=0;i<RankingArr.length;i++){
            var arr=[];
            for(var j=0;j<RankingArr[i].length;j++){
                if(0<RankingArr[i][j].num&&RankingArr[i][j].num<=5){
                    arr.push(RankingArr[i][j].name+bigNum[RankingArr[i][j].num]);
                }
            }
            if(arr.length!=0){
                GoodArr.push(arr[0]);
            }
        }
        if(bodys){
            var dom="";
            if(GoodArr.length==0){
                dom+='<p>暂无</p>';
            }else {
                for(var i=0;i<GoodArr.length;i++){
                    dom+='<li><i class="material-icons" style="color: #96c7ff;vertical-align: bottom;">thumb_up</i><p>'+GoodArr[i]+'</p></li>';
                }
            }
            bodys.find('.GoodArr').html(dom);
        }
        return GoodArr.length;
    }
    //核心素养不好的表现
    _m.fillFail = function (PercentageArr,failArr,bodys) {
        for(var i=0;i<PercentageArr.length;i++){
            var arr=[];
            for(var j=0;j<PercentageArr[i].length;j++){
                if(PercentageArr[i][j].num>0.9&&PercentageArr[i][j].num<1){
                    arr.push(PercentageArr[i][j].name);
                }
            }
            if(arr.length!=0){
                failArr.push(arr[0]);
            }
        }
        if(bodys){
            var dom="";
            if(failArr.length==0){

            }else {

                for(var i=0;i<failArr.length;i++){
                    dom+='<li><i class="material-icons" style="color: #ff4747;vertical-align: bottom;transform:rotate(180deg)">wb_incandescent</i><p>'+failArr[i]+'</p></li>';
                }
            }
            bodys.find('.failArr').html(dom);
        }
        return  failArr.length;
    }
    //学生个人打分
    _m.studentRecord = function (taid) {
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>学生列表<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>学生打分</a>",
            type: 2,
            content: "pprojectRorStudent_record.html",
            area: ['100%', '100%'],
            success:function(layero,index){
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                // var  params={
                //     token:token,
                //     faid:userId,
                //     taid:taid
                // }
                // $.axse(urls+onestudentList,params,function(result) {
                 var data = Information;
                        body.find('.studentTitle').text('为'+data.accountData.rname+'的表现打分')
                        body.find('input[name="rname"]').attr('data-taid',taid);
                        body.find('input[name="rname"]').val(data.accountData.rname);


                // })
            },
            cancel: function(index, layero){
                mainPage.all_table();
                $(window).unbind("resize");
            }
        })

        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function() {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    //班内给学生个人打分
    _m.classgradeToStudentRecord = function (taid) {
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>学生列表<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>学生打分</a>",
            type: 2,
            content: "pprojectForStudent_classgrade_record.html",
            area: ['100%', '100%'],
            success:function (layero,index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                var  params={
                    token:token,
                    faid:userId,
                    taid:taid
                }
                $.axse(urls+onestudentList,params,function(result) {
                    if(!result.error){
                        body.find('.studentTitle').text('为'+result.data.accountData.rname+'的表现打分')
                        body.find('input[name="rname"]').attr('data-taid',taid);
                        body.find('input[name="rname"]').val(result.data.accountData.rname);
                    }

                })
            },
            cancel: function(index, layero){
                mainPage.all_table();
                $(window).unbind("resize");
            }
        })

        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function() {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    //班内给学生个人打分
    _m.classgradeToStudentRecordHistory = function (taid) {
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>学生列表<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>班内打分历史</a>",
            type: 2,
            content: "pprojectForStudent_classgrade_ScoreHistory.html",
            area: ['100%', '100%'],
            success:function (layero,index) {
                var bodys = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                bodys.find('#personal_data').attr('data-taid',taid);
                bodys.find('.history').attr('data-taid',taid);
               
                var studentInformation = new PersonalInformation(Information,bodys);
                    studentInformation.fillPhoto();//填充头像
                var dom=studentInformation.ForTeacherToMessage();
                bodys.find('.basic_M').append(dom);
                studentInformation.fillCodeData();//填充二维码
                var LookMessage= new MaskForStudent(bodys.find('#personal_data')); //查看详细信息
                var code = new exportCode(bodys.find('#codeBtn')); //生成二维码
                var params={
                    token:token,
                    faid:userId,
                    student_account_id:taid
                }
                self.classgradeToStudentRecordHistory_Table(bodys,params);
            },
            cancel: function(index, layero){
                $(window).unbind("resize");
            }
        })

        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function() {
            top.layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    //班内打分填充表格
    _m.classgradeToStudentRecordHistory_Table = function (bodys,filed) {
            if(!filed.token||!sessionStorage.identity_id){
                tool().judge_token(function () {
                    top.location.href=loginSrc;
                })
                return;
            }
            if(filed) $.extend(filed,pclogin);
            bodys.find('#table1').bootstrapTable({
                url: urls+ '/classPrivateProject/getRecords.action',
                queryParams: function (params) {
                    var obj = {
                        size: params.limit,
                        page: params.offset / params.limit,
                    }
                    if (filed) $.extend(obj, filed);
                    return obj;
                },
                sidePagination: "server",
                pagination: true,
                paginationLoop: false,
                paginationShowPageGo: true,
                pageNumber: 1,
                striped:true,
                cache:false,
                pageSize: 5,
                pageList: [5, 10, 15],
                columns: [{
                    field: 'commit_time',
                    align: "center",
                    title: '打分时间',
                    formatter: function(value, row, index) {
                        var a=tool().getSmpFormatDateByLong(row.time,false);
                        return a;
                    }
                }, {
                    field: '',
                    align: "center",
                    title: '打分项',
                    formatter: function(value, row, index) {
                        var a = row.project.name;
                        return a;
                    }
                }, {
                    field: 'value',
                    align: "center",
                    title: '分值'
                },{
                    field: 'des',
                    align: "center",
                    title: '备注'
                },{
                    field: 'sum_value',
                    align: "center",
                    title: '总分',
                    formatter: function(value, row, index) {
                        var a = 600+row.sum_value;
                        return a;
                    }
                }, {
                    field: '',
                    align: "center",
                    title: '打分人',
                    formatter: function(value, row, index) {
                        var a = row.teacher.rname;
                        return a;
                    }
                }
                ],responseHandler:function(result){
                    if(result.error){
                        if(400<=result.error.errorCode&&result.error.errorCode<=500){
                            top.location.href=loginSrc;
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
    //通过弹框选择  给学生班内打分 还是校内打分
    _m.switch_Mask = function (taid) {
        var index = top.layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['300px', 'auto'],
            content: '<div style="height: 150px"><div style="padding-top: 60px;display: inline-block;padding-left: 50px"><span class="school_Btn school" style="margin-right: 30px;width: 85px;">校级打分</span><span class="school_Btn classgrade" style="width: 85px;">班内打分</span></div></div>',
            success: function (layero, index) {
                var school_Role =$(layero).find('.school');
                var classgrade_Role=$(layero).find('.classgrade');
                school_Role.unbind('click').bind('click',function () {
                    top.layer.close(index);
                    self.studentRecord(taid)

                })
                classgrade_Role.unbind('click').bind('click',function () {
                    top.layer.close(index);
                    self.classgradeToStudentRecord(taid)
                })
            }
        })

        }
    //填充学生成绩
    _m.fill_Score = function (bodys,taid,wayNum) {
        var loadings= parent.layui.layer.load(2);
        var params={
            faid:userId,
            token:token,
            project_id:1,
            taid:taid
        }
        $.axse(urls+'/performance/statistics/student/getPerformanceReport.action', params, function(result) {
            parent.layui.layer.close(loadings);
            var indicatorArr = [];            //最高分
            var studentRecordArr = [];         //个人成绩
            // var lastPerformanct= result.data.lastPerformanct;   //上一周数据的
            var projectPerformanc = result.data.projectPerformanc.statistics;         //个人考核项目(顶级目录)
            var subProjectPerformanc = result.data.subProjectPerformanc;//个人成绩以及全校的最高分
            for(var i=0;i<subProjectPerformanc.length;i++){
                var heightStatistics=subProjectPerformanc[i].heightStatistics;
                   if(heightStatistics.value<0){
                        heightStatistics.value=0;
                      }
                if(subProjectPerformanc[i].statistics.value+0<0){
                    var statistics = subProjectPerformanc[i].statistics.value+0||0;
                    indicatorArr.push({
                        name:heightStatistics.project_name,
                        max: 0+heightStatistics.value||0,
                        min: subProjectPerformanc[i].statistics.value+0||0
                    })
                }else {
                    var statistics = subProjectPerformanc[i].statistics.value+0||0;
                    indicatorArr.push({
                        name:heightStatistics.project_name,
                        max: 0+heightStatistics.value||0
                    })
                }
                studentRecordArr.push(statistics)
            }
            self.ranking(bodys,result.data.projectPerformanc.statistics,wayNum);  //名次的填充
            self.echarsLD(bodys,indicatorArr,studentRecordArr,projectPerformanc.project_name);//多维图
            self.singleRanking(bodys,subProjectPerformanc);    //单项考核的评分
        },function () {
            parent.layui.layer.close(loadings);
        })
    }
    //学生家长账号登录
    _m.fill_Score2 = function (bodys,taid,wayNum) {
        // var loadings= parent.layui.layer.load(2);
        var params={
            faid:userId,
            token:token,
            project_id:1,
            taid:taid
        }
        $.axse(urls+'/performance/statistics/student/getPerformanceReport.action', params, function(result) {
            // parent.layui.layer.close(loadings);
            var indicatorArr = [];            //最高分
            var studentRecordArr = [];         //个人成绩
            // var lastPerformanct= result.data.lastPerformanct;   //上一周数据的
            var projectPerformanc = result.data.projectPerformanc.statistics;         //个人考核项目(顶级目录)
            var subProjectPerformanc = result.data.subProjectPerformanc;//个人成绩以及全校的最高分
            for(var i=0;i<subProjectPerformanc.length;i++){
                var heightStatistics=subProjectPerformanc[i].heightStatistics;
                if(heightStatistics.value<0){
                    heightStatistics.value=0;
                }
                if(subProjectPerformanc[i].statistics.value+50<0){
                    var statistics = subProjectPerformanc[i].statistics.value+50||50;
                    indicatorArr.push({
                        name:heightStatistics.project_name,
                        max: 50+heightStatistics.value||50,
                        min: subProjectPerformanc[i].statistics.value+50||50
                    })
                }else {
                    var statistics = subProjectPerformanc[i].statistics.value+50||50;
                    indicatorArr.push({
                        name:heightStatistics.project_name,
                        max: 50+heightStatistics.value||50
                    })
                }
                studentRecordArr.push(statistics)
            }
            self.ranking(bodys,result.data.projectPerformanc.statistics,wayNum);  //名次的填充
            self.echarsLD(bodys,indicatorArr,studentRecordArr,projectPerformanc.project_name);//多维图
            self.singleRanking(bodys,subProjectPerformanc);    //单项考核的评分
        },function () {
            // parent.layui.layer.close(loadings);
        })
    }
    //核心素养分数汇总
    _m.Total_score_echars= function (ids,arr) {
        $("#"+ids).css('width',$("#"+ids).width());
        var table_echarts = echarts.init(document.getElementById(ids));
        option = {
            title : {
                text: '',
                subtext: '',
                x:'center',
                bottom:'-5',
                textStyle:{
                    //文字颜色
                    color:'#000',
                    //字体风格,'normal','italic','oblique'
                    fontStyle:'normal',
                    fontWeight:'normal',
                    //字体大小
                    fontSize:14
                }
            },
            color:['#37a2da', '#67e0e3','#fff065','#ff9f7f','#e36fb5','#eba53e'],
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            series : [
                {
                    name: '核心素养',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '41%'],
                    data: arr,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }

                }
            ]
        };
        table_echarts.setOption(option);
    }

   return _m;
}