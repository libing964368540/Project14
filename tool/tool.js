var tool = function() {
	var _m = {};
	var self = _m;
	//初始化
	_m.init = function() {
	}
	//请重新修改并导入表格
    _m.AgainUpExl = function (msg) {
        var index = top.layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: false,
            area: ['600px', '500px'],
            content: '<div style="padding:30px 30px 50px;color:#000000;opacity:0.87;position:relative;padding-bottom: 27px">' +
                '<h3 style="color: #010101;text-align: center;font-size: 20px;font-weight: bold;padding-bottom: 50px">请重新修改并导入表格</h3>'+
                 '<ul style="height: 295px;overflow-y: auto;padding-bottom: 20px">'+msg+'</ul>'+
            '<div class="yesTip"style="width:300px;text-align:center;line-height:35px;color:#ffffff;cursor: pointer;background:#2196F3;margin: 42px auto">确定<div>' +
            '</div>',
            success: function(layer, index) {
                $(layer).find('.yesTip').unbind('click').bind('click', function() {
                    top.layer.close(index);
                })
            }

        })
    }
	//判断token是否有效跳转页面
    _m.judge_token = function (fn) {
        if(sessionStorage.sl_userIsLogin == 'false'){
	        return ;
        }else {
            sessionStorage.sl_userIsLogin = false;
            var index = top.layer.open({
                type: 1,
                title: false,
                closeBtn: 0,
                shadeClose: false,
                area: ['400px', 'auto'],
                content: '<div style="padding:30px 30px 50px;color:#000000;opacity:0.87;position:relative;padding-bottom: 27px">' +
                '<div style="height: 80px;margin-bottom: 25px;width: 80px;margin: 0 auto;margin-top: 60px;"><img src="images1/out.png" alt=""width="100%"height="100%"></div>'+
                '<p style="padding:20px 10px 64px;text-align: center">您的账户在别处登录，请重新登录</p>' +
                '<div class="yesTip"style="width:300px;text-align:center;line-height:35px;color:#ffffff;cursor: pointer;background:#2196F3;margin: 0 auto">确定<div>' +
                '</div>',
                success: function(layer, index) {
                    $(layer).find('.yesTip').unbind('click').bind('click', function(e) {
                        if(e.preventDefault){
                            e.preventDefault();
                        }else{
                            window.event.returnValue == false;
                        }                              //阻止浏览器的默认行为
                        window.event? window.event.cancelBubble = true : e.stopPropagation();//阻止冒泡
                        fn();
                        top.layer.close(index);
                    })
                }

            })
         }
    }
	//切换账户通用的弹框
    _m.Switched_Roles = function (src,msg,fn) {
        var index = top.layer.open({
            type: 1,
            title: false,
             closeBtn: 0,
            shadeClose: false,
            area: ['400px', 'auto'],
            content: '<div style="padding:30px 30px 50px;color:#000000;opacity:0.87;position:relative;padding-bottom: 27px">' +
                '<i class="layui-icon layui-icon-close closeBtn" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;cursor: pointer">&#x1006;</i> '+
                '<div style="height: 80px;margin-bottom: 25px;width: 80px;margin: 0 auto;margin-top: 60px;"><img src="'+src+'" alt=""width="100%"height="100%"></div>'+
            '<p style="padding:20px 10px 64px;text-align: center">'+msg+'</p>' +
            '<div class="yesTip"style="width:300px;text-align:center;line-height:35px;color:#ffffff;cursor: pointer;background:#2196F3;margin: 0 auto">确定<div>' +
            '</div>',
            success: function(layer, index) {
                if(msg=='登录超时，请重新登录'){
                    $(layer).find('.closeBtn').remove();
                }
                $(layer).find('.yesTip').unbind('click').bind('click', function() {
                    fn();
                    top.layer.close(index);
                })
                $(layer).find('.closeBtn').unbind('click').bind('click', function() {
                    top.layer.close(index);
                })
            }

        })
    }
    //新增专业类型
     _m.add_school_majorT = function(){
    	var index = layui.layer.open({
			title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative;'>专业设置<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>专业类型设置</a>",
			type: 2,
			content: "set_majorType.html",
			area: ['100%', '100%']
		})

		window.sessionStorage.setItem("index", index);
		//改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
		$(window).on("resize", function() {
			layui.layer.full(window.sessionStorage.getItem("index"));
		})
    }
    //恢复账户接口
     _m.regainUser = function (taid) {
        tool().Switched_Roles('images1/recovery.png','确认恢复此账号？', function() {
            var params={
                token:token,
                faid:userId,
                taid:taid,
                recycle:1
            }
            $.axse(urls+'/account/recycle.action',params,function(result){
                    sl_Mask.YesTip('恢复成功');
                    mainPage.createUser();
            })
        })
    }
    //彻底删除账号
    _m.removeUser = function (taid) {
        tool().Switched_Roles('images1/out.png','确认彻底删除此账号？', function() {
            var params={
                token:token,
                faid:userId,
                taid:taid,
                recycle:0
            }
            $.axse(urls+'/account/recycle.action',params,function(result){
                    sl_Mask.YesTip('删除成功');
                    mainPage.createUser();
            })
        })
    }
    //删除打分类型
    _m.delType=function (that) {
        tool().Switched_Roles('images1/out.png','确定删除打分规则？', function() {
             that.remove();
        })
    }
    //编辑账户（修改）
    _m.addUser2 = function (num,group) {
        var navtitle=['管理员账号','教职工账号','学生账号','家长账号'];
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>" + navtitle[num] + "<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>编辑账户</a>",
            type: 2,
            content: "accout_edit.html",
            area: ['100%', '100%'],
            success: function (layero, index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                var taid=Information.id;
                var state=Information.state;
                var studentInformation = new PersonalInformation(Information,body);
                studentInformation.fillPhoto();//填充头像
                if(num==0||num==1){
                    var dom = studentInformation.fillTeacherMessage();
                    studentInformation.power();
                }
                if(num==2){
                    var dom = studentInformation.fillStudentMessage();
                    body.find('.postParents').empty().append('<li class="lf" style="color: #bec2c9">暂无</li>');
                }
                if(num==3){
                    var dom = studentInformation.fillFamilyMessage();
                    body.find('.postParents').empty().append('<li class="lf" style="color: #bec2c9">暂无</li>');
                }

                body.find('.basic_M ul').append(dom);
                body.find('#editBtn').attr('data-taid',taid);
                body.find('#editBtn').attr('data-num',num);
                body.find('#addPost').attr('data-taid',taid);
                body.find('#addpower').attr('data-taid',taid);
                body.find('.ResetPassword').attr('data-taid',taid);
                body.find('.school_del').attr('data-taid',taid);
                body.find('.school_del').attr('data-state',state);
                body.find('#addpower').attr('data-group',group);
                var EditInformatin = new EditAllUserInformation(body.find('#editBtn'),Information);
                studentInformation.Post();
            },
            cancel: function(layero,index){
            $('#table1').bootstrapTable('refresh');
            $(window).unbind("resize");
        }
        })
        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function() {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }

	//获取账户的基本信息
	_m.userList =function (taid,obj) {
          var params={
              token:token,
              faid:userId,
              taid:taid
		  }
        var loadings= top.layui.layer.load(2);
        $.axse(urls+onestudentList,params,function(result) {
            top.layui.layer.close(loadings);
            var data=result.data;
            Information=data;
            var studentInformation = new PersonalInformation(data,obj);
            studentInformation.fillpage();//填充数据
            studentInformation.fillPhoto();//填充头像
		},function () {
            top.layui.layer.close(loadings);
        })
    }
    _m.Delpower = function (that,taid) {
        var iid = that.attr('data-id');
        var params={
            faid:userId, // 操作ID
            token:token, //操作token
            iids:iid,   //目标身份
            taid:taid,  //目标ID
            add:0  // 添加／删除 0删除 1添加
        }
        $.axse(urls+'/identity/addidentityForAccount.action',params,function(result){
        	if(result.error){
                top.layer.msg('<i class="material-icons msgIconStyleFail">cancel</i>'+result.error.message,{
                    skin: 'msgStyle'//skin属性可以将layer的标签提取出来，重新定义样式
                });
			}else {
                top.layer.msg('<i class="material-icons msgIconStyle">check_circle</i>'+'删除成功',{
                    skin: 'msgStyle'//skin属性可以将layer的标签提取出来，重新定义样式
                });
                that.parent().parent().remove();
			}
        },function () {

        })
    }
	_m.DelPost = function (that,taid,obj) {
        var postid = that.attr('data-id');
        var params={
            faid:userId,
            token:token,
            taid:taid,
            postid:postid,
            add:0,
            iid: obj.find('.powerParents li.del').eq(0).attr('data-id')
        }
        $.axse(urls+'/post/addforaccount.action',params,function(result){
            if(result.error){
                top.layer.msg('<i class="material-icons msgIconStyleFail">cancel</i>'+result.error.message,{
                    skin: 'msgStyle'//skin属性可以将layer的标签提取出来，重新定义样式
                });
            }else {
                top.layer.msg('<i class="material-icons msgIconStyle">check_circle</i>'+'删除成功',{
                    skin: 'msgStyle'//skin属性可以将layer的标签提取出来，重新定义样式
                });
                that.parent().parent().remove();
            }
        },function () {

        })
    }
    //展示已绑定到账号的班级和专业部
    _m.fill_classGrade = function (classgrade,posts_bind) {
        if(classgrade){
           for(var i=0;i<classgrade.length;i++){
               if(classgrade[i].identity_id!=0){
                   posts_bind.push(classgrade[i].name+'班主任');
               }
           }
        }
        return posts_bind;
    }
    _m.fill_group = function (majorGroup,posts_bind) {
        if(majorGroup){
            posts_bind.push(majorGroup.name+'专业部负责人');
        }
        return posts_bind;
    }
    //展示已绑定到账号的副班主任
    _m.fill_Vice_classGrade = function (Vice_classgrade,posts_bind) {
        if(Vice_classgrade){
            for(var i=0;i<Vice_classgrade.length;i++){
                if(Vice_classgrade[i].identity_id!=0){
                    posts_bind.push(Vice_classgrade[i].name+'副班主任');
                }
            }
        }
        return posts_bind;
    }
    //我的账户的基本信息
    //班主任查看打分项
    _m.classLook_Record = function (projectid) {

        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>打分项<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>查看打分项</a>",
            type: 2,
            content: "pprojectForStudent_Look_Record.html",
            area: ['100%', '100%'],
            success:function (layero,index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                        //打分项的填充
                        var result=ScoreInformation;
                        body.find('input[name="names"]').val(result.name);
                        //规则
                        var rules= result.rules;
                        var dom='';
                        var objs= body.find('#Del_Add_btnWrap')
                        for(var i=0;i<rules.length;i++){
                            if(rules[i].operation==1){
                                rules[i].value='&nbsp+'+ rules[i].value
                            }else if(rules[i].operation==2){
                                rules[i].value='&nbsp-'+ rules[i].value
                            }
                            if(rules[i].bind_rule_id){
                                dom +='<span class="layui-btn del" data-id="'+rules[i].id+'" data-name="'+rules[i].name+'" data-num="'+rules[i].value+'"><i class="material-icons contact" style="font-size: 16px;left: 10px;opacity: 1;right: auto;" data-id="'+rules[i].id+'">attach_file</i>'+rules[i].name+rules[i].value+'</span>'
                            }else {
                                dom +='<span class="layui-btn del" data-id="'+rules[i].id+'" data-name="'+rules[i].name+'" data-num="'+rules[i].value+'">'+rules[i].name+rules[i].value+'</span>';
                            }
                        }
                        body.find('.btnWrap').prepend(dom);
                        body.find('.btnWrap .contact').unbind('click').bind('click',function (e) {
                            var ids=$(this).attr('data-id');
                            sl_Mask.look_S_RulesForClassgrade(ids);
                        })
                    }

        })

        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function() {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    //新增打分项
    _m.add_Record = function (num,projectid) {
	    var arr = ['新增打分项','编辑打分项'];
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>打分项<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>"+arr[num]+"</a>",
            type: 2,
            content: "pprojectForStudent_Record.html",
            area: ['100%', '100%'],
            success:function (layero,index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                body.find('.title').text(arr[num]);
                if(projectid){
                    body.find('.delBtn').show();
                    body.find('.sumbit').attr('data-projectid',projectid);
                    body.find('.delBtn').attr('data-id',projectid);
                    var params={
                        faid:userId,
                        token:token,
                        projectid:projectid,
                        hierarchy:0
                    }
                    $.axse(urls+'/pproject/getprojecttree.action',params,function(result) {

                               //打分项的填充
                                body.find('input[name="names"]').val(result.data.name);
                               //判断是否为考勤规则
                               if(result.data.punch){
                                   body.find('#judge_roleType').text('check_box').addClass('active').show();
                                   body.find('input[name="punch"]').val(1);
                               }else {
                                   body.find('#judge_roleType').text('check_box_outline_blank').removeClass('active').hide();
                                   body.find('input[name="punch"]').val(0);
                               }

                               //规则
                               var rules= result.data.rules;
                               var dom='';
                               var objs= body.find('#Del_Add_btnWrap');
                               for(var i=0;i<rules.length;i++){
                                   if(rules[i].operation==1){
                                       rules[i].num='+'+rules[i].value;
                                       rules[i].value='&nbsp+'+ rules[i].value;
                                   }else if(rules[i].operation==2){
                                       rules[i].num='-'+rules[i].value;
                                       rules[i].value='&nbsp-'+ rules[i].value
                                   }
                                   //判断核心素养规则是否绑定班级打分规则
                                     if(rules[i].bind_rule_id){
                                       dom +='<span class="layui-btn del connected" data-id="'+rules[i].id+'" data-name="'+rules[i].name+'" data-num="'+rules[i].num+'" data-bind="'+rules[i].bind_rule_id+'"><i class="material-icons contact" style="font-size: 16px;left: 10px;opacity: 1;right: auto;" data-id="'+rules[i].id+'">attach_file</i>'+rules[i].name+rules[i].value+'<i class="material-icons delete"style="font-size: 16px" data-id="'+rules[i].id+'" data-name="'+rules[i].name+'" data-num="'+rules[i].num+'">clear</i></span>';
                                    }else {
                                         dom +='<span class="layui-btn del connected" data-id="'+rules[i].id+'" data-name="'+rules[i].name+'" data-num="'+rules[i].num+'">'+rules[i].name+rules[i].value+'<i class="material-icons delete"style="font-size: 16px" data-id="'+rules[i].id+'" data-name="'+rules[i].name+'" data-num="'+rules[i].num+'">clear</i></span>';
                                     }
                                    }

                               body.find('.btnWrap').prepend(dom);
                               //编辑
                                body.find('.btnWrap span.connected').unbind('click').bind('click',function (e) {
                                   //如果提供了事件对象，则这是一个非IE浏览器
                                   if (e && e.stopPropagation) {
                                       e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
                                   }
                                   else {
                                       window.event.cancelBubble = true;//否则，我们需要使用IE的方式来取消事件冒泡
                                       return false;
                                   }
                               //     self.edit_Record($(this));
                                    sl_Mask.S_RulesForClassgrade($(this));
                                })
                               //删除
                               body.find('.btnWrap .delete').unbind('click').bind('click',function (e) {
                                   //如果提供了事件对象，则这是一个非IE浏览器
                                   if (e && e.stopPropagation) {
                                       e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
                                   }
                                   else {
                                       window.event.cancelBubble = true;//否则，我们需要使用IE的方式来取消事件冒泡
                                       return false;
                                   }
                                   self.del_Record($(this))
                               })

                    },function () {

                    })
                }else{
                    body.find('.sumbit').attr('data-projectid',"");
                    body.find('#judge_roleType').show();
                    body.find('.delBtn').hide();
                }
            },
            cancel: function(index, layero){
                mainPage.all_table();
                $(window).unbind("resize");
            }
        })

        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function() {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    _m.del_Record =function (that) {
        tool().Switched_Roles('images1/del.png','确认要删除么？', function() {
            var dom='';
            var rules={
                id:that.attr('data-id'),
                name:that.attr('data-name'),
                value:that.attr('data-num')
            }
                dom+='<span data-id="'+rules.id+'" data-name="'+rules.name+'" data-num="'+rules.value+'"></span>';

                 that.parent().parent().next().append(dom);
                 that.parent().remove();
        })
    }
    //编辑
    _m.edit_Record = function (that) {
           var id=that.attr('data-id');
           var name=that.attr('data-name');
           var value=that.attr('data-num');
        var index = top.layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['400px', 'auto'],
            content: '<div style="padding:30px 50px 24px;color:#898989;position:relative"class="layui-form major_set">' +
            '<p style="text-align:center;padding-bottom:20px;font-size: 20px;color: #010101; font-weight: bold;">编辑打分项</p>' +
            '<i class="layui-icon layui-icon-close closeBtn NoTip" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;cursor: pointer">&#x1006;</i> ' +
            '<div style="padding:20px 0px 20px">' +

            '<ul >' +
            '<li class="clear" style="line-height:30px;margin-bottom: 15px;"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">描述</label><input class="layui-input rg" type="text"  placeholder="请输入规则描述"style="width:220px;border: none;background: #f3f5f8;" lay-verify="required" name="name" value='+name+'></li>' +
            '<li class="clear" style="line-height:30px;margin-bottom: 15px;"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">分值</label><input class="layui-input rg" type="text"  placeholder="请输入分值"style="width:220px;border: none;background: #f3f5f8;" lay-verify="required" name="num"value='+value+'></li>' +
            '</ul>' +

            '</div>' +
            '<div class="yesTip"style="width:100%;text-align:center;line-height:35px;color:#ffffff;cursor: pointer;background:#2196F3;" lay-filter="formDemo" lay-submit>确定</div>' +

            '</div>',
            success: function (layeor, index) {
                //确定按钮
                top.layui.form.on('submit(formDemo)', function(data){
                    var field=data.field;
                    top.layer.close(index);
                })
                //取消按钮
                $(layeor).find('.NoTip').unbind('click').bind('click',function () {
                    top.layer.close(index);
                })
            }
        })
    }
	//确定按钮
	_m.yesTip = function(title, msg, fn) {
		var index = top.layer.open({
			type: 1,
			title: false,
			closeBtn: 0,
			shadeClose: true,
			area: ['350px', 'auto'],
			content: '<div style="padding:30px 30px 50px;color:#898989;position:relative">' +
				'<p style="text-align:center;padding-bottom:20px;border-bottom:1px solid #f6f6f6; ">' + title + '</p>' +
				'<p style="line-height:40px;padding:20px 10px 20px">' + msg + '</p>' +
				'<div class="yesTip"style="width:100%;text-align:center;line-height:50px;color:#2488fa;position: absolute;left:0;cursor: pointer;background:#f6f6f6;">确定<div>' +
				'</div>',
			success: function(layer, index) {
				$(layer).find('.yesTip').unbind('click').bind('click', function() {
					fn();
					top.layer.close(index);
				})
			}

		})
	}
	//确定    取消  按钮
	_m.yesNOTip = function(title, msg, fn, btn_text1, btn_text2) {
		var btn_text1 = btn_text1 || '取消';
		var btn_text2 = btn_text2 || '确定';
		var index = top.layer.open({
			type: 1,
			title: false,
			closeBtn: 0,
			shadeClose: true,
			area: ['350px', 'auto'],
			content: '<div style="padding:30px 30px 50px;color:#000000;opacity:0.87position:relative">' +
				'<p style="text-align:center;padding-bottom:20px;border-bottom:1px solid #f3f5f8;font-size: 20px;font-weight: bold;color: #010101;position: relative">' + title + '</p>' +
				'<div style="padding:10px 10px 20px">' + msg + '</div>' +
				'<div class="NoTip"style="width:50%;text-align:center;line-height:50px;color:#2488fa;position: absolute;left:0;bottom:0;cursor: pointer;background:#f6f6f6;">' + btn_text1 + '</div>' +
				'<div class="yesTip"style="width:50%;text-align:center;line-height:50px;color:#2488fa;position: absolute;left:50%;bottom:0;cursor: pointer;background:#f6f6f6;">' + btn_text2 + '</div>' +
				'<i style="font-style:normal;position:absolute;left:0;right:0;margin:auto;display:inline-block;width:2px;text-align:center;bottom:15px;font-size:18px;color: #cccccc">|</i>' +
				'</div>',
			success: function(layer, index) {
				$(layer).find('.yesTip').unbind('click').bind('click', function() {
					fn();
					  top.layer.close(index);
				})
                $(layer).find('.NoTip').unbind('click').bind('click', function() {
                    top.layer.close(index);
                })
			}

		})
	}
	//添加岗位
	//确定取消弹框
	//学校出勤个人详情
	_m.enterOut_Record = function() {
		var index = layui.layer.open({
			title:"<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>考勤记录<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>个人考勤记录</a>",
			type: 2,
			content: "enterOut_man.html",
			area: ['100%', '100%']
		})

		window.sessionStorage.setItem("index", index);
		//改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
		$(window).on("resize", function() {
			layui.layer.full(window.sessionStorage.getItem("index"));
		})
	}
    //请假时长的计算
    _m.stay_long = function (s_time,e_time,type) {
       var nTime = (e_time-s_time)/1000;
        var day = Math.floor(nTime/86400);
        var hour = Math.floor(nTime%86400/3600);
        if(type){
            return day +'天';
        }else {
            return day +'天'+hour+'小时';
        }

    }
	//获取班主任请假状态

    //将时间戳改成年/月/日
	_m.get_date=function (tm) {
        if (tm) {
            if(typeof tm =='string'){
                tm = JSON.parse(tm);
            }
            var d = new Date(tm); //根据时间戳生成的时间对象
            var date = (d.getFullYear()) + "-" ;
               if(d.getMonth()<9){
                   date+='0'+(d.getMonth() + 1) + "-";
               }else{
                   date+= (d.getMonth() + 1) + "-";
               }
               if(d.getDate()<10){
                   date+= "0"+d.getDate();
               }else{
                   date+= d.getDate();
               }


            return date;
        }
    }
    /*时间转换*/
    /*时间戳转换*/
//var dateChange = (function() {
//调用方法getSmpFormatDateByLong(数值, true);
//扩展Date的format方法
    Date.prototype.format = function(format) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        }
        if(/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for(var k in o) {
            if(new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    }
    /**
     *转换日期对象为日期字符串
     * @param date 日期对象
     * @param isFull 是否为完整的日期数据,
     * 为true时, 格式如"2000-03-05 01:05:04"
     * 为false时, 格式如 "2000-03-05"
     * @return 符合要求的日期字符串
     */
    _m.getSmpFormatDate=function (date, isFull) {
        var pattern = "";
        if(isFull == true || isFull == undefined) {
            pattern = "yyyy-MM-dd hh:mm:ss";
        } else {
            pattern = "yyyy-MM-dd";
        }
        return self.getFormatDate(date, pattern);
    }
    /**
     *转换日期对象为日期字符串
     * @param timeStamp 时间戳
     * @param type 是否为完整的日期数据,
     * 为 1 时, 格式如"2000-03-05 01:05:04"
     * 为 2 时, 格式如 "2000-03-05"
     * 为 3 时, 格式如 "2000-03-05 01"
     * @return 符合要求的日期字符串
     */
    _m.parseFormatDate=function (timeStamp, type) {
        if(timeStamp) {
            var date = new Date(timeStamp)
            var pattern = "";
            if(type == 1) {
                pattern = "yyyy-MM-dd hh:mm:ss";
            } else if(type == 2) {
                pattern = "yyyy-MM-dd";
            } else if(type == 3) {
                pattern = "yyyy-MM-dd hh时";
            }
            return self.getFormatDate(date, pattern);
        }

    }
    /*转换long值为日期字符串
     * @param l long值
     * @param isFull 是否为完整的日期数据,
     * 为true时, 格式如"2000-03-05 01:05:04"
     * 为false时, 格式如 "2000-03-05"
     * @return 符合要求的日期字符串
     */
    _m.getSmpFormatDateByLong=function (l, isFull) {
        if(l == null) {
            return "";
        } else {
            return self.getSmpFormatDate(new Date(l), isFull);
        }
    }
    /**
     *转换日期对象为日期字符串
     * @param l long值
     * @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
     * @return 符合要求的日期字符串
     */
    _m.getFormatDate=function (date, pattern) {
        if(date == undefined) {
            date = new Date();
        }
        if(pattern == undefined) {
            pattern = "yyyy-MM-dd hh:mm:ss";
        }
        return date.format(pattern);
    }
    /*时间戳转换end*/
    //通过身份证号获取出生年月日
    _m.GetBirthday=function (psidno){
        var birthdayno,birthdaytemp
        if(psidno.length==18){
            birthdayno=psidno.substring(6,14)
        }else if(psidno.length==15){
            birthdaytemp=psidno.substring(6,12)
            birthdayno="19"+birthdaytemp
        }else{
            top.layer.tips("错误的身份证号码，请核对！")
            return false
        }
        var birthday=birthdayno.substring(0,4)+"-"+birthdayno.substring(4,6)+"-"+birthdayno.substring(6,8)
        return birthday
    }
    //编辑页面   专业下拉框的填充
	_m.editMajor = function (obj,groupid,values,lay,fn) {
        if(!groupid){
             $(obj).find("select[name='majorid']").html("<option value=''>选择专业</option>");
             self.clear_Class_Student(obj,lay);
             layui.form.render();
             return;
         }
        var params = {
            faid: userId,
            token: token,
            groupid:groupid
        }
        $.axse(urls+Get_Major, params, function (result) {
                if(result.error){
                    top.layer.msg('<i class="material-icons msgIconStyleFail">cancel</i>'+result.error.message,{
                        skin: 'msgStyle'//skin属性可以将layer的标签提取出来，重新定义样式
                    });
                }else {
                    var data = result.data;
                    if (data && data.length > 0) {
                        var dom="<option value=''>选择专业</option>";
                        for (var i = 0; i < data.length; i++) {
                            dom += '<option value=' + data[i].id + '>' + data[i].name + '</option>'
                        }
                        $(obj).find("select[name='majorid']").html(dom)
                        if(lay){
                            layui.form.render();
                            layui.form.on('select(majorid)', function (majordata) {
                                self.editMajorClass(obj,majordata.value,values,lay,fn);
                                self.clear_Class_Student(obj,lay);
                            })
                        }else {
                            top.layui.form.render();
                            if(values){
                                $(obj).find("select[name='majorid']").val(values);
                            }
                            top.layui.form.render();
                            top.layui.form.on('select(majorid)', function (majordata) {
                                self.editMajorClass(obj,majordata.value,values);
                                self.clear_Class_Student(obj,lay);
                            })
                        }

                    }
                }

        }, function () {

        })
    }
	//编辑页面   专业部下拉框的填充
	_m.editMajorGroup = function (obj,values,lay,fn) {
        var params ={
            faid:userId,
            token:token
        }
        $.axse(urls+Get_MajorGroup,params,function(result){
            var dom="<option value=''>选择专业部</option>";
            var data=result.data;
            if(data&&data.length>0){
                for(var i=0;i<data.length;i++){
                    dom+='<option value="'+data[i].id+'">'+data[i].name+'</option>'
                }
                $(obj).find(".groupid").html(dom);
                if(lay){
                     layui.form.render();
                     layui.form.on('select(groupid)', function (majordata) {
                        self.editMajor(obj,majordata.value,values,lay,fn);
                         self.clear_Class_Student(obj,lay);
                    })
                }else {
                    top.layui.form.render();
                    if(values){
                        $(obj).find("select[name='groupid']").val(values);
                        top.layui.form.render();
                    }
                    top.layui.form.on('select(groupid)', function (majordata) {
                         self.editMajor(obj,majordata.value,values);
                         self.clear_Class_Student(obj,lay);
                    })
                }
            }
        },function () {

        })
    }
	//编辑页面   班级下拉框的填充
	_m.editMajorClass = function (obj,majorid,values,lay,fn) {
        if(!majorid){
            self.clear_Class_Student(obj,lay);
            return;
        };
        var params ={
            faid:userId,
            token:token,
            major_id:majorid,
            size:100
        }
        $.axse(urls+Get_MajorClass,params,function(result){
            var dom="<option value=''>选择班级</option>";
            if(lay) {
                if(lay!=2){
                    layui.formSelects.data('classgaderid', 'local', {
                        arr:[]
                    });
                }else {
                    $(obj).find("select[name='classgaderid']").html('');
                    layui.form.render();
                }

            }else {
                $(obj).find("select[name='classgaderid']").html('');
                layui.form.render();
            }
            var data=result.data.list;
            var arr=[];
            if(data&&data.length>0){
                for(var i=0;i<data.length;i++){
                    dom+='<option value='+data[i].id+'>'+data[i].name+'</option>';
                    arr.push({
                        value:data[i].id,
                        name:data[i].name
                    })
                }
                $(obj).find("select[name='classgaderid']").html(dom);
                // top.layui.form.render();
                if(lay){
                    if(lay==2){
                        layui.form.render();
                        layui.form.on('select(classgaderid)', function (majordata) {
                            fn(majordata.value)
                        })
                    }else {
                        layui.formSelects.data('classgaderid', 'local', {
                            arr: arr
                        });
                        var classArr=[];
                        layui.formSelects.on('classgaderid', function(id, vals, val, isAdd, isDisabled){
                            if(isAdd){
                                classArr.push(val.val);
                            }else {
                                classArr.splice( classArr.indexOf(val.val), 1);
                            }
                            if( $(obj).find("input[name='AllclassId']").length!=0){
                                $(obj).find("input[name='AllclassId']").val(classArr.join('-'));

                            }else {
                                self.getClassStudent(obj,classArr.join('-'));
                            }

                        })
                    }

                    layui.form.render();
                 }else {
                     top.layui.form.render();
                 }
                if(values){
                    $(obj).find("select[name='classgaderid']").val(values);
                }
                top.layui.form.render();
            }
        },function () {

        })
    }
    //清空学生 和 班级
    _m.clear_Class_Student = function (obj,lay) {
        if(lay){
            if(lay==2){
                $(obj).find("select[name='classgaderid']").html('');
            }else {
                layui.formSelects.data('classgaderid', 'local', {
                    arr:[]
                });
                if($(obj).find("select[name='cids']").length>0){
                    layui.formSelects.data('cids', 'local', {
                        arr:[]
                    });
                }
            }
        }else {
            $(obj).find("select[name='classgaderid']").html('');
        }
        top.layui.form.render();
    }
    //通过班级获取学生
    _m.getClassStudent = function (obj,cids) {
        if(!cids){
            return;
        }
        var params={
            faid:userId,
            token:token,
            iids:6,
            cids:cids,
            size:3000
          }
        $.axse(urls+Get_classStudent,params,function(result){
                var accounts = result.data.list.reverse();
                var arr=[];
                for(var i=0;i<accounts.length;i++){
                    var classnum=accounts[i].accountData.identitysData[6].st_classgrade_number||"";
                    arr.push({
                        value:accounts[i].id,
                        name:"<em style='width: 17px;height: 17px;display: inline-block;background: #2196F3;color: #ffffff;vertical-align: middle;margin-right: 10px;font-size: 12px;line-height: 17px;text-align: center;font-style: normal;margin-bottom: 3px'>"+classnum+"</em>"+accounts[i].accountData.rname
                    })
                }
                layui.formSelects.data('cids', 'local', {
                    arr: arr
                });
                var studentArr=[];
                layui.formSelects.on('cids', function(id, vals, val, isAdd, isDisabled){
                    if(isAdd){
                        studentArr.push(val.val);
                    }else {
                        studentArr.splice( studentArr.indexOf(val.val), 1);
                    }
                    $(obj).find("input[name='AllStudent']").val(studentArr.join('-'));
                })
                layui.form.render();

        })
    }
	//编辑页面    民族下拉框的填充
	_m.editnation = function (obj,values) {
        var datas = {
            "data": [{"id": "1", "name": "汉族"}, {"id": "2", "name": "蒙古族"}, {"id": "3", "name": "回族"},
                {"id": "4", "name": "藏族"}, {"id": "5", "name": "维吾尔族"}, {"id": "6", "name": "苗族"},
                {"id": "7", "name": "彝族"}, {"id": "8", "name": "壮族"}, {"id": "9", "name": "布依族"},
                {"id": "10", "name": "朝鲜族"}, {"id": "11", "name": "满族"}, {"id": "12", "name": "侗族"},
                {"id": "13", "name": "瑶族"}, {"id": "14", "name": "白族"}, {"id": "15", "name": "土家族"},
                {"id": "16", "name": "哈尼族"}, {"id": "17", "name": "哈萨克族"}, {"id": "18", "name": "傣族"},
                {"id": "19", "name": "黎族"}, {"id": "20", "name": "傈僳族"}, {"id": "21", "name": "佤族"},
                {"id": "22", "name": "畲族"}, {"id": "23", "name": "高山族"}, {"id": "24", "name": "拉祜族"},
                {"id": "25", "name": "水族"}, {"id": "26", "name": "东乡族"}, {"id": "27", "name": "纳西族"},
                {"id": "28", "name": "景颇族"}, {"id": "29", "name": "柯尔克孜族"}, {"id": "30", "name": "土族"},
                {"id": "31", "name": "达斡尔族"}, {"id": "32", "name": "仫佬族"}, {"id": "33", "name": "羌族"},
                {"id": "34", "name": "布朗族"}, {"id": "35", "name": "撒拉族"}, {"id": "36", "name": "毛难族"},
                {"id": "37", "name": "仡佬族"}, {"id": "38", "name": "锡伯族"}, {"id": "39", "name": "阿昌族"},
                {"id": "40", "name": "普米族"}, {"id": "41", "name": "塔吉克族"}, {"id": "42", "name": "怒族"},
                {"id": "43", "name": "乌孜别克族"}, {"id": "44", "name": "俄罗斯族"}, {"id": "45", "name": "鄂温克族"},
                {"id": "46", "name": "崩龙族"}, {"id": "47", "name": "保安族"}, {"id": "48", "name": "裕固族"},
                {"id": "49", "name": "京族"}, {"id": "50", "name": "塔塔尔族"}, {"id": "51", "name": "独龙族"},
                {"id": "52", "name": "鄂伦春族"}, {"id": "53", "name": "赫哲族"}, {"id": "54", "name": "门巴族"},
                {"id": "55", "name": "珞巴族"}, {"id": "56", "name": "基诺族"}]
        }
        var dom = "";
        var data = datas.data;
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                dom += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
            }
            if(obj){
                $(obj).append(dom)
                top.layui.form.render();
            }
            if(values){
                for(var i=0;i<data.length;i++){
                    if(data[i].id==values){
                        return data[i].name
                    }
                }

            }
        }
    }
    //编辑页面    政治面貌的填充
	_m.partymember = function (obj,values) {
		var data=[{id:1,name:'党员'},{id:2,name:'团员'},{id:0,name:'群众'},{id:3,name:'其他'}];
        var dom = "";
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                dom += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
            }
            if(obj){
                $(obj).append(dom)
                top.layui.form.render();
            }
            if(values){
                for(var i=0;i<data.length;i++){
                    if(data[i].id==values){
                        return data[i].name
                    }
                }
            }
        }
    }
    //编辑页面     学历下拉框的填充
	_m.education = function (obj) {
        var data = [{id: 1, name: '小学'}, {id: 2, name: '初中'}, {id: 3, name: '高中'}, {id: 4, name: '大专'}, {
            id: 5,
            name: '本科'
        }, {id: 6, name: '研究生'}, {id: 7, name: '博士'}];
        var dom = "";
        if (data && data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                dom += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
            }
            $(obj).append(dom)
            top.layui.form.render();
        }
    }
    //给页面上填充学历
    _m.fillEducationTopage = function (index) {
        var data = ['','小学','初中','高中','大专','本科','研究生','博士'];
        if(index){
            var a=data[index];
            return a;
        }
    }
    //编辑页面     寝室学校的填充
    _m.dormotoryForSchool = function (value) {
        var obj={"1":'丁桥校区',"2":"翠苑校区"};
        if(value){
            return obj[value];
        }
    }
    //编辑页面     寝室男、女生寝室的填充
    _m.dormitoryForSex = function (value) {
        var obj={"1":"男生寝室","2":'女生寝室'};
        if(value){
            return obj[value];
        }
    }
    //编辑页面     男女性别的填充
    _m.judge_sex = function (value) {
        var sexArr={"0":'女',"1":"男"};
        var sexName = sexArr[value];
        return sexName;
    }
    //编辑页面     住校情况的填充
    _m.judge_liveStudent = function (value) {
        var wayArr={"1":"住校生","0":"通校生","2":"停住"}
        var wayName = wayArr[value];
        return wayName;
    }
    //编辑页面     是否有效数据的填充
    _m.judge_activeservicestate = function (value) {
        var activeservicestateArr={"1":"有效","0":"无效"};
        var Name = activeservicestateArr[value];
        return Name;
    }
    //编辑页面教师  、 家长账号数据的填充
    _m.judge_activeservicestateForTeacher = function (value) {
        var activeservicestateArr={"1":"在职","0":"不在职"};
        var Name = activeservicestateArr[value];
        return Name;
    }
    //填充表格
    /*
 * 填充表格：（若后台返回是null或者空设定默认值'--'）；
 * option:获取到的data对象；
 * 调用方式：dominit(数据obj)
 * */
//填充表格
	_m.dominit = function (options, par) {
        for(var i in options) {
             // console.log(i+"---------"+options[i]);
            if(typeof options[i] == 'number') options[i] += '' //值为数值类型的装换为字符串
            if(options[i] == "" || options[i] == null) {
                if(par) {
					 par.find('.' + i).text('')
                     par.find('.' + i).val('')
                } else {
                     $('.' + i).text('')
                     $('.' + i).val('')
                }
            } else {
                if(par) {
                    //是否住校
                          if(i=='sex'||i=='way'||i=='activeservicestate'||i=='dormitory'){
                              if(i=='sex'){
                                  par.find('.' + i).text(self.judge_sex(options[i]));
                                  par.find('.' + i).val(self.judge_sex(options[i]));
                              }
                              if(i=='way'){
                                  par.find('.' + i).text(self.judge_liveStudent(options[i]));
                                  par.find('.' + i).val(self.judge_liveStudent(options[i]));
                              }
                              if(i=='activeservicestate'){
                                  par.find('.' + i).text(self.judge_activeservicestate(options[i]));
                                  par.find('.' + i).val(self.judge_activeservicestateForTeacher(options[i]));
                              }
                              if(i=='dormitory'){
                                  if(options[i]){
                                      var schoolName = self.dormotoryForSchool(options[i].dormitory.school_district_id);
                                      var dormitoryName = self.dormitoryForSex(options[i].dormitory.dormitory_type);
                                      par.find('.' + i).text(schoolName+dormitoryName+options[i].dormitory.number) ;
                                      par.find('.' + i).val(schoolName+dormitoryName+options[i].dormitory.number);
                                  }
                              }
                          }else {
                              par.find('.' + i).text(options[i])
                              if(options[i]!='暂无'){
                                  par.find('.' + i).val(options[i])
                              }

                          }
                } else {
					$('.' + i).text(options[i])
                    $('.' + i).val(options[i])
                }

            }
        }

    }
      //基本信息返回接口 对专业和班级字段的的处理
    _m.basicMHandle = function (data,type) {
       if(data&&data.length>0){
           var dom;
           var arr=data;
              switch (type){
                  case 1:
                      if(data[0].identity_id) {
                          dom = arr[0].name
                      }else{
                          dom = arr[arr.length-1].name
                      }
                        break;
                  case 2:
                        if(data[0].identity_id){
                            dom = arr[0].id
                        }else{
                            dom = arr[arr.length-1].id
                        }
                        break;
                  case 3:
                      if(arr[0].group){
                         dom = arr[0].group.id
                        }
                       break;
                  case 4:
                         if(arr[0].group){
                             dom = arr[0].group.name
                         }

                      break
              }
              return dom;
       }


    }

    /*
    * 1 班级打分项列表
    *
    * 2 班级打分项添加
    *
    * 3 班级打分项编辑
    * */
    _m.class_ScoreItemEdit = function (projectid) {
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>班级打分项<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>编辑打分项</a>",
            type: 2,
            content: "pprojectForClassgrade_ScoreItemEdit.html",
            area: ['100%', '100%'],
            success:function (layero,index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                if(projectid){
                    body.find('.sumbit').attr('data-projectid',projectid);
                    body.find('.delBtn').attr('data-project_id',projectid);
                    var params={
                        faid:userId,
                        token:token,
                        project_id:projectid,
                        hierarchy:0
                    }
                    $.axse(urls+'/pprojectForClassgrade/getProject.action',params,function(result) {
                            //打分项的填充
                            body.find('input[name="names"]').val(result.data[0].name);
                            body.find('input[name="value"]').val(result.data[0].value);
                            //规则
                            var rules= result.data[0].rules;
                            var dom='';
                            for(var i=0;i<rules.length;i++){
                                if(rules[i].operation==1){
                                    rules[i].value='&nbsp+'+ rules[i].value
                                }else if(rules[i].operation==2){
                                    rules[i].value='&nbsp-'+ rules[i].value
                                }
                                dom +='<span class="layui-btn del" data-id="'+rules[i].id+'" data-name="'+rules[i].name+'" data-num="'+rules[i].value+'">'+rules[i].name+rules[i].value+'<i class="material-icons dels"style="font-size: 16px" data-id="'+rules[i].id+'" data-name="'+rules[i].name+'" data-num="'+rules[i].value+'">clear</i></span>';
                            }
                            body.find('.btnWrap').prepend(dom);

                            //编辑
                            // body.find('.btnWrap .del').unbind('click').bind('click',function (e) {
                            //     //如果提供了事件对象，则这是一个非IE浏览器
                            //     if (e && e.stopPropagation) {
                            //         e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
                            //     }
                            //     else {
                            //         window.event.cancelBubble = true;//否则，我们需要使用IE的方式来取消事件冒泡
                            //         return false;
                            //     }
                            //    self.edit_Record($(this));
                            // })
                            //删除

                            body.find('.btnWrap .dels').unbind('click').bind('click',function (e) {
                                //如果提供了事件对象，则这是一个非IE浏览器
                                if (e && e.stopPropagation) {
                                    e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
                                }
                                else {
                                    window.event.cancelBubble = true;//否则，我们需要使用IE的方式来取消事件冒泡
                                    return false;
                                }
                                self.del_Record($(this))
                            })

                    },function () {

                    })
                }else{
                    body.find('.sumbit').attr('data-projectid',"");
                }
            },
            cancel: function(layero,index){
                $('#table1').bootstrapTable('refresh');
                $(window).unbind("resize");
            }

        })

        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function() {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    //班级维护树形结构
    _m.class_treeList = function (projectid) {
        sessionStorage.classtree=projectid;
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>班级<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>编辑</a>",
            type: 2,
            content: "pprojectForClassgrade_tree.html",
            area: ['100%', '100%'],
            success:function (layero,index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                sessionStorage.classtree=projectid;
                body.find('.tree').attr('data-projectid',projectid);

            },
            cancel: function( layero,index){
                class_than.all_table();
                $(window).unbind("resize");
            }
        })

        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function() {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    //获取周次
    _m.week = function (superid,fn) {
        var params={
            token:token,
            faid:userId,
            superid:superid
        }
        $.axse(urls+'/time/gettimes.action', params, function (result) {
            var data = result.data;
            var dom = "<option value=''>选择周期</option>";
            for (var i = 0; i < data.length; i++) {
                dom += '<option value=' + data[i].id + ' data-stime='+data[i].stime+' data-etime='+data[i].etime+'>' + data[i].name + '</option>'
            }
            $('select[name="superid"]').html(dom);
            layui.form.render();
            layui.form.on('select(superid)', function (data) {
                if(fn){
                    fn();
                }
            })
        })
    }
    //获取学期填充接口
    _m.termSelect = function (fn) {
        var params = {
            faid: userId,
            token: token,
            superid:0
        };
        $.axse(urls + termList, params, function (result) {
            if (!result.error) {
                var data = result.data;
                var dom = "";
                for (var i = 0; i < data.length; i++) {
                    dom += '<option value=' + data[i].id + ' data-stime='+data[i].stime+' data-etime='+data[i].etime+'>' + data[i].name + '</option>'
                }
                $('select[name="termid"]').html(dom);
                if($('select[name="superid"]').length>0){
                    if(data.length>0){
                        self.week(data[0].id,fn);
                    }
                }
                layui.form.render();
                layui.form.on('select(termid)', function (data) {
                    self.week(data.value,fn);
                    if(fn){
                        fn();
                    }
                })
            }
        })
    }
    //获取班级评比填充接口(考核)
    _m.AssessmentClass=function (fn) {
        var params = {
            faid: userId,
            token: token,
            project_id:0
        };
        $.axse(urls + ClassContents, params, function (result) {
            if (!result.error) {
                var data = result.data;
                var dom = "";
                for (var i = 0; i < data.length; i++) {
                    dom += '<option value=' + data[i].id + '>' + data[i].name + '</option>'
                }
                $('select[name="project_id"]').html(dom);
                layui.form.render();
                layui.form.on('select(project_id)', function (data) {
                    var text=$('select[name="project_id"]').find("option:selected").text()
                    params.project_id = data.value;
                     fn(text);
                })
            }
        })
    }
    //上传图片
    _m.upImg = function (that) {
        var filepath = that.val();
        var extStart = filepath.lastIndexOf(".");
        var ext = filepath.substring(extStart, filepath.length).toUpperCase();
        var fileList = that.get(0).files.length;
        var files = that.get(0).files;
        if(ext != ".BMP" && ext != ".PNG" && ext != ".GIF" && ext != ".JPG" && ext != ".JPEG") { //判断格式不是图片return
                // top.layer.msg("图片限于bmp,png,gif,jpeg,jpg格式");
            // return false;
        } else {

            for(var i = 0; i < files.length; i++) {
                var file = files[i];
                    console.log(file);
                var imgsize = file.size;
                if(imgsize > 1 * 1024 * 1024) {
                    top.layer.msg("图片太大,请重新上传");
                    return;
                }
                var form = new FormData(); //new 一个form对象
                form.append('uploadFile', file); //把上传的文件append到form对象里
                //
                form.name='uploadFile'
                self.upImgajax(that,form,file.name);
            }
        }
    }
    _m.upImgajax=function (that,form) {
         var identityid=sessionStorage.identity_id;
        $.ajax({
            url: urls+'/file/fileUpload.action?token='+token+'&faid='+userId+'&identity_id='+identityid+'&clientType=0',
            type: 'post',
            data: form,
            async: true,
            cache: false,
            processData: false,
            contentType: false,
            success: function(result) {
                if(result.error){
                    top.layer.msg('<i class="material-icons msgIconStyleFail">cancel</i>'+result.error.message,{
                        skin: 'msgStyle'//skin属性可以将layer的标签提取出来，重新定义样式
                    });
                }else {
                    var srcImg = ImgurlHttp+result.data;
                    that.parent().find('img').attr('src',srcImg);
                    that.next().val(result.data);
                    top.layer.msg('<i class="material-icons msgIconStyle">check_circle</i>'+'上传成功',{
                        skin: 'msgStyle',//skin属性可以将layer的标签提取出来，重新定义样式
                    });
                    that.val('');
                }
            },
            error: function(data) {
                sl_Mask.NoTip('服务器内部错误')
            }

        })
    }
    //裁剪图片
    _m.Cutting = function (that) {
         var imgsrc=that.attr('src');
        var index = top.layer.open({
            type:2,
            title:'上传头像',
            skin:'',
            content:"page/cutImage.html",
            shadeClose: false,
            offset: ['10px'],
            area: ['800px','600px'],
            success:function (layero,index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
            }
        })
    }
    //上传文件
    _m.upFile = function (that) {
         var Filename=that.prev();
            var filepath = that.val();
            var extStart = filepath.lastIndexOf(".");
            var ext = filepath.substring(extStart, filepath.length).toUpperCase();
            var fileList = that.get(0).files.length;
            var files = that.get(0).files;
            // if (ext != ".XLS") { //判断格式不是文件return
            //     top.layer.msg("文件限于xls格式");
            //     files[0].name = '';
            //     that.val('');
            //     return false;
            // } else {
                Filename.text(files[0].name);
            // }

    }
    //查看图片
    _m.showImg = function (that) { var url=that.attr('src');
        if(!url){
            return;
        }
        var img = "<img src='" + url + "'  style='max-width: 600px;max-height:580px'/>";
            top.layer.open({
                type: 1,
                shade: false,
                title: false, //不显示标题
                // area: ['10px', 'auto'],
                shade: 0.6, //遮罩透明度
                offset: 'auto',
                area: [img.width + 'px', img.height+'px'],
                content: img, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                cancel: function () {
                    //layer.msg('图片查看结束！', { time: 5000, icon: 6 });
                }
            });
    }
    //获取消息数量的接口
    _m.WorkMessage = function (type) {
        if(sessionStorage.identity_id==1||sessionStorage.identity_id==2){
            return;
        }
        var params={
            token:token,
            faid:userId
        }
        $.axse(urls+'/accountData/getAccountForMe.action', params, function (result) {
                  var MessageCount=result.data.messageCount;
                  if(type){
                      if(MessageCount){
                          parent.$('#MessageCountIcon').show();
                          parent.$('#MessageCount').show().text(MessageCount);
                          parent.$('#MessageCountForIndex').show().text(MessageCount);
                      }else {
                          parent.$('#MessageCountIcon').hide();
                          parent.$('#MessageCount').text('').hide();
                          parent.$('#MessageCountForIndex').text('').hide();
                      }
                  }else {
                      if(MessageCount){
                          $('#MessageCountIcon').show();
                          $('#MessageCount').show().text(MessageCount);
                          $('#MessageCountForIndex').show().text(MessageCount);
                      }else {
                          $('#MessageCountIcon').hide();
                          $('#MessageCount').text('').hide();
                          $('#MessageCountForIndex').text('').hide();
                      }

                  }

        })
    }
    //消息的以读设置
    _m.AlreadyRead = function (message_ids) {
        var params={
            token:token,
            faid:userId,
            message_ids:message_ids
        }
        $.axse(urls+'/message/setReadState.action', params, function (result) {
                 tool().WorkMessage();
        })
    }
    //查看寝室名称
    _m.DormMessage = function (ids) {
        var index = layui.layer.open({
            title: "<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>住宿管理<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>住宿详情</a>",
            type: 2,
            content: "dormitory_Message.html",
            area: ['100%', '100%'],
            success:function (layero,index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();

                body.find('#del').attr('data-id',ids);
                self.DormMessageFill(ids,body);
            },
            cancel: function(index, layero){
                mainPage.all_table();
                $(window).unbind("resize");
            }
        })
        window.sessionStorage.setItem("index", index);
        //改变窗口大小时，重置弹窗的宽高，防止超出可视区域（如F12调出debug的操作）
        $(window).on("resize", function() {
            layui.layer.full(window.sessionStorage.getItem("index"));
        })
    }
    //填充寝室请求处理
    _m.DormMessageFill = function (ids,body) {
        var params={
            token:token,
            faid:userId,
            dormitory_id:ids
        }
        $.axse(urls+oneRoomMessage,params,function(result){
            //填充标题
            var data= result.data;
            var arr={"1":"男生寝室","2":'女生寝室'};
            var accounts=data.accounts;
            var dormitory=arr[data.dormitory_type]+data.number;
            body.find('h3').text(dormitory);
            body.find('.roommate').empty();
            var dom='';
            for(var i=0;i<data.capacity;i++){
                dom+="<li class='lf'><i class='roomNum'>"+(i+1)+"</i><dl>" +
                    "<dt>" +
                    "<span class='addWrap' data-id="+(i+1)+" data-dormitory_id="+ids+"><i class='material-icons add'>add</i></span>" +
                    "</dt>" +
                    "<dd>暂无</dd>" +
                    "</dl>" +
                    "</li>";
            }
            body.find('.roommate').empty();
            body.find('.roommate').append(dom);
            self.fillBindStudent(accounts,body,ids);
            bindStudent().bindAjax(body.find('.roommate .addWrap'),body);
        })
    }
    //填充绑定的寝室的学生
    _m.fillBindStudent = function (accouts,body,ids){
        var dom="";
        if(accouts&&accouts.length>0){
            for(var i=0;i<accouts.length;i++){
                var index=accouts[i].index;
                if(accouts[i].account.photoPath){
                    var src=ImgurlHttp+accouts[i].account.photoPath
                }else {
                    var src='../images1/Photo.png';
                }
                dom="<div class='photo'><div class='imgWrap'><img src='"+src+"' alt=''></div>" +
                    "<em class='close' data-id="+accouts[i].account.id+" data-index="+accouts[i].index+" onclick='bindStudent().removeBind($(this))' data-dormitory_id="+ids+">" +
                    "<i class='material-icons' >cancel</i></em></div>";
                body.find('.roommate li').eq(index-1).find('dt').append(dom);
                body.find('.roommate li').eq(index-1).find('dd').text(accouts[i].account.rname);
            }
        }
    }
    //公用  选择弹框页面  标签里填充多个班级  或者 多个学生
    _m.fill_More_ToPage = function (arr,obj) {
        var dom='';
        if(arr.length==1){
            dom+='<span class="selectedUser">'+arr[0]+'</span>';
        }else {
            dom+='<span class="selectedUser">'+arr[0]+'</span><span class="selectedUser">+'+(arr.length-1)+'</span>';
        }
        obj.html('')
        obj.append(dom);
        //班级批量打分更换班级时候，清空学生
    }
    //清除缓存
    _m.clear_sessionStorage =function () {
        $.cookie(sessionStorage.username+"userIds", null, { path: "/" });
        $.cookie(sessionStorage.username+"tokens", null, { path: "/" });
        sessionStorage.removeItem('positionId');
        window.sessionStorage.removeItem("menu");
        sessionStorage.removeItem('photopath');
        sessionStorage.removeItem('rname');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('identity_id');
        menu = [];
        window.sessionStorage.removeItem("curmenu");
    }
    //把小写变成大写
    _m.NumChange = function (index) {
        var obj={1:'周一', 2:'周二', 3:'周三', 4:'周四', 5:'周五', 6:'周六', 7:'周日'}
        var str = obj[index];
        return str;
    }
    _m.AdaptIEforTime = function (time) {
        if(time){
           var a= new Date(time.replace(/-/g, "/")+' 00:00:00').getTime() ;
           return a;
        }
    }
    //给提交按钮加加载样式
    _m.onClick = function (that) {
        var dom="";
            dom+='<div class="fading-circle\">\n' +
                        "<div class=\"sk-circle1 sk-circle\"></div>\n" +
                        "<div class=\"sk-circle2 sk-circle\"></div>\n" +
                        "<div class=\"sk-circle3 sk-circle\"></div>\n" +
                        "<div class=\"sk-circle4 sk-circle\"></div>\n" +
                        "<div class=\"sk-circle5 sk-circle\"></div>\n" +
                        "<div class=\"sk-circle6 sk-circle\"></div>\n" +
                        "<div class=\"sk-circle7 sk-circle\"></div> \n" +
                        "<div class=\"sk-circle8 sk-circle\"></div>\n" +
                        "<div class=\"sk-circle9 sk-circle\"></div>\n" +
                        "<div class=\"sk-circle10 sk-circle\"></div>\n" +
                        "<div class=\"sk-circle11 sk-circle\"></div>\n" +
                        "<div class=\"sk-circle12 sk-circle\"></div>\n" +
                "</div>"
        that.append(dom);
    }
    return _m;
}

