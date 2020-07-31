layui.use(['layer', 'form', 'element','laydate'], function() {
    var  layer = layui.layer
        , form = layui.form
        , element = layui.element;
    var HaveClassSeat=[];//存储已经绑定的学生的id；
    var choose_studentDom = '<div style="padding:0 45px 20px;color:#898989;font-size: 14px" class="layui-form">' +
        '<div>' +
        '<div>' +
        '<div class="sl-formWrap"style="padding-top: 5px"><p class="gradeWrap"></p></div>'+
        '<div class="sl-formWrap" style="padding-top: 5px"><ul class="studentWrap"></ul></div>'+
        '</div>'+
        '</div>' +
        '<div class="clear" style="padding-left: 10px;height:50px;"><span class="school_Btn rg sumbitBtn" >确定</span></div>'+
        '</div>';
    DormMessage = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            self.classSelect();
            self.add();
        }
        //获取班级
        _m.classSelect = function () {
            var params = {
                token: token,
                faid: userId,
                director_id: userId
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
                    form.render();
                    form.on('select(classgaderid)', function (majordata) {
                        self.getStudent(majordata.value);
                    })
                }else {
                    sl_Mask.NoTip('班主任账户下未绑定任何班级，请绑定后重试')
                }
            })
        }
        //获取座位表
        _m.getStudent = function (classgrade_id) {
            var params={
                token:token,
                faid:userId,
                classgrade_id:classgrade_id
            }
            $.axse(urls + '/classgradeSeat/getSeats.action', params, function (result) {
                HaveClassSeat=[];
                $('.director_class').text(result.data.classgrade.name);
                $('.director_rname').text(result.data.classgrade.director.rname);
                $('.tableWrap li').find('.photo').remove();
                $('.tableWrap li').find('dd').text('暂无');
                var accouts=result.data.seats;
                if(accouts&&accouts.length>0){
                    for(var i=0;i<accouts.length;i++){
                        HaveClassSeat.push(accouts[i].student.id);
                        var dom="";
                        var index=accouts[i].index;
                        dom+="<div class='photo' ><div class='imgWrap' data-name='"+accouts[i].student.rname+"'onclick='DormMessage.state($(this))'data-id="+accouts[i].student.id+" data-temporary_state="+accouts[i].student.temporary_state+"><img src='"+ImgurlHttp+accouts[i].student.photoPath+"' alt=''></div>" +
                            "<em class='close'data-id="+accouts[i].student.id+" onclick='DormMessage.del($(this))'>" +
                            "<i class='material-icons' >cancel</i></em></div>";
                        $('.tableWrap li').eq(index).find('dt').append(dom);
                        if(accouts[i].student.temporary_state){
                            $('.tableWrap li').eq(index).find('dd').text(accouts[i].student.rname+'（临时请假）');
                        }else {
                            $('.tableWrap li').eq(index).find('dd').text(accouts[i].student.rname);
                        }

                    }
                }
            })
        }
        //删除
        _m.del = function (that) {
            var account_id= that.attr('data-id');
            tool().Switched_Roles('images1/del.png','确认要删除么？', function() {
                var params = {
                    token: token,
                    faid: userId,
                    account_id: account_id
                }
                $.axse(urls+'/classgradeSeat/remove.action', params, function (result) {
                    if(HaveClassSeat.indexOf(account_id)>-1){
                        HaveClassSeat.remove(account_id);
                    }
                    sl_Mask.YesTip('删除成功');
                    that.parent().parent().next().text('暂无');
                    that.parent().remove();
                })
            })
        }
        //添加
        _m.add = function () {
            $('.tableWrap li dt span').unbind('click').bind('click',function () {
                var that=$(this);
                var values = $('select[name="classgaderid"]').val();
                if(!values){
                    sl_Mask.NoTip('班主任账户下未绑定任何班级，请绑定后重试')
                    return;
                }
                var index = top.layer.open({
                    type: 1,
                    title: '选择学生',
                    closeBtn: 1,
                    shadeClose: false,
                    skin: 'choose_grade_student',
                    area: ['850px', 'auto'],
                    content: choose_studentDom,
                    btnAlign: 'l',
                    success: function (layero, index) {
                        $(layero).find('.layui-layer-content').css('height','auto');
                        var classgrade_id = $('select[name="classgaderid"]').val();
                        var classgrade_name=$('select[name="classgaderid"]').find('option:selected').text();
                        var sumbitBtn = $(layero).find('.sumbitBtn');
                        $(layero).find('.gradeWrap').append('<span class="active">'+classgrade_name+'</span>');
                        self.studentForclassgrade($(layero),classgrade_id);
                        var studentWrap = $(layero).find('.studentWrap');
                        sumbitBtn.unbind('click').bind('click',function () {
                            var account_id=studentWrap.find('li.active');
                            if(account_id.length==0){
                                sl_Mask('请选择学生');
                               return
                            }
                            var params={
                                   faid:userId,
                                   token:token,
                                   account_id:account_id.attr('data-id'),
                                   classgrade_id:classgrade_id,
                                   index:that.attr('data-index')
                                 }
                            $.axse(urls+'/classgradeSeat/bindSeat.action',params,function(result){
                                   sl_Mask.YesTip('添加成功');
                                   top.layer.close(index);
                                   self.getStudent(classgrade_id);
                               },function () {
                            })
                        })

                    }
                })
            })
        }
        //通过班级id 获取全班学生
        _m.studentForclassgrade = function (obj,cids) {
            var params={
                faid:userId,
                token:token,
                iids:6,
                cids:cids,
                size:100,
                sort :4,
                sortType:1
            }
            $.axse(urls+Get_classStudent,params,function(result){
                    var accounts = result.data.list.reverse();
                    if (accounts && accounts.length > 0) {
                        var dom="" ;
                        for(var i=0;i<accounts.length;i++){
                           if(HaveClassSeat.indexOf(accounts[i].id)==-1){
                               var classnum=accounts[i].accountData.identitysData[6].st_classgrade_number||"";
                               dom +='<li class="lf" style="margin-bottom: 15px;margin-right: 10px" data-id="'+accounts[i].id+'" title="'+accounts[i].accountData.rname+'"><i>'+classnum+'</i><span>'+accounts[i].accountData.rname+'</span></li>';
                           }

                        }
                        obj.find('.studentWrap').append(dom);
                        obj.find('.studentWrap li').unbind('click').bind('click',function () {
                            obj.find('.studentWrap li').removeClass('active');
                            $(this).addClass('active');
                        })

                    }

            })
        }
        //绑定学生
        _m.bind = function (that,account) {
            var parents= that.parent();
            var dom="";
            var src=ImgurlHttp+account.photoPath
            dom+="<div class='photo'><div class='imgWrap' data-id="+account.id+" data-name='"+account.rname+"'><img src='"+src+"' alt=''></div>" +
                "<em class='close' data-id="+account.id+">" +
                "<i class='material-icons' >cancel</i></em></div>";
            parents.append(dom);
            parents.next().text(account.rname);
            parents.find('em.close').unbind('click').bind('click',function () {
                self.del($(this));
            })
        }
        //设置学生为临时有事状态
        _m.state = function (that) {
            var name=that.attr('data-name');
            var ids= that.attr('data-id');
            var state= that.attr('data-temporary_state');
            var msg="更改"+name+"的晚自修状态<br>（当日18:10之前开放)";
            sl_Mask.Switched_state('images1/Score.png',msg,state,function (index) {
                if(state==0){
                    //设置状态
                    DormMessage.stateAjax(ids,1,index);
                }else {
                    //取消状态
                    DormMessage.stateAjax(ids,0,index);
                }

            }) 
        }
        //设置临时状态接口
        _m.stateAjax = function (ids,state,index) {
            var params={
                token:token,
                faid:userId,
                student_account_id:ids,
                temporary_state:state
            }
            $.axse(urls+setState,params,function(result){
                sl_Mask.YesTip('设置成功');
                top.layer.close(index);
                var classgrade_id = $('select[name="classgaderid"]').val();
                DormMessage.getStudent(classgrade_id);
            })
        }
        return _m;
    })();
    DormMessage.init();
})