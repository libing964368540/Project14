layui.use(['layer', 'form', 'element'], function() {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element
    var NoApply = '<li class="clear">' +
        '<label class="layui-form-label lf">学期</label>' +
        '<select name="termid" lay-verify="required">' +
        '<option value="">选择学期</option>' +
        '</select>' +
        '</li>'+
        '<li class="clear">' +
        '<label class="layui-form-label lf">申请原因</label>' +
        '<input type="text"  placeholder="请输入申请原因" class="layui-input stay_long" style="width: 370px;" name="des"lay-verify="required">'+
        '</li>'+
        '<li class="clear" style="padding-top: 30px">' +
        '<span class="layui-btn blue" lay-filter="formDemo" lay-submit>提交</span>'+
        '</li>';
    var HaveApply = '<li class="clear">' +
        '<label class="layui-form-label lf">学期</label>' +
        '<p class="item"></p>' +
        '</li>'+
        '<li class="clear">' +
        '<label class="layui-form-label lf">申请原因</label>' +
        '<p class="des"></p>' +
        '</li>'+
        '<li class="clear">' +
        '<label class="layui-form-label lf">申请状态</label>' +
        '<p class="state"></p>' +
        '</li>'
    var dormitory_ApplyForStudent = (function () {
           var _m = {};
           var self = _m;
           _m.init = function () {
               self.get();
           }
           //获取申请信息
           _m.get =function () {
               var params={
                   token:token,
                   faid:userId,
                   student_id:userId
               }
               $.axse(urls+ '/inResidenceApply/getApplyForAccountId.action', params, function (result) {
                   var list = result.data.list;
                   $('.list').empty();
                   if(list&&list.length>0){
                       //已申请
                       $('.list').append(HaveApply);
                       self.have(list);
                   }else{
                      //未申请
                       $('.list').append(NoApply);
                       form.render();
                       self.No(list);
                   }
               })
               
           }
           //填充已申请的信息
           _m.have = function (list) {
               // self.Item(list);
               if(list[0].semester_name){
                   $('.item').text(list[0].semester_name);
               }
               $('.des').text(list[0].des);
               if(list[0].state==1){
                   $('.state').text('已审批');
               }
               if(list[0].state==-1){
                   $('.state').text('已拒绝');
                   $('.state').css('color','#ff4747');
               }
               if(list[0].state==0){
                   $('.state').text('待审批');
                   $('.state').css('color','#2196f3');
               }
           }
           //填充未申请的信息
           _m.No = function (list) {
               self.Item(list);
               self.sumbit();
           }
        //监听提交
        _m.sumbit=function () {
            form.on('submit(formDemo)', function(data) {
                var semester_index= $('select[name="termid"]').find('option:selected').attr('data-index');
                var semester_name =  $('select[name="termid"]').find('option:selected').text();
                var params={
                    token:token,
                    faid:userId,
                    des:data.field.des,
                    semester_index:semester_index,
                    semester_name:semester_name,
                    semester:data.field.termid,
                    student_id: userId
                }
                tool().Switched_Roles('images1/Score.png','确定提交住宿申请？',function () {
                    self.shenqi(params);
                })
            });
        }
        //申请
       _m.shenqi = function (params) {
           var loadings= top.layui.layer.load(2);
           $.axse(urls+'/inResidenceApply/apply.action',params,function(result){
               top.layui.layer.close(loadings);
                var data= result.data;
                var list= [];
                    list.push(data);
                   $('.list').empty();
                    self.have(list);
               if(list&&list.length>0){
                   //已申请
                   $('.list').append(HaveApply);
                   self.have(list);
               }else{
                   //未申请
                   $('.list').append(NoApply);
                   form.render();
                   self.No(list);
               }
               sl_Mask.YesTip('申请成功')
           })
        }
        //获取学期接口
        _m.Item = function (list) {
               var params={
                   token:token,
                   faid:userId
                  }
               $.axse(urls +termList, params, function (result) {
                   var data = result.data;
                   if(list&&list.length>0){
                       var datas= {};
                       for(var i=0;i<data.length;i++){
                           if(data[i].id==list[0].semester){
                               datas.item = data[i].name;
                           }
                       }
                       $('.item').text(datas.item);
                   }else {
                       var dom="<option value=''>选择学期</option>";
                       for(var i=0;i<data.length;i++){
                           dom += '<option value=' + data[i].id + ' data-stime='+data[i].stime+' data-etime='+data[i].etime+' data-index='+data[i].index+'>' + data[i].name + '</option>'
                       }
                       $('select[name="termid"]').empty().append(dom);
                       form.render();
                   }
               })
           }
           return _m;
    })();
    dormitory_ApplyForStudent.init();
})
