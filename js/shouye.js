var shouyeMessage=null;
var shouye = (function () {
    var _m={};
    var self = _m;
    _m.init=function () {
        var rname= sessionStorage.rname;
        if(rname!='undefined'){
            $('h3.sl-title').text('Welcome，'+rname+'老师');
        }else {
            $('h3.sl-title').text('Welcome，'+sessionStorage.username+'老师');
        }
        self.NowTime();
        self.jude_role();
        self.echarsInit();
        self.jump();
    }
    _m.echarsInit=function () {
        $(window).on('resize',function() {
            self.score();
            self.zhu('zhu',shouyeMessage);
        }).resize();
    }
    //获取全校的核心素养的打分情况
    //得分情况请求
    _m.score = function (filed) {
        var params = {
            token:token,
            faid:userId
        }
        if(filed) $.extend(params,filed);
        $.axse(urls+'/performance/statistics/student/getPerformanceScale.action',params,function(result) {
            var projects= result.data.projects;
            var arr_reduce=arr_add =[{value:0, name:'科学精神'},{value:0, name:'学会学习'},
                {value:0, name:'人文底蕴',}, {value:0, name:'实践创新'},
                {value:0, name:'责任担当'},{value:0, name:'健康生活'}];
            var arr_add =[{value:0, name:'科学精神'},{value:0, name:'学会学习'},
                {value:0, name:'人文底蕴'}, {value:0, name:'实践创新'},
                {value:0, name:'责任担当'},{value:0, name:'健康生活'}];
            var add_Total =0;
            var reduce_Total=0;
            for(var i=0;i<projects.length;i++){
                if(projects[i].project_id==0){
                    continue;
                }else {
                    add_Total+=projects[i].add_value;
                    reduce_Total+=projects[i].subtract_value;
                    self.fill_score(projects[i],arr_reduce,arr_add,add_Total,reduce_Total);
                }
            }
//                    ForStudent().Total_score_echars('pproject_Add',arr_add);
//                    ForStudent().Total_score_echars('pproject_reduce',arr_reduce);
            self.picbing('bingtu',arr_add);
        })
    }
    //填充得分
    _m.fill_score = function (project,arr_reduce,arr_add) {
        switch (project.project_name){
            case '科学精神':
                arr_add[0].value=Number(project.add_value)
                arr_reduce[0].value =Number(project.subtract_value)
                break;
            case '学会学习':
                arr_add[1].value=Number(project.add_value)
                arr_reduce[1].value =Number(project.subtract_value)
                break;
            case '人文底蕴':
                arr_add[2].value=Number(project.add_value)
                arr_reduce[2].value =Number(project.subtract_value)
                break;
            case '实践创新':
                arr_add[3].value=Number(project.add_value)
                arr_reduce[3].value =Number(project.subtract_value)
                break;
            case '责任担当':
                arr_add[4].value=Number(project.add_value)
                arr_reduce[4].value =Number(project.subtract_value)
                break;
            case '健康生活':
                arr_add[5].value=Number(project.add_value)
                arr_reduce[5].value =Number(project.subtract_value)
                break;
        }
    }
    _m.picbing = function (ids,arr) {
        var table_echarts = echarts.init(document.getElementById(ids));
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            color:['#37a2da', '#67e0e3','#fff065','#ff9f7f','#e36fb5','#eba53e'],
            legend: {
                orient: 'vertical',
                x: 'left',
                data:['科学精神','学会学习','人文底蕴','实践创新','责任担当','健康生活']
            },
            series: [
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['50%', '70%'],
                    center: ['55%','50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '16',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:arr
                }
            ]
        };
        table_echarts.setOption(option);
    }
    _m.zhu = function (ids,obj) {
        var timeArr=[];
        var aArr =[];
        var bArr =[];
        if(obj){
            weekInfo=obj.weekInfo.reverse();
            for(var i=0;i<weekInfo.length;i++){
                timeArr.push(tool().getSmpFormatDateByLong(weekInfo[i].time,false));
                aArr.push(weekInfo[i].a);
                bArr.push(weekInfo[i].b);
            }
        }else {
            return;
        }
        var table_echarts = echarts.init(document.getElementById(ids));
        option = {
            title : {
                text: '核心素养评价动态',
            },
            tooltip : {
                trigger: 'axis'
            },
            color:['#2196f3','#ff4747'],
            legend: {
                data:['加分','减分']
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    data : timeArr
                }

            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:'加分',
                    type:'bar',
                    data:aArr,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name: '平均值'}
                        ]
                    }
                },
                {
                    name:'减分',
                    type:'bar',
                    data: bArr
                }
            ]
        };

        table_echarts.setOption(option);
    }
    /*通过当前日期获取周次和学期*/
    _m.NowTime = function () {
        var date = new Date();
        var nowTime= date.getTime();
        var nowTimeS = tool().getSmpFormatDateByLong(nowTime,false).replace(/-/g,"/");
        nowTime = new Date(nowTimeS+' 00:00:00').getTime();
        var params = {
            faid: userId,
            token: token,
            time: nowTime
        }
        $.axse(urls+'/time/getCurrentTime.action', params, function (result) {
            var data= result.data;
            if(data){
                //学期
                $('#grad3').find('.semester').text(data.semester.name)
                //周次
                $('#grad3').find('.week').text(data.week.name)
                $('#grad3').find('.date').text(nowTimeS.replace(/-/g,"/")+'学生总数（全校）')
            }
        },function (e) {
            e.error.message="今天是休息日";
            $('#grad3').find('.week').text('休息日')
            $('#grad3').find('.date').text(nowTimeS.replace(/-/g,"/")+'学生总数（全校）')
        })
        $.axse(urls+'/duty/getDuty.action', params, function (result) {
            var data=result.data;
            if(data.length==0){
              $('.dutyCount').text('否');
            }else {
                 for(var i=0;i<data.length;i++){
                     if(data[i].teacher.id==userId){
                         $('.dutyCount').text('是');
                     }
                 }
            }
        },function () {
            
        })
    }
    //快捷方式
    _m.jump = function () {
        $('#shortcut section dl').unbind('click').bind('click',function (e) {
            window.event? window.event.cancelBubble = true : e.stopPropagation();
            var title=$(this).attr('data-title');
            $(this).find('cite').text(title)
            var that=$(this);
            top.tab.tabAdd(that);
        })
        $('#bingtuWrap').unbind('click').bind('click',function () {
            var title=$(this).attr('data-title');
            $(this).find('cite').text(title)
            var that=$(this);
            top.tab.tabAdd(that);
        })
        $('#zhuWrap').unbind('click').bind('click',function () {
            var title=$(this).attr('data-title');
            $(this).find('cite').text(title)
            var that=$(this);
            top.tab.tabAdd(that);
        })
    }
    //通过个人信息传参数
    _m.jude_role = function () {
        //通过权限判断传参来展示不同权限下展示的打分记录
        if(sessionStorage.positionId) {
            var params={};
            var positionId = JSON.parse(sessionStorage.positionId);
            var arr=[];
            var role = sessionStorage.identity_id;
            if (role == 4) { //班主任或副班主任
                var classgrades = positionId['4'].classgrades
                if (classgrades.length == 0) {
                    sl_Mask.NoTip('班主任权限下未绑定班级，请绑定后重新登录再试');
                    return false;
                } else {
                    for (var i = 0; i < classgrades.length; i++) {
                        arr.push(classgrades[i].id);
                    }
                    params.classgrade_id = arr.join('-');
                }
            }
            if (role == 8) { //专业部
                var majorGroup = positionId['8'].majorGroup
                if (!majorGroup) {
                    sl_Mask.NoTip('专业部权限下未绑定班级，请绑定后重新登录再试');
                    return false;
                } else {
                    params.major_group_id = majorGroup.id;
                }
            }
            if (role == 12) { //班主任或副班主任
                var classgrades = positionId['12'].classgrades
                if (classgrades.length == 0) {
                    sl_Mask.NoTip('班主任权限下未绑定班级，请绑定后重新登录再试');
                    return false;
                } else {
                    for (var i = 0; i < classgrades.length; i++) {
                        arr.push(classgrades[i].id);
                    }
                    params.classgrade_id = arr.join('-');
                }
            }
            self.getData(params);
        }
    } 
    //获取首页数据
    _m.getData = function (data) {
         var params={
             token:token,
             faid:userId
         }
         $.extend(params,data);
        // var loadings = top.layui.layer.load(2);
        $.axse(urls+'/getHomeInfo.action',params,function(result) {
            // top.layui.layer.close(loadings);
            //填充当页面数据
            var data=result.data;
                shouyeMessage=data;
            var datas={
                studentInfoCount:data.studentInfo.count+'人', //学生总数
                punchInfoException:data.punchInfo.exceptionCount+'人',//考勤异常
                punchInfoLate:data.punchInfo.lateCount+'人', //考勤迟到
                punchInfoCount:data.punchInfo.punchCount+'人',//到校人数
                performanceInfoACount:data.performanceInfo.aCount+'条', //核心素养今日加分
                performanceInfoMCount:data.performanceInfo.mCount+'条', //核心素养几日减分
                performanceInfoCout:data.performanceInfo.cout+'条',   //核心素养今日打分总分
                leaveInfo_activityCount:data.leaveInfo.activityCount+'人',//活动//请假
                leaveInfo_illCount:data.leaveInfo.illCount+'人',//病假
                leaveInfo_matterCount:data.leaveInfo.matterCount+'人',//事假人数
                leaveInfo_otherCount:data.leaveInfo.activityCount+data.leaveInfo.otherCount+data.leaveInfo.illCount+data.leaveInfo.matterCount+'人', //事假
                //班级打分
                performanceClassgradeInfo_count:data.performanceClassgradeInfo.count+'条',
                //今日住校
                inResidenceCount:data.inResidenceInfo.inResidenceCount+'人',//今日住校
                inCompetitionCount:data.inResidenceInfo.inCompetitionCount+'人',//竞赛
                inStopCount:data.inResidenceInfo.inStopCount+'人',//停住
                //班级打分动态模块的加载
                infos:data.performanceClassgradeInfo.infos
            }
            for(var i in datas){
               $('.'+i).text(datas[i]);
            }
            /*填充班级打分的树形模块*/
            if(datas.infos){
                var dom=""
               for(var i=0;i<datas.infos.length;i++){
                   if(i<3){
                       for(j in datas.infos[i]){
                           dom+='<dl data-url="page/page/classRecordHistory.html" data-title="考评记录">'+
                               '<cite style="display: none"></cite>'+
                               '<dt>'+j+'</dt>'+
                               '<dd class="">'+datas.infos[i][j]+'条</dd>'+
                               '</dl>'
                       }
                   }
               }
               $('#classgradeScoreType').append(dom);
                $('#classgradeScoreType dl').unbind('click').bind('click',function (e) {
                    window.event? window.event.cancelBubble = true : e.stopPropagation();
                    var title=$(this).attr('data-title');
                    $(this).find('cite').text(title)
                    var that=$(this);
                    top.tab.tabAdd(that);
                })
            }
            self.zhu('zhu',data);
        },function () {
            // top.layui.layer.close(loadings);
        })
    }
    //判断今日是否有值班
    _m.duty = function () {
        
    }
    return _m;
})();
shouye.init();