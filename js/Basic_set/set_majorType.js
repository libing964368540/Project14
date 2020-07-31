layui.use(['layer', 'form', 'element'], function() {
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        form = layui.form,
        element = layui.element

    //增加专业
    $('#add').unbind('click').bind('click', function() {
        var index = top.layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: false,
            area: ['400px', 'auto'],
            content: '<div style="padding:30px 50px 24px;color:#898989;position:relative"class="layui-form major_set">' +
            '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close">&#x1006;</i> '+
            '<p style="padding-bottom:20px;" class="self_Mask_title">新增专业类型</p>' +
            '<div style="padding:20px 0 20px">' +
            '<ul >' +
            '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">专业类型</label><input class="layui-input rg" type="text"  placeholder="请输入专业类型"style="width:220px;border: none;background: #f3f5f8;" lay-verify="required" name="name"></li>' +
            '</ul>' +
            '</div>' +
            '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>' +
            '</div>',
            success: function(layer, index) {
                top.layui.form.render();
                //确定按钮
                top.layui.form.on('submit(formDemo)', function(data){
                    var param={
                        faid:userId,
                        token:token,
                        name:data.field.name
                    }
                    $.axse(urls+'/major/createMajorType.action',param,function(result){
                        $('#account').find('#table1').bootstrapTable('destroy');
                        school_major.init();
                        top.layer.close(index);
                    },function () {
                    })
                });
                //取消按钮
                $(layer).find('.NoTip').unbind('click').bind('click',function () {
                    top.layer.close(index);
                })
            }
        })

    })
})
var school_major = (function () {
    var _m={};
    var self=_m;
    //初始化
    _m.init=function () {
        self.table();
    }
    //table
    _m.table = function(){
        var filed ={
            faid:userId,
            token:token
        }
        if(filed) $.extend(filed,pclogin);
        if(!filed.token||!sessionStorage.identity_id){
            tool().judge_token(function () {
                parent.location.href=loginSrc;
            })
            return;
        }
        $('#table1').bootstrapTable({
            url:urls + '/major/getMajorTypes.action',
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
            pageNumber:1,
            cache:false,
            pageSize: 10,
            pageList: [10, 15, 25],
            columns:
                [  {
                    field: '',
                    align:"center",
                    title: '序号',
                    width:'80px',
                    formatter: function(value, row, index) {
                        var index = index + 1;
                        return index;
                    }
                }, {
                    width:'180px',
                    field: 'name',
                    align:"center",
                    title: '专业部'
                },{
                    width:'165px',
                    field: '',
                    align:"center",
                    title: '操作',
                    formatter: function(value, row, index) {
                        var a = '<a class="blue">编辑</a>';
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
                        skin: 'msgStyle',//skin属性可以将layer的标签提取出来，重新定义样式
                    });
                        return {
                            "rows":'',
                            "total":''
                        }
                    }
                }else{
                    return {
                        "rows":result.data,
                        "total":result.data.length
                    }
                }
            } ,formatLoadingMessage: function(){
                return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
            }
        })

    }
    return _m;
})();
school_major.init();


//点击