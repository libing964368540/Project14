layui.use(['layer', 'form', 'element','laydate'], function() {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element
    //移除按钮
    //添加账户
    mainPage = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            self.all_table();
            self.add();
        }
        //生成表格
        _m.table = function (filed) {
            if(!filed.token||!sessionStorage.identity_id){
                tool().judge_token(function () {
                    parent.location.href=loginSrc;
                })
                return;
            }
            if(filed) $.extend(filed,pclogin);
            $('#table1').bootstrapTable({
                url: urls + '/Punch/getDevices.action',
                queryParams: function () {
                    return filed;
                },
                sidePagination: "client",
                pagination: true,
                paginationLoop: false,
                pageNumber: 1,
                cache:false,
                striped:true,
                pageSize: 10,
                pageList: [10, 15, 25],
                columns:
                    [{
                        field: '',
                        align: "center",
                        title: '序号',
                        width: '80px',
                        formatter: function (value, row, index) {
                            var index = index + 1;
                            return index;
                        }
                    }, {
                        field: 'device',
                        align: "center",
                        title: '设备号'
                    }, {
                        field: 'push',
                        align: "center",
                        title: '考勤方向',
                        formatter: function (value, row, index) {
                            var arr = ['出','进']
                            var a=arr[row.push];
                            return a;
                        }
                    }, {
                        field: '',
                        align: "center",
                        title: '操作',
                        formatter: function (value, row, index) {
                            var a = '<a class="red" style="margin-right: 20px" onclick="mainPage.del($(this))" data-device='+row.device+'>删除</a>'
                          return a;
                        }
                    }],
                responseHandler: function (result) {
                    if (result.error) {
                        if (400 <= result.error.errorCode && result.error.errorCode <= 500) {
                            tool().judge_token(function () {
                                parent.location.href=loginSrc;
                            })
                        }else {
                            sl_Mask.NoTip(result.error.message);
                        }
                    } else {
                        return result.data
                    }
                } ,formatLoadingMessage: function(){
                    return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
                }
            })
        }
        //给学期表格传参
        _m.all_table = function () {
            $('#account').find('#table1').bootstrapTable('destroy');
            var params = {
                faid: userId,
                token: token
            }
            self.table(params);
        }
        //新增学期
        _m.add = function () {
            $('#AddTerm').unbind('click').bind('click', function () {
                var index = parent.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shadeClose: false,
                    slin: 'layer-ext-myskin',
                    area: ['400px', 'auto'],
                    content: '<div style="padding:30px 50px 24px;color:#898989;position:relative" class="layui-form major_set">' +
                    '<p class="self_Mask_title" style="padding-bottom:20px;">新增设备</p>' +
                    '<div style="padding:20px 0 0">' +
                    '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close">&#x1006;</i> '+
                    '<ul style="padding-bottom: 30px">' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">设备号</label><input class="layui-input rg" type="text"  placeholder="请输入设备号"style="width:220px;border: none;background: #f3f5f8" lay-verify="required" name="device"></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">考勤方向</label><select name="push" lay-verify="required"><option value="">请选择</option><option value="0">出</option><option value="1">进</option></select></li>' +

                    '</ul>' +
                    '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>' +

                    '</div>',
                    success: function (layero, index) {
                        parent.layui.form.render();
                        //确定按钮
                        top.layui.form.on('submit(formDemo)', function(data){
                            //学期年份名字
                            //学期描述
                            //第几学期索引
                            self.create(data.field,index);
                        })
                        //取消按钮
                        $(layero).find('.NoTip').unbind('click').bind('click',function () {
                            top.layer.close(index);
                        })
                    }
                })
            })
        }
        //创建时间段
        _m.create = function (data,index) {
            var params ={
                faid:userId,
                token:token,
                device:data.device,
                push:data.push
            }
            $.axse(urls+'/Punch/addDevice.action',params,function(result){
                sl_Mask.YesTip('添加成功')
                self.all_table();
                top.layer.close(index);

            })
        }
        //删除学期
        _m.del = function (that) {
            tool().Switched_Roles('images1/del.png',' 确定删除此设备？', function() {
                var params={
                    token:token,
                    faid:userId,
                    device:that.attr('data-device')
                }
                $.axse(urls+'/Punch/removeDevice.action',params,function(result){
                    sl_Mask.YesTip('删除成功')
                    self.all_table();
                })
            })
        }
        return _m;

    })();
    mainPage.init();
})
