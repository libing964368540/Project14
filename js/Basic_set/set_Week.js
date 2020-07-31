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
            // mainPage.termSelect();
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
                paginationShowPageGo: true,
                pageNumber: 1,
                pageSize: 10,
                cache:false,
                pageList: [10, 15, 25],
                striped:true,
                columns:
                    [{
                        field: '',
                        align: "center",
                        title: '周次',
                        width: '180px',
                        formatter: function (value, row, index) {
                            var index = row.name;
                            return index;
                        }

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
                        field: '',
                        align: "center",
                        title: '操作',
                        width: '160px',
                        formatter: function (value, row, index) {
                            var a = '<a class="red" onclick="mainPage.del('+row.id+','+row.superid+')">删除</a>'
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
                },formatLoadingMessage: function(){
                    return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
                }
            })

        }
        //给学期表格传参
        _m.all_table = function (superid) {
            $('#account').find('#table1').bootstrapTable('destroy');
            var params = {
                faid: userId,
                token: token,
                superid:superid
            }
             self.table(params);
        }
        //新增学期
        _m.add = function () {
            $('#addWeek').unbind('click').bind('click', function () {
                var index = parent.layer.open({
                    type: 1,
                    title: false,
                    closeBtn: 0,
                    shadeClose: false,
                    slin: '',
                    area: ['400px', 'auto'],
                    content: '<div style="padding:30px 50px 24px;color:#898989;position:relative" class="layui-form major_set">' +
                    '<p class="self_Mask_title" style="padding-bottom:20px;">新增周次</p>' +
                    '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close">&#x1006;</i> '+
                    '<div style="padding:20px 0 20px">' +
                       '<form class="layui-form">'+
                    '<ul>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">选择学期</label><select name="superid" lay-filter="superid"></select></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">起止时间</label><input class="layui-input rg" type="text"  placeholder="请选择时间段"style="width:220px;background: #f3f5f8;border: none"  name="time" readonly id="time" lay-verify="required"></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">周次</label><input class="layui-input rg" type="number"  placeholder="请输入周次"style="width:220px;background: #f3f5f8;border: none" name="name" lay-verify="required"></li>' +
                    '</ul>' +
                    '</form>'+
                    '</div>' +
                    '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>' +
                    '</div>',
                    success: function (layero, index) {
                        self.superidSelect($(layero));
                        parent.layui.form.render();
                        //确定按钮
                        top.layui.form.on('submit(formDemo)', function(data){
                            var ItemIndex = $(layero).find("select[name='superid']").find('option:selected').attr('data-index');
                            var indexS = ItemIndex+'0'+data.field.name;
                            console.log(indexS);
                             self.create(data.field,index,indexS);
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
        _m.create = function (data,index,indexS) {
            var params ={
                faid:userId,
                token:token,
                name:'第'+data.name+'周',
                des:'',
                index:indexS,
                stime:new Date(data.time.split(' - ')[0]+' 00:00:00').getTime(),
                etime:new Date(data.time.split(' - ')[1]+' 00:00:00').getTime(),
                superid:data.superid
            }
            $.axse(urls+'/time/create.action',params,function(result){
                      sl_Mask.YesTip('创建成功');
                     var superids = $('select[name="termid"]').val();
                     // self.all_table(superids);
                     $('#table1').bootstrapTable('refresh');
                      top.layer.close(index);
            })
        }
        //删除周次
        _m.del = function (time_id,superid) {
            tool().Switched_Roles('images1/del.png','确定删除此周次？', function() {
                var params={
                    token:token,
                    faid:userId,
                    time_id:time_id
                }
                $.axse(urls+'/time/delete.action',params,function(result){
                        sl_Mask.YesTip('删除成功');
                        // self.all_table(superid);
                    $('#table1').bootstrapTable('refresh');
                })

            })
        }
        _m.termSelect = function () {
            var params = {
                faid: userId,
                token: token
            };
            $.axse(urls + termList, params, function (result) {
                    var data = result.data;
                    if(data&&data.length>0){
                        var dom = "";
                        for (var i = 0; i < data.length; i++) {
                            dom += '<option value=' + data[i].id + ' data-stime='+data[i].stime+' data-etime='+data[i].etime+'>' + data[i].name + '</option>'
                        }
                        $('select[name="termid"]').html(dom);
                        form.render();
                        form.on('select(termid)', function (data) {
                            // params.project_id = data.value
                            self.all_table(data.value)

                        })
                         self.all_table(data[0].id);
                    }else {
                         self.all_table('');
                    }
            })
        }
        //弹框添加学期
        _m.superidSelect = function (obj) {
            var params = {
                faid: userId,
                token: token
            };
            $.axse(urls + termList, params, function (result) {
                if (!result.error) {
                    var data = result.data;
                    var dom = "";
                    for (var i = 0; i < data.length; i++) {
                        dom += '<option value=' + data[i].id + ' data-stime='+data[i].stime+' data-etime='+data[i].etime+' data-index='+data[i].index+'>' + data[i].name + '</option>'
                    }
                    obj.find('select[name="superid"]').html(dom);
                    obj.find('.yesTip').attr('data-index',data.index);
                    parent.layui.form.render();
                    var weekTime= top.layui.laydate.render({
                        elem: '#time', //指定元素
                        range: true,
                        min:tool().getSmpFormatDateByLong(data[0].stime,false),
                        max:tool().getSmpFormatDateByLong(data[0].etime,false)
                    });
                    top.layui.form.on('select(superid)', function (data) {
                        var timeparsent= obj.find("select[name='superid']").find('option:selected')
                        var stime=tool().getSmpFormatDateByLong(Number(timeparsent.attr('data-stime')),false).split('-')
                        var etime=tool().getSmpFormatDateByLong(Number(timeparsent.attr('data-etime')),false).split('-')
                        console.log(stime);
                        console.log(etime);
                        obj.find("input[name='time']").val('');
                        weekTime.config.min= {year:stime[0],month:stime[1],date:stime[2]}
                        weekTime.config.max= {year:etime[0],month:etime[1],date:etime[2]}
                    })
                }
            })
        }
        return _m;
    })();
    mainPage.init();
    mainPage.termSelect();
})
