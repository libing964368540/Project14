//给寝室或者学校项目绑定学生
bindStudent = function () {
    var _m={};
    var self=_m;
    //绑定学生的ajax
    _m.bindAjax = function (obj,body) {
        obj.unbind('click').bind('click',function () {
            var that = $(this);
            var dormitory_C_S= new dormitory_choose_student({
                obj:that,
                url:Get_classStudent,
                treeType:1,
                fn:function (data) {
                    var params={
                           faid:userId,
                           token:token,
                           account_id:data,
                            dormitory_id:that.attr('data-dormitory_id'),
                            index:that.attr('data-id')
                        }
                     $.axse(urls+sleepRoomBindUser,params,function(result){
                          tool().DormMessageFill(params.dormitory_id,body);
                           sl_Mask.YesTip('添加成功');
                       })

                }
            })
        })
    }
    _m.group = function (obj) {
        var params ={
            faid:userId,
            token:token
        }
        $.axse(urls+Get_MajorGroup,params,function(result){
            var dom="<option value=''>请选择专业部</option>";
            var data=result.data;
            if(data&&data.length>0){
                for(var i=0;i<data.length;i++){
                    dom+='<option value="'+data[i].id+'">'+data[i].name+'</option>'
                }
                obj.find('select[name="groupid"]').html(dom)
                top.layui.form.render();
                top.layui.form.on('select(groupid)', function (majordata) {
                    self.Major(obj,majordata.value);
                })
            }
        },function () {

        })
    }
    //通过专业部获取专业
    _m.Major =function (obj,groupid) {
        var params = {
            faid: userId,
            token: token,
            groupid:groupid
        }
        $.axse(urls+ Get_Major, params, function (result) {
            if(!result.error) {
                var data = result.data;
                if (data && data.length > 0) {
                    var dom = "<option value=''>选择所属专业</option>";
                    for (var i = 0; i < data.length; i++) {
                        dom += '<option value=' + data[i].id + '>' + data[i].name + '</option>'
                    }
                    obj.find("select[name='major_id']").html(dom);
                    top.layui.form.render();
                    top.layui.form.on('select(major_id)', function (majordata) {
                        self.classN(obj,majordata.value);
                    })
                }
            }
        })
    }
    //通过专业获取班级
    _m.classN =function (obj,majorid) {
        var params = {
            faid:userId,
            token:token,
            major_id:majorid,
            size:100
        }
        $.axse(urls+ Get_MajorClass, params, function (result) {
            if(!result.error) {
                var data = result.data.list;
                if (data && data.length > 0) {
                    var dom = "<option value=''>选择班级</option>";
                    for (var i = 0; i < data.length; i++) {
                        dom += '<option value=' + data[i].id + '>' + data[i].name + '</option>'
                    }
                    obj.find("select[name='classgaderid']").html(dom);
                    top.layui.form.render();
                    top.layui.form.on('select(classgaderid)', function (majordata) {
                        self.student(obj,majordata.value);
                    })
                }
            }
        })
    }
    //通过班级获取学生
    _m.student = function (obj,cids) {
        var params={
            faid:userId,
            token:token,
            iids:6,
            cids:cids,
            size:100
        }
        $.axse(urls+Get_classStudent,params,function(result){
            if(!result.error) {
                var data = result.data.list;
                if (data && data.length > 0) {
                    var dom = "<option value=''>选择学生</option>";
                    for (var i = 0; i < data.length; i++) {
                        dom += '<option value=' + data[i].id + '>' + data[i].accountData.rname + '</option>'
                    }
                    obj.find("select[name='account_id']").html(dom);
                    top.layui.form.render();
                }
            }
        })
    }
    //绑定学生
    _m.bind = function (that,account) {
        var parents= that.parent();
        var dom="";
        var src=ImgurlHttp+account.account.photoPath
            dom+="<div class='photo'><div class='imgWrap'><img src='"+src+"' alt=''></div>" +
                "<em class='close' data-id="+account.account.id+" data-index="+account.index+" data-dormitory_id="+account.id+">" +
                "<i class='material-icons' >cancel</i></em></div>";
           parents.append(dom);
           parents.next().text(account.account.rname);
           parents.find('em.close').unbind('click').bind('click',function () {
                 self.removeBind($(this));
           })
    }
    //解绑学生
    _m.removeBind = function (that) {
        var account_id= that.attr('data-id');
        var index= that.attr('data-index');
        var ids= that.attr('data-dormitory_id');
        tool().Switched_Roles('images1/del.png','确认要删除么？', function() {
            var params = {
                token: token,
                faid: userId,
                account_id: account_id,
                index:index,
                dormitory_id: ids
            }
            $.axse(urls+'/dormitoryCheck/remove.action', params, function (result) {
                sl_Mask.YesTip('删除成功');
                that.parent().parent().parent().find('dd').text('暂无');
                that.parent().remove();
            })

        })
    }
    return _m;
};

