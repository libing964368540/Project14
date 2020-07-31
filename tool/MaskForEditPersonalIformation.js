//教职工
var dom_message ="<form class='publicMsg layui-form'>"+
    "<div class='title clear'>"+
    "<p class='lf' style='color: #010101;font-weight: bold;'>基本信息（账号：<i class='username' style='font-style:normal;font-weight: normal'></i>）</p>"+
    "<div class='rg'>"+
    "<span class='yesBtn layui-layer-btn0' lay-filter='formDemo' lay-submit>确认添加</span>"+
    "<span class='NoBtn layui-layer-btn1' style='padding-right: 0'>取消</span>"+
    "</div>"+
    "</div>"+
    "<div>"+
    "<ul class='clear'style='padding-top:15px;'>"+
    "<li class='photoWrap lf'style='position: relative;' >" +
    "<img src='images1/Photo.png' class='photopath'onclick='tool().Cutting($(this));'>"+
    "<input type='hidden' name='photopath'></li>"+
    "<li class='rg sexWrap clear' style='width:670px'><input class='lf magright10 rname' type='text' name='rname' class='magright10'style='width:200px' name='rname'placeholder='输入姓名'><select class='magright10 sex' name='sex'><option value=''>选择性别</option><option value='0'>女</option><option value='1'>男</option></select><input type='text' placeholder='请选择出生年月' style='width: 200px;margin-left: 25px' name='birthday' id='birthday' readonly class='birthday'></li>"+
    "<li class='rg' style='width:650px'><input type='text' placeholder='请在此输入证件号' style='width:100%' name='idcnumber' class='idcnumber'></li>"+
    "</ul>"+
    "<div class='title clear' style='border: none'>"+
    "<p class='lf'>联系方式</p>"+
    "</div>"+
    "<ul class >"+
    "<li style='width:670px'><input type='number' placeholder='输入手机号' style='width: 187px;margin-right: 25px' name='phone' class='phone'><input type='number' placeholder='输入虚拟网号' style='width: 187px;' name='virtualphone' class='virtualphone'></li>"+
    "<li class='clear line'style='width:675px'><select class='magright10 province'name='province' lay-filter='province'  name='province'><option value=''>请选择省份</option></select><select lay-filter='city' name='city' class='city'><option value=''>请选择市县</option></select><select name='county' lay-filter='county' class='county'><option value=''>请选择区县</option></select></li>"+
    "<li style='width:615px'><input type='text' placeholder='输入详细地址' style='width: 100%;' name='addres' class='address'></li>"+
    "</ul>"+

    "<div class='title clear' style='border: none'>"+
    "<p class='lf'>其他信息</p>"+
    "</div>"+
    "<div style='width: 100%;'>"+
    "<ul style='width: 920px'>"+
    "<li class='line clear'style='width:100%;position: relative'><select name='nation' class='nation'><option value=''>选择民族</option></select><select name='partymember' class='partymember'><option value=''>选择政治面貌</option></select><select name='education' class='education'><option value=''>选择学历</option></select><select name='activeservice_state' class='activeservice_state'><option value='1'>在职</option><option value='2'>不在职</option></select></li>"+
    "</ul>"+
    "</div>"+
    "</div>"+
    "</form>";
//学生
var dom_message_student ="<form class='publicMsg layui-form'style='padding-bottom: 0'>"+
    "<div class='title clear'>"+
    "<p class='lf'  style='color: #010101;font-weight:bold;'>基本信息（账号：<i class='username'style='font-style:normal;font-weight:normal;'></i>）</p>"+
    "<div class='rg'>"+
    "<span class='yesBtn layui-layer-btn0' lay-filter='formDemo' lay-submit>确认添加</span>"+
    "<span class='NoBtn layui-layer-btn1'style='padding-right:0;'>取消</span>"+
    "</div>"+
    "</div>"+
    "<div style='padding-top: 10px'>"+
    "<ul class='clear'>"+
    "<li class='photoWrap lf'style='position: relative;'>" +
    "<img src='' class='photopath' onclick='tool().Cutting($(this));'>"+
    "<input type='hidden' name='photopath'></li>"+
    "<li class='rg sexWrap clear' style='width:670px'><input class='lf magright10 rname' type='text' name='rname' class='magright10'style='width:200px' name='rname'placeholder='请输入姓名'><select class='magright10 sex' lay-filter='sex' name='sex'><option value=''>请选择性别</option><option value='0'>女</option><option value='1'>男</option></select><input type='text' placeholder='请选择出生年月' style='width: 200px;margin-left: 25px' name='birthday' id='birthday' readonly class='birthday'></li>"+
    "<li class='rg' style='width:650px'><input type='text' placeholder='请在此输入证件号' style='width:100%' name='idcnumber' class='idcnumber'></li>"+
    "<li class='rg'style='width:675px'><select class='groupid' lay-filter='groupid' name='groupid'><option value=''>请选择所属专业部</option></select><select name='majorid' class='majorid' lay-filter='majorid'><option value=''>选择所属专业</option></select><select name='classgaderid' class='classgaderid' lay-filter='classgaderid'><option value=''>选择所属班级</option></select></li>"+
    "</ul>"+
    "<ul>"+
    "<li class='clear'><input type='number' placeholder='一卡通' style='width: 187px;margin-right: 25px' name='cardnumber' class='cardnumber'><input type='number' placeholder='学籍号' style='width: 187px;margin-right: 25px' name='number' class='number'><input type='number' placeholder='校内学号' class='schoolnumber'style='width: 187px;' name='schoolnumber'><input type='number' placeholder='班内学号' style='width: 187px;' class='rg classgradenumber' name='classgradenumber'></li>"+
    "</ul>"+
    "<div class='title clear' style='border: none'>"+
    "<p class='lf'>联系方式</p>"+
    "</div>"+
    "<ul>"+
    "<li><input type='number' placeholder='输入手机号' style='width: 187px;margin-right: 25px' name='phone'class='phone'><input type='number' placeholder='输入虚拟网号' style='width: 187px;margin-right: 25px' name='virtualphone'class='virtualphone'><input type='number' placeholder='家长手机号' style='width: 187px;' name='familyphone' class='familyphone'></li>"+
    // "<li class='clear line'style='width:670px'><select class='magright10 province'name='province' lay-filter='province'  name='province'><option value=''>请选择省份</option></select><select name='city' lay-filter='city' class='city'><option value=''>请选择市县</option></select><select name='county' lay-filter='county' class='county'><option value=''>请选择区县</option></select></li>"+
    // "<li style='width:615px'><input type='text' placeholder='输入详细地址' style='width: 100%;'name='addres' class='address'></li>"+
    "</ul>"+

    "<div class='title clear' style='border: none'>"+
    "<p class='lf'>其他信息</p>"+
    "</div>"+
    "<div style='width: 100%;'>"+
    "<ul style='width: 920px'>"+
    "<li class='line clear other'style='width:100%;position: relative'>" +
    "<select name='nation'class='nation'><option value=''>选择民族</option></select>" +
    // "<select class='partymember' name='partymember'><option value=''>选择政治面貌</option></select>" +
    // "<input type='text' placeholder='毕业学校' class='lf graduateschool'style='width: 187px;margin-right: 25px' name='graduateschool'>" +
    "<select class='activeservicestate' name='activeservicestate'><option value=1>有效</option><option value=2>无效</option></select><select name='way' class='way' disabled><option value=''>是否住校</option><option value=0>通校生</option><option value=1>住校生</option><option value=2>停住</option></select><input type='text' style='width: 187px;' class='dormitory' disabled placeholder='寝室'></li>"+

    "</ul>"+
    "</div>"+
    "</div>"+
    "</form>";
//家长
var dom_message_family ="<form class='publicMsg layui-form'style='padding-bottom: 20px'>"+
    "<div class='title clear'>"+
    "<p class='lf'  style='color: #010101;font-weight:bold;'>基本信息（账号：<i class='username'style='font-style:normal;font-weight:normal;'></i>）</p>"+
    "<div class='rg'>"+
    "<span class='yesBtn layui-layer-btn0' lay-filter='formDemo' lay-submit>确认添加</span>"+
    "<span class='NoBtn layui-layer-btn1'style='padding-right:0;'>取消</span>"+
    "</div>"+
    "</div>"+
    "<div style='padding-top: 10px'>"+
    "<ul class='clear'>"+
    "<li class='photoWrap lf'style='position: relative;'>" +
    "<img src='' class='photopath' onclick='tool().Cutting($(this));'>"+
    "<input type='hidden' name='photopath'></li>"+
    "<li class='rg sexWrap clear' style='width:670px'><input class='lf magright10 rname' type='text' name='rname' class='magright10'style='width:200px' name='rname'placeholder='请输入姓名'><select class='magright10 sex' lay-filter='sex' name='sex'><option value=''>请选择性别</option><option value='0'>女</option><option value='1'>男</option></select><input type='text' placeholder='请选择出生年月' style='width: 200px;margin-left: 25px' name='birthday' id='birthday' readonly class='birthday'></li>"+
    "<li class='rg' style='width:650px'><input type='text' placeholder='请在此输入证件号' style='width:100%' name='idcnumber' class='idcnumber'></li>"+

    "</ul>"+
    "<div class='title clear' style='border: none'>"+
    "<p class='lf'>联系方式</p>"+
    "</div>"+
    "<ul>"+
    "<li><input type='number' placeholder='输入手机号' style='width: 187px;margin-right: 25px' name='phone'class='phone'></li>"+
    "<li class='clear line'style='width:670px'><select class='magright10 province'name='province' lay-filter='province'  name='province'><option value=''>请选择省份</option></select><select name='city' lay-filter='city' class='city'><option value=''>请选择市县</option></select><select name='county' lay-filter='county' class='county'><option value=''>请选择区县</option></select></li>"+
    "<li style='width:615px'><input type='text' placeholder='输入详细地址' style='width: 100%;'name='addres' class='address'></li>"+
    "</ul>"+
    "</div>"+
    "</form>";
/*
弹框
* 此函数为修改所有账户基本信息的功能
*  obj  指定的obj对象
*  Information  渲染的数据集合
* */
var arr=[dom_message,dom_message,dom_message_student,dom_message_family];
function EditAllUserInformation(obj,Information) {
     var oBox = obj;
     this.oBox = obj;
     this.Information=Information;
     var _this= this;
    oBox.unbind('click').bind('click', function () {
         _this.taid=this.getAttribute('data-taid');
         _this.editNumber =parseInt($(this).attr('data-num')) ;
         _this.Mask();
     })
}
EditAllUserInformation.prototype.Mask = function() {
    var _this = this;
    var index = top.layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        skin: '',
        content:arr[ _this.editNumber],
        shadeClose: false,
        offset: ['10px'],
        area: ['910px', 'auto'],
        success: function (layero, index) {
            $(layero).find('.layui-layer-content').css('height','auto');
            //出生日期的选择
            var NoWDATE = new Date();
            top.layui.laydate.render({
                elem: '#birthday', //指定元素
                max:"NoWDATE"
            });
            //专业部的填充
            // tool().editMajorGroup($(layero));
            //民族的填充
            tool().editnation($(layero).find('select[name="nation"]'));
            //政治面貌的填充
            tool().partymember($(layero).find('select[name="partymember"]'));
            //学历
            tool().education($(layero).find('select[name="education"]'));
            //省市区填充
            _this.loadProvince($(layero));
            top.layui.form.render();
            _this.editBasicMessage($(layero));
            top.layui.form.on('submit(formDemo)', function(data){//提交数据
                _this.revise(data.field,_this.Information.id,index);
            });
            //身份证和出生年月的联动效果
            //取消
            $(layero).find('.NoBtn').unbind('click').bind('click',function(){
                top.layer.close(index);
            })
        }
    })
}
//修改基本信息
EditAllUserInformation.prototype.revise = function (param,taid,index) {
    var _this=this;
    var parents=this.oBox.parent().parent().parent().parent();
    var params = {};
    var modifyUSE = JSON.parse(window.modifyUSE);
    var CanNotEmpty = ['rname','sex','birthday','idcnumber','groupid','majorid','classgaderid','cardnumber','number','schoolnumber','classgradenumber','nation','partymember','graduateschool'] //指定的字段不可清空
    var CanNotEmptyName = ['姓名','性别','出生年月','身份证号','专业部','专业','班级','一卡通','学籍号','校内学号','班内学号','民族','政治面貌','毕业院校'];
    var chooseArr = [];
    for(var i in param){
        /*专业部 、 专业 、班级需同时都有值*/
        if(i=='groupid'||i=='majorid'){if(!param['classgaderid']){continue}}
        if(param[i]!= modifyUSE[i]) {
            if(CanNotEmpty.indexOf(i)!=-1&&!param[i]){
                chooseArr.push(CanNotEmptyName[CanNotEmpty.indexOf(i)]);
                continue;
            }
            // if(param[i]){
            if (i == 'birthday') {
                if (param[i]) {
                    params.birthday = new Date(param[i]).getTime();
                }else{
                    params.birthday = '';
                }
            } else {
                if(i=='phone'){if(param[i]&&param[i].length!==11){sl_Mask.NoTip('请输入正确的手机号');return;}}//手机号
                if(i=='familyphone'){if(param[i]&&param[i].length!==11){sl_Mask.NoTip('请输入正确的手机号');return;}}//家长手机号
                params[i] = param[i];
            }
            // }
        }else {
            if(param[i]==""&& modifyUSE[i]===0){
               if(i!=='sex'){
                   params[i] = param[i];
               }else {
                   chooseArr.push('性别')
               }

            }
        }
    }
    if($.isEmptyObject(params)){
        if(chooseArr.length>0){
            top.layer.msg('<i class="material-icons msgIconStyleFail">cancel</i>'+chooseArr[0]+'不可清空',{
                skin: 'msgStyle',//skin属性可以将layer的标签提取出来，重新定义样式
            });
        }else {
            top.layer.msg('<i class="material-icons msgIconStyleFail">cancel</i>请修改内容后再提交',{
                skin: 'msgStyle',//skin属性可以将layer的标签提取出来，重新定义样式
            });
            // sl_Mask.NoTip('请修改内容后再提交');
        }
        return;
    }
    params.token=token
    params.faid=userId
    params.taid=taid
    // console.log(params);
    $.axse(urls+ modifyStudentMessage,params,function(result){
        sl_Mask.YesTip('修改成功');
        _this.Information = result.data;
        var studentInformation = new PersonalInformation(result.data,parents);
        studentInformation.fillPhoto();//填充头像
        studentInformation.fillpage();
        
        top.layer.close(index);
    },function () {

    })

}
//省市区表单渲染
EditAllUserInformation.prototype.loadProvince = function($form) {
    var _this=this;
    var proHtml = ''
    $.get("../json/address.js", function (data) {
        var data=JSON.parse(data);
        for (var i = 0; i < data.length; i++) {
            proHtml += '<option   value="' + data[i].name + '">' + data[i].name + '</option>';
        }
        //初始化省数据
        $form.find("select[name='province']").append(proHtml);
        top.layui.form.render();
        top.layui.form.on('select(province)', function (proData) {

            $form.find("select[name=county]").html('<option value="">请选择县/区</option>');
            var value = proData.value;
            if (value) {
                _this.loadCity($form,data[$(this).index() - 1].childs);
            } else {
                $form.find("select[name=city]").attr("disabled", "disabled");
            }
        });
    })
}
//加载市数据
EditAllUserInformation.prototype.loadCity=function ($form,citys,values) {
    var _this=this;
    var cityHtml = '<option value="">请选择市</option>'
    for (var i = 0; i < citys.length; i++) {
        cityHtml += '<option value="' + citys[i].name + '">' + citys[i].name + '</option>';
    }
    $form.find("select[name=city]").html(cityHtml).removeAttr("disabled");
    top.layui.form.render();
    if(values){
        $form.find("select[name=city]").val(values);
    }
    top.layui.form.render();
    top.layui.form.on('select(city)', function (cityData) {
        var value = cityData.value;
        if (value) {
            _this.loadArea($form,citys[$(this).index() - 1].childs);
        } else {
            $form.find("select[name=county]").attr("disabled", "disabled");
        }
    });
}
//加载县/区数据
EditAllUserInformation.prototype.loadArea=function ($form,areas,values) {
    var areaHtml = '<option value="">请选择县/区</option>';
    for (var i = 0; i < areas.length; i++) {
        areaHtml += '<option value="' + areas[i].name + '">' + areas[i].name + '</option>';
    }
    $form.find("select[name=county]").html(areaHtml).removeAttr("disabled");
    top.layui.form.render();
    if(values){
        $form.find("select[name=county]").val(values);
    }
    top.layui.form.render();
}
//加载基本信息
EditAllUserInformation.prototype.editBasicMessage = function (obj) {

    var num= this.oBox.attr('data-num');
    var data = this.Information;
    //获取基本信息
    var datas={
        rname:data.accountData.rname||"",
        username:data.username||"",
        city:data.accountData.city||"",
        address:data.accountData.address||"",
        idcnumber:data.accountData.idcNnmner||"",
        birthday:tool().get_date(data.accountData.birthday)||"",
        phone:data.accountData.phone||"",
        country:data.accountData.county||"",
        nation:data.accountData.nation||"",            //民族
        partymember:data.accountData.partymember||"",  //政治面貌
        photopath:data.accountData.photopath||"",      //图片
        province:data.accountData.province||"",        //省
        sex:data.accountData.sex==null?"":data.accountData.sex,                  //性别
        virtualphone:data.accountData.virtualphone||"" //虚拟号
    }
    var identitysData = data.accountData.identitysData;

    for(var i in identitysData) {
        var iids = i;
        if (iids == 2||iids == 1) {
            datas.classgrades = tool().basicMHandle(identitysData[iids].classgrades, 2) || "";
            datas.majors = tool().basicMHandle(identitysData[iids].majors, 2) || "";
            datas.group = tool().basicMHandle(identitysData[iids].majors, 3) || '';
            datas.education = identitysData[iids].education || "";
            datas.activeservice_state = identitysData[iids].activeservice_state
        }
        if (iids == 3 || iids == 4 || iids == 5||iids == 8 || iids == 9 || iids == 10 ||iids == 11 ||iids == 12) {
            datas.familyphone = identitysData[iids].st_family_phone || "";
            datas.classgrades = tool().basicMHandle(identitysData[iids].classgrades, 2) || "";
            datas.identitys = identitysData[iids].identitys || "";
            datas.group = tool().basicMHandle(identitysData[iids].majors, 3) || '',
                datas.majors = tool().basicMHandle(identitysData[iids].majors, 2) || "";
            datas.cardnumber = identitysData[iids].st_card_number || "";
            datas.classgrade_performance = identitysData[iids].st_classgrade_performance || "";
            // datas.dormitory = identitysData[iids].dormitory || ""; //住校生寝室
            datas.education = identitysData[iids].education || "";
            datas.graduate_schoolname = identitysData[iids].st_graduate_schoolname || "";
            datas.number = identitysData[iids].st_main_number || "";
            datas.performance = identitysData[iids].st_performance || "";
            datas.schoolnumber = identitysData[iids].st_school_number || "";
            datas.way = identitysData[iids].st_way || "";
            datas.activeservice_state = identitysData[iids].activeservice_state
        }
        if (iids == 6 || iids == 7) {
            datas.familyphone = identitysData[iids].st_family_phone || "";
            datas.classgrades = tool().basicMHandle(identitysData[iids].classgrades, 2) || "";
            datas.identitys = identitysData[iids].identitys || "";
            datas.group = tool().basicMHandle(identitysData[iids].majors, 3) || '',
                datas.majors = tool().basicMHandle(identitysData[iids].majors, 2) || "";
            datas.cardnumber = identitysData[iids].st_card_number || "";
            datas.classgrade_performance = identitysData[iids].st_classgrade_performance || "";
            datas.dormitory = identitysData[iids].dormitory || ""; //住校生寝室
            datas.examination_number = identitysData[iids].st_examination_number || "";
            datas.graduateschool = identitysData[iids].st_graduate_schoolname || "";
            datas.number = identitysData[iids].st_main_number || "";
            datas.performance = identitysData[iids].st_performance || "";
            datas.schoolnumber = identitysData[iids].st_school_number || "";
            datas.way = identitysData[iids].st_way;
            datas.classgradenumber = identitysData[iids].st_classgrade_number;
            datas.activeservice_state = identitysData[iids].activeservice_state
        }
    }
        var modifyUSEData = datas;
        modifyUSEData.groupid = datas.group;
        modifyUSEData.majorid = datas.majors;
        modifyUSEData.classgaderid = datas.classgrades;
        modifyUSEData.county = datas.country;
        modifyUSEData.addres = datas.address;
        modifyUSEData.activeservicestate=datas.activeservice_state;
        modifyUSEData.dormitoryid=datas.dormitory_id;
        window.modifyUSE= JSON.stringify(modifyUSEData);
        if(data.accountData.photopath){
            obj.find('.photopath').attr('src',ImgurlHttp+data.accountData.photopath);
            obj.find('input[name="photopath"]').val(data.accountData.photopath);
        }
        for(var i in datas){
            if(i=="dormitory"&&datas[i].dormitory){
                var schoolName = tool().dormotoryForSchool(datas[i].dormitory.school_district_id);
                var dormitoryName = tool().dormitoryForSex(datas[i].dormitory.dormitory_type);
                obj.find('.' + i).val(schoolName+dormitoryName+datas[i].dormitory.number);
            }else {
                // console.log(i+"+++++++"+datas[i]);
                obj.find('.'+i).val(datas[i]);
            }
        }
        obj.find('.username').text(datas['username']);
        if(this.editNumber==2){
            this.downmajorsData(datas.group,datas.majors,datas.classgrades,obj);//专业部 、 专业 、班级
        }
        this.downAddress(datas.province,datas.city,datas.country,obj)//省市区
        top.layui.form.render();


}
//处理专业部  专业  班级 的数据下行
EditAllUserInformation.prototype.downmajorsData=function (groupid,majorsid,schoolClassid,obj) {
    console.log(schoolClassid);
    if(majorsid!=null){
        tool().editMajor(obj,groupid,majorsid);
    }
    if(schoolClassid!=null){
        tool().editMajorClass(obj,majorsid,schoolClassid);
    }
     // setTimeout(function () {
        //如果专业部有信息
        // if(groupid!=null){

            tool().editMajorGroup(obj,groupid);
            obj.find('.groupid').val(groupid);
        // }
        top.layui.form.render();
     // },3000)
}
//处理省   市   区  数据下行的问题
EditAllUserInformation.prototype.downAddress = function (province,city,area,obj) {
    var _this=this;
    $.get("../json/address.js", function (data) {
        obj.find('.province').val(province);
        var data=JSON.parse(data);
        for (var i = 0; i < data.length; i++) {
            if(data[i].name==province){
                _this.loadCity(obj,data[i].childs,city);
                var citys= data[i].childs;
                for(var j=0;j<citys.length;j++){
                    if(citys[j].name==city) {
                        _this.loadArea(obj,citys[j].childs,area);

                    }

                }
            }

        }
        top.layui.form.render();
    })

}