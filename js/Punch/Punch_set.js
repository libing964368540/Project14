layui.use(['layer', 'form', 'element', 'laydate'], function() {
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        form = layui.form,
        element = layui.element,
        laydate = layui.laydate
    laydate.render({
        elem: '#startTime',
        type: 'time'
    });
    laydate.render({
        elem: '#endTime',
        type: 'time'
    });
    var add_edit_Mask = '<div style="padding:30px 50px 24px;color:#898989;position:relative" class="layui-form major_set">' +
        '<p style="text-align:center;padding-bottom:50px;color: #010101;font-size: 20px;font-weight: bold ">编辑规则</p>' +
        '<i class="layui-icon layui-icon-close closeBtn NoTip" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;cursor: pointer">&#x1006;</i> '+
        '<div >' +
        '<ul style="padding-bottom: 35px">' +
        '<li  class="clear" style="line-height:30px;margin-bottom: 15px;"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">到校时间</label><input type="text" placeholder="请选择时间" class="layui-input rg" id="startTime" readonly style="width:220px;border: none;background: #f3f5f8;border-radius: 0;" name="start"> </li>' +
        '<li  class="clear" style="line-height:30px;margin-bottom: 15px;"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">离校时间</label><input type="text" placeholder="请选择时间" class="layui-input rg" readonly id="endTime" style="width:220px;border: none;background: #f3f5f8;border-radius: 0;" name="end"></li>' +
        '</ul>' +
        '<div class="yesTip"style="width:100%;text-align:center;line-height:35px;color:#2488fa;cursor: pointer;background:#2196F3;color: #ffffff" lay-filter="formDemo" lay-submit>确定</div>'
    '</div>'
    var set_NotNormal_Mask = '<div style="padding:30px 50px 24px;color:#898989;position:relative" class="layui-form major_set">' +
        '<p style="text-align:center;padding-bottom:50px;color: #010101;font-size: 20px;font-weight: bold ">晚走时间设置</p>' +
        '<i class="layui-icon layui-icon-close closeBtn NoTip" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;cursor: pointer">&#x1006;</i> '+
        '<div >' +
        '<ul style="padding-bottom: 35px">' +
        '<li  class="clear" style="line-height:30px;margin-bottom: 15px;"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">晚走时间</label><input type="text" placeholder="请选择时间" class="layui-input rg" id="startTime" readonly style="width:220px;border: none;background: #f3f5f8;border-radius: 0;" name="start"> </li>' +
        '</ul>' +
        '<div class="yesTip"style="width:100%;text-align:center;line-height:35px;color:#2488fa;cursor: pointer;background:#2196F3;color: #ffffff" lay-filter="formDemo" lay-submit>确定</div>'
    '</div>'
    //考勤设置的表格
    leave_set = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            self.all();
            self.type();
            if(sessionStorage.identity_id==3){
                self.getState();
            }
        }
        //获取考勤总开关的状态
        _m.getState = function () {
            var params = {
                token:token,
                faid:userId
            }
            $.axse(urls+'/PunchGet/GetFinality.action',params,function(result) {
                // console.log(result);
                if(result.data==1){//开
                    $('.tableWrap .closeMask').remove();
                    $('#switchBtn').text('关闭考勤');
                    $('#switchBtn').attr('data-type',1);
                }
                if(result.data==0){//关闭
                    $('.tableWrap').append('<div class="closeMask" style="position: absolute;width: 100%;height: 100%;background: #ffffff;opacity: 0.8;top:0;left: 0;text-align: center;line-height: 500px;font-size: 30px;color: #FF4747;font-weight: bold">已关闭</div>');
                    $('#switchBtn').text('开启考勤')
                    $('#switchBtn').attr('data-type',0);
                }
                $('.typeBtnWrap').append('<div class="rg punchBindScore" style="display: inline-block"><span class="school_Btn red late" style="margin-right: 40px;width: 80px;" data-state="100">迟到扣分</span><span class="school_Btn red NotNormal" style="margin-right: 40px;width: 80px;"data-state="200">晚走扣分</span><span class="school_Btn setNotNormal" style="margin-right: 20px;width: 80px;background: #f3f5f8;color: #2196F3">晚走时间</span></div>')
                self.switchBtn();
                self.punchBindScore();
            })
        }
        //表格
        _m.table = function (filed) {
            if(!filed.token||!sessionStorage.identity_id){
                tool().judge_token(function () {
                    top.location.href=loginSrc;
                })
                return;
            }
            if(filed) $.extend(filed,pclogin);
            $('#student_leave_set').find('#table1').bootstrapTable('destroy');
            $('#table1').bootstrapTable({
                url:urls+'/PunchGet/GetPunchRules.action',
                queryParams:function(params){
                    var obj={}
                    if(filed) $.extend(obj,filed);
                    return obj;
                },
                sidePagination: "client",
                contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                method: 'POST',
                async:true,
                // striped:true,
                pagination: true,
                paginationLoop: false,
                cache:false,
                pageNumber:1,
                pageSize: 10,
                pageList: [10, 15, 25],
                columns:
                    [  {
                        field: 'type',
                        align:"left",
                        title: '学生类型',
                        width:'20%',
                        formatter: function(value, row, index) {
                            if (row.type == 1) {
                                var a='住校生';
                            }
                            if(row.type== 2){
                                var a="通校生";
                            }
                            return a;
                        }
                    },{
                        field: 'day',
                        align:"left",
                        title: '考勤日',
                        width:'20%',
                        formatter: function(value, row, index) {
                            var a=self.date(row.day);
                            return a;
                        }
                    }, {
                        field: '',
                        align:"left",
                        title: '到校时间',
                        width:'25%',
                        formatter: function(value, row, index) {
                            if(row.hour1<10){
                                row.hour1 = '0'+row.hour1;
                            }
                            if(row.minute1<10){
                                row.minute1 = '0'+row.minute1;
                            }
                            if(row.open1){
                                var a = '<span class="start-up" style="background: #2196F3" data-id='+row.id+' onclick="leave_set.close1($(this))">已启用</span>';
                            }else {
                                var a = '<span class="start-up" data-id='+row.id+' onclick="leave_set.start1($(this))">已关闭</span>';
                            }
                            var a = row.hour1+'：'+row.minute1+a;
                            return a;
                        }
                    }, {
                        field: '',
                        align:"left",
                        title: '离校时间',
                        width:'25%',
                        formatter: function(value, row, index) {
                            if(row.hour2<10){
                                row.hour2 = '0'+row.hour2;
                            }
                            if(row.minute2<10){
                                row.minute2 = '0'+row.minute2;
                            }
                            if(row.open2){
                                var a= '<span class="start-up" style="background: #2196F3" data-id='+row.id+'  onclick="leave_set.close2($(this))">已启用</span>';
                            }else {
                                var a= '<span class="start-up" data-id='+row.id+'  onclick="leave_set.start2($(this))">已关闭</span>';
                            }
                            var a = row.hour2+'：'+row.minute2+a;
                            return a;
                        }
                    },{
                        field: '',
                        align:"left",
                        title: '操作',
                        formatter: function(value, row, index) {

                            var open1=  row.hour1+':'+row.minute1+':00'
                            var open2=  row.hour2+':'+row.minute2+':00'
                            var  a="<a class='blue' onclick='leave_set.edit($(this))' data-open1="+open1+"   data-open2="+open2+"  data-id="+row.id+">编辑</a>";
                            return a;
                        }
                    }],
                responseHandler:function(result){
                    if(result.error){
                        if(400<=result.error.errorCode&&result.error.errorCode<=500){
                            parent.location.href=loginSrc;
                        }else {
                            layer.msg('<i class="material-icons msgIconStyleFail">cancel</i>'+result.error.message,{
                                skin: 'msgStyle',//skin属性可以将layer的标签提取出来，重新定义样式
                            });
                            return  [];
                        }
                    }else{
                        var arr=[];
                        var data=result.data;
                        var type= $('#student_leave_set .typeBtnWrap li.active').attr('data-type');

                        if(type==1){
                            for(var i=0;i<data.length>0;i++){
                                if(data[i].type==1){
                                    arr.push(data[i]);
                                }
                            }
                        }
                        if(type==2){
                            for(var i=0;i<data.length>0;i++){
                                if(data[i].type==2){
                                    arr.push(data[i]);
                                }
                            }
                        }
                        if(data[0].out_hour<10){
                            var out_hour = '0'+ data[0].out_hour;
                        }else {
                            var out_hour =  data[0].out_hour;
                        }
                        if(data[0].out_minute<10){
                            var out_minute = '0'+ data[0].out_minute;
                        }else {
                            var out_minute =  data[0].out_minute;
                        }
                        $('#student_leave_set').find('#table1').attr('out_hour',out_hour);
                        $('#student_leave_set').find('#table1').attr('out_minute',out_minute);
                        return  arr;
                    }
                },
                formatLoadingMessage: function(){
                    return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
                }
            })
            $('table tr').css("background-color","#FFFFFF");

        }
        //全部
        _m.all = function () {
            var param={
                faid:userId,
                token:token
            }
            self.table(param);
        }
        //判断是星期几
        _m.date = function (date) {
            var arr=["","一","二","三","四","五","六","日"];
            return '星期'+arr[date];
        }
        //启动1
        _m.start1 = function (that) {
            tool().Switched_Roles('images1/recovery.png','确定开启规则？', function() {
                var ids = that.attr('data-id');
                var params = {
                    token: token,
                    faid: userId,
                    id: ids,
                    open1: 1
                }
                self.modify(params, '开启成功');
            })
        }
        //启动2
        _m.start2 = function (that) {
            tool().Switched_Roles('images1/recovery.png','确定开启规则？', function() {
                var ids = that.attr('data-id');
                var params = {
                    token: token,
                    faid: userId,
                    id: ids,
                    open2: 1
                }
                self.modify(params, '开启成功');
            })
        }
        //关闭1
        _m.close1 = function (that) {
            tool().Switched_Roles('images1/out.png','确定关闭规则？', function() {
                var ids = that.attr('data-id');
                var params = {
                    token: token,
                    faid: userId,
                    id: ids,
                    open1: 0
                }
                self.modify(params, '关闭成功');
            })
        }
        //关闭2
        _m.close2 = function (that) {
            tool().Switched_Roles('images1/out.png','确定关闭规则？', function() {
                var ids = that.attr('data-id');
                var params = {
                    token: token,
                    faid: userId,
                    id: ids,
                    open2: 0
                }
                self.modify(params, '关闭成功');
            })
        }
        //选择类型
        _m.type = function () {
            $('#student_leave_set .typeBtnWrap li').unbind('click').bind('click',function () {
                $('#student_leave_set .typeBtnWrap li').removeClass('active');
                $(this).addClass('active');
                self.all();
            })
        }
        //修改ajax
        _m.modify = function (params,msg) {
            $.axse(urls+'/PunchEdit/modificationPunchRule.action',params,function(result) {
                top.layer.msg('<i class="material-icons msgIconStyle">check_circle</i>' + msg, {
                    skin: 'msgStyle'//skin属性可以将layer的标签提取出来，重新定义样式
                });
                $('#student_leave_set').find('#table1').bootstrapTable('destroy');
                self.all();
            })
        }
        //编辑
        _m.edit = function (that) {
            var ids=that.attr('data-id');
            var open1 = that.attr('data-open1');
            var open2 = that.attr('data-open2');
            var index = parent.layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                shadeClose: false,
                slin:'.layer-ext-myskin',
                area: ['400px', 'auto'],
                content:add_edit_Mask,
                success: function(layero, index) {
                    $(layero).find('#startTime').val(open1)
                    $(layero).find('#endTime').val(open2)
                    top.layui.form.render();
                    top.layui.laydate.render({
                        elem: '#startTime',
                        type: 'time'
                    });
                    top.layui.laydate.render({
                        elem: '#endTime',
                        type: 'time'
                    });
                    top.layui.form.render();
                    parent.layui.form.on('submit(formDemo)', function(data){
                        console.log(data);
                        var start=data.field.start
                        var end=data.field.end
                        var params={
                            token:token,
                            faid:userId,
                            id:ids
                        }
                        if(start!=open1){
                            var startArr = start.split(':');
                            params.hour1=startArr[0];
                            params.minute1=startArr[1];
                        }
                        if(end!=open2){
                            var endArr = end.split(':');
                            params.hour2=endArr[0];
                            params.minute2=endArr[1];
                        }
                        if(end==open2&&start==open1){
                            layer.msg('<i class="material-icons msgIconStyleFail">cancel</i>' + '请修改规则后再提交', {      skin: 'msgStyle',//skin属性可以将layer的标签提取出来，重新定义样式
                            });
                            return;
                        }
                        self.modify(params,'修改成功')
                        top.layer.close(index);
                    });
                    $(layero).find('.NoTip').unbind('click').bind('click',function () {
                        top.layer.close(index);
                    })
                }
            })
        }
        //设置开关的总按钮
        _m.switchBtn = function () {
            $('#switchBtn').unbind('click').bind('click',function () {
                var type = $(this).attr('data-type');
                if(type==1){self.switch('images1/out.png','是否关闭考勤？',0,function () {
                    $('#switchBtn').text('开启考勤');
                    $('#switchBtn').attr('data-type',0);
                    $('.tableWrap').append('<div class="closeMask" style="position: absolute;width: 100%;height: 100%;background: #ffffff;opacity: 0.8;top:0;left: 0;text-align: center;line-height: 500px;font-size: 30px;color: #FF4747;font-weight: bold">已关闭</div>');
                });}
                if(type==0){self.switch('images1/out.png','是否开启考勤？',1,function () {
                    $('#switchBtn').text('关闭考勤');
                    $('#switchBtn').attr('data-type',1);
                    $('.tableWrap .closeMask').remove();
                });}
            })
        }
        //点击开关
        _m.switch = function (src,msg,state,fn) {
            var index = top.layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                shadeClose: false,
                area: ['400px', 'auto'],
                content: '<div style="padding:30px 30px 50px;color:#000000;opacity:0.87;position:relative;padding-bottom: 27px">' +
                '<i class="layui-icon layui-icon-close closeBtn" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;cursor: pointer">&#x1006;</i> '+
                '<div style="height: 80px;margin-bottom: 25px;width: 80px;margin: 0 auto;margin-top: 60px;"><img src="'+src+'" alt=""width="100%"height="100%"></div>'+
                '<p style="padding:10px 10px 54px;text-align: center;line-height: 30px">'+msg+'</p>' +
                '<div class="self_Mask_btn">确定<div>' +
                '</div>',
                success: function(layer, index) {
                    $(layer).find('.self_Mask_btn').unbind('click').bind('click', function() {
                        var params={
                            token:token,
                            faid:userId,
                            open:state
                        }
                        var loadings = top.layui.layer.load(2);
                        $.axse(urls+'/PunchEdit/Finality.action',params,function(result) {
                            top.layui.layer.close(loadings);
                            sl_Mask.YesTip('设置成功');
                            fn();
                            top.layer.close(index);
                        },function () {
                            top.layui.layer.close(loadings);
                        })
                    })
                    $(layer).find('.closeBtn').unbind('click').bind('click', function() {
                        top.layer.close(index);
                    })
                }

            })
        }
        //给考勤的状态绑定核心素养打分规则
        _m.punchBindScore = function () {
            $('.punchBindScore span.late').unbind('click').bind('click',function (e) {
                sl_Mask.PunchStateBindScoreRule($(this));
            })
            $('.punchBindScore span.NotNormal').unbind('click').bind('click',function (e) {
                sl_Mask.PunchStateBindScoreRule($(this));
            })
            $('.punchBindScore span.setNotNormal').unbind('click').bind('click',function (e) {
                var out_hour = $('#student_leave_set').find('#table1').attr('out_hour');
                var out_minute = $('#student_leave_set').find('#table1').attr('out_minute');
                var index = parent.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shadeClose: false,
                    slin: '.layer-ext-myskin',
                    area: ['400px', 'auto'],
                    content: set_NotNormal_Mask,
                    success: function (layero, index) {
                        $(layero).find('#startTime').val(out_hour+':'+ out_minute+':'+'00')
                        top.layui.laydate.render({
                            elem: '#startTime',
                            type: 'time'
                        });
                        //确定
                        parent.layui.form.on('submit(formDemo)', function(data){
                            var params={
                                token:token,
                                faid:userId
                               }
                            var start=data.field.start
                            if(start){
                                var startArr = start.split(':');
                                params.hour=startArr[0];
                                params.minute=startArr[1];
                            }
                            self.setNotNormalTime(params,index);
                        })
                        //取消
                        $(layero).find('.NoTip').unbind('click').bind('click',function () {
                            top.layer.close(index);
                        })
                    }
                })
            })
        }
        //设置考勤时间
        _m.setNotNormalTime =function (params,index) {
            $.axse(urls+'/PunchEdit/SetOutTime.action',params,function(result) {
                 sl_Mask.YesTip('操作成功');
                 top.layer.close(index);
                $('#student_leave_set').find('#table1').bootstrapTable('destroy');
                self.all();
            })
        }
        return _m;
    })();
    leave_set.init();


})