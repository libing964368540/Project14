layui.use(['layer', 'form', 'element','laydate'], function() {
     layer = parent.layer === undefined ? layui.layer : top.layer;
     form = layui.form;
     laydate =layui.laydate;
    StartEndTime.get();
     gradeInClass_History = (function () {
         var _m = {};
         var self = _m;
         //初始化
         _m.init = function () {
             self.all_table();
             self.time();
             if(sessionStorage.identity_id==13){
                 self.ScoreUserClass();
             }else {
                 self.classSelect();
             }

             self.MoreDelete();
         }
         //打分专员填充班级
         _m.ScoreUserClass = function () {
             var positionId = JSON.parse(sessionStorage.positionId);
             var classgrades = positionId['13'].classgrades;
             if(classgrades.length>0){
                 self.getStudent(classgrades[0].id);
                 var dom="";
                 for(var i=0;i<classgrades.length;i++){
                     dom += '<option value="' + classgrades[i].id + '">' + classgrades[i].name + '</option>'
                 }
                 $('select[name="classgaderid"]').html(dom);
                 layui.form.render();
                 layui.form.on('select(classgaderid)', function (majordata) {
                     self.getStudent(majordata.value);
                 })
             }else {
                 sl_Mask.NoTip('打分专员账户下未绑定班级，请绑定后再试')
             }

         }
         //表格
         _m.table = function (filed) {
             if(!filed.token||!sessionStorage.identity_id){
                 tool().judge_token(function () {
                     top.location.href=loginSrc;
                 })
                 return;
             }
             if(filed) $.extend(filed,pclogin);
             $('#account').find('#table1').bootstrapTable('destroy');
             $('#table1').bootstrapTable({
                 url: urls+ '/classPrivateProject/getRecords.action',
                 queryParams: function (params) {
                     var obj = {
                         size: params.limit,
                         page: params.offset / params.limit,
                     }
                     if (filed) $.extend(obj, filed);
                     return obj;
                 },
                 sidePagination: "server",
                 pagination: true,
                 paginationLoop: false,
                 paginationShowPageGo: true,
                 pageNumber: 1,
                 striped:true,
                 cache:false,
                 pageSize: 10,
                 pageList: [5, 10, 15,25,50],
                 columns: [{
                     field: 'variablevalue',
                     checkbox:true,
                     width:'43px',
                      visible: false
                   },{
                     field: 'commit_time',
                     align: "center",
                     title: '打分时间',
                     formatter: function(value, row, index) {
                         var a=tool().getSmpFormatDateByLong(row.time,false);
                         return a;
                     }
                 }, {
                     field: '',
                     align: "center",
                     title: '学生姓名',
                     formatter: function(value, row, index) {
                         var a=row.student.rname
                         return a;
                     }
                 }, {
                     field: 'rule_name',
                     align: "center",
                     title: '打分项',
                     formatter: function(value, row, index) {
                         var a=row.project.name;
                         return a;
                     }
                 }, {
                     field: 'des',
                     align: "center",
                     title: '备注'
                 },{
                     field: '',
                     align: "center",
                     title: '打分',
                     formatter: function(value, row, index) {
                         var a = row.value;
                         return a;
                     }
                 }, {
                     field: '',
                     align: "center",
                     title: '打分人',
                     formatter: function(value, row, index) {
                         var a = row.teacher.rname;
                         return a;
                     }
                 }
                 ],responseHandler:function(result){
                     if(result.error){
                         if(400<=result.error.errorCode&&result.error.errorCode<=500){
                             top.location.href=loginSrc;
                         }else {
                             sl_Mask.NoTip(result.error.message);
                             return {
                                 "rows":'',
                                 "total":''
                             }
                         }
                     }else{
                         return {
                             "rows":result.data.list,
                             "total":result.data.count
                         }
                     }
                 },
                 formatLoadingMessage: function(){
                     return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
                 },
                 onCheck:function(value, row, index){ //单行
                     $('#table1  tr.selected td label i.material-icons').text('check_box');
                     var flag=$('#table1 th input[type="checkbox"]').prop('checked')
                     if(flag){
                         $('#table1 th label').addClass('active');
                         $('#table1 th label i.material-icons').text('check_box');
                     }else {
                         $('#table1 th label').removeClass('active');
                         $('#table1 th label i.material-icons').text('check_box_outline_blank');
                     }
                     // var a= $('#table1').bootstrapTable('getSelections');
                     // if(a.length==10){
                     //     $('#table1 th label').addClass('active');
                     // }
                 },
                 onUncheck:function(e){ //单行
                     for(var i=0;i<$('#table1  tr').length;i++){
                         if(!$('#table1  tr').eq(i).hasClass('selected')){
                             $('#table1  tr:nth-child('+i+') td label i.material-icons').text('check_box_outline_blank');
                         }
                     }
                     $('#table1 th label').removeClass('active');
                     $('#table1 th label i.material-icons').text('check_box_outline_blank');
                 },
                 onCheckAll:function(value, row, index){ //全选
                     $('#table1 th label').addClass('active')
                     $('#table1 th label i.material-icons').text('check_box');
                     $('#table1  tr td label i.material-icons').text('check_box');
                 },
                 onUncheckAll:function(value, row, index){ //全不选
                     $('#table1 th label').removeClass('active');
                     $('#table1 th label i.material-icons').text('check_box_outline_blank');
                     $('#table1  tr td label i.material-icons').text('check_box_outline_blank');
                 },
                 onClickRow:function (value, row, index) {
                     Information= value
                 },
                 onLoadSuccess:function (data) {
                     if(data.rows.length>0){
                         $('#table1').bootstrapTable('showColumn', 'variablevalue');
                     }else {
                         $('#table1').bootstrapTable('hideColumn', 'variablevalue');
                     }
                 }

             })
         }
         //获取全部
         _m.all_table = function () {
             var params = {
                 token:token,
                 faid:userId,
                 submit_account_id:userId
             }
             self.table(params);
         }
         //time 搜索范围
         _m.time = function () {
             $('#TimeSearch').unbind('click').bind('click',function () {
                 var stime= new Date($("#s_time").val()+' 00:00:00').getTime();
                 var etime= new Date($("#e_time").val()+' 00:00:00').getTime();
                 if(stime&&etime){
                     var params = {
                         faid: userId,
                         token: token,
                         stime:stime,
                         etime:etime,
                         submit_account_id:userId
                     }
                     self.table(params);
                 }else {
                     self.all_table();
                 }
             })

         }
         //填充班级select
         _m.classSelect = function () {
             var params = {
                 token: token,
                 faid: userId
             }
             //判断是不是副班主任
             if(sessionStorage.identity_id == 12){
                 params.vice_director_aid = userId;
             }else {
                 params.director_id = userId;
             }
             $.axse(urls + '/classgrade/getClassgrades.action', params, function (result) {
                 var dom='<option value="">选择班级</option>';
                 var data = result.data.list;
                 if (data && data.length > 0) {
                     for (var i = 0; i < data.length; i++) {
                         dom += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                     }
                     $('select[name="classgaderid"]').html(dom);
                     form.render();
                     form.on('select(classgaderid)', function (majordata) {
                          self.getStudent(majordata.value);
                     })
                 }
             })

         }
         //获取
         _m.getStudent = function (ids) {
             var params={
                 token:token,
                 faid:userId,
                 classgrade_id:ids
             }
             self.table(params);
         }


         //批量删除的调用
         _m.MoreDelete = function () {
             $('#MoreDelete').unbind('click').bind('click',function () {
                 self.deleteUserList();
             })
         }
         //批量删除
         _m.deleteUserList = function (type) {
             //获取所有被选中的记录
             var rows = $("#table1").bootstrapTable('getSelections');
             var arr0=[];
             if (rows.length == 0) {
                 sl_Mask.NoTip("请先选择打分记录");
                 return;
             } else {
                 for (var i = 0; i < rows.length; i++) {
                     arr0.push(rows[i]['id'])
                 }//正常状态
             }
             if (arr0.length > 0) {
                 tool().Switched_Roles('images1/Score.png', '确定提交本次批量删除', function () {
                     self.ApplyMore(arr0.join('-'));
                 })
             } else {
                 sl_Mask.NoTip("只能删除自己的打分记录");
             }
         }
         //批量审批的接口
         _m.ApplyMore = function (record_ids) {
             var params = {
                 token: token,
                 faid: userId,
                 record_ids: record_ids
             }
             var loadings = top.layui.layer.load(2);
             $.axse(urls + '/classPrivateProject/delete.action', params, function (result) {
                 top.layui.layer.close(loadings);
                 sl_Mask.YesTip('删除成功');
                 $('#table1').bootstrapTable('refresh');
                 $('#table1 th label').removeClass('active').find('i').text('check_box_outline_blank');
             }, function () {
                 top.layui.layer.close(loadings);
             })
         }
         return _m;
     })();
    gradeInClass_History.init();
    });