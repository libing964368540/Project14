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
            self.school_area();
            self.sleeproom_type();
            self.floor();
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
            $('#account').find('#table1').bootstrapTable('destroy');
            $('#table1').bootstrapTable({
                url: urls + sleepRoomList,
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
                        title: '序号',
                        width: '180px',
                        formatter: function (value, row, index) {
                            var index = index+1;
                            return index;
                        }
                    },{
                        field: 'school_district_id',
                        align: "center",
                        title: '校区',
                        width: '180px',
                        formatter: function(value, row, index) {
                           var arr={"1":'丁桥校区',"2":"翠苑校区"};
                           var a=arr[row.school_district_id];
                           return a;
                        }
                    }, {
                        field: 'dormitory_type',
                        align: "center",
                        title: '寝室类型',
                        formatter: function(value, row, index) {
                            var arr={"1":"男生寝室","2":'女生寝室'};
                            var a=arr[row.dormitory_type];
                            return a;
                        }
                    }, {
                        field: 'number',
                        align: "center",
                        title: '寝室号'
                    }, {
                        field: 'capacity',
                        align: "center",
                        title: '床位数'
                    }, {
                        field: 'floor',
                        align: "center",
                        title: '楼层'
                    }, {
                        field: '',
                        align: "center",
                        title: '操作',
                        width: '160px',
                        formatter: function (value, row, index) {
                            var a = '<a class="blue" onclick="mainPage.edit('+row.ID+')">编辑</a>'
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
                        return result.data.list;

                    }
                }
            })

        }
        //给学期表格传参
        _m.all_table = function (superid) {
            var params = {
                faid: userId,
                token: token
            }
            self.table(params);
        }
        //新增寝室
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
                    '<p class="self_Mask_title" style="padding-bottom:20px;">新增寝室</p>' +
                    '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close">&#x1006;</i> '+
                    '<div style="padding:20px 0 20px">' +
                    '<form class="layui-form">'+
                    '<ul>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">选择校区</label><select name="school_district_id"><option value="">请选择校区</option> <option value="1">丁桥校区</option><option value="2">翠苑校区</option></select></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">寝室类型</label><select name="dormitory_type"><option value="">请选择请示类型</option><option value="1">男生寝室</option><option value="2">女生寝室</option></select></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">楼层</label><select name="floor"><option value="">请选择楼层</option><option value="1">1</option> <option value="2">2</option> <option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option></select></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">寝室号</label><input class="layui-input rg" type="text"  placeholder="请输入寝室号"style="width:220px;background: #f3f5f8;border: none"  name="number" id="" lay-verify="required"></li>' +
                    '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">床位数</label><input class="layui-input rg" type="text"  placeholder="请输入床位"style="width:220px;background: #f3f5f8;border: none"  name="capacity"  lay-verify="required"></li>' +
                    '</ul>'+
                    '</form>'+
                    '</div>'+
                    '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>' +
                    '</div>',
                    success: function (layero, index) {
                        parent.layui.form.render();
                        //确定按钮
                        top.layui.form.on('submit(formDemo)', function(data){
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
        _m.create = function (data,index) {
            var params={
                token:token,
                faid:userId
            }
            if(data) $.extend(params,data);
            $.axse(urls+'/dormitory/create.action',params,function(result){
                sl_Mask.YesTip('新建成功');
                self.all_table();
                top.layer.close(index);
            })
        }
        //通过学区筛选
        _m.school_area = function () {
            form.on('select(school_district_id)', function(data){
                var params={
                    faid: userId,
                    token: token,
                    school_district_id:data.value,
                    dormitory_type:$('select[name="dormitory_type"]').val(),
                    floor:$('select[name="floor"]').val()
                }
                self.table(params);
            })
        }
        //通过寝室类型筛选
         _m.sleeproom_type = function () {
             form.on('select(dormitory_type)', function(data){
               var params={
                   faid: userId,
                   token: token,
                   dormitory_type:data.value,
                   school_district_id:$('select[name="school_district_id"]').val(),
                   floor:$('select[name="floor"]').val()
               }
                 self.table(params);
             })
         }
        //通过楼层筛选
        _m.floor = function () {
            form.on('select(floor)', function(data){
                var params={
                    faid: userId,
                    token: token,
                    floor:data.value,
                    dormitory_type:$('select[name="dormitory_type"]').val(),
                    school_district_id:$('select[name="school_district_id"]').val()
                }
                self.table(params);
            })
        }
        //编辑
        _m.edit = function (ids) {
            var index = parent.layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                shadeClose: false,
                slin: '',
                area: ['400px', 'auto'],
                content: '<div style="padding:30px 50px 24px;color:#898989;position:relative" class="layui-form major_set">' +
                '<p class="self_Mask_title" style="padding-bottom:20px;">编辑寝室</p>' +
                '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close">&#x1006;</i> '+
                '<div style="padding:20px 0 20px">' +
                '<form class="layui-form">'+
                '<ul>' +
                '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">选择校区</label><select name="school_district_id"><option value="">请选择校区</option> <option value="1">丁桥校区</option><option value="2">翠苑校区</option></select></li>' +
                '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">寝室类型</label><select name="dormitory_type"><option value="">请选择请示类型</option><option value="1">男生寝室</option><option value="2">女生寝室</option></select></li>' +
                '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">楼层</label><select name="floor"><option value="">请选择楼层</option><option value="1">1</option> <option value="2">2</option> <option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7">7</option></select></li>' +
                '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">寝室号</label><input class="layui-input rg" type="text"  placeholder="请输入寝室号"style="width:220px;background: #f3f5f8;border: none"  name="number" id="" lay-verify="required"></li>' +
                '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:60px;text-align:left;padding:9px 0;">床位数</label><input class="layui-input rg" type="text"  placeholder="请输入床位"style="width:220px;background: #f3f5f8;border: none"  name="capacity"  lay-verify="required"></li>' +
                '</ul>' +
                '</form>'+
                '</div>' +
                '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>' +
                '</div>',
                success: function (layero, index) {
                    parent.layui.form.render();
                    self.oneSleepMessage($(layero),ids)
                    //确定按钮
                    top.layui.form.on('submit(formDemo)', function(data){
                        self.modify(ids,data.field,index);
                    })
                    //取消按钮
                    $(layero).find('.NoTip').unbind('click').bind('click',function () {
                        top.layer.close(index);
                    })
                }
            })
        }
        //编辑的填充
        _m.fillEdit = function (ids) {
           var params={
               token:token,
               faid:userId
           }

        }
        //获取单条寝室信息
        _m.oneSleepMessage = function (obj,dormitory_id) {
            var params={
                token:token,
                faid:userId,
                dormitory_id:dormitory_id
            }
            $.axse(urls+oneRoomMessage,params,function(result){
                 var data = result.data;
                //选择校区
                  obj.find('select[name="school_district_id"]').val(data.school_district_id);
                //寝室类型
                  obj.find('select[name="dormitory_type"]').val(data.dormitory_type);
                //楼层
                  obj.find('select[name="floor"]').val(data.floor);
                  top.layui.form.render();
                //寝室号
                  obj.find('input[name="number"]').val(data.number)
                 //床位数
                  obj.find('input[name="capacity"]').val(data.capacity);
            })
        }
        //修改寝室信息
        _m.modify =function (ids,data,index) {
            var params={
                token:token,
                faid:userId,
                dormitory_id:ids
            }
            if(data) $.extend(params,data);
            $.axse(urls+'/dormitory/modification.action',params,function(result){
                sl_Mask.YesTip('编辑成功');
                self.all_table();
                top.layer.close(index);
            })
        }
        return _m;

    })();
    mainPage.init();

})
