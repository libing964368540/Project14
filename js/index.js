var $,tab,dataStr,layer;
layui.config({
	base : "js/lib/"
}).extend({
	"bodyTab" : "bodyTabS"
})
layui.config({
    skin:'layer-ext-myskin'
})

layui.use(['bodyTab','form','element','layer','jquery','laydate','laypage','tree'],function(){
	var form = layui.form,
        laydate = layui.laydate,
		element = layui.element;
		$ = layui.$;
        laypage = layui.laypage;
    	layer = parent.layer === undefined ? layui.layer : top.layer;
    	loadings.init();
		tab = layui.bodyTab({
			openTabNum : "50",  //最大可打开窗口数量
			url : "json/navs.js", //获取菜单json地址
            changeRegresh:true,
            autoRefresh:true,
            changeRegresh:false
		});


    //防止页面后退
    history.pushState(null, null, document.URL);
    window.addEventListener('popstate', function () {
        history.pushState(null, null, document.URL);
    });
        form.verify({
             createname: function(value, item){ //value：表单的值、item：表单的DOM对象
                    var reg=/^[0-9a-zA-Z]*$/g;
                    if(!reg.test(value)){
                         return '账户名格式为字母和数字';
                       }
              }
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
            ,pass: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
            ]

    });
    // var loading=layer.load(2,{ shade: [1, '#f8f8f8']});
    $('#top_tabs').show();
	//通过顶部菜单获取左侧二三级菜单   注：此处只做演示之用，实际开发中通过接口传参的方式获取导航数据
	function getData(json){
        if($("#top_tabs li").length > 1){
            $("#top_tabs li").each(function(){
                if($(this).attr("lay-id") != ''){
                    element.tabDelete("bodyTab",$(this).attr("lay-id")).init();
                    window.sessionStorage.removeItem("menu");
                    menu = [];
                    window.sessionStorage.removeItem("curmenu");
                }
            })
        }
		    dataStr = json;
            tab.render();
            //消息中心
            //我的消息
            if($('#top_tabs').find('li').length==1){
                // $("#navBar").find("li").eq(0).addClass('layui-nav-itemed');
                // $("#navBar").find("li").eq(0).find('dd').eq(0).addClass('layui-this');
                // var url = $("#navBar").find("li").eq(0).find('dd').eq(0).find('a').attr('data-url')
                // $('.clildFrame iframe').attr('src',url);
                // $('#top_tabs').find('cite').text($("#navBar").find("li").eq(0).find('dd').eq(0).find('cite').text())
                if(sessionStorage.identity_id==1||sessionStorage.identity_id==2||sessionStorage.identity_id==13){
                    $('.top_menu .LookMessage').hide();
                }
                if(sessionStorage.identity_id!=6&&sessionStorage.identity_id!=7&&sessionStorage.identity_id!=1&&sessionStorage.identity_id!=2&&sessionStorage.identity_id!=13){
                    $('.clildFrame iframe').attr('src','page/shouye.html');
                    $('#top_tabs').find('cite').text('首页')
                }else {
                    $("#navBar").find("li").eq(0).addClass('layui-nav-itemed');
                    $("#navBar").find("li").eq(0).find('dd').eq(0).addClass('layui-this');
                    var url = $("#navBar").find("li").eq(0).find('dd').eq(0).find('a').attr('data-url')
                    $('.clildFrame iframe').attr('src', url);
                    $('#top_tabs').find('cite').text($("#navBar").find("li").eq(0).find('dd').eq(0).find('cite').text())
                }
                setTimeout(function () {
                    tool().WorkMessage();
                },2000)
            }
	}

	//页面加载时判断左侧菜单是否显示
	//通过顶部菜单获取左侧菜单
	// $(".topLevelMenus li,.mobileTopLevelMenus dd").click(function(){
	// 	if($(this).parents(".mobileTopLevelMenus").length != "0"){
	// 		$(".topLevelMenus li").eq($(this).index()).addClass("layui-this").siblings().removeClass("layui-this");
	// 	}else{
	// 		$(".mobileTopLevelMenus dd").eq($(this).index()).addClass("layui-this").siblings().removeClass("layui-this");
	// 	}
	// 	$(".layui-layout-admin").removeClass("showMenu");
	// 	$("body").addClass("site-mobile");
	// 	getData($(this).data("menu"));
	// 	//渲染顶部窗口
	// 	tab.tabMove();
	// })
    var LeftTopNav = {
	    "1":{"name":"账号管理","dataId":"AccountNumber",icon:"person_pin","dataIdentity":"1"},
        "2":{"name":"账号管理","dataId":"AccountNumber",icon:"person_pin","dataIdentity":"2"},
        "14":{"name":"消息中心","dataId":"news_center",icon:"email","dataIdentity":"14"},
        "15":{"name":"系统设置","dataId":"system_set",icon:"settings","dataIdentity":"15"},
        "3":{"name":"学生处","dataId":"Student_Office",icon:"person_pin","dataIdentity":"3"},
        "4":{"name":"班主任","dataId":"class_master",icon:"recent_actors","dataIdentity":"4"},
        "6":{"name":"学生中心","dataId":"student_center",icon:"school","dataIdentity":"6"},
        "7":{"name":"学生中心","dataId":"family_center",icon:"school","dataIdentity":"7"},
        "5":{"name":"任课教师","dataId":"teacher",icon:"face","dataIdentity":"5"},
        "8":{"name":"专业部","dataId":"group",icon:"folder_shared","dataIdentity":"8"},
        "9":{"name":"团委","dataId":"Youth",icon:"stars","dataIdentity":"9"},
        "10":{"name":"医务室","dataId":"doctor_Office",icon:"local_hospital","dataIdentity":"10"},
        "11":{"name":"实训处","dataId":"Training_Office",icon:"build","dataIdentity":"11"},
        "12":{"name":"副班主任","dataId":"class_master",icon:"person_pin","dataIdentity":"12"},
        "13":{"name":"打分专员","dataId":"ScoreUser",icon:"person_pin","dataIdentity":"13"},
    }

	//隐藏左侧导航
	$(".hideMenu").click(function(){
		if($(".topLevelMenus li.layui-this a").data("url")){
			layer.msg("此栏目状态下左侧菜单不可展开");  //主要为了避免左侧显示的内容与顶部菜单不匹配
			return false;
		}
		$(".layui-layout-admin").toggleClass("showMenu");
		//渲染顶部窗口
		tab.tabMove();
	})

	//通过顶部菜单获取左侧二三级菜单   注：此处只做演示之用，实际开发中通过接口传参的方式获取导航数据
    var photopath = sessionStorage.photopath;
	    if(photopath!='undefined'){
            $('.photopath').attr('src',ImgurlHttp+photopath);
        }

    if(sessionStorage.positionId){
        var positionId = JSON.parse(sessionStorage.positionId);
        if(sessionStorage.rname!="undefined"){
            var rname= sessionStorage.rname;
        }else {
            var rname =sessionStorage.username
        }
    }
   $('.adminName').text(rname);
	var arr=[];
    for(var i in positionId){
    switch (i){
    	    case "1":
                 arr.push(LeftTopNav["1"]);
    		break;
            case "2":
                arr.push(LeftTopNav["2"]);
            	break;
    	    case "3":
              arr.push(LeftTopNav["3"]);
    		break;
            case "4":
                arr.push(LeftTopNav["4"]);
                break;
            case "5":
                arr.push(LeftTopNav["5"]);
                break;
            case "6":
                arr.push(LeftTopNav["6"]);
                break;
            case "7":
                arr.push(LeftTopNav["7"]);
                break;
             case "8":
                 arr.push(LeftTopNav["8"]);
                 break;
             case "9":
                 arr.push(LeftTopNav["9"]);
                 break;
             case "10":
                 arr.push(LeftTopNav["10"]);
                  break;
              case "11":
                  arr.push(LeftTopNav["11"]);
                  break;
              case "12":
                  arr.push(LeftTopNav["12"]);
                  break;
              case "13":
                  arr.push(LeftTopNav["13"]);
            break;
            default:
                break;
    }
    }
    if(positionId){
        sessionStorage.identity_id = arr[0]["dataIdentity"];
    }else {
         // tool().judge_token(function () {
             tool().clear_sessionStorage();
            top.location.href='page/login.html';
        // })
    }

    var dom="";
    var smallDom="";
    for(var i=0;i<arr.length;i++){
        //大屏幕的样式
        dom+='<li class="layui-nav-item" data-menu='+arr[i].dataId+' pc data-identity='+arr[i].dataIdentity+' style="position: relative;padding: 0 30px">' +
            '<a href="javascript:;"><span><i class="material-icons topIocn" style="font-size: 15px;position: absolute;top:18px;left: 8px;">'+arr[i].icon+'</i></span><cite>'+arr[i].name+'</cite></a><s style="position: absolute;width: 100%;height: 5px;bottom: -1px;left:0;z-index: 100; "></s></li>';
        //小屏幕的样式
        smallDom+='<dd class="" data-menu='+arr[i].dataId+' data-identity='+arr[i].dataIdentity+'><a href="javascript:;"><i class="material-icons topIocn" style="font-size: 15px;position: absolute;top:18px;left: 20px;">'+arr[i].icon+'</i><cite>'+arr[i].name+'</cite></a></dd>';
    }
    $(".topLevelMenus").append(dom);
    $(".topLevelMenus_small").append(smallDom);
     $(".topLevelMenus li").eq(0).addClass('layui-this').addClass('active');
    $(".topLevelMenus_small dd").eq(0).addClass('layui-this').addClass('active');
    //生成以及导航并添加事件
    $(".main_body .topLevelMenus li").unbind('click').bind('click',function(){
        var that=$(this);
        var Indexnum=$(this).index()-1;
        if($(this).hasClass('active')){
           return;
        }
        $(".topLevelMenus li.layui-nav-item").removeClass("layui-this");
        $(".topLevelMenus li.layui-this").removeClass("layui-this");
        tool().Switched_Roles('images1/repeat.png','切换权限将关闭之前角色的页面',function () {
            $(".topLevelMenus li").removeClass('active');
            $(".topLevelMenus li").eq(Indexnum).addClass("active");
            $(".main_body .topLevelMenus_small dd").removeClass('active');
            $(".main_body .topLevelMenus_small dd").eq(Indexnum).addClass("active");
            $(".layui-layout-admin").removeClass("showMenu");
            $('.layui-layout-admin .layui-side ul').empty();
            sessionStorage.identity_id = that.attr("data-identity");
            getData(navDate[that.attr("data-menu")]);
          //  渲染顶部窗口
            tab.tabMove();
        })
    })
    //生成小屏幕导航并添加事件
    $(".main_body .topLevelMenus_small dd").unbind('click').bind('click',function(){
        var that=$(this);
        var Indexnum=$(this).index();
        console.log(Indexnum);
        if($(this).hasClass('active')){
            return;
        }
        $(".topLevelMenus_small dd.layui-this").removeClass("layui-this");
        tool().Switched_Roles('images1/repeat.png','切换权限将关闭之前角色的页面',function () {
            $(".main_body .topLevelMenus_small dd").removeClass('active');
            $(".main_body .topLevelMenus_small dd").eq(Indexnum).addClass("active");
            $(".topLevelMenus li").removeClass('active');
            $(".topLevelMenus li").eq(Indexnum).addClass("active");
            $(".layui-layout-admin").removeClass("showMenu");
            $('.layui-layout-admin .layui-side ul').empty();
            sessionStorage.identity_id = that.attr("data-identity");
            getData(navDate[that.attr("data-menu")]);
            //  渲染顶部窗口
            tab.tabMove();
        })
    })
     getData(navDate[arr[0].dataId]);
    // setTimeout(function () {
    //     layer.close(loading);
    //     $('.layui-layout-admin .layui-header').css('opacity',1);
    //
    // },1000);


	//手机设备的简单适配
    $('.site-tree-mobile').on('click', function(){
		$('body').addClass('site-mobile');
	});
    $('.site-mobile-shade').on('click', function(){
		$('body').removeClass('site-mobile');
	});

	// 添加新窗口
	$("body").on("click",".layui-nav .layui-nav-item a:not('.mobileTopLevelMenus .layui-nav-item a')",function(){
		//如果不存在子级
		if($(this).siblings().length == 0){
			addTab($(this));
			$('body').removeClass('site-mobile');  //移动端点击菜单关闭菜单层
		}
		$(this).parent("li").siblings().removeClass("layui-nav-itemed");
	})

	//清除缓存
	$(".clearCache").click(function(){
		window.sessionStorage.clear();
        window.localStorage.clear();
        var index = layer.msg('清除缓存中，请稍候',{icon: 16,time:false,shade:0.8});
        setTimeout(function(){
            layer.close(index);
            layer.msg("缓存清除成功！");
        },1000);
    })

	//刷新后还原打开的窗口
    if(cacheStr == "true") {
        if (window.sessionStorage.getItem("menu") != null) {
            menu = JSON.parse(window.sessionStorage.getItem("menu"));
            curmenu = window.sessionStorage.getItem("curmenu");
            var openTitle = '';
            for (var i = 0; i < menu.length; i++) {
                openTitle = '';
                if (menu[i].icon) {
                    if (menu[i].icon.split("-")[0] == 'icon') {
                        openTitle += '<i class="seraph ' + menu[i].icon + '"></i>';
                    } else {
                        openTitle += '<i class="layui-icon">' + menu[i].icon + '</i>';
                    }
                }
                openTitle += '<cite>' + menu[i].title + '</cite>';
                openTitle += '<i class="layui-icon layui-unselect layui-tab-close" data-id="' + menu[i].layId + '">&#x1006;</i>';
                element.tabAdd("bodyTab", {
                    title: openTitle,
                    content: "<iframe src='" + menu[i].href + "' data-id='" + menu[i].layId + "'></frame>",
                    id: menu[i].layId
                })
                //定位到刷新前的窗口
                if (curmenu != "undefined") {
                    if (curmenu == '' || curmenu == "null") {  //定位到后台首页
                        element.tabChange("bodyTab", '');
                    } else if (JSON.parse(curmenu).title == menu[i].title) {  //定位到刷新前的页面
                        element.tabChange("bodyTab", menu[i].layId);
                    }
                } else {
                    element.tabChange("bodyTab", menu[menu.length - 1].layId);
                }
            }
            //渲染顶部窗口
            tab.tabMove();
        }
    }else{
		window.sessionStorage.removeItem("menu");
		window.sessionStorage.removeItem("curmenu");
	}
})

//打开新窗口
function addTab(_this){
	tab.tabAdd(_this);
}
//注销账户
/*
 * 退出登录：适用于页面头部的退出按钮
 * 调用方式：点击退出时调用login_out()
 *
 * */
function login_out(tip) {
    var tips = tip||'确定登出此账户？';
    tool().Switched_Roles('images1/out.png',tips, function() {
        var loadings= top.layui.layer.load(2);
        var params = {
            faid:userId,
            token: token
        };
        $.axse(urls + "/account/out.action", params, function(result) {
            top.layui.layer.close(loadings);
              if(result.error){
                  layer.msg('<i class="material-icons msgIconStyleFail">cancel</i>'+result.error.message,{
                      skin: 'msgStyle',//skin属性可以将layer的标签提取出来，重新定义样式
                  });
              }else {
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
                  location.href='page/login.html'
              }
        },function () {
            top.layui.layer.close(loadings);
            tool().judge_token(function () {
                tool().clear_sessionStorage();
                top.location.href=loginSrc;
            })
        })
    })
}
window.onload=function (event){
    // alert("===onbeforeunload===");
    if(event.clientX>document.body.clientWidth && event.clientY < 0 || event.altKey) {
        // alert("你关闭了浏览器");
    }else{
        // alert("你正在刷新页面");
        sessionStorage.sl_userIsLogin=true;
        }
}
/*查看消息*/
function LookMessage() {
    $('.LookMessage').unbind('click').bind('click',function () {
        var title=$(this).attr('data-title');
        $(this).find('cite').text(title)
        var that=$(this);
        top.tab.tabAdd(that);
    })
}
LookMessage();

// 检测用户活跃情况
function isActive() {
    // result 表示当前页面可能是index或者注册页面
    // 不是index页面 ，不是注册页面才会去检测用户的活跃状态（鼠标移动状态）
        var lastTime = new Date().getTime();
        var currentTime = new Date().getTime();
        //设置超时时间： 10分
        var timeOut = 45 * 60 * 1000;

        window.onload = function() {
            /* 检测鼠标移动事件 */
            document.addEventListener('mousemove', function() {
                // 更新最后的操作时间
                // console.log('鼠标移动了')
                lastTime = new Date().getTime();
            })
        }

        /* 定时器  间隔1分钟，检测是否长时间未操作页面  */
        var quitTime = window.setInterval(testTime, 60000);

        // 超时函数
        function testTime() {
            //更新当前时间
            currentTime = new Date().getTime();
            console.log('currentTime', currentTime)
            //判断是否超时
            if (currentTime - lastTime > timeOut) {
                login_out('登录超时，请重新登录')
                // 清除掉定时器
                window.clearInterval(quitTime)
            }
        }

}

isActive()





