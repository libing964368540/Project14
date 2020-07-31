layui.use(['layer', 'form', 'element'], function(){
    var layer = layui.layer
        ,form = layui.form
        ,element = layui.element;
    $('#Import').unbind('click').bind('click',function () {
        window.open(ImgurlHttp+'SHSSVIEW/xls/新生导入模板.xls')
    })
    //上传导表
    var UpTemplate_Score = new UpTemplate('UpFile',{
        url:'/file/uploadImportStudent.action',
        filed:'',
        tip:'确认上传此表格进行批量导入学生',
        NoFile_Tip:"请先上传文件"
    })
    //移除按钮
    //添加账户
    var Information = null;
})
mainPage=(function(){
    var _m = {};
    var self = _m;
    //初始化
    _m.init=function(){
        self.all_table({state:1});
        self.keyword();
        self.switchState();
        self.switch();
    }
    //通过状态选择更换列表
    _m.switchState = function () {
        $('#account .formwrap ul li').unbind('click').bind('click',function () {
            $('#account .formwrap ul li').removeClass('active');
            $(this).addClass('active');
            var state = $(this).attr('data-state');
            if(state==1){self.normal_table()};
            if(state==2){self.recycle_table()};
            if(state==101){self.HaveLeave_table()};
            if(!state){self.all_table()};
        }) 
    }
    //生成表格
    _m.table = function(filed){
        if(!filed.token||!sessionStorage.identity_id){
            tool().judge_token(function () {
                parent.location.href=loginSrc;
            })
            return;
        }
        if(filed) $.extend(filed,pclogin);
        $('#table1').bootstrapTable({
            url:urls + studentList,
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
            paginationShowPageGo: true,
            pagination: true,
            paginationLoop: false,
            pageNumber:1,
            cache:false,
            pageSize: 10,
            pageList: [10, 20, 50,100],
            columns:
                 [{
                     field: 'variablevalue',
                    checkbox:true,
                    width:'43px',
                     visible: false
                },
                    {
                    field: '',
                    align:"left",
                    title: '',
                    width:'80px',
                    formatter: function(value, row, index) {
                        if(row.accountData.photopath){
                            var a='<span class="school_imgwrap"><img src="'+ImgurlHttp+row.accountData.photopath+'" alt="" ></span>'
                        }else {
                            var a='<span class="school_imgwrap"><img src="../images1/header.png" alt="" ></span>'
                        }
                        return a;
                    }

                },{
                    field: 'rname',
                    align:"center",
                    width:'100px',
                    title: '姓名',
                    formatter: function(value, row, index) {
                        if(row.accountData.rname){
                            var a='<span style="color: #262626">'+row.accountData.rname+'</span>';
                            return a;
                        }

                    }

                }, {
                        field: 'st_main_number',
                        align:"center",
                        title: '学号',
                         // width:'100px',
                        formatter: function(value, row, index) {
                            if(row.accountData.identitysData[6]){
                                if(row.accountData.identitysData[6].st_main_number){
                                    var a= row.accountData.identitysData[6].st_main_number
                                }else {
                                    var a= '暂无'
                                }
                                return a

                            }else {
                                return '暂无'
                            }
                        }
                    },
                    {
                    field: 'classgrades',
                    align:"center",
                    title: '班级',
                        // width:'200px',
                    formatter: function(value, row, index) {
                        if(row.accountData.identitysData[6]){
                            if(row.accountData.identitysData[6].classgrades){
                                var a= tool().basicMHandle(row.accountData.identitysData[6].classgrades,1);
                            }else {
                                var a= '暂无'
                            }
                            return a

                        }else {
                            return '暂无'
                        }
                    }
                }, {
                    field: 'majors',
                    align:"center",
                    title: '专业部',
                    formatter: function(value, row, index) {
                        if(row.accountData.identitysData[6]){
                            if(row.accountData.identitysData[6].majors){
                                var a=tool().basicMHandle(row.accountData.identitysData[6].majors,4);
                                return a;
                            }else {
                                return '暂无'
                            }
                        }else {
                            return '暂无'
                        }
                    }
                },
                    {
                    field: '',
                    align:"center",
                    title: '状态',
                    formatter: function(value, row, index) {
                        var arr = ['', '正常', '弃用'];
                        return arr[row.state]
                    }
                },{
                    field: '',
                    align:"center",
                    title: '操作',
                    formatter: function(value, row, index) {
                        if(row.state==2){
                            var b='<a class="blue" onclick="tool().regainUser('+row.id+')" style="margin-right: 20px">恢复</a>';
                            var a='<a class="red"  onclick="tool().removeUser('+row.id+')">彻底删除</a>'
                            return b+a;
                        }else{
                      
                            var b='<a class="blue" data-id='+row.id+' onclick="tool().addUser2(2,3)">编辑</a>'
                            return b;

                        }

                    }
                }],
            responseHandler:function(result){
                if(result.error){
                    if(400<=result.error.errorCode&&result.error.errorCode<=500){
                        tool().judge_token(function () {
                            parent.location.href=loginSrc;
                        })
                    }else {
                        sl_Mask.NoTip(result.error.message);
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
            },
            onCheck:function(value, row, index){ //单行
                $('#table1  tr.selected td label i.material-icons').text('check_box');
                var flag=$('#table1 th input[type="checkbox"]').prop('checked')
                if(flag){
                    $('#table1 th label').addClass('active');
                    $('#table1 th label i.material-icons').text('check_box');
                }else {
                    $('#table1 th label').removeClass('active');
                    $('#table1 th label i.material-icons').text('check_box_outline_blank');
                }
                // var a= $('#table1').bootstrapTable('getSelections');
                // if(a.length==10){
                //     $('#table1 th label').addClass('active');
                // }
            },
            onUncheck:function(e){ //单行
                for(var i=0;i<$('#table1  tr').length;i++){
                    if(!$('#table1  tr').eq(i).hasClass('selected')){
                        $('#table1  tr:nth-child('+i+') td label i.material-icons').text('check_box_outline_blank');
                    }
                }
                $('#table1 th label').removeClass('active');
                $('#table1 th label i.material-icons').text('check_box_outline_blank');
            },
            onCheckAll:function(value, row, index){ //全选
                $('#table1 th label').addClass('active')
                $('#table1 th label i.material-icons').text('check_box');
                $('#table1  tr td label i.material-icons').text('check_box');
            },
            onUncheckAll:function(value, row, index){ //全不选
                $('#table1 th label').removeClass('active');
                $('#table1 th label i.material-icons').text('check_box_outline_blank');
                $('#table1  tr td label i.material-icons').text('check_box_outline_blank');
            },
            onClickRow:function (value, row, index) {
                Information= value
            },
            onLoadSuccess:function (data) {
                if(data.rows.length>0){
                    $('#table1').bootstrapTable('showColumn', 'variablevalue');
                }else {
                    $('#table1').bootstrapTable('hideColumn', 'variablevalue');
                }
            }
            })
    }
    //全部
    _m.all_table = function(filed){
        var val1=$('#search').val();
        var val_cids=$('select[name="classgaderid"]').val();
        var state = $('#account .formwrap ul li.active').attr('data-state');
        $('#account').find('#table1').bootstrapTable('destroy');
        var params={
            token:token,
            faid:userId,
            iids:'6',
            sortType:0
        }
        if($.trim(val1)){params.keyword=val1};
        if($.trim(val_cids)){params.cids=val_cids};
        if(state){params.state=state};
        if(filed) $.extend(params,filed);
        if(!params.state){
            $('.removeBtn').removeClass('stop');
            $('.renewBtn').removeClass('stop');
            $('.deleteBtn').removeClass('stop');
        }
        if(params.state==1){
            $('.leaveBtn').removeClass('stop');
        }
        self.table(params)
    }
    //正常
    _m.normal_table = function(){
        $('.removeBtn').addClass('stop');
        $('.renewBtn').addClass('stop');
        $('.deleteBtn').removeClass('stop');
        $('.leaveBtn').removeClass('stop');
        self.all_table({state:1});
    }
    //回收站
    _m.recycle_table = function(){
        $('.removeBtn').removeClass('stop');
        $('.renewBtn').removeClass('stop');
        $('.deleteBtn').addClass('stop');
        $('.leaveBtn').addClass('stop');
        self.all_table({state:2});
    }
    //获取已离校的数据
    _m.HaveLeave_table = function () {
        $('.removeBtn').addClass('stop');
        $('.renewBtn').addClass('stop');
        $('.deleteBtn').removeClass('stop');
        $('.leaveBtn').addClass('stop');
        self.all_table({state:101});
    }
    //切换选中被选中的样式
    //搜索
    _m.search_table = function () {
        self.all_table()
    }
    //添加新用户
    _m.createUser = function () {
        $('#account').find('#table1').bootstrapTable('destroy');
        self.all_table();
    }
    //创建账号
    _m.tip = function() {
        var index = top.layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: false,
            skin: 'school_Msg',
            content: '<div class="school_Msg layui-form" style="padding:0 30px;height:100%;position:relative;">' +
            '<p class="titles" style="padding:30px 0 20px;color:#010101;border:1px solid transparent;font-size: 20px;font-weight: bold">新建账号</p>' +
            '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close">&#x1006;</i> '+
            '<div class="school_Msgcontnet" style="padding:20px 0 0">' +
            '<ul><li style="padding-bottom: 15px"><input type="text" placeholder="请输入账号" class="layui-input" style="background:#f6f6f6;border: none;" name="username" lay-verify="required|createname|min"></li><li><input type="password" placeholder="请输入密码" class="layui-input" name="password" style="background:#f6f6f6;border: none"></li></ul>' +
            '<i style="font-size:12px;color:#e3e3e3;font-style:normal;padding-top:10px;display:inline-block;">密码可为空默认123456</i>' +
            '</div>' +
            '<div class="school_MsgBtn" style="position: absolute;bottom:0;left:0;width:100%;line-height:50px;text-align:center;color:#2196F3;background:#f4f4f4;cursor: pointer;" lay-filter="formDemo" lay-submit>一键创建账号</div>' +
            '</div>',
            area: ['350px', '290px'],
            success: function(layer, index) {
                top.layui.form.render();
                var flag=true;
                top.layui.form.on('submit(formDemo)', function(data){
                    var loadings= top.layui.layer.load(2);
                    if(flag){
                        flag= false;
                        setTimeout(function(){
                            flag=true;
                            top.layui.layer.close(loadings);
                        },2000)
                        var params = {
                            faid: userId,
                            token: token,
                            username: data.field.username,
                            password: data.field.password || '123456',
                            iids: '6'
                        }
                        $.axse(urls + '/account/create.action', params, function (result) {
                            Information=result.data;
                            top.layui.layer.close(loadings);
                            top.layer.close(index);
                            var myDate = new Date().getTime();
                            var time = tool().get_date(myDate);
                            var dom = "<ul style='line-height:30px'>" +
                                "<li class='clear'><span class='lf'>创建时间：</span><p class='rg'>" + time + "</p></li>" +
                                "<li class='clear'><span class='lf'>创建账号：</span><p class='rg'>" + result.data.username + "</p></li>" +
                                "<li class='clear'><span class='lf'>当前状态：</span><p class='rg'>等待完善账号信息</p></li>" +
                                "</ul>";
                            self.createUser();
                            sl_Mask.successTip('<i class="material-icons" style="color: #4AC34F;font-size: 30px;position: absolute;left: 110px;">check_circle</i>创建账号成功', dom, function () {
                            
                                tool().addUser2(2,3);
                            }, '暂时跳过', '完善账号信息');

                        }, function () {
                            top.layui.layer.close(loadings);
                        })
                    }else{
                        sl_Mask.NoTip('您点击过快，请2秒后再试')
                    }
                })
                //取消按钮
                $(layer).find('.NoTip').unbind('click').bind('click',function () {
                    top.layer.close(index);
                })
            }
        })
    }
    //删除提示
    _m.delMsg = function (obj) {
        if(obj.find('.error').length > 0) {
            obj.find('.error').remove();
        }
        var dom = '<p class="error"style="text-align:center;color:red;padding-bottom:10px;">账户不能为空</p>';
        obj.find('ul').prepend(dom);
    }
    //键盘事件
    _m.keyword = function () {
        $(document).keyup(function(event) {
            var e=event||window.event;
            if(e.keyCode == 13) {
                self.search_table();
            }
        });
    }
    //
    _m.oneClass_table = function (cids) {
        $('#account .formwrap ul li').removeClass('active').eq(0).addClass('active');
        self.all_table({state:1});
    }
    //批量  删除  恢复  移除
    //批量删除
    _m.deleteUserList = function(that,type) {
        if(that.hasClass('stop')){
            return;
        }
        //获取所有被选中的记录
        var rows = $("#table1").bootstrapTable('getSelections');
        var RemoveArr =[];
        var DelArr =[];
        var ReaginArr = [];
        var LeaveArr = [];
        if (rows.length == 0) {
            sl_Mask.NoTip("请先选择学生!");
            return;
        }else {
            for (var i = 0; i < rows.length; i++) {
                // ids += rows[i]['id'] + ",";
                if(rows[i]['state']==1||rows[i]['state']==101){DelArr.push(rows[i]['id'])}//正常状态
                if(rows[i]['state']==2){RemoveArr.push(rows[i]['id']);ReaginArr.push(rows[i]['id'])}//回收站状态
                if(rows[i]['state']==1){LeaveArr.push(rows[i]['id'])};
            }//恢复
            if(type==1) {
                if (ReaginArr.length == 0) {
                    sl_Mask.NoTip("未选择要恢复的学生")
                }else {
                    if(ReaginArr.length>1){
                        tool().Switched_Roles('images1/recovery.png','确认批量恢复账号？', function() {
                            self.more_remove(1, 1, ReaginArr);  //批量恢复
                        })
                    }else {
                        tool().Switched_Roles('images1/recovery.png','确认恢复此账号？', function() {
                            self.more_remove(1, 0, ReaginArr);  //单个恢复
                        })
                    }
                }
            }
            //删除
            if(type==2){
                if(DelArr.length==0){
                    sl_Mask.NoTip("未选择要删除的学生")
                }else {
                    if(DelArr.length>1){
                        tool().Switched_Roles('images1/out.png','确认批量删除账号？', function() {
                            self.more_remove(0, 1, DelArr);  //批量删除
                        })
                    }else {
                        tool().Switched_Roles('images1/out.png','确认删除此账号？', function() {
                            self.more_remove(0, 0, DelArr);  //单个删除
                        })
                    }
                }
            }//彻底删除
            if(type==3){
                if(RemoveArr.length==0){
                    sl_Mask.NoTip("未选择要彻底删除的学生")
                }else {
                    if(RemoveArr.length>1){
                        tool().Switched_Roles('images1/out.png','确认批量彻底删除账号？', function() {
                            self.more_remove(0, 1, RemoveArr);  //批量移除
                        })
                    }else {
                        tool().Switched_Roles('images1/out.png','确认彻底删除此账号？', function() {
                            self.more_remove(0, 0, RemoveArr);   //单个移除
                        })
                    }
                }
            };//移除
            //离校
            if(type==4){
                if(LeaveArr.length==0){
                    sl_Mask.NoTip("未选择要离校的学生")
                }else {
                    if(LeaveArr.length>1){
                        tool().Switched_Roles('images1/out.png','确认批量操作账号为离校？', function() {
                            self.more_remove(0, 2, LeaveArr);  //批量移除
                        })
                    }else {
                        tool().Switched_Roles('images1/out.png','确认操作此账号为离校？', function() {
                            self.more_remove(0, 2, LeaveArr);   //单个移除
                        })
                    }
                }
            }
        }
    }

    //批量弃用  恢复   移除  学生账号
    _m.more_remove = function (recycle,num,ids) {
        var arrUrls = ['/account/recycle.action','/account/recycles.action','/accountStudent/graduate.action'];
        var params = {
            token:token,
            faid:userId,
            recycle:recycle
        }
        if(num==0){params.taid = ids.join('-')} //单项操作
        if(num==1){params.taids_str = ids.join('-')} //批量操作
        if(num==2){params.ids_str =  ids.join('-'); delete params.recycle}
        var loadings= top.layui.layer.load(2);
        $.axse(urls +arrUrls[num], params, function (result) {
            top.layui.layer.close(loadings);
            sl_Mask.YesTip('操作成功');
            $('#table1').bootstrapTable('refresh');
            $('#table1 th label').removeClass('active');
        },function () {
            top.layui.layer.close(loadings);
        })
    }
    //切换导表方式
    _m.switch = function () {
        $('.head i').unbind('click').bind('click',function () {
            if($(this).hasClass('switch')){
                $(this).removeClass('switch');
                $(this).text('导入表格');
                $('#QueryWrap').show();
                $('.head button').show();
                $('#MoreSwitchTitle').hide();
                $('.ScoreFrom').hide();
                $('.ScoreFrom').eq(0).show();
            }else {
                $(this).addClass('switch');
                $(this).text('返回');
                $('#QueryWrap').hide();
                $('.head button').hide();
                $('#MoreSwitchTitle').show();
                $('.ScoreFrom').hide();
                $('.ScoreFrom').eq(1).show();
            }
        })
    }
    return _m;
})();
mainPage.init();
tool().editMajorGroup($('#account'),'',2,mainPage.oneClass_table);
// input搜索
var query = new Query_table('QueryWrap',{
    tip:'请输入学生姓名',
    successFn:mainPage.search_table
})
// 点击状态搜索