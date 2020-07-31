dormitory_mask = function () {
    var _m={};
    var self=_m;
    //通过班级   获取住校生
    _m.getClassStudent = function (obj,filed) {
        if(!filed.classgrade_ids){
            return;
        }
        var params={
            faid:userId,
            token:token,
            size:300
        }
        if(filed) $.extend(params,filed);
        $.axse(urls+get_liveSchool,params,function(result){
            var accounts = result.data.list;
            var arr=[];
            for(var i=0;i<accounts.length;i++){
                var classnum=accounts[i].st_classgrade_number||"";
                arr.push({
                    value:accounts[i].id,
                    name:"<em style='width: 17px;height: 17px;display: inline-block;background: #2196F3;color: #ffffff;vertical-align: middle;margin-right: 10px;font-size: 12px;line-height: 17px;text-align: center;font-style: normal;margin-bottom: 3px'>"+classnum+"</em>"+accounts[i].rname
                })
            }
            layui.formSelects.data('cids', 'local', {
                arr: arr
            });
            var studentArr=[];
            layui.formSelects.on('cids', function(id, vals, val, isAdd, isDisabled){
                if(isAdd){
                    studentArr.push(val.val);
                }else {
                    studentArr.splice( studentArr.indexOf(val.val), 1);
                }
                $(obj).find("input[name='AllStudent']").val(studentArr.join('-'));
            })
            layui.form.render();

        })
    }
    //查看退住单详情
    _m.sleephome_back_one = function (that) {
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>退住列表<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>退住单</a>",
            type: 2,
            content: "dormitory_back_one.html",
            area: ['100%', '100%'],
            success:function (layero,index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                var arr=['违纪退住','学生申请'];
                var ids=that.attr('data-id');
                var datas={
                    time:tool().getSmpFormatDateByLong(parseInt(that.attr('data-time')),false),
                    type:arr[that.attr('data-type')],
                    des:that.attr('data-des'),
                    account:that.attr('data-account'),
                    classgrade:that.attr('data-classgrade'),
                    commit_time:that.attr('data-commit_time'),
                    commit_account:that.attr('data-commit_account')
                }
                tool().dominit(datas,body);
                //通过状态
                if(that.attr('data-state')==0){
                    body.find('.delBtn').show();
                    body.find('.delBtn').attr('data-id',ids);
                }else {
                    body.find('.delBtn').show();
                    body.find('.delBtn').attr('data-id',ids);
                }
            },
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
    //查看停住详情
    _m.sleephome_stop_one =function (that) {
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>停住列表<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>停住单</a>",
            type: 2,
            content: "dormitory_stop_one.html",
            area: ['100%', '100%'],
            success: function (layero, index) {
                var arr=['违纪','其他'];
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();   var index = layui.layer.open({
                var datas={
                    time:that.attr('data-time'),
                    type:arr[that.attr('data-type')],
                    des:that.attr('data-des'),
                    account:that.attr('data-account'),
                    classgrade:that.attr('data-classgrade'),
                    commit_time:that.attr('data-commit_time'),
                    commit_account:that.attr('data-commit_account')
                }
                tool().dominit(datas,body);
                var ids= that.attr('data-id')
                body.find('.delBtn').attr('data-id',ids);
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
    return _m;
}