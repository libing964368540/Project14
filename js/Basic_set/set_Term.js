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
                url: urls + '/time/gettimes.action',
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
                        field: 'name',
                        align: "center",
                        title: '学期'
                    }, {
                        field: 'stime',
                        align: "center",
                        title: '开始时间',
                        formatter: function (value, row, index) {
                          var a=tool().get_date(row.stime);
                             return a;
                        }
                    }, {
                        field: 'etime',
                        align: "center",
                        title: '结束时间',
                        formatter: function (value, row, index) {
                            var a=tool().get_date(row.etime);
                            return a;
                        }
                    }, {
                        field: 'subTimeCount',
                        align: "center",
                        title: '周数'
                    }, {
                        field: '',
                        align: "center",
                        title: '操作',
                        formatter: function (value, row, index) {
                                var a = '<a class="red" style="margin-right: 20px" onclick="mainPage.del('+row.id+')">删除</a>'
                                var b = '<a class="blue" data-id=' + row.id + ' data-stime='+row.stime+' onclick="mainPage.modifyMask($(this),'+row.id+')" data-etime='+row.etime+' data-name='+row.name+'>修改</a>';
                            return a+b;
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
            $('#table1 tr').css("background-color", "#FFFFFF");
        }
        //给学期表格传参
        _m.all_table = function () {
            $('#account').find('#table1').bootstrapTable('destroy');
            var params = {
                faid: userId,
                token: token,
                superid:0
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
                    '<p class="self_Mask_title" style="padding-bottom:20px;">新增学期</p>' +
                    '<div style="padding:20px 0 0">' +
                    '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close">&#x1006;</i> '+
                    '<ul style="padding-bottom: 30px">' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">开始年份</label><input class="layui-input rg" type="text"  placeholder="请选择开始年份"style="width:220px;border: none;background: #f3f5f8" name="yearStart" lay-verify="required" id="yearStart" readonly></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">结束年份</label><input class="layui-input rg" type="text"  placeholder="结束年份"style="width:220px;border: none;background: #f3f5f8" name="yearEnd" lay-verify="required" readonly id="yearEnd"></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">学期</label><select name="index" lay-verify="required"><option value="">请选择学期</option><option value="1">第一学期</option><option value="2">第二学期</option></select></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">起止时间</label><input class="layui-input rg" type="text"  placeholder="请选择时间段"style="width:220px;border: none;background: #f3f5f8"  name="time" readonly id="time" lay-verify="required"></li>' +
                    '</ul>' +
                    '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>' +

                    '</div>',
                    success: function (layero, index) {
                        parent.layui.form.render();
                        top.layui.laydate.render({
                            elem: '#yearStart', //指定元素
                            type: 'year',
                            done:function (value,date,endDate) {
                                if(value){
                                    var yearEnd = parseInt(value)+1;
                                    $(layero).find('#yearEnd').val(yearEnd);
                                }else {
                                    $(layero).find('#yearEnd').val('');
                                }
                            }
                        });
                        top.layui.laydate.render({
                            elem: '#time', //指定元素
                            range: true
                        });
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
            var datas = ['','第一学期','第二学期'];
            var nameS = data.yearStart +'-'+ data.yearEnd +'（'+ datas[data.index]+'）';
            var params ={
                faid:userId,
                token:token,
                name:nameS,
                des:'',
                index:data.yearStart+data.index,
                 stime:new Date(data.time.split(' - ')[0]+' 00:00:00').getTime(),
                 etime:new Date(data.time.split(' - ')[1]+' 00:00:00').getTime()
            }
            $.axse(urls+'/time/create.action',params,function(result){
                        sl_Mask.YesTip('创建成功')
                        self.all_table();
                        top.layer.close(index);

            })
        }
        //删除学期
        _m.del = function (time_id) {
            tool().Switched_Roles('images1/del.png',' 确定删除此学期？', function() {
                var params={
                    token:token,
                    faid:userId,
                    time_id:time_id
                }
                $.axse(urls+'/time/delete.action',params,function(result){
                         sl_Mask.YesTip('删除成功')
                         self.all_table();
                })
            })
        }
        //修改
        _m.modify = function (data,index,time_id) {
            var params={
                token:token,
                faid:userId,
                time_id:time_id,
                name:data.name,
                stime:new Date(data.time.split(' - ')[0]+' 00:00:00').getTime(),
                etime:new Date(data.time.split(' - ')[1]+' 00:00:00').getTime()
            }
            $.axse(urls+'/time/modification.action',params,function(result){
                      sl_Mask.YesTip('修改成功')
                      top.layer.close(index);
                      self.all_table();
            })
        }
        //修改学期
        _m.modifyMask = function (that,time_id) {
               var time_name = that.attr('data-name');
               var stime = that.attr('data-stime');
               var etime = that.attr('data-etime');
                var index = parent.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shadeClose: false,
                    slin: 'layer-ext-myskin',
                    area: ['400px', 'auto'],
                    content: '<div style="padding:30px 50px 24px;color:#898989;position:relative" class="layui-form major_set">' +
                    '<p class="self_Mask_title"style="padding-bottom:20px;">修改学期</p>' +
                    '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close">&#x1006;</i> '+
                    '<div style="padding:20px 0 20px">' +

                    '<ul >' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">学期</label><input class="layui-input rg" type="text"  placeholder="请输入学期"style="width:220px;border: none;background: #f3f5f8" name="name" lay-verify="required"></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">起止时间</label><input class="layui-input rg" type="text"  placeholder="请选择时间段"style="width:220px;border: none;background: #f3f5f8"  name="time" readonly id="time" lay-verify="required"></li>' +
                    '</ul>' +
                    '</div>' +
                    '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>' +
                    '</div>',
                    success: function (layero, index) {
                        top.layui.laydate.render({
                            elem: '#time', //指定元素
                            range: true
                        });
                        $(layero).find('input[name="name"]').val(time_name);
                        $(layero).find('#time').val(tool().get_date(stime)+' - '+tool().get_date(etime));
                        //确定按钮
                        top.layui.form.on('submit(formDemo)', function(data){
                            self.modify(data.field,index,time_id);
                        })
                        //取消按钮
                        $(layero).find('.NoTip').unbind('click').bind('click',function () {
                            top.layer.close(index);
                        })
                    }
                })

        }

        return _m;

    })();
    mainPage.init();
})
