/*
* 通过
* 1.通过获取消息条数的接口更新个人信息 例如：我的页面
*
* 2.通过账户table列表的缓存拿到某一条的个人信息缓存去填充个人信息 例如：admin权限下的账户列表的基本信息，其他账户的学生列表
*  Information 个人的基本信息
*  obj 要填充数据的对象
* */

function PersonalInformation(Information,obj) {
    this.Information = Information;
    this.obj=obj||null;
}
//重组基本数据结构并返回(主要用于填充文本)
PersonalInformation.prototype.againDesign=function () {
    var data=this.Information;
    //获取基本信息
    var datas={
        rname:data.accountData.rname||"暂无",
        username:data.username||"暂无",
        city:data.accountData.city||"暂无",
        addressS: data.accountData.address,
        address:data.accountData.province+data.accountData.city+data.accountData.county+data.accountData.address||"暂无",
        idcNnmner:data.accountData.idcNnmner||"暂无",
        birthday:tool().get_date(data.accountData.birthday)||"暂无",
        phone:data.accountData.phone||"暂无",
        country:data.accountData.county||"暂无",
        nation:tool().editnation("",data.accountData.nation),            //民族
        partymember:tool().partymember("",data.accountData.partymember),  //政治面貌
        photopath:data.accountData.photopath||"",      //图片
        province:data.accountData.province||"暂无",        //省
        provinceS:data.accountData.province+data.accountData.city||'',
        sex:data.accountData.sex,                  //性别
        virtualphone:data.accountData.virtualphone||"暂无" //虚拟号
    }
    var identitysData = data.accountData.identitysData;
    for(var i in identitysData) {
        var iids = i;
        if (iids == 2||iids == 1) {
            datas.classgrades = tool().basicMHandle(identitysData[iids].classgrades, 1) || "暂无";
            datas.group = tool().basicMHandle(identitysData[iids].majors, 4) || '暂无',                                   datas.majors = tool().basicMHandle(identitysData[iids].majors, 1) || "暂无",                                  datas.activeservicestate = identitysData[iids].activeservice_state,
                datas.education=tool().fillEducationTopage(identitysData[iids].education) //学历
        }
        if (iids == 3 || iids == 4 || iids == 5 || iids == 8 || iids == 9 || iids == 10||iids == 11||iids == 12) {
            datas.familyphone = identitysData[iids].st_family_phone || "暂无";
            datas.classgrades = tool().basicMHandle(identitysData[iids].classgrades, 1) || "暂无";
            datas.identitys = identitysData[iids].identitys || "";
            datas.group = tool().basicMHandle(identitysData[iids].majors, 4) || '暂无',
                datas.majors = tool().basicMHandle(identitysData[iids].majors, 1) || "暂无";
            datas.cardnumber = identitysData[iids].st_card_number || "暂无";
            datas.classgrade_performance = identitysData[iids].st_classgrade_performance || "";
            datas.examination_number = identitysData[iids].st_examination_number || "";
            datas.graduate_schoolname = identitysData[iids].st_graduate_schoolname || "";
            datas.number = identitysData[iids].st_main_number || "";
            datas.performance = identitysData[iids].st_performance || "";
            datas.schoolnumber = identitysData[iids].st_school_number || "暂无";
            datas.way = identitysData[iids].st_way;
            datas.activeservicestate = identitysData[iids].activeservice_state,
                datas.education=tool().fillEducationTopage(identitysData[iids].education) //学历
        }
        if (iids == 6 || iids == 7) {
            datas.familyphone = identitysData[iids].st_family_phone || "暂无";
            datas.classgrades = tool().basicMHandle(identitysData[iids].classgrades, 1) || "暂无";
            datas.identitys = identitysData[iids].identitys || "";
            datas.group = tool().basicMHandle(identitysData[iids].majors, 4) || '暂无',
                datas.majors = tool().basicMHandle(identitysData[iids].majors, 1) || "暂无";
            datas.cardnumber = identitysData[iids].st_card_number || "暂无";
            datas.classgrade_performance = identitysData[iids].st_classgrade_performance || "";
            datas.dormitory = identitysData[iids].dormitory || ""; //住校生寝室
            datas.examination_number = identitysData[iids].st_examination_number || "";
            datas.graduate_schoolname = identitysData[iids].st_graduate_schoolname || "";
            datas.number = identitysData[iids].st_main_number || "";
            datas.performance = identitysData[iids].st_performance || "";
            datas.schoolnumber = identitysData[iids].st_school_number || "暂无";
            datas.way = identitysData[iids].st_way;
            datas.classgradenumber = identitysData[iids].st_classgrade_number,
                datas.st_performance = identitysData[iids].st_performance,
                datas.activeservicestate = identitysData[iids].activeservice_state
        }
    }
    return datas;
}
//把数据填充到页面中
PersonalInformation.prototype.fillpage=function () {
    var datas = this.againDesign();
    switch (datas.sex){
        case 0:
            var colors='#FF4081';
            break;
        case 1:
            var colors='#2196f3';
            break;
        default :
            var colors='#9D9D9D'
    }
        this.obj.find('#sexIcon').css('color',colors)
        tool().dominit(datas,this.obj);
}
//填充头像
PersonalInformation.prototype.fillPhoto=function () {
    var data=this.Information;
    var obj=this.obj;
    if(data.accountData.photopath){
        obj.find('.photopath').attr('src',ImgurlHttp+data.accountData.photopath);
        if(data.id == userId){//如果给自己账号修改头像后，同时更新自己首页的头像
            top.$('#userInfo').find('img').attr('src',ImgurlHttp+data.accountData.photopath);
        }
    }else {
        obj.find('.photopath').attr('src','../images1/header.png');
    }
}
//填充二维码数据
PersonalInformation.prototype.fillCodeData=function () {
    var username = this.Information.username;
    this.obj.find('#codeBtn').attr('data-username',username);
}
//弃用账号时状态的填充
PersonalInformation.prototype.fillremoveData=function () {
    var state = _this.Information.state;
    _obj.find('.school_del').attr('data-state',state);
}
//学生处从学生列表查看学生信息时的填充
PersonalInformation.prototype.ForTeacherToMessage=function () {
    var data=this.againDesign();
    if(data.dormitory) {
        var schoolName = tool().dormotoryForSchool(data.dormitory.dormitory.school_district_id);
        var dormitoryName = tool().dormitoryForSex(data.dormitory.dormitory.dormitory_type);
        var house=schoolName+dormitoryName+data.dormitory.dormitory.number
    }else {
        var house=''
    }
    switch (data.sex){
        case 0:
            var colors='#FF4081';
            break;
        case 1:
            var colors='#2196f3';
            break;
        default :
            var colors='#9D9D9D'
    }
    var dom = "<div style='position: relative;'>"+
        "<h3 class='rname'>"+data.rname+"</h3>" +
        "<i class='material-icons' style='position: absolute;left: 65px;top:0px;font-size: 20px;color:"+colors+"'>person</i>"+
        "<i style='position: absolute;left: 130px;top:0px;font-size: 14px;color: #2196F3;font-style: normal;cursor: pointer;' id='personal_data' data-taid="+this.Information.id+">详细信息</i><i style='position: absolute;left: 220px;top:0px;font-size: 14px;color: #2196F3;font-style: normal;cursor: pointer;' id='codeBtn'>我的二维码</i>"+
        "</div>"+
        "<ul class='clear' style='padding-top: 14px;'>" +
        "<li class='clear lf'><span class='lf'>学号：</span><p class='lf number'>"+data.number+"</p></li>"+
    "<li class='clear  lf'><span class='lf'>一卡通：</span><p class='lf cardnumber'>"+data.cardnumber+"</p> </li>"+
    "<li class='clear  lf'><span class='lf'>是否住校：</span><p class='lf way'>"+tool().judge_liveStudent(data.way)+"</p></li>"+
    "<li class='clear lf'><span class='lf'>专业：</span><p class='lf majors'>"+data.majors+"</p></li>"+
    "<li class='clear lf'><span class='lf'>手机号：</span ><p class='lf phone'>"+data.phone+"</p></li>"+
    "<li class='clear lf'> <span class='lf'>宿舍房间：</span ><p class='lf dormitory'>"+house+"</p></li>"+
    "<li  class='clear lf'><span class='lf'>班级：</span ><p class='lf classgrades'>"+data.classgrades+"</p></li>"+
    "<li class='clear lf'><span class='lf'>手机号（家长）：</span><p class='lf familyphone'>"+data.familyphone+"</p></li>"+
    "<li class='clear lf'><span class='lf '>是否有效：</span><p class='lf activeservicestate'>"+tool().judge_activeservicestate(data.activeservicestate)+"</p></li></ul>"
    return dom;
}
//填充岗位
PersonalInformation.prototype.power = function () {
    var identitysData =  this.Information.accountData.identitysData;//获取权限
    var prarents = this.obj;//填充岗位的父元素
    var postDom ='';
    var postArr =[];
    var posts_bind=[];
    for(var i in identitysData) {
        postArr.push(identitysData[i].posts);
        if (i == 4) {tool().fill_classGrade(identitysData[i].classgrades, posts_bind)}//添加班主任岗位
        if (i == 8) {tool().fill_group(identitysData[i].majorGroup, posts_bind) }//添加专业部岗位
        if (i == 12) {tool().fill_Vice_classGrade(identitysData[i].classgrades, posts_bind)}//添加副班主任岗位
    }
    //编定的班级和专业部
    for(var z=0;z<posts_bind.length;z++){
        postDom+="<li class='lf del'><button class='layui-btn del'>"+posts_bind[z]+"</button></li>"
    }
    //岗位
    if(postArr[0]){
        var posts=postArr[0];
        if(posts.length>0){
            for(var j=0;j<posts.length;j++){
                if(posts[j].id){
                    postDom+="<li class='lf del publicPost'><button class='layui-btn del' >"+posts[j].name+"<i class='material-icons' data-id='"+posts[j].id+"'style='font-size: 16px'>clear</i></button></li>";
                }

            }
        }
    }
        prarents.find('.postParents').prepend(postDom);
        prarents.find('.postParents li.del i').unbind('click').bind('click',function (e) {
            //如果提供了事件对象，则这是一个非IE浏览器
            if (e && e.stopPropagation) {e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
            } else {window.event.cancelBubble = true;//否则，我们需要使用IE的方式来取消事件冒泡
                return false;}
            var that=$(this);
            tool().Switched_Roles('images1/del.png','确定移除此岗位？', function() {
                tool().DelPost(that, this.Information.id, prarents);
            })
        })

}
//填充权限
PersonalInformation.prototype.Post = function () {
    var identitysData =  this.Information.accountData.identitysData;//获取权限
    var prarents = this.obj;//填充的权限父元素
    var dom="";
    for(var i in identitysData) {
        dom+="<li class='lf del'><button class='layui-btn del' >"+identitysData[i].name+"<i class='material-icons' data-id='"+identitysData[i].key+"' style='font-size: 16px'>clear</i></button></li>";
    }
    prarents.find('.powerParents').prepend(dom);
    prarents.find('.powerParents li.del i').unbind('click').bind('click',function (e) {
        //如果提供了事件对象，则这是一个非IE浏览器
        if (e && e.stopPropagation) {e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
        } else {
            window.event.cancelBubble = true;//否则，我们需要使用IE的方式来取消事件冒泡
            return false;
        }
        var that=$(this);
        tool().Switched_Roles('images1/del.png','确定移除此权限？', function() {
            if(prarents.find('.powerParents li.del').length==1){
                sl_Mask.NoTip('权限唯一时不能删除');
            }else {
                tool().Delpower(that,this.Information.id);
            }
        })

    })

}
//编辑界面  管理员和老师的基本信息的填充
PersonalInformation.prototype.fillTeacherMessage = function () {
    var data = this.againDesign();
    switch (data.sex){
        case 0:
            var colors='#FF4081';
            break;
        case 1:
            var colors='#2196f3';
            break;
        default :
            var colors='#9D9D9D'
    }
    var dom = '<li class="clear" style="position: relative;display: inline-block"><span class="lf">姓名：</span><span class="lf rname" style="padding-right: 10px">'+data.rname+'</span><i class="material-icons" style="font-size: 20px;padding-right: 15px;display: inline-block;color:'+colors+'" id="sexIcon">person</i><span style="color: #2196F3;cursor: pointer;vertical-align: top;" id="editBtn">维护</span></li>'+
        '<li class="clear"><span class="lf">账号：</span ><p class="lf username">'+data.username+'</p></li>'+
        '<li class="clear"><span class="lf">出生年月：</span><p class="lf birthday">'+data.birthday+'</p></li>'+
        '<li class="clear"><span class="lf">手机号码：</span ><p class="lf phone">'+data.phone+'</p><span class="lf student_hide" style="margin-left: 20px;">虚拟网号：</span ><p class="lf virtualphone student_hide">'+data.virtualphone+'</p></li>';
    return dom;
}
//编辑界面  学生基本信息的填充
PersonalInformation.prototype.fillStudentMessage = function () {
    var data = this.againDesign();
    switch (data.sex){
        case 0:
            var colors='#FF4081';
            break;
        case 1:
            var colors='#2196f3';
            break;
        default :
            var colors='#9D9D9D'
    }
    var dom = '<li class="clear" style="position: relative;display: inline-block"><span class="lf">姓名：</span><span class="lf rname" style="padding-right: 10px">'+data.rname+'</span><i class="material-icons" style="font-size: 20px;padding-right: 15px;display: inline-block;color:'+colors+'" id="sexIcon">person</i><span style="color: #2196F3;cursor: pointer;vertical-align: top;" id="editBtn">维护</span></li>'+
        '<li class="clear"><span class="lf">账号：</span ><p class="lf username">'+data.username+'</p></li>'+
        '<li class="clear"><span class="lf">出生年月：</span><p class="lf birthday">'+data.birthday+'</p></li>'+
        '<li class="clear"><span class="lf">手机号码：</span ><p class="lf phone">'+data.phone+'</p> <span class="lf student_show familayP" style="margin-left: 20px;">家长号：</span ><p class="lf student_show familyphone">'+data.familyphone+'</p><span class="lf student_show" style="margin-left: 20px;">一卡通号：</span ><p class="lf student_show cardnumber">'+data.cardnumber+'</p><span class="lf student_show" style="margin-left: 20px;">校内学号：</span ><p class="lf student_show schoolnumber">'+data.schoolnumber+'</p></li>'+
        '<li class="clear"><span class="lf">所属专业部：</span><p class="lf group">'+data.group+'</p><span class="lf">所属专业：</span><p class="lf majors">'+data.majors+'</p><span class="lf">所属班级：</span><p class="lf classgrades">'+data.classgrades+'</p></li>'
    return dom;
}
//编辑界面  家长基本信息的填充
PersonalInformation.prototype.fillFamilyMessage = function () {
    var data = this.againDesign();
    switch (data.sex){
        case 0:
            var colors='#FF4081';
            break;
        case 1:
            var colors='#2196f3';
            break;
        default :
            var colors='#9D9D9D'
    }
    var dom = '<li class="clear" style="position: relative;display: inline-block"><span class="lf">姓名：</span><span class="lf rname" style="padding-right: 10px">'+data.rname+'</span><i class="material-icons" style="font-size: 20px;padding-right: 15px;display: inline-block;color:'+colors+'" id="sexIcon">person</i><span style="color: #2196F3;cursor: pointer;vertical-align: top;" id="editBtn">维护</span></li>'+
        '<li class="clear"><span class="lf">账号：</span ><p class="lf username">'+data.username+'</p></li>'+
        '<li class="clear"><span class="lf">出生年月：</span><p class="lf birthday">'+data.birthday+'</p></li>'+
        '<li class="clear"><span class="lf">手机号码：</span ><p class="lf phone">'+data.phone+'</p></li>'
    return dom;
}



//我的个人界面  管理员和老师的基本信息的填充
PersonalInformation.prototype.fillTeacherMessageTosee = function () {
    var data = this.againDesign();
        console.log(data);
    switch (data.sex){
        case 0:
            var colors='#FF4081';
            break;
        case 1:
            var colors='#2196f3';
            break;
        default :
            var colors='#9D9D9D'
    }
    var dom = '<li class="clear" style="position: relative;display: inline-block"><span class="lf">姓名：</span><span class="lf rname" style="padding-right: 15px">'+data.rname+'</span><i class="material-icons" style="font-size: 20px;padding-right: 15px;display: inline-block;color:'+colors+'" id="sexIcon">person</i><span style="color: #2196F3;cursor: pointer;vertical-align: top" id="editBtn">查看</span></li>'+
        '<li class="clear"><span class="lf">账号：</span ><p class="lf username">'+data.username+'</p></li>'+
        '<li class="clear"><span class="lf">出生年月：</span><p class="lf birthday">'+data.birthday+'</p></li>'+
        '<li class="clear"><span class="lf">手机号码：</span ><p class="lf phone">'+data.phone+'</p><span class="lf student_hide" style="margin-left: 20px;">虚拟网号：</span ><p class="lf virtualphone student_hide">'+data.virtualphone+'</p></li>';
    return dom;
}
//我的个人界面  学生基本信息的填充
PersonalInformation.prototype.fillStudentMessageTosee = function () {
    var data = this.againDesign();
    switch (data.sex){
        case 0:
            var colors='#FF4081';
            break;
        case 1:
            var colors='#2196f3';
            break;
        default :
            var colors='#9D9D9D'
    }
    var dom = '<li class="clear" style="position: relative;display: inline-block"><span class="lf">姓名：</span><span class="lf rname" style="padding-right: 15px">'+data.rname+'</span><i class="material-icons" style="font-size: 20px;padding-right: 15px;display: inline-block;color:'+colors+'" id="sexIcon">person</i><span style="color: #2196F3;cursor: pointer;vertical-align: top" id="editBtn">查看</span></li>'+
        '<li class="clear"><span class="lf">账号：</span ><p class="lf username">'+data.username+'</p></li>'+
        '<li class="clear"><span class="lf">出生年月：</span><p class="lf birthday">'+data.birthday+'</p></li>'+
        '<li class="clear"><span class="lf">手机号码：</span ><p class="lf phone">'+data.phone+'</p> <span class="lf student_show familayP" style="margin-left: 20px;">家长号：</span ><p class="lf student_show familyphone">'+data.familyphone+'</p><span class="lf student_show" style="margin-left: 20px;">一卡通号：</span ><p class="lf student_show cardnumber">'+data.cardnumber+'</p><span class="lf student_show" style="margin-left: 20px;">校内学号：</span ><p class="lf student_show schoolnumber">'+data.schoolnumber+'</p></li>'+
        '<li class="clear"><span class="lf">所属专业部：</span><p class="lf group">'+data.group+'</p><span class="lf">所属专业：</span><p class="lf majors">'+data.majors+'</p><span class="lf">所属班级：</span><p class="lf classgrades">'+data.classgrades+'</p></li>'
    return dom;
}
//我的个人信息  家长基本信息的填充
PersonalInformation.prototype.fillFamilyMessageTosee = function () {
    var data = this.againDesign();
    switch (data.sex){
        case 0:
            var colors='#FF4081';
            break;
        case 1:
            var colors='#2196f3';
            break;
        default :
            var colors='#9D9D9D'
    }
    var dom = '<li class="clear" style="position: relative;display: inline-block"><span class="lf">姓名：</span><span class="lf rname" style="padding-right: 15px">'+data.rname+'</span><i class="material-icons" style="font-size: 20px;padding-right: 15px;display: inline-block;color:'+colors+'" id="sexIcon">person</i><span style="color: #2196F3;cursor: pointer;vertical-align: top" id="editBtn">查看</span></li>'+
        '<li class="clear"><span class="lf">账号：</span ><p class="lf username">'+data.username+'</p></li>'+
        '<li class="clear"><span class="lf">出生年月：</span><p class="lf birthday">'+data.birthday+'</p></li>'+
        '<li class="clear"><span class="lf">手机号码：</span ><p class="lf phone">'+data.phone+'</p></li>'
    return dom;
}
//我的个人信息 填充岗位
PersonalInformation.prototype.powerTosee = function () {
    var identitysData =  this.Information.accountData.identitysData;//获取权限
    var prarents = this.obj;//填充岗位的父元素
    var postDom ='';
    var postArr =[];
    var posts_bind=[];
    for(var i in identitysData) {
        postArr.push(identitysData[i].posts);
        if (i == 4) {tool().fill_classGrade(identitysData[i].classgrades, posts_bind)}//添加班主任岗位
        if (i == 8) {tool().fill_group(identitysData[i].majorGroup, posts_bind) }//添加专业部岗位
         if (i == 12) {tool().fill_Vice_classGrade(identitysData[i].classgrades, posts_bind)}//添加副班主任岗位
    }
    //编定的班级和专业部
    for(var z=0;z<posts_bind.length;z++){
        postDom+="<li class='lf del'><button class='layui-btn del'>"+posts_bind[z]+"</button></li>"
    }
    //岗位
    if(postArr[0]){
        var posts=postArr[0];
        if(posts.length>0){
            for(var j=0;j<posts.length;j++){
                if(posts[j].id){
                    postDom+="<li class='lf del publicPost'><button class='layui-btn del' >"+posts[j].name+"</button></li>";
                }
            }
        }
    }
    if(!postDom){
        postDom='<li style="color: #bec2c9">暂无</li>'
    }
    prarents.find('.postParents').prepend(postDom);
}
//我的个人信息 填充权限
PersonalInformation.prototype.PostTosee = function () {
    var identitysData =  this.Information.accountData.identitysData;//获取权限
    var prarents = this.obj;//填充的权限父元素
    var dom="";
    for(var i in identitysData) {
        dom+="<li class='lf del'><button class='layui-btn del' >"+identitysData[i].name+"</button></li>";
    }
    prarents.find('.powerParents').prepend(dom);
}
