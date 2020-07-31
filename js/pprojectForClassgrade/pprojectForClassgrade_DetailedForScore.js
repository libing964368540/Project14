layui.use(['layer', 'form', 'element'], function() {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element
    //通过五项评比获取明细表
    school_class = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            self.AssessmentClass(
                school_class.choose
            );
            self.downFile();
        }
        /*修改分页开始*/

        //获取多表头
        _m.getColumns = function (params,data,loadings) {
            var list=[];
            var arr = [];
            var arr1 = [{
                field: 'name',
                align: "center",
                title: '班级',
                colspan: 1,
                rowspan: 3,
                width: '200px',
                class: 'fontSize12',
            }];
            var list = [];
            for(var i=0;i<data.length;i++){ //学校
                var subRecord = data[i].records[0].subRecord  //一级目录
                var obj = {};
                obj.name = data[i].name;
                for(var j=0;j<subRecord.length;j++){
                    var days = subRecord[j].days;        //周
                    for(z=0;z<days.length;z++){
                        var performances = days[z].performances   //打分项
                        for(h=0;h<performances.length;h++){
                            var keyS = days[z].day_for_week+'_'+performances[h].project_id;
                            var valueS = performances[h].value
                            if(valueS){
                                obj[keyS]='<span title='+data[i].name+'>'+valueS+'</span>';
                            }else {
                                obj[keyS]='';
                            }
                        }
                    }
                    obj[subRecord[j].project_name]=subRecord[j].value;
                }
                list.push(obj);
            }
            // console.log(list);
            /**/
            var arr2 = [];
            var arr3 = [];
            for (var h = 0; h < data[0].records[0].subRecord.length; h++) {
                arr1.push({
                    field: '',
                    align: "center",
                    title: data[0].records[0].subRecord[h].project_name,
                    colspan: data[0].records[0].subRecord[h].days.length * data[0].records[0].subRecord[h].days[0].performances.length + 1,
                    rowspan: 1,

                })
                for (var j = 0; j < data[0].records[0].subRecord[h].days.length; j++) {
                    arr2.push({
                        field: '',
                        align: "center",
                        title: tool().NumChange(data[0].records[0].subRecord[h].days[j].day_for_week),
                        colspan: data[0].records[0].subRecord[h].days[j].performances.length,
                        rowspan: 1
                    })
                    for (var z = 0; z < data[0].records[0].subRecord[h].days[j].performances.length; z++) {
                        arr3.push({
                            field: data[0].records[0].subRecord[h].days[j].day_for_week+'_'+data[0].records[0].subRecord[h].days[j].performances[z].project_id,
                            align: "center",
                            title: data[0].records[0].subRecord[h].days[j].performances[z].project_name+data[0].records[0].subRecord[h].days[j].performances[z].value2+'分',
                            class: 'fontSize12',
                            width:'200px',
                            formatter: function (value, row, index, limit) {
                                return value;
                            }
                        })
                    }

                }
                arr2.push({
                    field: subRecord[h].project_name,
                    align: "center",
                    title: '总分',
                    colspan: 1,
                    rowspan: 2,
                    class:'red'
                })
            }
            arr.push(arr1);
            arr.push(arr2);
            arr.push(arr3);
            // console.log(arr);
            //获取分数
            // console.log(list);
            self.tableForServer(params,arr,loadings);
        }
        //数据回来修改成可以渲染表格的数据
        _m.getList = function (data) {
            var list = [];
            for(var i=0;i<data.length;i++){ //学校
                var subRecord = data[i].records[0].subRecord  //一级目录
                var obj = {};
                obj.name = data[i].name;
                for(var j=0;j<subRecord.length;j++){
                    var days = subRecord[j].days;        //周
                    for(z=0;z<days.length;z++){
                        var performances = days[z].performances   //打分项
                        for(h=0;h<performances.length;h++){
                            var keyS = days[z].day_for_week+'_'+performances[h].project_id;
                            var valueS = performances[h].value
                            if(valueS){
                                obj[keyS]='<span title='+data[i].name+'>'+valueS+'</span>';
                            }else {
                                obj[keyS]='';
                            }
                        }
                    }
                    obj[subRecord[j].project_name]=subRecord[j].value;
                }
                list.push(obj);
            }
            return list;
        }
        //从服务端获取数据的table
        _m.tableForServer = function (filed,arr,loadings) {
            $('#student_all').find('#table1').bootstrapTable('destroy');
            $('#table1').bootstrapTable({
                url:urls + '/classgrade/getClassgrades.action',
                queryParams:function(params){
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
                striped: true,
                cache: false,
                pageNumber: 1,
                pageSize: 10,
                pageList: [10,15,25,50,100],
                columns: arr,
                responseHandler: function (result) {
                    top.layui.layer.close(loadings);
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
                            "rows":self.getList(result.data.list),
                            "total":result.data.count
                        }
                    }
                },
                formatLoadingMessage: function () {
                    return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
                }

            })
        }    
        /*修改分页结束*/

        //通过数据刷新班级打分报告
        _m.getTable = function (data) {
            var list=[];
            var arr = [];
            var arr1 = [{
                field: 'name',
                align: "center",
                title: '班级',
                colspan: 1,
                rowspan: 3,
                width: '200px',
                class: 'fontSize12',
            }];
            var list = [];
                for(var i=0;i<data.length;i++){ //学校
                    var subRecord = data[i].records[0].subRecord  //一级目录
                    var obj = {};
                        obj.name = data[i].name;
                        for(var j=0;j<subRecord.length;j++){
                           var days = subRecord[j].days;        //周
                               for(z=0;z<days.length;z++){
                                   var performances = days[z].performances   //打分项
                                       for(h=0;h<performances.length;h++){
                                           var keyS = days[z].day_for_week+'_'+performances[h].project_id;
                                           var valueS = performances[h].value
                                              if(valueS){
                                                  obj[keyS]='<span title='+data[i].name+'>'+valueS+'</span>';
                                              }else {
                                                  obj[keyS]='';
                                              }
                                       }
                               }
                            obj[subRecord[j].project_name]=subRecord[j].value;
                        }
                    list.push(obj);
                }
                // console.log(list);
            /**/
            var arr2 = [];
            var arr3 = [];
                for (var h = 0; h < data[0].records[0].subRecord.length; h++) {
                        arr1.push({
                            field: '',
                            align: "center",
                            title: data[0].records[0].subRecord[h].project_name,
                            colspan: data[0].records[0].subRecord[h].days.length * data[0].records[0].subRecord[h].days[0].performances.length + 1,
                            rowspan: 1,

                        })
                        for (var j = 0; j < data[0].records[0].subRecord[h].days.length; j++) {
                            arr2.push({
                                field: '',
                                align: "center",
                                title: tool().NumChange(data[0].records[0].subRecord[h].days[j].day_for_week),
                                colspan: data[0].records[0].subRecord[h].days[j].performances.length,
                                rowspan: 1
                            })
                            for (var z = 0; z < data[0].records[0].subRecord[h].days[j].performances.length; z++) {
                                arr3.push({
                                    field: data[0].records[0].subRecord[h].days[j].day_for_week+'_'+data[0].records[0].subRecord[h].days[j].performances[z].project_id,
                                    align: "center",
                                    title: data[0].records[0].subRecord[h].days[j].performances[z].project_name+data[0].records[0].subRecord[h].days[j].performances[z].value+'分',
                                    class: 'fontSize12',
                                    width:'200px',
                                    formatter: function (value, row, index, limit) {
                                        return value;
                                    }
                                })
                            }

                        }
                        arr2.push({
                            field: subRecord[h].project_name,
                            align: "center",
                             title: '总分',
                             colspan: 1,
                             rowspan: 2,
                            class:'red'
                           })
                    }
            arr.push(arr1);
            arr.push(arr2);
            arr.push(arr3);
            // console.log(arr);
            //获取分数
            // console.log(list);
            self.table(list, arr);

        }
        //table
        _m.table = function (data, arr) {
            $('#student_all').find('#table1').bootstrapTable('destroy');
            $('#table1').bootstrapTable({
                data: data,
                sidePagination: "client",
                // contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                // method: 'POST',
                // async:true,
                pagination: true,
                paginationLoop: false,
                paginationShowPageGo: true,
                striped: true,
                cache: false,
                pageNumber: 1,
                pageSize: 10,
                pageList: [10,15,25,50,100],
                columns: arr,
                responseHandler: function (result) {
                },
                formatLoadingMessage: function () {
                    return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
                }

            })
        }
        //获取当前的所在的学期和周次
        _m.ItemNow = function (project_id,fn) {
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
                  self.classlist(data,project_id);
                  $('input[name="semesterId"]').val(data.semester.id);
                  $('input[name="weekId"]').val(data.week.id);
                  self.termSelect(fn);
                }
            },function (e) {
                e.error.message ="今天是休息日"
                self.termSelect(fn);
            })
        }
        //获取班级成绩列表
        _m.classlist = function (data,project_id) {
            var params={
                token:token,
                faid:userId,
                size:1
            }
                params.semester = data.semester.index;
                params.week = data.week.index;
                params.project_id = project_id;
                self.ajax(params);
        }
        //通过筛选获取班级报告
        _m.choose = function () {
            //学期
             var semesterIndex = $('select[name="termid"]').find('option:selected').attr('data-semester');
            //周次
             var weekIndex = $('select[name="superid"]').find('option:selected').attr('data-week');
            //根目录
             var projectId = $('select[name="project_id"]').val();
             if(!semesterIndex){
                 sl_Mask.NoTip('请选择要查询的学期')
                 return;
             }
            if(!weekIndex){
                sl_Mask.NoTip('请选择要查询的周次')
                return;
            }
            if(!projectId){
                sl_Mask.NoTip('请选择要查询的评比目录')
                return;
            }
            var params={
                token:token,
                faid:userId,
                size:1
            }
            params.semester = semesterIndex;
            params.week = weekIndex;
            params.project_id = projectId;
            self.setTitle();
            self.ajax(params);
        }
        _m.ajax= function (params) {
            var loadings= top.layui.layer.load(2);
            $.axse(urls+'/classgrade/getClassgrades.action', params, function (result) {
                var list = result.data.list;
                // self.getTable(list)
                var obj={};
                    for(var i in params){
                        if(i!='size'){
                            obj[i]= params[i];
                        }
                    }
                self.getColumns(obj,list,loadings);
                // top.layui.layer.close(loadings);
            },function () {
                top.layui.layer.close(loadings);
            })
        }
        //获取打分目录
        //获取班级评比填充接口(考核)
        _m.AssessmentClass=function (fn) {
            var params = {
                faid: userId,
                token: token,
                project_id:0
            };
            $.axse(urls + ClassContents, params, function (result) {
                    var data = result.data;
                    var dom = "";
                    if(data&&data.length>0){
                        self.ItemNow(data[0].id,fn);
                    }
                    for (var i = 0; i < data.length; i++) {
                        dom += '<option value=' + data[i].id + '>' + data[i].name + '</option>'
                    }
                    $('select[name="project_id"]').html(dom);
                    layui.form.render();
                    layui.form.on('select(project_id)', function (data) {
                        var text=$('select[name="project_id"]').find("option:selected").text()
                        params.project_id = data.value;
                        if(fn){
                            fn()
                        }

                    })
            })
        }
        //获取周次
        _m.week = function (superid,fn) {
            var params={
                token:token,
                faid:userId,
                superid:superid
            }
            $.axse(urls+'/time/gettimes.action', params, function (result) {
                var data = result.data;
                var dom = "<option value=''>请选择周次</option>";
                for (var i = 0; i < data.length; i++) {
                    dom += '<option value='+ data[i].id+' data-week='+data[i].index+'>' + data[i].name + '</option>'
                }
                // form.render();
                $('select[name="superid"]').html(dom);
                var weekId = $('input[name="weekId"]').val();
                if(weekId){
                    $('select[name="superid"]').val(weekId);
                }
                form.render();
                form.on('select(superid)', function (data) {
                    if(fn){
                        fn();
                    }
                })
            })
        }
        //获取学期填充接口
        _m.termSelect = function (fn) {
            var params = {
                faid: userId,
                token: token,
                superid:0
            };
            $.axse(urls + termList, params, function (result) {
                if (!result.error) {
                    var data = result.data;
                    var dom = "<option value=''>请选择学期</option>";
                    for (var i = 0; i < data.length; i++) {
                        dom += '<option value=' + data[i].id + ' data-semester='+data[i].index+'>' + data[i].name + '</option>'
                    }
                    $('select[name="termid"]').html(dom);
                    form.render();
                    var semesterId = $('input[name="semesterId"]').val();
                    if(semesterId){
                        $('select[name="termid"]').val(semesterId);
                        form.render();
                        if(data.length>0){
                            self.week(semesterId,fn);
                        }
                    }else {
                        if(data.length>0){
                              // self.week(data[0].id,fn);
                        }
                    }
                    self.setTitle();
                    form.on('select(termid)', function (data) {
                        if(data.value){
                            $('input[name="weekId"]').val('');
                            self.week(data.value,fn);
                        }else{
                            $('input[name="weekId"]').val('');
                            $('select[name="superid"]').html("<option value=''>请选择学期</option>");
                            form.render();
                        }

                        // if(fn){
                        //     fn();
                        // }
                    })
                }
            })
        }
        //设置标题名称
        _m.setTitle = function () {
            var ItemName=$('select[name="termid"]').find("option:selected").text()
            var projectName=$('select[name="project_id"]').find("option:selected").text()
            if(ItemName=='请选择学期'){ItemName=''};
            if(projectName=='请选择周次'){projectName=''};
            var str= ItemName+ projectName +'明细表';
            $('#student_all h3').text(str);
        }
        //下载班级打分模板
        _m.downFile = function () {

            $('#download').unbind('click').bind('click',function () {
                var params={
                    token:token,
                    faid:userId
                }
                //学期
                var semesterIndex = $('select[name="termid"]').find('option:selected').attr('data-semester');
                //周次
                var weekIndex = $('select[name="superid"]').find('option:selected').attr('data-week');
                //根目录
                var projectId = $('select[name="project_id"]').val();
                if(!semesterIndex){
                    sl_Mask.NoTip('请选择要查询的学期')
                    return;
                }
                if(!weekIndex){
                    sl_Mask.NoTip('请选择要查询的周次')
                    return;
                }
                if(!projectId){
                    sl_Mask.NoTip('请选择要查询的评比目录')
                    return;
                }
                params.semester = semesterIndex;
                params.week = weekIndex;
                params.project_id = projectId;
                var index = layer.load(2);
                $.axse(urls + '/classgradeReport/getWeekReportPath.action', params, function (result) {
                    layer.close(index);
                    var data=result.data;
                    var httpUrl=ImgurlHttp+data;
                    window.open(httpUrl);
                },function () {
                    layer.close(index);
                })
                //xu
            })
        }
        return _m;
    })()
    school_class.init();
})
