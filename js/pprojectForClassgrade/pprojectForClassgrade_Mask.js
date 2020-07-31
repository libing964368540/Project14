pprojectForClassgrade_Mask = function () {
    var _m = {};
    var self = _m;
    //个体班级打分
    _m.classScore = function (classgradeid) {
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>班级列表<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>班级打分</a>",
            type: 2,
            content: "pprojectForClassgrage_Record.html",
            area: ['100%', '100%'],
            success:function (layero,index) {
                var bodys = layui.layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                console.log(bodys.html()) //得到iframe页的body内容
                var  params={
                    token:token,
                    faid:userId,
                    classgrade_id:classgradeid
                }
                $.axse(urls+oneClass,params,function(result) {
                        bodys.find('.title').attr('data-classgradeid',classgradeid);
                        var data=result.data;
                        bodys.find('.title').text('给'+data.name+'班的表现打分');
                })
            },
            cancel: function(index, layero){
                $(window).unbind("resize");
            }
        })
        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function() {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    //查看班级情况
    _m.classdetail = function (classgradeid) {
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>班级<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>班级信息</a>",
            type: 2,
            content: "pprojectForClassgrage_detail.html",
            area: ['100%', '100%'],
            success:function (layero,index) {
                var bodys = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                //获取班级以及班主任信息
                var  params={
                    token:token,
                    faid:userId,
                    classgrade_id:classgradeid
                }
                $.axse(urls+oneClass,params,function(result) {
                    if(!result.error){
                        bodys.find('.title').attr('data-classgradeid',classgradeid);
                        bodys.find('.history').attr('data-classgradeid',classgradeid);
                        var data=result.data;
                        bodys.find('.title').text(data.name);
                    }

                })
            },
            cancel: function(index, layero){
                $(window).unbind("resize");
            }
        })

        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function() {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    //查看班级历史记录
    _m.classRecordHistory = function (that) {
        var classgradeid=that.attr('data-classgradeid');
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>班级<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>历史打分</a>",
            type: 2,
            content: "classRecordHistory.html",
            area: ['100%', '100%'],
            success:function (layero,index) {
                var bodys = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                var filed={
                    token:token,
                    faid:userId,
                    cid :classgradeid,
                    identity_id:sessionStorage.identity_id
                }
                bodys.find('#table1').bootstrapTable({
                    url: urls+ classRecordHistoty,
                    queryParams: function (params) {
                        var obj = {
                            size: params.limit,
                            page: params.offset / params.limit,
                        }
                        if (filed) $.extend(obj, filed);
                        return obj;
                    },
                    sidePagination: "server",
                    pagination: true,
                    paginationLoop: false,
                    pageNumber: 1,
                    pageSize: 5,
                    pageList: [5, 10, 15],
                    columns: [{
                        field: 'commit_time',
                        align: "center",
                        title: '打分时间',
                        width: '17%',
                        formatter: function(value, row, index) {
                            var a=tool().get_date(row.commit_time);
                            return a;
                        }

                    }, {
                        field: 'project_name',
                        align: "center",
                        width: '17%',
                        title: '打分项',

                    }, {
                        field: 'rule_name',
                        align: "center",
                        title: '打分内容',
                        width:'39.2%'

                    }, {
                        field: 'value',
                        align: "center",
                        title: '总分',
                        width:'12.7%'
                    }, {
                        field: '',
                        align: "center",
                        title: '打分人',
                        width:'12.7%'
                    }
                    ],responseHandler:function(result){
                        if(result.error){
                            top.layer.msg('<i class="material-icons msgIconStyleFail">cancel</i>'+result.error.message,{
                                skin: 'msgStyle'//skin属性可以将layer的标签提取出来，重新定义样式
                            });
                            if(400<=result.error.errorCode&&result.error.errorCode<=500){
                                parent.location.href='login.html'
                            }else {
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
                    }

                })
            },
            cancel: function(index, layero){
                $(window).unbind("resize");
            }
        })

        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function() {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    //班主任查看打分项
    _m.classLook_Record = function (projectid) {
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>打分项<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>查看打分项</a>",
            type: 2,
            content: "pprojectForStudent_Look_Record.html",
            area: ['100%', '100%'],
            success:function (layero,index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();

                var params={
                    faid:userId,
                    token:token,
                    projectid:projectid,
                    hierarchy:0
                }
                $.axse(urls+'/pproject/getprojecttree.action',params,function(result) {
                    //打分项的填充
                    body.find('input[name="names"]').val(result.data.name);
                    //规则
                    var rules= result.data.rules;
                    var dom='';
                    var objs= body.find('#Del_Add_btnWrap')
                    for(var i=0;i<rules.length;i++){
                        if(rules[i].operation==1){
                            rules[i].value='&nbsp+'+ rules[i].value
                        }else if(rules[i].operation==2){
                            rules[i].value='&nbsp-'+ rules[i].value
                        }
                        dom +='<span class="layui-btn del" data-id="'+rules[i].id+'" data-name="'+rules[i].name+'" data-num="'+rules[i].value+'">'+rules[i].name+rules[i].value+'</span>';
                    }
                    body.find('.btnWrap').prepend(dom);

                },function () {

                })


            },
            cancel: function(index, layero){
                $(window).unbind("resize");
            }
        })

        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function() {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    //班级打分项添加
    _m.class_ScoreItemAdd = function () {
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>班级打分项<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>添加打分项</a>",
            type: 2,
            content: "pprojectForClassgrade_ScoreItemAdd.html",
            area: ['100%', '100%'],
            cancel: function(index, layero){
                mainPage.all_table();
                $(window).unbind("resize");
            }
        })

        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function() {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }

    return _m;
}