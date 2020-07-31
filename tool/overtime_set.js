 overtime_set = (function () {
     var _m = {};
     var self = _m;
     //初始化
     _m.init = function () {
         
     }
     //获取全部教师
     _m.getTeacher = function (obj,value,iframeWins) {
         var params={
             token: token,
             faid: userId,
             iids: '3-4-5',
             size:200,
             state:1
         }
         $.axse(urls+'/account/getAccountsStaff.action',params,function(result){
             var list=result.data.list;
             obj.find('select[name="teacher"]').empty();
             var dom="<option value=''>请选择老师</option>";
             for(var i=0;i<list.length;i++){
                 if(list[i].accountData.rname){
                     dom+='<option value='+list[i].id+'>'+list[i].accountData.rname+'</option>';
                 }else {
                     dom+='<option value='+list[i].id+'>'+list[i].username+'</option>';
                 }

             }
             obj.find('select[name="teacher_account_id"]').html(dom);
             if(iframeWins){
                 iframeWins.layui.form.render();
                 if(value){
                     obj.find('select[name="teacher_account_id"]').val(value);
                     iframeWins.layui.form.render();
                 }
             }else{
                 layui.form.render();
                 if(value){
                     obj.find('select[name="teacher_account_id"]').val(value);
                     layui.form.render();
                 }
             }


         })
     }
     //多选班级的弹框
     _m.getClass = function () {
         var add_edit_Mask = '<div style="padding:0 50px;color:#898989;" class="layui-form">' +
             '<div class="clear">' +
                  '<div class="lf" style="width: 300px;height: 550px;border-right: 1px solid #cccccc;padding-top: 20px;"><ul class="wrap" style="height: 450px;overflow-y: auto;"></ul><div><span class="school_Btn yesTip"style="margin-right: 20px;width: 80px">确定</span><span class="school_Btn"style="background: #b1b1b1;width: 80px">取消</span></div></div>'+
                '<div class="rg" style="width: 300px;height: 500px;overflow-y: auto;padding-top: 20px"><ul id="tree" style="line-height: 35px"></ul></div>'+
             '</div>' +
         '</div>'
         var index = top.layer.open({
             type: 1,
             title:'选择班级',
             closeBtn: 1,
             shadeClose: false,
             slin:'grades',
             area: ['700px','auto'],
             content:add_edit_Mask,
             btnAlign: 'l',
             success: function(layer, index) {
                 var classgrade_Name=$('.classgrade_ids').val();
                 var classgrade_id = $('.chooseClass').val();
                 if($.trim(classgrade_Name)){
                    var arr=classgrade_Name.split('，');
                    var arr_id=classgrade_id.split('-');
                     self.fillMaskLeft(arr,arr_id,$(layer));
                 }else {
                     var arr = [];
                     var arr_id=[];
                 }
                 classgrade_Tree.tree(function (tree) {
                     top.layui.tree({
                         elem: '#tree'
                         ,nodes:tree
                         ,click: function(node){
                             console.log(node) //node即为当前点击的节点数据
                             if(!node.children){
                                 if(arr.length>0){
                                     for(var i=0;i<arr.length;i++) {
                                         if (arr[i] == node.name) {
                                             sl_Mask.NoTip('班级已被选中');
                                             return;
                                         }
                                     }
                                     arr.push(node.name);
                                     arr_id.push(node.id);

                                     $(layer).find('.wrap').append('<li style="display:inline-block;padding: 5px 10px;background: #f3f5f8;color: #8b8b8b;margin-right: 5px;margin-bottom: 10px;cursor: pointer"><span data-id='+node.id+'>'+node.name+'</span><i class="material-icons" style="font-size: 16px;vertical-align: middle;margin-left: 5px">clear</i></li>');
                                     $(layer).find('.wrap li').unbind('click').bind('click',function () {
                                         arr = arr.remove($(this).find('span').text());
                                         arr_id = arr_id.remove(parseInt($(this).find('span').attr('data-id')));
                                         $(this).remove();
                                     })

                                 }else {
                                     arr.push(node.name);
                                     arr_id.push(node.id);
                                     $(layer).find('.wrap').append('<li style="display:inline-block;padding: 5px 10px;background: #f3f5f8;color: #8b8b8b;margin-right: 5px;margin-bottom: 10px;cursor: pointer"><span data-id='+node.id+'>'+node.name+'</span><i class="material-icons" style="font-size: 16px;vertical-align: middle;margin-left: 5px">clear</i></li>');
                                     $(layer).find('.wrap li').unbind('click').bind('click',function () {

                                         arr = arr.remove($(this).find('span').text());
                                         arr_id = arr_id.remove(parseInt($(this).find('span').attr('data-id')));
                                         $(this).remove();
                                     })
                                 }


                             }
                         }
                     });
                 });
                 $(layer).find('.yesTip').unbind('click').bind('click', function(e) {
                     e.preventDefault();
                     $('.classgrade_ids').val(arr.join("，"))
                     $('.chooseClass').val(arr_id.join("-"))
                     top.layer.close(index);
                 })
                 $(layer).find('.NoTip').unbind('click').bind('click',function () {
                     top.layer.close(index);
                 })
             }

         })
     }
     //获取全部班级
     _m.fillMaskLeft = function (arr,arr_id,obj) {
         var dom='';
         for(var i=0;i<arr.length;i++){
             dom+='<li style="display:inline-block;padding: 5px 10px;background: #f3f5f8;color: #8b8b8b;margin-right: 5px;margin-bottom: 10px;cursor: pointer"><span data-id='+arr_id[i]+'>'+arr[i]+'</span><i class="material-icons" style="font-size: 16px;vertical-align: middle;margin-left: 5px">clear</i></li>';
         }
         obj.find('.wrap').append(dom);
         obj.find('.wrap li').unbind('click').bind('click',function () {
             arr = arr.remove($(this).find('span').text());
             arr_id = arr_id.remove($(this).find('span').attr('data-id'));
             $(this).remove();
         })
     }
     return _m;
})