seat_Mask = function () {
    var _m = {};
    var self =_m;
    //查看参加比赛的成员
    _m.match_project_member = function (that) {
        var ids=that.attr('data-id');
        var name=that.attr('data-name');
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>竞赛学生管理<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>"+name+"详情</a>",
            type: 2,
            content: "classgradeSeat_matchMember.html",
            area: ['100%', '100%'],
            success:function (layero,index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                body.find('.addBtn').attr('data-competition_id',ids);
                body.find('.editBtn').attr('data-competition_id',ids);
                self.match_project_GetStudent(body,ids);
            },
            cancel: function(layero,index){
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
    //通过竞赛比赛的id去获取比赛成员
    _m.match_project_GetStudent=function (obj,ids,type) {
        var params={
            token:token,
            faid:userId,
            competition_id:ids
        }
        $.axse(urls+'/competition/getCompetitionForId.action',params,function(result){
            var data=result.data;
            var arr=['活动','竞赛'];
            var datas={
                name:data.competition.name,
                type:data.competition.type,
                types:arr[data.competition.type],
                stime:tool().getSmpFormatDateByLong(data.competition.stime,false),
                etime:tool().getSmpFormatDateByLong(data.competition.etime,false),
                time:tool().getSmpFormatDateByLong(data.competition.stime,false)+'至'+tool().getSmpFormatDateByLong(data.competition.etime,false),
                account_id:data.teacher.id,
                teacher:data.teacher.rname
            }
            if(type){
                obj.find('.name').val(datas.name);
                obj.find('.type').val(datas.type);
                obj.find('.etime').val(datas.etime);
                obj.find('.stime').val(datas.stime);
                top.layui.form.render();
            }else {
                tool().dominit(datas, obj);
                obj.find('.editBtn').attr('data-teacher',datas.account_id);
                var students = result.data.students;
                obj.find('.roommate .add_Student').remove();
                if (students && students.length > 0) {
                    var dom = "";
                    for (var i = 0; i < students.length; i++) {
                        dom += "<li class='lf add_Student'><dt><div class='photo'><div class='imgWrap'><img src='" + ImgurlHttp + students[i].photoPath +"' alt=''></div>" +
                            "<em class='close' data-student_account_id=" + students[i].id + ">" +
                            "<i class='material-icons'>cancel</i></em></div></dt><dd>" + students[i].rname + "</dd></li>";
                    }
                    obj.find('.roommate').prepend(dom);
                    obj.find('.roommate li').find('em').unbind('click').bind('click', function () {
                        var student_account_id = $(this).attr('data-student_account_id');
                        seat_Mask().match_project_DelStudent(obj, ids, student_account_id);
                    })
                }
            }
        })
    }
    //通过竞赛比赛的id去删除比赛成员
    _m.match_project_DelStudent = function (obj,ids,student_account_id) {
        tool().Switched_Roles('images1/del.png','确认要删除么？', function() {
            var params={
                token:token,
                faid:userId,
                competition_id:ids,
                student_account_id:student_account_id
            }
            $.axse(urls+'/competition/removeStudent.action',params,function(result){
                seat_Mask().match_project_GetStudent(obj,ids);
                sl_Mask.YesTip('删除成功');
            })
        })

    }
    //获取全部教师
    _m.getTeacher = function (obj,value) {
        var params={
            token: token,
            faid: userId,
            iids: '3-4-5',
            size:200
        }
        $.axse(urls+'/account/getAccountsStaff.action',params,function(result){
            var list=result.data.list;
            obj.find('select[name="teacher"]').empty();
            var dom="<option value=''>请选择指导老师</option>";
            for(var i=0;i<list.length;i++){
                dom+='<option value='+list[i].id+'>'+list[i].accountData.rname+'</option>';
            }
            obj.find('select[name="teacher_account_id"]').html(dom);
            top.layui.form.render()
            if(value){
                obj.find('select[name="teacher_account_id"]').val(value) ;
                top.layui.form.render();
            }
        })
    }
    return _m;
}