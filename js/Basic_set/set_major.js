layui.use(['layer', 'form', 'element'], function() {
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        form = layui.form,
        element = layui.element
    var add_edit_Mask = '<div style="padding:30px 50px 24px;color:#898989;position:relative" class="layui-form major_set">' +
        '<p class="self_Mask_title">新增专业</p>' +
        '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close">&#x1006;</i> '+
        '<div >' +
        '<ul style="padding-bottom: 35px">' +
        '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">专业编号</label><input class="layui-input rg" type="text"  placeholder="请输入专业编号"style="width:220px;border: none;background: #f3f5f8;border-radius: 0;" name="number" lay-verify="required"></li>' +
        '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">专业名称</label><input class="layui-input rg" type="text"  placeholder="请输入专业名称"style="width:220px;border: none;background: #f3f5f8;border-radius: 0;" lay-verify="required" name="name"></li>' +
        '<li  class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">专业类型</label> <select  name="typeid"style="border-radius: 0"><option value=""></option></select></li>' +
        '<li  class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">专业部</label><select lay-verify="required" name="groupid"><option value=""></option></select></li>' +
        '</ul>' +
        '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>'
        '</div>'
    //增加专业
    $('#add').unbind('click').bind('click', function() {
        var index = parent.layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: false,
            slin:'.layer-ext-myskin',
            area: ['400px', 'auto'],
            content:add_edit_Mask,
            success: function(layer, index) {
                major_set.getbranch($(layer).find('select[name="groupid"]'));
                major_set.getType($(layer).find('select[name="typeid"]'))
                parent.layui.form.render();
                parent.layui.form.on('submit(formDemo)', function(data){
                    var params={
                        faid:userId,
                        token:token,
                        groupid:data.field.groupid,
                        name:data.field.name,
                        typeid:data.field.typeid,
                        number:$(layer).find('input[name="number"]').val()
                    }
                    $.axse(urls+'/major/createMajor.action',params,function(result){
                            sl_Mask.YesTip('添加成功');
                            $('#account').find('#table1').bootstrapTable('destroy');
                             major_set.init();
                            top.layer.close(index);
                    },function () {

                    })
                    // top.layer.close(index);
                });
                $(layer).find('.NoTip').unbind('click').bind('click',function () {
                    top.layer.close(index);
                })
            }
        })


    })
})
//表格渲染
var major_set = (function () {
    var _m={};
    var self=_m;
    //初始化
    _m.init=function () {
        self.table();
    }
    _m.table = function(){
        if(!token||!sessionStorage.identity_id){
            tool().judge_token(function () {
                parent.location.href=loginSrc;
            })
            return;
        }
            $('#table1').bootstrapTable({
                url:urls + '/major/getMajors.action',
                queryParams:function(){
                    var params ={
                        faid:userId,
                        token:token
                    }
                     $.extend(params,pclogin);
                    return params;
                },
                sidePagination: "client",
                pagination: true,
                paginationLoop: false,
                paginationShowPageGo: true,
                pageNumber:1,
                pageSize: 10,
                cache:false,
                striped:true,
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
                    },{
                        field: 'number',
                        align:"center",
                        title: '专业编号'
                    }, {
                        field: 'name',
                        align:"center",
                         width:'240px',
                        title: '专业名称'
                    }, {
                        field: 'type',
                        align:"center",
                        title: '专业类型',
                        formatter: function(value, row, index) {
                            var a = row.type.name;
                            return a;
                        }
                    }, {
                        field: 'group',
                        align:"center",
                        title: '专业部',
                        formatter: function(value, row, index) {
                            var a = row.group.name;
                            return a;
                        }
                    },{
                        field: '',
                        align:"center",
                        title: '操作',
                        formatter: function(value, row, index) {
                            var a = '<a class="blue" data-group='+row.group.id+' data-number='+row.number+' data-type='+row.type.id+' data-name='+row.name+' data-id='+row.id+' onclick="major_set.edit($(this))">编辑</a>';
                            var b ='<a class="red" style="margin-left: 20px" onclick="major_set.del('+row.id+')">删除</a>';
                            return a+b;
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
                            return [];
                        }
                    }else {
                        return result.data
                    }
                }, formatLoadingMessage: function(){
                    return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
                }
            })

        }
        //获取专业部信息
        _m.getbranch=function (obj,value) {
            var params ={
                faid:userId,
                token:token
            }
            $.axse(urls+'/major/getMajorGroups.action',params,function(result){
                var dom="";
                var data=result.data;
               if(data&&data.length>0){
                   for(var i=0;i<data.length;i++){
                       dom+='<option value="'+data[i].id+'">'+data[i].name+'</option>'
                   }
                   $(obj).append(dom);
                    parent.layui.form.render();
                    if(value){
                        $(obj).val(value);
                        parent.layui.form.render();
                    }
               }
            },function () {

            })

        }
        //获取专业类型信息
        _m.getType=function (obj,value) {
            var params ={
                faid:userId,
                token:token
            }
            $.axse(urls+'/major/getMajorTypes.action',params,function(result){
                var data=result.data;
                if(data&&data.length>0){
                    var dom="";
                    for(var i=0;i<data.length;i++){
                        dom+='<option value="'+data[i].id+'">'+data[i].name+'</option>'
                    }
                    $(obj).append(dom)
                    parent.layui.form.render();
                    if(value){
                        $(obj).val(value);
                        parent.layui.form.render();
                    }
                }
            },function () {

            })

        }
        //编辑
        _m.edit = function (that) {
           var group =that.attr('data-group');
           var type =that.attr('data-type');
           var name = that.attr('data-name');
           var number = that.attr('data-number');
           var ids= that.attr('data-id');
            var index = parent.layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                shadeClose: true,
                slin: '.layer-ext-myskin',
                area: ['400px', 'auto'],
                content: '<div style="padding:30px 50px 24px;color:#898989;position:relative" class="layui-form major_set">' +
                '<p class="self_Mask_title">编辑专业</p>' +
                '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close">&#x1006;</i> '+
                '<div >' +
                '<ul style="padding-bottom: 35px">' +
                '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">专业编号</label><input class="layui-input rg" type="text"  placeholder="请输入专业编号"style="width:220px;border: none;background: #f3f5f8;border-radius: 0;" name="number" lay-verify="required" value='+number+'></li>' +
                '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">专业名称</label><input class="layui-input rg" type="text"  placeholder="请输入专业名称"style="width:220px;border: none;background: #f3f5f8;border-radius: 0;" lay-verify="required" name="name" value='+name+'></li>' +
                '<li  class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">专业类型</label> <select  name="typeid"style="border-radius: 0"><option value=""></option></select></li>' +
                '<li  class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">专业部</label><select lay-verify="required" name="groupid"><option value=""></option></select></li>' +
                '</ul>' +
                '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>'+
                '</div>',
                success: function (layer, index) {
                    major_set.getbranch($(layer).find('select[name="groupid"]'),group);
                    major_set.getType($(layer).find('select[name="typeid"]'),type);
                    parent.layui.form.render();
                    parent.layui.form.on('submit(formDemo)', function (data) {
                        self.modify(data,index,ids);
                    });
                    $(layer).find('.NoTip').unbind('click').bind('click', function () {
                        top.layer.close(index);
                    })
                }
            })
        }
        //修改专业
        _m.modify = function (data,index,major_id) {
            var params={
                faid:userId,
                token:token,
                groupid:data.field.groupid,
                name:data.field.name,
                typeid:data.field.typeid,
                number:data.field.number,
                major_id:major_id
            }
            $.axse(urls+'/major/modification.action',params,function(result){
                sl_Mask.YesTip('修改成功');
                top.layer.close(index);
                $('#table1').bootstrapTable('refresh');
            })
        }
        //删除专业
        _m.del = function (major_id) {
            tool().Switched_Roles('images1/del.png','确定删除此专业？', function() {
                var params={
                    token:token,
                    faid:userId,
                    major_id:major_id
                }
                $.axse(urls+'/major/removeMajor.action',params,function(result){
                        sl_Mask.YesTip('删除成功');
                        $('#table1').bootstrapTable('refresh');

                })

            })
        }
        return _m;
})()
major_set.init();
