layui.use(['layer', 'form', 'element', 'laydate'], function() {
    var layer = parent.layer === undefined ? layui.layer : top.layer
    form = layui.form,
        laydate = layui.laydate
    var laydateTime;
    laydate.render({
        elem: '#startEnd',
        range: true,
        done: function(value, date, endDate){
            laydateTime=value;
            class_leave.time(value);
        }
    });
    //页面操作
    class_leave = (function () {
        var _m={};
        var self=_m;
        //初始化
        _m.init = function () {
            //班主任权限下
            if(sessionStorage.identity_id==4||sessionStorage.identity_id == 12){
                self.classgrades();
            }else{
                self.all({states:100});
            }
            self.keyword();
            self.type();
            self.state();
        }
        //通过班主任权限获取班级
        _m.classgrades= function () {
            var params={
                token:token,
                faid:userId
            };
            if(sessionStorage.identity_id == 12){
                params.vice_director_aid = userId;
            }else {
                params.director_id = userId;
            }
            $.axse(urls + '/classgrade/getClassgrades.action', params, function (result) {
                var data = result.data.list;
                if (data && data.length > 0) {
                    var arr=[];
                    for(var i=0;i<data.length;i++){
                        arr.push(data[i].id)
                    }
                    $('#account').attr('data-classgrade_ids',arr.join('-'));
                    self.all({classgrade_ids:arr.join('-')});

                }else {
                    // sl_Mask.NoTip('班主任账户下未绑定任何班级，请绑定后重试')
                }
            })

        }
        //table
        _m.table = function(filed){
            if(!filed.token||!sessionStorage.identity_id){
                tool().judge_token(function () {
                    top.location.href=loginSrc;
                })
                return;
            }
            if(filed) $.extend(filed,pclogin);
            $('#table1').bootstrapTable({
                url:urls+'/PunchGet/GetPunchRecord.action',
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
                striped:true,
                pagination: true,
                paginationLoop: false,
                paginationShowPageGo: true,
                pageNumber:1,
                cache:false,
                pageSize: 10,
                pageList: [10, 15, 25,50,100],
                columns:
                    [  {
                        field: '',
                        align:"center",
                        title: '类型',
                        width:'80px',
                        formatter: function(value, row, index) {
                            var a;
                            switch (row.behavior){
                                case 1:
                                    a='<span class="leaveState" style="background: #2196F3">进校</span>';
                                    break;
                                case 0:
                                    a='<span class="leaveState" style="background: #ff4747">离校</span>';
                                    break;
                            }

                            return a;
                        }
                    },{
                        field: 'student_name',
                        align:"center",
                        title: '学生'
                    },{
                        field: 'way',
                        align:"center",
                        title: '属性',
                        formatter: function(value, row, index) {
                            var arr=['通校生','住校生','停住']
                            if(row.way!=null)
                            {
                                var a=arr[row.way];
                                return a;
                            }
                        }
                    }, {
                        field: 'classgrade_name',
                        align:"center",
                        title: '班级'
                    },{
                        field: 'time',
                        align:"center",
                        title: '时间',
                        formatter: function(value, row, index) {
                            if(row.punch_time){
                                var a = tool().getSmpFormatDateByLong(row.punch_time,true)+'（扫码）'
                            }else {
                                var a = tool().getSmpFormatDateByLong(row.time,true)
                            }
                            return a;
                        }
                    },{
                        field: 'type',
                        align:"center",
                        title: '状态',
                        formatter: function(value, row, index) {
                            if(row.state==1){
                                var a='<a onclick="class_leave.changeState('+row.id+',$(this))" data-state='+row.state+'>正常</a>'
                            }
                            if(row.state==100){
                                var a='<a class="red" onclick="class_leave.changeState('+row.id+',$(this))" data-state='+row.state+'>迟到</a>'
                            }
                            if(row.state==200){
                                var a='<a class="red" onclick="class_leave.changeState('+row.id+',$(this))" data-state='+row.state+'>晚走</a>'
                            }
                            if(row.state==300){
                                var a='<a class="red" onclick="class_leave.changeState('+row.id+',$(this))" data-state='+row.state+'>重复</a>'
                            }
                            if(row.state==500){
                                var a='<a class="red" onclick="class_leave.changeState('+row.id+',$(this))" data-state='+row.state+'>请假</a>'
                            }
                            if(row.state==600){
                                var a='<a class="red" onclick="class_leave.changeState('+row.id+',$(this))" data-state='+row.state+'>早退</a>'
                            }
                            return a;
                        }
                    }],
                responseHandler:function(result){
                    if(result.error){
                        if(400<=result.error.errorCode&&result.error.errorCode<=500){
                            tool().judge_token(function () {
                                parent.location.href=loginSrc;
                            })
                        }else {
                            top.layer.msg('<i class="material-icons msgIconStyleFail">cancel</i>'+result.error.message,{
                                skin: 'msgStyle'//skin属性可以将layer的标签提取出来，重新定义样式
                            });
                            return {
                                "rows":'',
                                "total":''
                            }
                        }
                    }else{
                        return {
                            "rows":result.data.list,
                            "total":result.data.count
                        }
                    }
                },
                formatLoadingMessage: function(){
                    return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
                }
            })

        }
        //全部
        _m.all = function (opt) {
            var val1=$('#search').val();//学生姓名
            var behavior = $('select[name="behavior"]').val();   //行为
            var states=$('#account .formwrap ul li.active').attr('data-states');
            var params={token:token,faid:userId}
            //时间
            var time=$('#startEnd').val();
            if(time){
                var s_time=new Date(time.split(' - ')[0].replace(/-/g,'/')+' 00:00:00').getTime();
                var  e_time=new Date(time.split(' - ')[1].replace(/-/g,'/')+' 00:00:00').getTime();
                params.s_time=s_time;
                params.e_time=e_time;
            }
            //状态
            if(val1){params.keyword=val1}
            if(behavior){params.behavior=behavior};
            if(states){params.states=states};
            //专业部权限下
            if(sessionStorage.identity_id==8){
                var obj=JSON.parse(sessionStorage.positionId);
                if(obj[8].majorGroup) {
                    params.major_group_ids=obj[8].majorGroup.id;
                }else {
                    sl_Mask.NoTip('专业部权限下未绑定任何班级');
                    return;
                }
            }
            if(sessionStorage.identity_id==4||sessionStorage.identity_id == 12){
                var classgrade_ids=$('#account').attr('data-classgrade_ids');
                if(classgrade_ids){
                    params.classgrade_ids = classgrade_ids;
                }else {
                    sl_Mask.NoTip('班主任权限下未绑定任何班级');
                    return;
                }
            }
            if(opt){
                if(opt.states){params.states=opt.states};
                if(opt.s_time){params.s_time=opt.s_time}
                if(opt.e_time){params.e_time=opt.e_time}
                if(opt.classgrade_ids){params.e_time=opt.classgrade_ids}
            }
            $('#account').find('#table1').bootstrapTable('destroy');
            self.table(params);
        }
        //搜索
        _m.search = function () {
            var val1=$('#search').val();
            if($.trim(val1)){
                $('#account').find('#table1').bootstrapTable('destroy');
                var params={
                    faid:userId,
                    token:token,
                    keyword:val1
                }
                self.table(params);
            }else{
                self.all();
                $('#account .formwrap ul li').removeClass('active').eq(0).addClass('active');
            }
        }
        //keyword 键盘事件
        _m.keyword = function () {
            $(document).keyup(function(event) {
                var e=event||window.event;
                if(e.keyCode == 13) {
                    self.all();
//                          self.search();
                }
            });
        }
        //状态筛选
        _m.type = function () {
            $('#account .formwrap ul li').unbind('click').bind('click',function(){
                $('#account .formwrap ul li').removeClass('active');
                $(this).addClass('active');
                self.all({});
//                      if($(this).find('span').text()=='全部'){
//                              self.all();
//                          }else{
//                              $('#account').find('#table1').bootstrapTable('destroy');
//                              var type= $(this).attr('data-type');
//                              var params={
//                                  token:token,
//                                  faid:userId,
//                                  states:type
//                              }
//                          self.table(params);
//                      }
            })
        }
        //时间段
        _m.time = function (time) {
            if(time){

                var s_time=new Date(time.split(' - ')[0].replace(/-/g,'/')+' 00:00:00').getTime();
                var  e_time=new Date(time.split(' - ')[1].replace(/-/g,'/')+' 00:00:00').getTime();
                self.all({
                    s_time:s_time,
                    e_time:e_time
                });
            }
        }
        //进校离校
        _m.state = function () {
            form.on('select(behavior)', function(data){
                self.all();
            })
        }
        //改变考勤信息的状态
        _m.changeState = function (ids,that) {
            if(sessionStorage.identity_id!=3){
                return;
            }
            var state= that.attr('data-state');
            var index = top.layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                shadeClose: false,
                area: ['400px', 'auto'],
                content: '<div style="padding:50px 30px 50px;color:#000000;opacity:0.87;position:relative;">' +
                '<i class="layui-icon layui-icon-close closeBtn" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;cursor: pointer">&#x1006;</i> ' +
                '<div style="height: 80px;margin-bottom: 25px;width: 80px;margin: 0 auto;margin-top: 30px;"><img src="images1/passIcon.png" alt=""width="100%"height="100%"></div>' +
                '<p style="padding:10px 10px 54px;text-align: center;line-height: 30px">更改此条考勤记录的状态为</p>' +
                '<div class="clear" style="width: 80%;margin: 0 auto">' +
                '<div class="self_Mask_btn lf YesBtn gray"style="width: 100px;">正常</div>' +
                '<div class="self_Mask_btn rg NoBtn red gray" style="width: 100px;">异常</div>' +
                '</div>'+
                '</div>',
                success: function (layer, index) {
                    if(state==100){
                        $(layer).find('.YesBtn').removeClass('gray');
                        $(layer).find('.NoBtn').removeClass('gray');
                    }//迟到
                    if(state==200){
                        $(layer).find('.YesBtn').removeClass('gray');
                        $(layer).find('.NoBtn').removeClass('gray');
                    }//晚走
                    if(state==300){
                        $(layer).find('.YesBtn').removeClass('gray');
                    }//异常
                    if(state==1){
                        $(layer).find('.NoBtn').removeClass('gray');
                    }//正常
                    var params={
                        token: token,
                        faid:userId,
                        id:ids
                    }
                    $(layer).find('.YesBtn').unbind('click').bind('click', function() {
                        if($(this).hasClass('gray')){
                            return;
                        }
                        params.state =1;
                        self.chageStateAjax(params,index);

                    })
                    $(layer).find('.NoBtn').unbind('click').bind('click', function() {
                        if($(this).hasClass('gray')){
                            return;
                        }
                        params.state =300;
                        self.chageStateAjax(params,index);
                    })
                    $(layer).find('.closeBtn').unbind('click').bind('click', function() {
                        top.layer.close(index);
                    })
                }
            })
        }
        //修改考勤状态的ajax
        _m.chageStateAjax = function (params,index) {
            var loadings = top.layui.layer.load(2);
            $.axse(urls+'/PunchEdit/Edit.action',params,function(result) {
                  top.layui.layer.close(loadings);
                  sl_Mask.YesTip('操作成功');
                  top.layer.close(index);
                  self.all();
            },function () {
                 top.layui.layer.close(loadings);
            })
        }
        return _m;
    })();
    class_leave.init();
    // input搜索
    var query = new Query_table('QueryWrap',{
        tip:'请输入学生姓名',
        successFn:class_leave.search
    })
})