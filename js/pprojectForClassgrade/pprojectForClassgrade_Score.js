layui.use(['layer', 'form', 'element','laydate'], function() {
    layer = parent.layer === undefined ? layui.layer : top.layer
    form = layui.form
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
            elem: '#time' //指定元素
        });
    });
    /**/
    var pp1= new choose_Student('AllClass',{
        url:'/classgrade/getClassgrades.action',
        field:1,
        title:'选择班级',
        treeType:1   //以年级tree为开头
    },2,function (arr) {
        if(arr.length==1){ //单选
            $('#ModelForStudent').show();
        }else {   //多选
            $('#ModelForStudent').hide();
            $('#StudentForClass').attr('data-id','');
            $('#StudentForClass').attr('data-classgradeid','');
            $('#StudentForClass').attr('title','');
            $('#StudentForClass').html('').text('选择学生');
            //关联学生打分规则
            $('input[name=namesForStudent]').val('');
            $('.btnWrapForStudent').empty();
        }
    });

    //选择学生
    //班主任选择打分学生
    var choose_grade_students = new choose_grade_student('StudentForClass',{
        OnClick:false ,  //判断是单选还是多选
        page:1
    })
    layui.form.render();
    var student_Score=(function () {
        var _m={};
        var self=_m;
        // 初始化
        _m.init=function () {
            self.msg();
            self.submit();
            self.switch();
            self.downFile();
        }
        //获取打分项弹框
        _m.msg = function () {
            var ClassChoice1 = new choose_Score('Choice',ClassRecord,{bind:1},function (projectid) {
                //
                var Class_getRules = new getRulesForClassGrade(projectid,$('#student_Score'),true);

            });
            //选择打分项
            var p2 = new choose_Score('ChoiceForStudent',studentRecord,{free:0},function (projectid) {
                var rules=new getRulesForStudet(projectid,$('.btnWrapForStudent'),true);

            });
        }
        //提交
        _m.submit = function () {
            form.on('submit(formDemo)', function(data) {
                var that = $(this);
                if($(this).hasClass('NoClick')){return;}
                tool().Switched_Roles('images1/Score.png', '确定提交本次打分？', function () {
                    var arr = [];
                    var student_arr = [];
                    var classgrade_ids = $('#AllClass').attr('data-id');
                    if(!classgrade_ids){sl_Mask.NoTip('请选择班级'); return}
                    var student_account_ids = $('#StudentForClass').attr('data-id');
                    if ($('.btnWrap').find('.blue').length == 0) {
                        sl_Mask.NoTip('请选择打分项');
                        return;
                    } else {
                        for (var i = 0; i < $('.btnWrap').find('.blue').length; i++) {
                            arr.push($('.btnWrap').find('.blue').eq(i).attr('data-id'))
                        }
                    }
                    var params = {
                        faid: userId,
                        token: token,
                        classgrade_ids: classgrade_ids,
                        rule_ids: arr.join('-')
                    }
                    //time
                    if ($.trim($('#time').val())) {
                        params.time = new Date($('#time').val().replace(/-/g,"/")+' 00:00:00').getTime();
                    }else {
                        sl_Mask.NoTip('请选择打分时间');
                        return;
                    }
                    //绑定学生的id
                    if(student_account_ids){
                        params.student_account_ids = student_account_ids;
                    }
                    //关联学生打分规则
                    if ($('.btnWrapForStudent').find('.blue').length == 0) {
                        params.to_student =0; //不关联学生打分  传0
                    } else {
                        for (var i = 0; i < $('.btnWrapForStudent').find('span.blue').length; i++) {
                            student_arr.push($('.btnWrapForStudent').find('span.blue').eq(i).attr('data-id'))
                        }
                        if(student_account_ids){
                            params.to_student =1;  //关联学生打分  传1
                            params.student_account_rule_ids =student_arr.join('-');
                        }else {
                            params.to_student =0; //不关联学生打分  传0
                        }
                    }
                    //time
                    if ($.trim($('.beizhu').val())) {
                        params.annotation = $('.beizhu').val()
                    }
                    that.addClass('NoClick');
                    tool().onClick(that);
                      // var loadings= top.layui.layer.load(2);
                    $.axse(urls + MoreClassRecord, params, function (result) {
                        // top.layui.layer.close(loadings);
                        that.removeClass('NoClick');
                        $('.fading-circle').remove();
                        sl_Mask.YesTip('打分成功');
                        $('#AllClass').attr('data-id','');
                        $('#AllClass').attr('title','');
                        $('#AllClass').html('').text('选择班级');
                        $('#StudentForClass').attr('data-id','');
                        $('#StudentForClass').attr('data-classgradeid','');
                        $('#StudentForClass').attr('title','');
                        $('#StudentForClass').html('').text('选择学生');
                        //班级打分规则
                        $('input[name=names]').val('');
                        $('.btnWrap').empty();
                        //关联学生打分规则
                        $('input[name=namesForStudent]').val('');
                        $('.btnWrapForStudent').empty();
                        //打分时间
                        $('#time').val('');
                        //备注
                        $('.beizhu').val('');
                        form.render();

                    },function () {
                        that.removeClass('NoClick');
                        $('.fading-circle').remove();
                        // top.layui.layer.close(loadings);
                    })
                })
            })
        }
        //切换
        _m.switch = function () {
            $('.head i').unbind('click').bind('click',function () {
                if($(this).hasClass('switch')){
                    $(this).removeClass('switch');
                    $(this).text('导入表格');
                    $('.head span').text('为各班级的表现批量打分');
                    $('.ScoreFrom').hide();
                    $('.ScoreFrom').eq(0).show();
                }else {
                    $(this).addClass('switch');
                    $(this).text('返回');
                    $('.head span').text('导入Excel表格进行批量打分');
                    $('.ScoreFrom').hide();
                    $('.ScoreFrom').eq(1).show();
                }

            })
        }
        //下载文件调用接口
        _m.downFile = function () {
            $('.DownFile').unbind('click').bind('click',function () {
                var params={
                    token:token,
                    faid:userId
                }
                $.axse(urls + '/file/getOperationXlsPath.action', params, function (result) {
                    var data=result.data;
                    var httpUrl=ImgurlHttp+data;
                    window.open(httpUrl);
                })
            })
        }
        return _m;
    })();
    student_Score.init();
})
