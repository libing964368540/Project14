//Demo
layui.use(['layer', 'form', 'element', 'laydate'], function() {
    var layer = layui.layer,
        form = layui.form,
        element = layui.element,
        laydate = layui.laydate
    StartEndTime.init();
    var leaveprocess = (function () {
        var _m={};
        var self=_m;
        //初始化
        _m.init=function () {
            self.sumbit();
//                        self.getgrade();
            if(sessionStorage.AgainLeave&&sessionStorage.AgainLeave!="undefined"){
                self.fill();
            }
        }
        //通过班主任    获取班级
        _m.getgrade = function () {
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
                    self.getClass(data[0].id);
                    for (var i = 0; i < data.length; i++) {
                        dom += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $('select[name="classgaderid"]').html(dom);
                    form.render();
                    form.on('select(classgaderid)', function (majordata) {
                        self.getClass(majordata.value);
                    })
                }else {
                    sl_Mask.NoTip('班主任账户下未绑定任何班级，请绑定后重试')
                }
            })
        }
        //获取学生
        _m.getClass = function (cids) {
            var params={
                token:token,
                faid:userId,
                cids:cids,
                size:500
            }
            $.axse(urls+studentList,params,function(result){
                var accounts = result.data.list.reverse();
                var arr=[];
                for(var i=0;i<accounts.length;i++){
                    var classnum=accounts[i].accountData.identitysData[6].st_classgrade_number||"";
                    arr.push({
                        value:accounts[i].id,
                        name:"<em style='width: 17px;height: 17px;display: inline-block;background: #2196F3;color: #ffffff;vertical-align: middle;margin-right: 10px;font-size: 12px;line-height: 17px;text-align: center;font-style: normal;margin-bottom: 3px'>"+classnum+"</em>"+accounts[i].accountData.rname
                    })
                }
                layui.formSelects.data('apply_account_ids', 'local', {
                    arr: arr
                });
                layui.form.render();
                if(sessionStorage.AgainLeave&&sessionStorage.AgainLeave!="undefined"){
                    self.fill();
                }
            })
        }
        //通过班级获取学生
        //申请的ajax
        _m.shenqi =function (params,that) {
            tool().Switched_Roles('images1/Score.png','确定提交本次请假申请',function () {
                // var loadings= top.layui.layer.load(2);
                // setTimeout(function () {
                //     top.layui.layer.close(loadings);
                // }, 3000)
                that.addClass('NoClick');
                tool().onClick(that);
                $.axse(urls + '/leave/apply.action', params, function (result) {
                    that.removeClass('NoClick');
                    $('.fading-circle').remove();
                    // top.layui.layer.close(loadings);
                    sl_Mask.YesTip('提交成功');
                    //请假学生
//                                    $('select[name="apply_account_ids"]').val('');
//                                    formSelects.value('apply_account_ids', []);
                    $('#apply_account').attr('data-id','');
                    $('#apply_account').attr('title','');
                    $('#apply_account').attr('data-classgradeId','');
                    $('#apply_account').html('').text('请选择学生');
                    //请假类型
                    $('select[name="type"]').val('');
                    form.render();
                    //请假时间
                    $('#startEnd').val('');
                    $('input[name="s_time"]').val('');
                    $('input[name="e_time"]').val('');
                    //请假时长
                    $('.stay_long').val('');
                    //备注
                    $('textarea[name="des"]').val('');
                    //图片
                    $('.file_path').val('');
                    $('img').attr('src','');
                    //家长签字
                    $('select[name="family_verify"]').val('0');
                    form.render();

                },function () {
                    that.removeClass('NoClick');
                    $('.fading-circle').remove();
                    // top.layui.layer.close(loadings);
                })
            })
        }
        //监听提交
        _m.sumbit=function () {
            form.on('submit(formDemo)', function(data) {
                if($(this).hasClass('NoClick')){
                    return;
                }
                var field=data.field;
//                            var account_ids = field.apply_account_ids.split(',').join('-')
                var account_ids=$('#apply_account').attr('data-id');
                if(!account_ids){
                    sl_Mask.NoTip('请选择学生');
                    return;
                }
                var params={
                    token:token,
                    faid:userId,
                    type:field.type,
                    apply_account_ids:account_ids,
                    s_time:new Date(field.s_time.replace(/-/g,"/")).getTime(),
                    e_time:new Date(field.e_time.replace(/-/g,"/")).getTime(),
                    family_verify:field.family_verify,
                    classgrade_id:$('#apply_account').attr('data-classgradeId')
                }
                //备注
                if(field.des){
                    params.des=field.des;
                }
                //图片
                if(field.file_path){
                    params.file_path=field.file_path;
                }
                //
                if(sessionStorage.AgainLeave){
                    sessionStorage.removeItem("AgainLeave");
                }

                self.shenqi(params,$(this));
            });
        }
        //填充页面信息
        _m.fill = function () {
            var ids=sessionStorage.AgainLeave;
            var params={
                token:token,
                faid:userId,
                leave_id:ids
            }
            $.axse(urls+leaveMessage_one,params,function(result){
                var data=result.data;
                //填充学生
//                                layui.formSelects.value('apply_account_ids',self.fill_student(data.apply_accounts));
                self.fill_student(data.apply_accounts)
                //填充请假类型
                $("select[name='type']").val(data.type);
                form.render();
                //开始时间
                $('input[name="s_time"]').val(tool().getSmpFormatDateByLong(data.s_time,true));
                //结束时间
                $("input[name='e_time']").val(tool().getSmpFormatDateByLong(data.e_time,true));
                //请假时长
                $('.stay_long').val(tool().stay_long(data.s_time,data.e_time));
                //备注
                $('textarea[name="des"]').val(data.des);
                //证明上传
                if(data.file_path){
                    $('input[name="file_path"]').val(data.file_path);
                    $('img').attr('src',ImgurlHttp+data.file_path);
                }
                //家长签字
                $('select[name="family_verify"]').val(data.family_verify);
                form.render();
            })
        }
        //填充学生账号
        _m.fill_student = function (apply_accounts) {
            var arr_id = [];
            var arr_name = [];
            if(apply_accounts.length>0){
                for(var i=0;i<apply_accounts.length;i++){
                    arr_id.push(apply_accounts[i].id);
                    arr_name.push(apply_accounts[i].accountData.rname);
                }
            }
            $('#apply_account').attr('data-id',arr_id.join('-'));
            $('#apply_account').attr('title',arr_name.join('-'));
            $('#apply_account').attr('data-classgradeId',apply_accounts[0].accountData.identitysData[6].classgrades[0].id);
            tool().fill_More_ToPage(arr_name, $('#apply_account'));
        }
        return _m;
    })();
    leaveprocess.init();
    choose_grade_students = new choose_grade_student('apply_account',{
        OnClick:false   //判断是单选还是多选
    })
});