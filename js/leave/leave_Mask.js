 leave_Mask = function () {
     var _m = {};
     var self = _m;
     //请假 待审核  驳回   页面
     _m.stayTry = function(ids,message_ids) {
         if(message_ids){
             tool().AlreadyRead(message_ids);
             tool().WorkMessage(message_ids);
         }
         var record;
         var index = layui.layer.open({
             type: 2,
             title:"<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>审批<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>审批详情</a>",
             area: ['100%','100%'],
             content:'leave_stay_state.html',
             success: function(layero, index) {
                 var body = layer.getChildFrame('body', index);
                 var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                  self.fill(body,ids);
             },
             cancel: function(layero,index){
                 $('#table1').bootstrapTable('refresh');
             },
             end:function () {}
         })
     }
     //班主任  查看 请假情况
     _m.stayTryClass = function (ids,message_ids) {
         if(message_ids){
             tool().AlreadyRead(message_ids);
             tool().WorkMessage(message_ids);
         }
         var index = layui.layer.open({
             type: 2,
             title:"<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>审批<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>审批详情</a>",
             area: ['100%','100%'],
             content:'leave_stay_state_class.html',
             success: function(layero, index) {
                 var body = layer.getChildFrame('body', index);
                 var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                 self.fill(body,ids);
             },
             cancel: function(layero,index){
             $('#table1').bootstrapTable('refresh');
         },
         end:function () {}
         })
     }
     //动态生成审批结果的时间图
     _m.timeLine = function (obj,data) {
         obj.find('.layui-timeline').empty();
         var stateArr={
             "0":'待审批',
             "1": '已审批',
             "-1":'驳回'
         }
         var stateclassName={
             "0":'stay',
             "1": 'state',
             "-1":'red'
         }
         var dom="";
         for(var i=0;i<data.length;i++){
             var state = data[i].examine_state||0 ;
             if(data[i].examine_account){
                 var rname =data[i].examine_account.accountData.rname+'（'+data[i].identity.name+'）' ;
             }else {
                 var rname =data[i].identity.name ;
             }
             if(data[i].examine_time){
                 var commit_time ='审批时间：'+tool().getSmpFormatDateByLong(data[i].examine_time,true);
             }else {
                 var commit_time='-'
             }

             var des =data[i].examine_des||'-';
             dom+='<li>' +
                 '<div><span class="stateB state '+stateclassName[state]+'">'+stateArr[state]+'</span><p class="rnameB" style="min-width: 150px">'+rname+'</p><p class="commit_time">'+commit_time+'</p><span>备注：</span><p class="des">'+des+'</p></div>' +
                 '<i style="display: block;height: 50px;border-left: 1px solid #bbbbbb;width:200px;margin: 8px 21px;"></i>' +
                 '</li>';
         }
         obj.find('.layui-timeline').append(dom);
         obj.find('.layui-timeline').find('i:last').remove();
     }
     //请假人数据处理
     _m.stay_rname=function (apply_accounts) {
         var arr=[];
         if(apply_accounts&&apply_accounts.length>0){
             for (var i=0;i<apply_accounts.length;i++){
                 arr.push(apply_accounts[i].accountData.rname+'（'+apply_accounts[i].accountData.identitysData[6].classgrades[0].name+'）');
             }
         }
         return arr.join('；');
     }
     //请假类型
     _m.stay_type = function (type) {
         var a='';
         switch (type){
             case 0:
                 a='其他'
                 break;
             case 1:
                 a='事假'
                 break;
             case 2:
                 a='病假'
                 break;
             case 3:
                 a='活动'
                 break;
         }
         return a;
     }
     //通过数据填充页面
     _m.fill = function (obj,ids) {
         var params={
             token:token,
             faid:userId,
             leave_id:ids
         }
         $.axse(urls+leaveMessage_one,params,function(result) {
             var data = result.data;
             obj.find('#AgreeBtn').attr('data-id', data.id);
             obj.find('#NoAgree').attr('data-id', data.id);
             var stateArr = {
                 "0": '待审批',
                 "1": '已审批',
                 "-1": '驳回'
             }
             var datas = {
                 rname: self.stay_rname(data.apply_accounts),             //请假人
                 s_time: tool().getSmpFormatDateByLong(data.s_time, true),   //请假时间
                 e_time: tool().getSmpFormatDateByLong(data.e_time, true),
                 stay_long: tool().stay_long(data.s_time, data.e_time),      //请假时长
                 type: self.stay_type(data.type),                         //请假类型
                 des: data.des||'',                                             //请假事由
                 family_verify: data.family_verify == 0 ? '未签字' : '已签字'       //是否家长签字
             }
             // tool().dominit(datas,obj);
             self.Fillcontent(datas,obj);
             if (data.file_path) {
                 obj.find('.file_path_Wrap').empty();
                 obj.find('.file_path_Wrap').append(' <img src=' + ImgurlHttp + data.file_path + ' alt="" class="file_path" onclick="tool().showImg($(this))">')
             } else {
                 obj.find('.file_path_Wrap').empty();
             }

             //不同状态下的页面显示
             if (data.last_state == 0) {
                 obj.find('.title').text('审批这张请假条');
                 obj.find('.AgreeWrap').show();
             }
             if (data.last_state == 1) {
                 obj.find('.title').text('这张请假条已被审批');
                 obj.find('#stay_state').append('<img src="../images1/Agree.png" class="Agree">');
                 obj.find('#AgainLeave').show().attr('data-id', data.id);
                 obj.find('#ExportBar').show();
             }
             if (data.last_state == -1) {
                 obj.find('.title').text('这张请假条已被审批');
                 obj.find('#stay_state').append('<img src="../images1/NoAgree.png" class="Agree">');
                 obj.find('#AgainLeave').show().attr('data-id', data.id);
                 obj.find('#ExportBar').show();
             }
             self.timeLine(obj, data.examine_identitys)
         })
     }
     //填充请假界面的数据
     _m.Fillcontent = function (data,obj) {
         var dom ='<li><span>请假人：</span><p class="rname">'+data.rname+'</p></li>'+
                  '<li><span >请假时间：</span><p class="s_time" style="width:170px">'+data.s_time+'</p>至<p class="e_time"style="margin-left: 40px">'+data.e_time+'</p><li>'+
                  '<li><span>请假时长：</span><p class="stay_long">'+data.stay_long+'</p><li>'+
                  '<li><span>请假类型：</span><p class="type">'+data.type+'</p><li>'+
                  '<li><span>请假事由：</span><p class="des">'+data.des+'</p><li>'+
                  '<li><span>证明文件：</span><p class="file_path_Wrap"style="width: 30px;height: 30px;font-size: 0"></p><li>'+
                  '<li><span>家长签字：</span><p class="family_verify">'+data.family_verify+'</p><li>';
         obj.find('.content').empty().append(dom);


     } 
     return _m;
 }