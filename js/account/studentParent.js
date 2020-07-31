layui.use(['layer', 'form', 'element'], function(){
    var layer = layui.layer
        ,form = layui.form
        ,element = layui.element
    var Information = null;
    // //单选框的点击事件
    //移除按钮
    //添加账户
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
        $('#account').find('#table1').bootstrapTable('destroy');
        $('#table1').bootstrapTable({
            url:urls + '/account/getAccountsForFamily.action',
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
            pageNumber:1,
            striped:true,
            cache:false,
            pageSize: 10,
            pageList: [10, 15, 25],
            columns:
                [  {
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
                },{
                    field: 'username',
                    align:"center",
                    title: '账号'
                },{
                    field: 'classgrades',
                    align:"center",
                    title: '班级',
                    formatter: function(value, row, index) {
                        if(row.accountData.identitysData[7]){
                            if(row.accountData.identitysData[7].classgrades){
                                var a= tool().basicMHandle(row.accountData.identitysData[7].classgrades,1);
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
                        if(row.accountData.identitysData[7]){
                            if(row.accountData.identitysData[7].majors){
                                var a=tool().basicMHandle(row.accountData.identitysData[7].majors,4);
                                return a;
                            }else {
                                return '暂无'
                            }
                        }else {
                            return '暂无'
                        }
                    }
                }, {
                    field: '',
                    align:"center",
                    title: '状态',
                    formatter: function(value, row, index) {
                        var arr = ['', '正常', '弃用'];
                        return arr[row.state];
                    }
                },{
                    field: '',
                    align:"center",
                    title: '操作',
                    formatter: function(value, row, index) {
                        if(row.state==2){
                            var b='<a class="blue" onclick="tool().regainUser('+row.id+')" style="margin-right: 20px">恢复</a>'
                            var a='<a class="red"  onclick="tool().removeUser('+row.id+')">彻底删除</a>'
                            return b+a;
                        }else {
                           
                            var b='<a class="blue" data-id='+row.id+' onclick="tool().addUser2(3,4)">编辑</a>'
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
        var params={
            token:token,
            faid:userId,
            iids:'7'
        }
        self.table(params)
    }
    //正常
    _m.normal_table = function(){
        var params={
            token:token,
            faid:userId,
            sort:1,
            state:1,
            iids:'7'
        }
        self.table(params);
    }
    //回收站
    _m.recycle_table = function(){
        var params={
            token:token,
            faid:userId,
            sort:1,
            state:2,
            iids:'7'
        }
        self.table(params)
    }
    //搜索
    _m.search_table = function () {
        var val1=$('#search').val();
        if($.trim(val1)){
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
    tip:'请输入家长账号',
    successFn:mainPage.search_table
})
// 点击状态搜索
var ForState = new ForState_Totable('ForState');
