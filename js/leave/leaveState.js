layui.use(['layer', 'form', 'element','laydate'], function(){
    var layer = layui.layer
        ,form = layui.form
        ,element = layui.element
    laydate = layui.laydate
    var laydateTime;
    laydate.render({
        elem: '#startEnd',
        range: true,
        done: function(value, date, endDate){
            laydateTime=value;
            leave_out.choose(value);
        }
    });
    //单选框的点击事件
    $('#account .formwrap ul li').unbind('click').bind('click',function(){
        $('#account .formwrap ul li').removeClass('active');
        $(this).addClass('active');
        var state=$(this).attr('data-state');
        leave_out.chooseState(state);
    })
    //搜索按钮
    //请假
    leave_out = (function () {
        var _m = {};
        var self = _m;
        var state={
            "0":'待审批',
            "1":"已审批",
            "-1":"驳回"
        }
        var stateclassName={
            "0":'blue',
            "1": 'gray',
            "-1":'red'
        }
        //初始化
        _m.init= function () {
            self.all();
            self.chooseType();
            self.keyword();
        }
        //表格table
        _m.table = function (filed) {
            if(!filed.token||!sessionStorage.identity_id){
                tool().judge_token(function () {
                    top.location.href=loginSrc;
                })
                return;
            }
            if(filed) $.extend(filed,pclogin);
            $('#account').find('#table1').bootstrapTable('destroy');
            $('#table1').bootstrapTable({
                url:urls + '/leave/getApplys.action',
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
                cache:false,
                pageNumber:1,
                pageSize: 10,
                pageList: [10, 15, 25],
                // striped : true,
                columns:
                    [  {
                        field: 'state',
                        align:"left",
                        title: '请假类型',
                        width:'15%',
                        formatter: function(value, row, index) {
                            switch (row.type){
                                case 0 :
                                    var a='<span class="leaveState" style="color: #ffffff;background: #868686;border-radius: 4px">其他</span>';
                                    break;
                                case 1 :
                                    var a='<span class="leaveState" style="color: #ffffff;background: #2387f9;border-radius: 4px">事假</span>';
                                    break;
                                case 2 :
                                    var a='<span class="leaveState" style="color: #ffffff;background: #ff4747;border-radius: 4px">病假</span>';
                                    break;
                                case 3 :
                                    var a='<span class="leaveState" style="color: #ffffff;background: #ff9800;border-radius: 4px">活动</span>';
                                    break;
                            }
                            return a;
                        }
                    },{
                        field: 'rname',
                        align:"left",
                        width:'15%',
                        title: '姓名',
                        formatter: function(value, row, index) {
                            if(filed.keyword){var key=filed.keyword;}else {key=""};
                            var keyArr=[];
                            var arr=[];
                            if(row.apply_accounts&&row.apply_accounts.length>0){
                                for (var i=0;i<row.apply_accounts.length;i++){
                                    if(row.apply_accounts[i]){
                                        arr.push(row.apply_accounts[i].accountData.rname)
                                        if(key&&row.apply_accounts[i].accountData.rname.indexOf(key)!=-1){
                                            keyArr.push(row.apply_accounts[i].accountData.rname);
                                        }
                                    }
                                }
                            }
                            if(arr.length>1){
                                if(key){
                                    var str=keyArr[0]+'等'+arr.length+'人'
                                }else {
                                    var str=arr[0]+'等'+arr.length+'人'
                                }
                            }else {
                                var str=arr[0]
                            }
                            return str;
                        }
                    },{
                        field: 'classgrades',
                        align:"left",
                        title: '班级',
                        width:'20%',
                        formatter: function(value, row, index) {
                            var apply_accounts= row.apply_accounts;
                            if(apply_accounts[0]){
                                var obj=apply_accounts[0].accountData.identitysData[6].classgrades;
                                var a=obj[0].name;
                                return a;
                            }
                        }
                    }, {
                        field: '',
                        align:"left",
                        title: '请假时间段',
                        formatter: function(value, row, index) {
                            var a='<span>'+tool().getSmpFormatDateByLong(row.s_time).replace(/-/g,"/").replace(/:/g,":")+"&nbsp;&nbsp;&nbsp;   至   &nbsp;&nbsp;&nbsp;"+tool().getSmpFormatDateByLong(row.e_time).replace(/-/g,"/").replace(/:/g,":")+'</span>';
                            return a;
                        }
                    },{
                        field: '',
                        align:"left",
                        title: '状态',
                        width:'10%',
                        formatter: function(value, row, index) {
                            var identity_id = sessionStorage.identity_id;
                            if(identity_id==4){
                                var a='<a class="'+stateclassName[row.last_state]+'"style="cursor: pointer" onclick="leave_Mask().stayTryClass('+row.id+')">'+state[row.last_state]+'</a>';
                            }else {
                                var a='<a class="'+stateclassName[row.last_state]+'"style="cursor: pointer" onclick="leave_Mask().stayTry('+row.id+')">'+state[row.last_state]+'</a>'
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
                            sl_Mask.NoTip(result.error.message)
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
        _m.all = function () {
            var params={
                token:token,
                faid:userId
            }
            self.table(params);
        }
        //搜索
        _m.search = function () {
            var val1=$('#search').val();
            var type = $('select[name="type"]').val();
            var state =  $('.formwrap ul li.active').attr('data-state');
            var params={
                token:token,
                faid:userId
            }
            if(laydateTime) {
                var s_time = new Date(laydateTime.split(' - ')[0] + ' 00:00:00').getTime();
                var e_time = new Date(laydateTime.split(' - ')[1] + ' 00:00:00').getTime();
                params.s_time=s_time;
                params.e_time=s_time;
            }
            if(val1){params.keyword=val1};
            if(type){params.type=type}
            if(state){params.state=state}
            // if($.trim(val1)){
            //     var params={
            //         faid:userId,
            //         token:token,
            //         keyword:val1
            //     }
                 self.table(params);
            // }else{
            //     self.all();
            // }
            // $('#account .formwrap ul li').removeClass('active').eq(0).addClass('active');
        }
        //键盘事件
        _m.keyword = function () {
            $(document).keyup(function(event) {
                var e=event||window.event;
                if(e.keyCode == 13) {
                    self.search();
                }
            });
        }
        //选择时间段
        _m.choose = function (time) {
            var type = $('select[name="type"]').val();
            var state =  $('.formwrap ul li.active').attr('data-state');
            var keyVal = $('#search').val();
            //选择时间段的处理
            if(time){
                var s_time=new Date(time.split(' - ')[0]+' 00:00:00').getTime();
                var  e_time=new Date(time.split(' - ')[1]+' 00:00:00').getTime();
                //选择类型
                //选择状态
                var params={
                    token:token,
                    faid:userId,
                    s_time:s_time,
                    e_time:e_time,
                    type:type,
                    state:state
                }
            }else {
                var params={
                    token:token,
                    faid:userId,
                    type:type,
                    state:state
                }
            }
            if($.trim(keyVal)){params.keyword=keyVal};
            self.table(params);
        }
        //选择请假类型
        _m.chooseType = function () {
            form.on('select(type)', function(data){
                var state =  $('.formwrap ul li.active').attr('data-state');
                var keyVal = $('#search').val();
                if(laydateTime){
                    var s_time=new Date(laydateTime.split(' - ')[0]+' 00:00:00').getTime();
                    var  e_time=new Date(laydateTime.split(' - ')[1]+' 00:00:00').getTime();
                    var params={
                        token:token,
                        faid:userId,
                        s_time:s_time,
                        e_time:e_time,
                        type:data.value,
                        state:state
                    }
                }else {
                    var state =  $('.formwrap ul li.active').attr('data-state');
                    var params={
                        token:token,
                        faid:userId,
                        type:data.value,
                        state:state
                    }
                }
                if($.trim(keyVal)){params.keyword=keyVal};
                self.table(params);
            })
        }
        //选择请假状态
        _m.chooseState = function (state) {
            var type = $('select[name="type"]').val();
            var keyVal = $('#search').val();
            if(laydateTime) {
                var s_time = new Date(laydateTime.split(' - ')[0]+' 00:00:00').getTime();
                var e_time = new Date(laydateTime.split(' - ')[1]+' 00:00:00').getTime();
                var params = {
                    token: token,
                    faid: userId,
                    s_time: s_time,
                    e_time: e_time,
                    type: type,
                    state: state
                }
            }else {
                var params = {
                    token: token,
                    faid: userId,
                    type: type,
                    state: state
                }
            }
            if($.trim(keyVal)){params.keyword=keyVal};
            self.table(params);
        }
        return _m;
    })();
    leave_out.init();
    // input搜索
    var query = new Query_table('QueryWrap',{
        tip:'请输入学生姓名',
        successFn:leave_out.search
    })
})