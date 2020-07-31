 sl_Mask = (function () {
     var _m = {};
     var self = _m;
     //成功的提示
     _m.YesTip = function (msg) {
         top.layer.msg('<i class="material-icons msgIconStyle">check_circle</i>'+msg,{
             skin: 'msgStyle',//skin属性可以将layer的标签提取出来，重新定义样式
         });
     }
     //错误的提示
     _m.NoTip = function (msg) {
         top.layer.msg('<i class="material-icons msgIconStyleFail">cancel</i>'+msg,{
             skin: 'msgStyle',//skin属性可以将layer的标签提取出来，重新定义样式
         });
     }
     //创建账户成功
     _m.successTip =function (title, msg, fn, btn_text1, btn_text2) {
         var btn_text1 = btn_text1 || '取消';
         var btn_text2 = btn_text2 || '确定';
         var index = top.layer.open({
             type: 1,
             title: false,
             closeBtn: 0,
             shadeClose: true,
             area: ['400px', 'auto'],
             content: '<div style="padding:30px 50px 24px;color:#000000;position:relative">' +
             '<p class="self_Mask_title"style="padding-left: 25px">'+title+'</p>' +
             '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close">&#x1006;</i> '+
             '<ul style="padding-bottom: 20px">' + msg + '</ul>' +
             '<div class="yesTip self_Mask_btn">'+btn_text2+'</div>'+
             '<div class="NoTip self_Mask_btn" style="background: #ffffff;color: #8b8b8b;margin-top: 5px">' + btn_text1 + '</div>' +
             '</div>',
             success: function(layero, index) {
                 $(layero).find('.yesTip').unbind('click').bind('click', function() {
                     fn();
                     top.layer.close(index);
                 })
                 $(layero).find('.NoTip').unbind('click').bind('click', function() {
                     top.layer.close(index);
                 })
             }

         })
     }
     //切换学生晚自修临时有事状态
     _m.Switched_state = function (src,msg,state,fn) {
         var index = top.layer.open({
             type: 1,
             title: false,
             closeBtn: 0,
             shadeClose: false,
             area: ['400px', 'auto'],
             content: '<div style="padding:30px 30px 50px;color:#000000;opacity:0.87;position:relative;padding-bottom: 27px">' +
             '<i class="layui-icon layui-icon-close closeBtn" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;cursor: pointer">&#x1006;</i> '+
             '<div style="height: 80px;margin-bottom: 25px;width: 80px;margin: 0 auto;margin-top: 60px;"><img src="'+src+'" alt=""width="100%"height="100%"></div>'+
             '<p style="padding:10px 10px 54px;text-align: center;line-height: 30px">'+msg+'</p>' +
             '<div class="self_Mask_btn">设置为临时请假<div>' +
             '</div>',
             success: function(layer, index) {
                 var fixedTime=18*3600+10*60;
                 var time= new Date();
                 var nowTime =time.getHours()*3600+time.getMinutes()*60;
                 if(nowTime<fixedTime){
                     if(state==0){
                         $(layer).find('.self_Mask_btn').addClass('yesTip');
                     }else {
                         $(layer).find('.self_Mask_btn').addClass('yesTip').addClass('red').text('取消临时请假');
                     }
                 }else {
                     $(layer).find('.self_Mask_btn').addClass('gray');
                 }
                 $(layer).find('.yesTip').unbind('click').bind('click', function() {
                     var time= new Date();
                     var nowTime =time.getHours()*3600+time.getMinutes()*60;
                     if(nowTime<fixedTime){
                         fn(index);
                     }else{
                          $(this).removeClass('yesTip').addClass('gray');
                          sl_Mask.NoTip('已过修改时间，不可修改');
                     }

                 })
                 $(layer).find('.gray').unbind('click').bind('click', function() {
                     sl_Mask.NoTip('设定修改时间已过，不可修改');
                 })
                 $(layer).find('.closeBtn').unbind('click').bind('click', function() {
                     top.layer.close(index);
                 })
             }

         })
     }
     //值班模块   代班 和 换班 审批的弹框
     _m.duty_StateMask = function (msg,obj,fn) {
         var index = top.layer.open({
             type: 1,
             title: false,
             closeBtn: 0,
             shadeClose: false,
             area: ['400px', 'auto'],
             content: '<div style="padding:30px 30px 50px;color:#000000;opacity:0.87;position:relative;padding-bottom: 27px">' +
             '<i class="layui-icon layui-icon-close closeBtn" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;cursor: pointer">&#x1006;</i> ' +
             '<div style="height: 80px;margin-bottom: 25px;width: 80px;margin: 0 auto;margin-top: 60px;"><img src="images1/passIcon.png" alt=""width="100%"height="100%"></div>' +
             '<p style="padding:10px 10px 54px;text-align: center;line-height: 30px">'+msg+'</p>' +
             '<div class="clear" style="width: 80%;margin: 0 auto">' +
                  '<div class="self_Mask_btn lf YesBtn"style="width: 100px;">通过</div>' +
                  '<div class="self_Mask_btn rg NoBtn" style="width: 100px;background: #ff4747">驳回</div>' +
             '</div>'+
             '</div>',
             success: function (layer, index) {
                 var params={
                      token: token,
                      faid:userId
                  }
                  $.extend(params,obj);
                 $(layer).find('.YesBtn').unbind('click').bind('click', function() {
                     params.agree =1;
                     fn(params,index);

                 })
                 $(layer).find('.NoBtn').unbind('click').bind('click', function() {
                     params.agree =-1;
                     fn(params,index);
                 })
                 $(layer).find('.closeBtn').unbind('click').bind('click', function() {
                     top.layer.close(index);
                 })
             }
         })
     }
     //学生处审批住校申请的弹框
     _m.dormitory_Apply = function (that,fn) {
         var rows = JSON.parse(that.attr('data-rows'));
         var arr = ['女','男']
         var index = top.layer.open({
             type: 1,
             title: false,
             closeBtn: 0,
             shadeClose: false,
             area: ['500px', 'auto'],
             content: '<div style="padding:30px 30px 50px;color:#000000;opacity:0.87;position:relative;padding-bottom: 27px">' +
             '<p class="self_Mask_title" style="padding-bottom:20px;text-align: left">住校申请</p>' +
             '<i class="layui-icon layui-icon-close closeBtn" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;cursor: pointer">&#x1006;</i> ' +
             '<div style="padding:20px 0 20px">' +
             '<ul >' +
             '<li class="clear self_Mask_row"><span style="display:inline-block;width:80px;text-align:left;padding:9px 0;">姓名</span><p style="display: inline-block;padding:9px 0;margin-right: 40px">'+rows.student_name+'</p><span style="display:inline-block;width:80px;text-align:left;padding:9px 0;">性别</span><p style="display: inline-block;padding:9px 0;">'+arr[rows.student_sex]+'</p></li>' +
             '<li class="clear self_Mask_row"><span style="display:inline-block;width:80px;text-align:left;padding:9px 0;">班级</span><p style="display: inline-block;padding:9px 0;">'+rows.classgrade_name+'</p></li>' +
             '<li class="clear self_Mask_row"><span style="display:inline-block;width:80px;text-align:left;padding:9px 0;">家庭住址</span><p style="display: inline-block;padding:9px 0;">'+rows.student_family_location+'</p></li>' +
             '<li class="clear self_Mask_row"><span style="display:inline-block;width:80px;text-align:left;padding:9px 0;">申请理由</span><p style="display: inline-block;padding:9px 0;">'+rows.des+'</p></li>' +
             '</ul>' +
             '</div>' +
             '<div class="clear" style="width: 100%;">' +
             '<div class="self_Mask_btn rg NoBtn" style="width: 60px;background: #ff4747;">拒绝</div>' +
             '<div class="self_Mask_btn rg YesBtn"style="width: 60px;margin-right: 20px">通过</div>' +
             '</div>'+
             '</div>',
             success: function (layer, index) {
                 var params={id:rows.id};
                 $(layer).find('.YesBtn').unbind('click').bind('click', function() {
                     params.state =1;
                     fn(params,index);
                 })
                 $(layer).find('.NoBtn').unbind('click').bind('click', function() {
                     params.state =-1;
                     fn(params,index);
                 })
                 $(layer).find('.closeBtn').unbind('click').bind('click', function() {
                     top.layer.close(index);
                 })
             }
         })
     }
     //学生处住校生审批的查看弹框
     _m.dormitory_Apply_look = function (that) {
          var rows = JSON.parse(that.attr('data-rows'));
         var arr = ['女','男']
         var index = top.layer.open({
             type: 1,
             title: false,
             closeBtn: 0,
             shadeClose: false,
             area: ['500px', 'auto'],
             content: '<div style="padding:30px 30px 50px;color:#000000;opacity:0.87;position:relative;padding-bottom: 27px">' +
             '<p class="self_Mask_title" style="padding-bottom:20px;text-align: left">住校申请</p>' +
             '<i class="layui-icon layui-icon-close closeBtn" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;cursor: pointer">&#x1006;</i> ' +
             '<div style="padding:20px 0 20px">' +
             '<ul >' +
             '<li class="clear self_Mask_row"><span style="display:inline-block;width:80px;text-align:left;padding:9px 0;">姓名</span><p style="display: inline-block;padding:9px 0;margin-right: 40px">'+rows.student_name+'</p><span style="display:inline-block;width:80px;text-align:left;padding:9px 0;">性别</span><p style="display: inline-block;padding:9px 0;">'+arr[rows.student_sex]+'</p></li>' +
             '<li class="clear self_Mask_row"><span style="display:inline-block;width:80px;text-align:left;padding:9px 0;">班级</span><p style="display: inline-block;padding:9px 0;">'+rows.classgrade_name+'</p></li>' +
             '<li class="clear self_Mask_row"><span style="display:inline-block;width:80px;text-align:left;padding:9px 0;">家庭住址</span><p style="display: inline-block;padding:9px 0;">'+rows.student_family_location+'</p></li>' +
             '<li class="clear self_Mask_row"><span style="display:inline-block;width:80px;text-align:left;padding:9px 0;">申请理由</span><p style="display: inline-block;padding:9px 0;">'+rows.des+'</p></li>' +
             '</ul>' +
             '</div>' +
             '<div class="clear" style="width: 100%;padding-bottom: 20px">' +
             '<div class="lf NoBtn" style="width: 60px;color: #ff4747;"></div>' +
             '<div class="lf YesBtn"style="width: 60px;margin-right: 20px"></div>' +
             '</div>'+
             '</div>',
             success: function (layer, index) {
                 if(rows.state==1){
                     $(layer).find('.YesBtn').text('已审批')
                 }
                 if(rows.state==-1){
                     $(layer).find('.NoBtn').text('已拒绝')
                 }
                 $(layer).find('.closeBtn').unbind('click').bind('click', function() {
                     top.layer.close(index);
                 })
             }
         })
     }
     //学生打分规则和班级打分规则关联
     _m.S_RulesForClassgrade = function (that) {
         var ruleID = that.attr('data-id');
         var bindRules = that.attr('data-bind')
         var index = top.layer.open({
             type: 1,
             title: false,
             closeBtn: 0,
             shadeClose: false,
             area: ['600px', 'auto'],
             content: '<div style="padding:30px 30px 50px;color:#000000;opacity:0.87;position:relative;padding-bottom: 27px">' +
             '<p class="self_Mask_title" style="padding-bottom:20px;text-align: left">关联班级打分项</p>' +
             '<i class="layui-icon layui-icon-close closeBtn" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;cursor: pointer">&#x1006;</i> ' +
             '<div style="padding:20px 0 20px">' +
                   '<ul>'+
                       '<li class="clear self_Mask_row"><input class="layui-input lf" type="text"  placeholder="选择打分项"style="width:220px;border: none;background: #f3f5f8;border-radius: 0;" name="names" lay-verify="required" readonly><span class="school_Btn" id="Choice">选择</span><span class="school_Btn clearBtn" style="background: #ff4747;margin-left:25px ">清空</span></li>' +
                        '<li class="clear self_Mask_row btnWrap" style="min-height: 250px">' +
                        '</li>'+
                   '</ul>'+
             '</div>' +
             '<div class="clear" style="width: 100%;padding-bottom: 20px">' +
             '<div class="lf YesBtn school_Btn yesBtn"style="width: 100px;margin-right: 20px">提交</div>' +
             '</div>' +
             '</div>',
             success: function (layero, index) {
                 if(bindRules){
                     self.getClassRulesForStudentRules(ruleID,$(layero));
                 }
                 $(layero).find('.clearBtn').attr('data-bind',bindRules);
                 var ClassChoice1 = new choose_Score($(layero).find('#Choice'),ClassRecord,{bind:1},function (projectid) {
                     var Class_getRules = new getRulesForClassGrade(projectid,$(layero),true);

                 });
                 //点击确定按钮提交
                 $(layero).find('.yesBtn').unbind('click').bind('click', function() {
                     var classgrade_ruleID= $(layero).find('.btnWrap').find('span.blue').attr('data-id');
                      var params= {
                          token:token,
                          faid:userId,
                          ruleID:ruleID,
                          classgrade_ruleID:classgrade_ruleID ||0
                      }
                     if(params.classgrade_ruleID==0&&!$(layero).find('.clearBtn').attr('data-bind')){
                          sl_Mask.YesTip('请选择要关联的班级打分项');
                          return;
                     }
                     $.axse(urls+'/prunle/bindForClassgradeRule.action', params, function (result) {
                           if(params.classgrade_ruleID==0){
                               sl_Mask.YesTip('解绑成功');
                               that.attr('data-bind','');
                               that.find('i.contact').remove();
                           }else {
                               sl_Mask.YesTip('绑定成功');
                               that.attr('data-bind',true);
                               var dom='<i class="material-icons contact" style="font-size: 16px;left: 10px;opacity: 1;right: auto;">attach_file</i>';
                               that.prepend(dom);
                           }
                           top.layer.close(index);
                     })
                 })
                 $(layero).find('.closeBtn').unbind('click').bind('click', function() {
                     top.layer.close(index);
                 })
                 //清除班级打分项
                 $(layero).find('.clearBtn').unbind('click').bind('click',function () {
                     $(layero).find('input[name="names"]').val('')//打分项
                     $(layero).find('.btnWrap').empty();//打分规则
                 })
             }
         })
     }
     //通过学生打分规则id  获取班级打分规则id;
      _m.getClassRulesForStudentRules = function (ruleID,obj,type) {
          var params={
              token:token,
              faid:userId,
              ruleID:ruleID
          }
          $.axse(urls+'/prunle/getBindData.action', params, function (result) {
              var data=result.data;
              var rule = data.rule;
              var names=''
              if (rule.operation == 1) {
                  names = rule.name+'&nbsp+'+rule.value;
              } else if (rule.operation == 2) {
                  names = rule.name+'&nbsp-'+rule.value;
              }
              if(type){ //绑定班级打分项查看;
                obj.find('input[name="names"]').val(data.project.name);
                obj.find('.rule').html(names);
              }else {  //更改或解绑班级打分项;
                  var dom = '<div style="margin-bottom: 20px"><span class="layui-btn blue" data-id=' + rule.id + '>' +names+ '</span></div>';
                  obj.find('input[name="names"]').val(data.project.name);
                  obj.find('.btnWrap').append(dom);
                  obj.find('.btnWrap').find('span.layui-btn').unbind('click').bind('click', function () {
                      var index = $(this).index();
                      obj.find('.btnWrap').find('span.layui-btn').addClass('gray').removeClass('blue').eq(index).addClass('blue').removeClass('gray');
                  })
              }

          })

      } 
     //学生打分项绑定班级打分规则在除学生处之外的权限下查看
     _m.look_S_RulesForClassgrade = function (ruleID) {
         var index = top.layer.open({
             type: 1,
             title: false,
             closeBtn: 0,
             shadeClose: false,
             skin:'add_director',
             area: ['400px', 'auto'],
             content: '<div style="padding:30px 50px 24px;color:#898989;position:relative"class="layui-form major_set">' +
             '<p class="self_Mask_title" style="padding-bottom:20px;">关联班级打分</p>' +
             '<div style="padding:20px 0 20px">' +
             '<ul style="height: 250px;overflow-y: auto">' +
             '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">打分项</label><input class="layui-input rg" type="text" style="width:220px;border: none;border-radius: 0;" readOnly name="names"></li>' +
             '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">规则</label><span class="layui-btn gray rule" data-id="216"></span></li>'+

             '</ul>' +
             '</div>' +
             '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>确定</div>' +
             '</div>',
             success: function(layero, index) {
                 self.getClassRulesForStudentRules(ruleID,$(layero),true);
                 //确定按钮
                 top.layui.form.on('submit(formDemo)', function(data){
                     top.layer.close(index);
                 });

             }
         })
     }
     //学生打分历史记录点击打分内容查看备注的弹框
     _m.remind_ForScoreHistoryMask=function (that) {
         var texts=that.attr('data-annotation')||'无';
         var index = top.layer.open({
             type: 1,
             title: false,
             closeBtn: 0,
             shadeClose: false,
             area: ['400px', 'auto'],
             content: '<div style="padding:30px 30px 50px;color:#000000;opacity:0.87;position:relative;padding-bottom: 27px">' +
             '<i class="layui-icon layui-icon-close closeBtn" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;cursor: pointer">&#x1006;</i> '+
             '<p style="padding:20px 10px 10px;">备注：</p>' +
             '<p style="padding:10px 10px 24px;line-height: 30px" id="qrcodeCanvas">'+texts+'</p>' +
             '<div class="self_Mask_btn">确定<div>' +
             '</div>',
             success: function(layero, index) {

                 $(layero).find('.self_Mask_btn').unbind('click').bind('click', function() {
                     top.layer.close(index);
                 }) //确定按钮

                 $(layero).find('.closeBtn').unbind('click').bind('click', function() {
                     top.layer.close(index);
                 })//关闭弹框
             }
         })
     }
     //给考勤状态绑定核心素养规则
     _m.PunchStateBindScoreRule =function (that) {
         var state=that.attr('data-state');
         var index = top.layer.open({
             type: 1,
             title: false,
             closeBtn: 0,
             shadeClose: false,
             area: ['600px', 'auto'],
             content: '<div style="padding:30px 30px 50px;color:#000000;opacity:0.87;position:relative;padding-bottom: 27px">' +
             '<p class="self_Mask_title" style="padding-bottom:20px;text-align: left">关联核心素养打分项</p>' +
             '<i class="layui-icon layui-icon-close closeBtn" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;cursor: pointer">&#x1006;</i> ' +
             '<div style="padding:20px 0 20px">' +
             '<ul>'+
             '<li class="clear self_Mask_row"><input class="layui-input lf" type="text"  placeholder="选择打分项"style="width:220px;border: none;background: #f3f5f8;border-radius: 0;" name="names" lay-verify="required" readonly><span class="school_Btn" id="Choice">选择</span><span class="school_Btn clearBtn" style="background: #ff4747;margin-left:25px ">清空</span></li>' +
             '<li class="clear self_Mask_row btnWrap" style="min-height: 250px">' +
             '</li>'+
             '</ul>'+
             '</div>' +
             '<div class="clear" style="width: 100%;padding-bottom: 20px">' +
             '<div class="lf YesBtn school_Btn yesBtn"style="width: 100px;margin-right: 20px">提交</div>' +
             '</div>' +
             '</div>',
             success: function (layero, index) {
                 var p2 = new choose_Score($(layero).find('#Choice'),studentRecord,{free:0},function (projectid) {
                     var rules=new getRulesForStudet(projectid,$(layero),false,true);
                 });
                 /*关闭*/
                 $(layero).find('.closeBtn').unbind('click').bind('click', function() {
                     top.layer.close(index);
                 })
                 var params={
                     token:token,
                     faid:userId,
                     state:state
                 }
                 self.getPunchStateBindScoreRule(params,$(layero));
                 /*确定按钮*/
                 $(layero).find('.yesBtn').unbind('click').bind('click', function() {
                     var rule_id = $(layero).find('.btnWrap').find('span.blue').attr('data-id');
                     var projectId = $(this).attr('dataId');
                     var r = $(layero).find('.clearBtn').attr('dataId');
                     if(!rule_id&&!r){
                         sl_Mask.NoTip('请选择打分规则');
                         return
                     }
                     if(!rule_id){
                         $.extend(params);
                         self.editPunchStateBindScoreRule(params,index);
                     }else {
                         $.extend(params,{rule_id:rule_id,project_id:projectId});
                         self.editPunchStateBindScoreRule(params,index,1);
                     }
                 })
                 /*关闭*/
                 $(layero).find('.closeBtn').unbind('click').bind('click', function() {
                     top.layer.close(index);
                 })
                 //清除班级打分项
                 $(layero).find('.clearBtn').unbind('click').bind('click',function () {
                     $(layero).find('.yesBtn').attr('dataId','');//打分项Id
                     $(layero).find('input[name="names"]').val('')//打分项
                     $(layero).find('.btnWrap').empty();//打分规则
                 })
             }
         })
     }
     //获取考勤状态绑定的规则
     _m.getPunchStateBindScoreRule =function(params,obj){
         var loadings= top.layui.layer.load(2);
         $.axse(urls+'/PunchGet/GePerfmanceRule.action', params, function (result) {
              top.layui.layer.close(loadings);
              var data=result.data;
              if(data&&!$.isEmptyObject(data)){
                  if(data[params.state]){
                      var project = data[params.state]['p'];
                      var r = data[params.state]['r'].id;
                      console.log(project);
                      self.getPunchStateBindProject(project,obj,r);
                  }
              }
         },function () {
              top.layui.layer.close(loadings);
         })
     }
     //编辑考勤状态绑定的规则
     _m.editPunchStateBindScoreRule =function(params,index,type){
         var loadings= top.layui.layer.load(2);
         $.axse(urls+'/PunchEdit/SetPerfmanceRule.action', params, function (result) {
             top.layui.layer.close(loadings);
             if(type){
                 sl_Mask.YesTip('操作成功');
             }else {
                 sl_Mask.YesTip('解绑成功');
             }
             top.layer.close(index);
         },function () {
             top.layui.layer.close(loadings);
         })
     }
     //获取考勤绑定的打分项
     _m.getPunchStateBindProject = function (data,obj,r) {
         obj.find('.btnWrap').empty();
         obj.find('input[name="names"]').val(data.name);
         obj.find('.clearBtn').attr('dataId',r);
         obj.find('.yesBtn').attr('dataId',data.id);
         var dom = "";
         var rules = data.rules;
         for (var i = 0; i < rules.length; i++) {
             if(rules[i].operation==1){
                 rules[i].value='&nbsp+'+ rules[i].value
             }else if(rules[i].operation==2){
                 rules[i].value='&nbsp-'+ rules[i].value
             }
             if(rules[i].bind_rule_id){
                 if(rules[i].id!=r){
                     dom += '<div style="position: relative;margin-bottom: 10px"><i class="material-icons contact gray" style="position:absolute;font-size: 16px;left: 10px;z-index: 1;top: 10px;" data-id=' + rules[i].id + '>attach_file</i><span class="layui-btn gray" data-id=' + rules[i].id + '>' + rules[i].name + rules[i].value + '</span></div>';
                 }else {
                     dom += '<div style="position: relative;margin-bottom: 10px"><i class="material-icons contact gray" style="position:absolute;font-size: 16px;left: 10px;z-index: 1;top: 10px;" data-id=' + rules[i].id + '>attach_file</i><span class="layui-btn blue" data-id=' + rules[i].id + '>' + rules[i].name + rules[i].value + '</span></div>';
                 }

             } else {
                 if(rules[i].id!=r){
                     dom += '<div style="position: relative;margin-bottom: 10px;"><span class="layui-btn gray" data-id=' + rules[i].id + '>' + rules[i].name + rules[i].value + '</span></div>';
                 }else {
                     dom += '<div style="position: relative;margin-bottom: 10px;"><span class="layui-btn blue" data-id=' + rules[i].id + '>' + rules[i].name + rules[i].value + '</span></div>';
                 }

             }
         }
         obj.find('.btnWrap').append(dom);

         obj.find('.btnWrap').find('span.layui-btn').unbind('click').bind('click', function (e) {
             //如果提供了事件对象，则这是一个非IE浏览器
             if (e && e.stopPropagation) {
                 e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
             }
             else {
                 window.event.cancelBubble = true;//否则，我们需要使用IE的方式来取消事件冒泡
                 return false;
             }
                 var index = $(this).index();
                 obj.find('span.layui-btn').addClass('gray').removeClass('blue');
                 $(this).addClass('blue').removeClass('gray');
         })
         obj.find('.btnWrap').find('i.contact').unbind('click').bind('click',function (e) {
             //如果提供了事件对象，则这是一个非IE浏览器
             if (e && e.stopPropagation) {
                 e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
             }
             else {
                 window.event.cancelBubble = true;//否则，我们需要使用IE的方式来取消事件冒泡
                 return false;
             }
             var ids=$(this).attr('data-id');
             sl_Mask.look_S_RulesForClassgrade(ids);
         })
     }
     return _m;
})();