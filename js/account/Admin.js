layui.use(['layer', 'form', 'element'], function(){
    var layer = layui.layer
        ,form = layui.form
        ,element = layui.element
    var Information = null;
})
mainPage=(function(){
    var _m = {};
    var self = _m;
    //初始化
    _m.init=function(){
        self.all_table();
        self.keyword();
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
            url:urls + '/account/getAccountsForAdmin.action',
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
            cache:false,
            pageNumber:1,
            pageSize: 10,
            pageList: [10, 15, 25],
            columns:
                [  {
                    field: '',
                    align:"center",
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
                    field: 'username',
                    align:"center",
                    title: '账号'
                }, {
                    field: '',
                    align:"center",
                    title: '权限',
                    formatter: function(value, row, index) {
                        var arr=[];
                            if(JSON.stringify(row.accountData.identitysData)!="{}"){
                                for(var i in row.accountData.identitysData){
                                    arr.push(row.accountData.identitysData[i].name);
                                }
                                return arr.join("&nbsp;&nbsp;&nbsp;&nbsp;");
                            }else{
                                return '暂无'
                            }
                    }
                }, {
                    field: '',
                    align:"center",
                    title: '授权时间',
                    formatter: function(value, row, index) {
                        if(row.accountData.identitysData){
                            if(row.accountData.identitysData[2]){
                                var a = tool().get_date(row.accountData.identitysData[2].relevanceTime);
                            }else{
                                var a = '系统创建'
                            }
                            return a
                        }else{
                            return '系统创建'
                        }
                    }
                },{
                    field: '',
                    align:"center",
                    title: '操作',
                    formatter: function(value, row, index) {
                        for(var i in row.accountData.identitysData){
                        if(row.accountData.identitysData[i].name=='超级管理员'){
                            var b ='<a style="color:#898989">不可编辑/移除</a>';
                        }
                    }
                        if(row.state==2){
                            var b='<a class="blue" onclick="tool().regainUser('+row.id+')" style="margin-right: 20px">恢复</a>'
                            var a='<a class="red"  onclick="tool().removeUser('+row.id+')">彻底删除</a>'
                            return b+a;
                        }else{
                       
                            var b='<a class="blue" data-id='+row.id+' onclick="tool().addUser2(0,1)">编辑</a>'
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
            onClickRow:function (value, row, index) {
                  Information= value
             }
        })

    }
    //全部
    _m.all_table = function(){
        $('#account').find('#table1').bootstrapTable('destroy');
        var params={
            token:token,
            faid:userId,
            iids:'1-2'
        }
        self.table(params);
    }
    //正常
    _m.normal_table = function(){
        $('#account').find('#table1').bootstrapTable('destroy');
        var params={
            token:token,
            faid:userId,
            sort:1,
            state:1,
            iids:'1-2'
        }
        self.table(params);
    }
    //回收站
    _m.recycle_table = function(){
        $('#account').find('#table1').bootstrapTable('destroy');
        var params={
            token:token,
            faid:userId,
            sort:1,
            state:2,
            iids:'1-2'
        }
        self.table(params)
    }
    //搜索
    _m.search_table = function () {
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
            self.all_table();
        }
        $('#account .formwrap ul li').removeClass('active').eq(0).addClass('active');
    }
    //添加新用户
    _m.createUser = function () {
        $('#account').find('#table1').bootstrapTable('destroy');
        self.all_table();
        $('#account .formwrap ul li').removeClass('active').eq(0).addClass('active');
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
                    if(flag) {
                        flag=false;
                        var params = {
                            faid: userId,
                            token: token,
                            username: data.field.username,
                            password: data.field.password || '123456',
                            iids: '2'
                        }
                        $.axse(urls + '/account/create.action', params, function (result) {
                            Information=result.data;
                            top.layui.layer.close(loadings);
                            top.layer.close(index);
                            var myDate = new Date().getTime();
                            var aa = tool().get_date(myDate);
                            var dom = "<ul style='line-height:30px'>" +
                                "<li class='clear self_Mask_row'><span class='lf'>创建时间：</span><p class='rg'>" + aa + "</p></li>" +
                                "<li class='clear self_Mask_row'><span class='lf'>创建账号：</span><p class='rg'>" + result.data.username + "</p></li>" +
                                "<li class='clear self_Mask_row'><span class='lf'>当前状态：</span><p class='rg'>等待完善账号信息</p></li>" +
                                "</ul>";
                            self.createUser();
                            sl_Mask.successTip('<i class="material-icons" style="color: #4AC34F;font-size: 30px;position: absolute;left: 110px;">check_circle</i>创建账号成功', dom, function () {
                                
                                tool().addUser2(0,1);
                            }, '暂时跳过', '完善账号信息');

                        },function () {
                            flag=true;
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
    return _m;
})();
mainPage.init();
// input搜索
var query = new Query_table('QueryWrap',{
    tip:'请输入管理员账号',
    successFn:mainPage.search_table
})
// 点击状态搜索
var ForState = new ForState_Totable('ForState');
