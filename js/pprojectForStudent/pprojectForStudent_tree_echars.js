layui.use(['layer', 'form', 'element','laydate'], function() {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element
    //
    pprojectForStudent_Total = function () {
        var _m={};
        var self = _m;
        //初始化
        _m.init = function () {
            self.school_score();
            self.group_scroe();
            self.grade_scroe();
        }
        //获取全校的 核心素养加分 和 减分情况
        _m.school_score =function () {
            self.score();
        }
        //通过专业部获取 核心素养加分和减分的情况
        _m.group_scroe =function (obj) {
            var params ={
                faid:userId,
                token:token
            }
            $.axse(urls+Get_MajorGroup,params,function(result) {
                var dom = "<option value=''>选择专业部</option>";
                var data = result.data;
                if (data && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        dom += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $('#account').find("select[name='majorGroup_id']").html(dom);
                    form.render();
                    form.on('select(majorGroup_id)', function (majordata) {
                        self.score({majorGroup_id:majordata.value});
                        self.classgrade_scroe(majordata.value);
                    })
                }
            })
        }
        //通过班级获取 核心素养加分和减分的情况
        _m.classgrade_scroe = function (groupId) {
            var params = {
                faid: userId,
                token: token,
                size:200
            }
            $.axse( urls + ClassList, params, function (result) {
                var list = result.data.list;
                var dom = "<option value=''>选择班级</option>";
                if (list && list.length > 0) {
                    for(i=0;i<list.length;i++){
                        if(list[i].major.group.id==groupId){
                            dom += '<option value="' + list[i].id + '">' + list[i].name + '</option>'
                        }
                    }
                    $('#account').find('select[name="classgrade_id"]').html(dom);
                    form.render();
                    form.on('select(classgrade_id)', function (majordata) {
                        self.score({classgrade_id:majordata.value});
                    })
                }
            })
        }
        //通过年级
        _m.grade_scroe = function () {
            form.on('select(grade)', function (majordata) {
                self.score({grade:majordata.value});
            })
        }
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
                ForStudent().Total_score_echars('pproject_Add',arr_add);
                ForStudent().Total_score_echars('pproject_reduce',arr_reduce);
                $('.Total').empty();
                self.fill_Message(arr_add,arr_reduce,add_Total,reduce_Total);
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
        //填充得分明细
        _m.fill_Message = function (arr_add,arr_reduce,add_Total,reduce_Total) {
            var colors=['#37a2da', '#67e0e3','#fff065','#ff9f7f','#e36fb5','#eba53e'];
            var dom='';
            var resuce_dom='';
            if(arr_add){
                for(var i=0;i<arr_add.length;i++){
                    if(add_Total){
                        var num_X=arr_add[i].value*100/add_Total;
                        if( String(num_X).indexOf(".")>-1){
                            var num=num_X.toFixed(2)+'%'
                        }else {var num=num_X+'%'}
                    }else {
                        var num='0%'
                    }
                    dom+='<dl><dt><i class="material-icons" style="color: '+colors[i]+';font-size: 25px;">fiber_manual_record</i></dt><dd><span>'+num+'</span><p>'+arr_add[i].name+'&nbsp;&nbsp;+'+arr_add[i].value+'</p></dd></dl>'
                }
                $('#pproject_Add_M').prepend(dom);
            }
            if(arr_reduce){
                for(var i=0;i<arr_reduce.length;i++){
                    if(reduce_Total){
                        var num_X=arr_reduce[i].value*100/reduce_Total;
                        if( String(num_X).indexOf(".")>-1){
                            var num=num_X.toFixed(2)+'%'
                        }else {
                            var num=num_X+'%'
                        }
                    }else {
                        var num='0%'
                    }
                    resuce_dom+= '<dl><dt><i class="material-icons" style="color: '+colors[i]+';font-size: 25px">fiber_manual_record</i></dt><dd><span>'+num+'</span><p>'+arr_reduce[i].name+'&nbsp;&nbsp; -'+arr_reduce[i].value+'</p></dd></dl>'
                }
                $('#pproject_reduce_M').prepend(resuce_dom);
            }
        }
        return _m;
    }
    pprojectForStudent_Total().init();
    tool().termSelect();
})