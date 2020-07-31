layui.use(['layer', 'form', 'element', 'upload','laydate','laypage'], function() {
    layer = parent.layer === undefined ? layui.layer : top.layer
    form = layui.form
    laypage = layui.laypage;
    var upload = layui.upload;
    layui.use('laydate', function(){
        var laydate = layui.laydate;
        //执行一个laydate实例
        laydate.render({
            elem: '#time', //指定元素
            format: 'yyyy-MM-dd'
        });
    });
    student_record = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            self.submit();
            self.chooseType();
            self.chooseTypeInit();
        }
        //点击选中的的打分项规则
        _m.choose = function (projectid,values) {
            $('input[name="names"]').val(values);
            $('input[name="names"]').attr('data-id',projectid);
            var dom = "<option value=''>选择分值</option>";
            var arr=[];
            if(projectid%2==0){
                var arr=[-1,-2,-3,-4,-5,-6,-7,-8,-9,-10]
            }else {
                var arr=[1,2,3,4,5,6,7,8,9,10];
            }
            for(var i=0;i<arr.length;i++){
                dom+="<option value="+arr[i]+">"+arr[i]+"</option>";
            }
            $('select[name="value"]').html(dom);
            form.render();
        }
        //点击提交
        _m.submit = function () {
            $('#sumbit').unbind('click').bind('click', function () {
                var val= $('select[name="type"]').val();
                if(!val){
                    sl_Mask.NoTip('请选择类型');return;
                }
                var that = $(this);
                if($(this).hasClass('NoClick')){
                    return;
                }
                tool().Switched_Roles('images1/Score.png','确定提交本次打分？',function () {
                    //通过判断选择类型然后去判断提交
                    if(val==1){student_record.recordForSchool(that);//核心素养提交
                    }
                    if(val==2){student_record.recordForClassgrade(that);//班内打分提交
                    }
                })
            })
        }
        //班内打分
        _m.recordForClassgrade = function (that) {
            var values = $('input[name="value"]').val()
            if(!$.trim(values)){
                sl_Mask.NoTip('请输入分值');
                return;
            }
            var params = {
                faid: userId,
                token: token,
                student_account_ids: $('input[name="rname"]').attr('data-taid'),
                project_id:$('input[name="names"]').attr('data-id'),
                value: $('input[name="value"]').val()
            }
            if($('#time').val()){
                params.time=new Date($('#time').val().replace(/-/g,"/")+' 00:00:00').getTime();
            }
            if($.trim($('.beizhu').val())){
                params.des=$('.beizhu').val()
            }
            // var loadings= top.layui.layer.load(2);
            that.addClass('NoClick');
            tool().onClick(that);
            $.axse(urls+'/classPrivateProject/submits.action', params, function (result) {
                that.removeClass('NoClick');
                $('.fading-circle').remove();
                // top.layui.layer.close(loadings);
                sl_Mask.YesTip('打分成功');
                //打分规则
                $('input[name="names"]').val('');
                $('input[name="names"]').attr('data-id',"");
                $('input[name="value"]').val('');
                //打分类型
                $('select[name="type"]').val('');
                form.render();
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
        }
        //核心素养打分
        _m.recordForSchool = function (that) {
            var arr=[];
            if ($('.btnWrap').find('span.blue').length == 0) {
                sl_Mask.NoTip('请选择打分规则');
                return;
            }else{
                for(var i=0;i<$('.btnWrap').find('span.blue').length;i++){
                    arr.push($('.btnWrap').find('span.blue').eq(i).attr('data-id'))
                }
            }
            var params = {
                faid: userId,
                token: token,
                taids: $('input[name="rname"]').attr('data-taid'),
                rids: arr.join("-")
            }
            if($('#time').val()){
                params.time=new Date($('#time').val().replace(/-/g,"/")+' 00:00:00').getTime();
            }
            if($.trim($('.beizhu').val())){
                params.annotation=$('.beizhu').val()
            }
            // var loadings= top.layui.layer.load(2);
            that.addClass('NoClick');
            tool().onClick(that);
            $.axse(urls + addStudent_Record, params, function (result) {
                // top.layui.layer.close(loadings);
                that.removeClass('NoClick');
                $('.fading-circle').remove();
                sl_Mask.YesTip('打分成功');
                //打分规则
                $('input[name="names"]').val('');
                $('.btnWrap').empty();
                //打分类型
                $('select[name="type"]').val('');
                form.render();
                //打分时间
                $('#time').val('');
                //备注
                $('.beizhu').val('');

            },function () {
                that.removeClass('NoClick');
                $('.fading-circle').remove();
                // top.layui.layer.close(loadings);
            })
        }
        //通过选择打分类型弹出其他框
        _m.chooseType=function () {
            $('#Choice').unbind('click').bind('click',function () {
                var val= $('select[name="type"]').val();
                if(val){
                    if(val==1){//核心素养
                        var p2 = new choose_Score('',studentRecord,{free:0},function (projectid) {
                            var rules=new getRulesForStudet(projectid,$('.btnWrap'));
                        });}
                    if(val==2){//班内打分
                        var p1 = new GradeInClass('',{
                            url:'/classPrivateProject/getProjects.action',
                            fn:function (projectid,values) {
                                student_record.choose(projectid,values);
                            }
                        });
                    }
                }else {
                    sl_Mask.NoTip('请先选择类型')
                }
            })
        }
        //在选择类型的时候进行初始化
        _m.chooseTypeInit = function () {
            layui.form.on('select(type)', function (data) {
                if(data.value==1){//核心素养
                    $('.btnWrap').empty().show();
                    $("input[name='names']").val('');
                    $('input[name="names"]').attr('data-id','');
                    $('.chooseOwnScore').find('select').html("<option value=''>选择分值</option>");
                    form.render();
                    $('.chooseOwnScore').hide();
                }
                if(data.value==2){//班内打分
                    $('.chooseOwnScore').find('select').html("<option value=''>选择分值</option>");
                    form.render();
                    $('.chooseOwnScore').show();
                    $("input[name='names']").val('');
                    $('input[name="names"]').attr('data-id','');
                    $('.btnWrap').empty().hide();
                }
            })
        }
        return _m;
    })();
    student_record.init();
})