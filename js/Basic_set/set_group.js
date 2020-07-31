layui.config({
    base: '../js/lib/' //此处路径请自行处理, 可以使用绝对路径
}).extend({
    formSelects: 'formSelects-v4.min'
});
layui.use(['layer', 'form', 'element','formSelects'], function() {
    var layer = parent.layer === undefined ? layui.layer : top.layer,
        form = layui.form,
        element = layui.element
      formSelects = layui.formSelects
    //增加专业
    $('#add').unbind('click').bind('click', function() {
        school_magorB.add('新增专业部');
    })

})
 school_magorB = (function () {
    var _m={};
        self=_m;
        //初始化
    _m.init = function () {
           self.table();
        }
        //table
    _m.table = function(){
        var filed ={
            faid:userId,
            token:token
        }
        if(!filed.token||!sessionStorage.identity_id){
            tool().judge_token(function () {
                parent.location.href=loginSrc;
            })
            return;
        }
        $('#table1').bootstrapTable({
            url:urls+'/major/getMajorGroups.action',
            queryParams:function(params){
                var params ={
                    faid:userId,
                    token:token
                }
                $.extend(params,pclogin);
                return params;
            },
            sidePagination: "client",
            // contentType:"application/x-www-form-urlencoded; charset=UTF-8",
            // method: 'POST',
            // async:true,
            striped:true,
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
                    formatter: function(value, row, index) {
                        var index = index + 1;
                        return index;
                    }
                }, {
                    field: 'name',
                    align:"center",
                    title: '专业部'
                }, {
                    field: 'lead_accounts',
                    align:"center",
                    title: '负责人',
                    formatter: function(value, row, index) {
                        var lead_accounts = row.lead_accounts;
                        var arr=[];
                            if(lead_accounts&&lead_accounts.length>0){
                               for(var i=0;i<lead_accounts.length>0;i++){
                                   if(lead_accounts[i].state==1){
                                       arr.push(lead_accounts[i].accountData.rname);
                                   }
                               }
                               var b=arr.join('&nbsp;/&nbsp;');
                                return b;
                            }
                    }
                },{
                    field: '',
                    align:"center",
                    title: '操作',
                    formatter: function(value, row, index) {
                        var lead_accounts = row.lead_accounts;
                        var arr=[];
                        if(lead_accounts&&lead_accounts.length>0){
                            for(var i=0;i<lead_accounts.length>0;i++){
                                arr.push(lead_accounts[i].id);
                            }
                        }
                        var str=arr.join(',');
                        var a = '<a class="blue" data-name='+row.name+'  data-id='+row.id+' onclick="school_magorB.edit($(this))" data-lead_accounts='+str+'>编辑</a>';
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
                        sl_Mask.NoTip(result.error.message);
                        return [];
                    }
                }else {
                    return result.data.reverse();
                }
            } ,formatLoadingMessage: function(){
                return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
            }
        })

    }
    _m.add= function (title) {
        var index = top.layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: false,
            skin:'add_director',
            area: ['400px', 'auto'],
            content: '<div style="padding:30px 50px 24px;color:#898989;position:relative"class="layui-form major_set">' +
            '<p class="self_Mask_title" style="padding-bottom:20px;">'+title+'</p>' +
            '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close">&#x1006;</i> '+
            '<div style="padding:20px 0 20px">' +
            '<ul >' +
            '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">专业部名称</label><input class="layui-input rg" type="text"  placeholder="请输入专业部名称"style="width:220px;border: none;background: #f3f5f8;" lay-verify="required" name="name"></li>' +
            '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">负责人</label><select lay-verify="required" name="account_ids" lay-filter="account_ids" xm-select="account_ids" id="account_ids" xm-select-show-count="1"></select></li>' +
            '</ul>' +
            '</div>' +
            '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>' +
            '</div>',
            success: function(layer, index) {
                parent.layui.formSelects.render('directorid');
                top.layui.form.render();
                self.fillDirector($(layer));
                //确定按钮
                top.layui.form.on('submit(formDemo)', function(data){
                    var param={
                        faid:userId,
                        token:token,
                        name:data.field.name
                    }
                    $.axse(urls+'/major/createMajorGroup.action',param,function(result){
                        sl_Mask.YesTip('添加成功');
                        $('#account').find('#table1').bootstrapTable('destroy');
                        self.init();
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
    }
    //填充专业部
     _m.fillDirector = function (obj,value) {
         var params ={
             faid:userId,
             token:token,
             iid:8,
             size:100,
             state:1
         }
         $.axse(urls+'/account/getAccountsStaff.action',params,function(result) {
             if (!result.error) {
                 var data = result.data.list;
                 if (data && data.length > 0) {
                     var arr=[];
                     for(var i=0;i<data.length;i++){
                         arr.push({
                             value:data[i].id,
                             name:data[i].accountData.rname
                         })
                     }
                     parent.layui.formSelects.data('account_ids', 'local', {
                         arr: arr
                     });
                     parent.layui.form.render();
                     if(value){
                         top.layui.formSelects.value('account_ids',value);
                         parent.layui.form.render();
                     }
                     var classArr = [];
                     parent.layui.formSelects.on('account_ids', function(id, vals, val, isAdd, isDisabled){
                         if(isAdd){
                             classArr.push(val.val);
                         }else {
                             classArr.splice( classArr.indexOf(val.val), 1);
                         }
                         obj.find("input[name='account_newName']").val(classArr.join('-'));
                     })
                     parent.layui.form.render();
                 }
             }
         })
     }
     //绑定专业部弹框
     _m.edit=function (that) {
        var name=that.attr('data-name');
        var ids= that.attr('data-id');
        var lead_accounts= that.attr('data-lead_accounts').split(',');
         var index = top.layer.open({
             type: 1,
             title: false,
             closeBtn: 0,
             shadeClose: false,
             skin:'add_director',
             area: ['400px', 'auto'],
             content: '<div style="padding:30px 50px 24px;color:#898989;position:relative"class="layui-form major_set">' +
             '<p class="self_Mask_title" style="padding-bottom:20px;">编辑专业部</p>' +
             '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close">&#x1006;</i> '+
             '<div style="padding:20px 0 20px">' +
             '<ul >' +
             '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">专业部名称</label><input class="layui-input rg" type="text"  placeholder="请输入专业部名称"style="width:220px;border: none;background: #f3f5f8;" lay-verify="required" name="name" readonly value='+name+'></li>' +
             '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">负责人</label><select  name="account_ids" lay-filter="account_ids" xm-select="account_ids" id="account_ids" xm-select-show-count="1"></select></li>' +
                 '<input type="hidden" name="account_newName">'+
             '</ul>' +
             '</div>' +
             '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>' +
             '</div>',
             success: function(layer, index) {
                 parent.layui.formSelects.render('account_ids');
                  top.layui.form.render();
                  self.fillDirector($(layer),lead_accounts);
                 //确定按钮
                 top.layui.form.on('submit(formDemo)', function(data){
                     if($(this).hasClass('NoClick')){//用于判断重复多次点击
                         return;
                     }
                     var  account_ids = data.field.account_ids.split(',');
                     var  accounts= self.choose_arr(account_ids,lead_accounts);
                          if(!accounts.bind_account_ids&&!accounts.remove_account_ids){
                              top.layer.close(index);
                              return;
                          }
                     var param={
                         faid:userId,
                         token:token,
                         major_group_id:ids
                     }
                     if(accounts.bind_account_ids){
                         param.bind_account_ids=accounts.bind_account_ids;
                     }
                     if(accounts.remove_account_ids){
                         param.remove_account_ids=accounts.remove_account_ids;
                     }

                     var that =$(this);
                     $(this).addClass('NoClick');//添加加载内容
                     tool().onClick($(this));//添加加载的loading
                     $.axse(urls+'/account/bindMajorGroup.action',param,function(result){
                            that.removeClass('NoClick'); //移除
                            that.find('.fading-circle').remove();//移除
                             sl_Mask.YesTip('修改成功');
                             $('#account').find('#table1').bootstrapTable('destroy');
                             self.init();
                             top.layer.close(index);

                     },function () {
                          that.removeClass('NoClick');
                          that.find('.fading-circle').remove();
                     })
                 });
                 //取消按钮
                 $(layer).find('.NoTip').unbind('click').bind('click',function () {
                     top.layer.close(index);
                 })
             //
              }
         })
     }
     _m.choose_arr = function (account_ids,lead_accounts) {
              var arr=[];
              for(var j=0;j<lead_accounts.length;j++){
                  if(account_ids.indexOf(lead_accounts[j])>-1){
                      account_ids.remove(lead_accounts[j]);
                  }else{
                     arr.push(lead_accounts[j]);
                  }
              }
              return {
                  bind_account_ids:account_ids.join('-')||'',
                  remove_account_ids:arr.join('-')||''
              };
     }
    return _m;
})()
school_magorB.init();
//点击