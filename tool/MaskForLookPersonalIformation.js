var teacher_dom ="<form class='publicMsg layui-form'>"+
    "<div class='title clear'>"+
    "<p class='lf' style='color: #010101;font-weight: bold;'>基本信息（账号：<i class='username' style='font-style:normal;font-weight: normal'></i>）</p>"+
    "<div class='rg'>"+
    "<span class='NoBtn layui-layer-btn1' style='padding-right: 0'>取消</span>"+
    "</div>"+
    "</div>"+
    "<div>"+
    "<ul class='clear'style='padding-top:15px;'>"+
    "<li class='photoWrap lf'style='position: relative;' >" +
    "<img src='images1/Photo.png' class='photopath'>"+
    "<input type='hidden' name='photopath'></li>"+
    "<li class='rg sexWrap clear' style='width:670px'><input class='lf rname' type='text' style='width:200px;margin-left: 20px'placeholder='姓名'><input class='sex' placeholder='性别' style='margin-left: 32px'><input type='text' placeholder='出生年月' style='width: 200px;margin-left: 31px' readonly class='birthday'></li>"+
    "<li class='rg' style='width:650px'><input type='text' placeholder='证件号' style='width:100%'  class='idcNnmner'></li>"+
    "</ul>"+
    "<div class='title clear' style='border: none'>"+
    "<p class='lf'>联系方式</p>"+
    "</div>"+
    "<ul class >"+
    "<li style='width:670px'><input type='number' placeholder='手机号' style='width: 187px;margin-right: 25px' class='phone'><input type='number' placeholder='虚拟网号' style='width: 187px;' name='virtualphone' class='virtualphone'></li>"+
    "<li class='clear line'style='width:670px'><input type='text' class=' province' placeholder='省份' style='width: 187px;margin-right: 25px'><input type='text' class='city' placeholder='市' style='width: 187px;margin-right: 25px'><input type='text' class='country' placeholder='区县' style='width: 187px;'></li>"+
    "<li style='width:615px'><input type='text' placeholder='详细地址' style='width: 100%;'class='addressS'></li>"+
    "</ul>"+
    "<div class='title clear' style='border: none'>"+
    "<p class='lf'>其他信息</p>"+
    "</div>"+
    "<div style='width: 100%;'>"+
    "<ul style='width: 920px'>"+
    "<li class='line clear'style='width:100%;position: relative'><input type='text' class='nation' placeholder='民族' style='width: 187px;margin-right: 25px'><input type='text' class='partymember' placeholder='政治面貌' style='width: 187px;margin-right: 25px'><input class='education' placeholder='学历'style='width: 187px;margin-right: 25px'><input class='activeservicestate' placeholder='在职'style='width: 187px;'></li>"+
    "</ul>"+
    "</div>"+
    "</div>"+
    "</form>";
var student_dom ="<form class='publicMsg layui-form'style='padding-bottom: 0'>"+
    "<div class='title clear'>"+
    "<p class='lf'  style='color: #010101;font-weight:bold;'>基本信息（账号：<i class='username'style='font-style:normal;font-weight:normal;'></i>）</p>"+
    "<div class='rg'>"+
    "<span class='NoBtn layui-layer-btn1'style='padding-right:0;'>取消</span>"+
    "</div>"+
    "</div>"+
    "<div style='padding-top: 10px'>"+
    "<ul class='clear'>"+
    "<li class='photoWrap lf'style='position: relative;'>" +
    "<img src='' class='photopath'>"+
    "<input type='hidden' name='photopath'></li>"+
    "<li class='rg sexWrap clear' style='width:670px'><input class='lf rname' type='text' style='width:200px;margin-left: 20px'placeholder='姓名'><input class='sex' placeholder='性别' style='margin-left: 32px'><input type='text' placeholder='出生年月' style='width: 200px;margin-left: 33px' readonly class='birthday'></li>"+
    "<li class='rg' style='width:650px'><input type='text' placeholder='证件号' style='width:100%'  class='idcNnmner'></li>"+
    "<li class='rg'style='width:670px'><input type='text' class='group' placeholder='专业部' style='margin-left: 20px'><input class='majors' placeholder='专业' style='width: 200px;margin-left: 32px'><input class='classgrades' placeholder='班级'style='width: 200px;margin-left: 33px'></li>"+
    "</ul>"+
    "<ul>"+
    "<li class='clear'><input type='number' placeholder='一卡通' style='width: 187px;margin-right: 25px'  class='cardnumber'><input type='number' placeholder='学籍号' style='width: 187px;margin-right: 25px' class='number'><input type='number' placeholder='校内学号' class='schoolnumber'style='width: 187px;'><input type='number' placeholder='班内学号' style='width: 187px;' class='rg classgradenumber'></li>"+
    "</ul>"+
    "<div class='title clear' style='border: none'>"+
    "<p class='lf'>联系方式</p>"+
    "</div>"+
    "<ul>"+
    "<li><input type='number' placeholder='手机号' style='width: 187px;margin-right: 25px' class='phone'><input type='number' placeholder='输入虚拟网号' style='width: 187px;margin-right: 25px'class='virtualphone'><input type='number' placeholder='家长手机号' style='width: 187px;'  class='familyphone'></li>"+
    // "<li class='clear line'style='width:670px'><input type='text' class=' province' placeholder='省份' style='width: 187px;margin-right: 25px'><input type='text' class='city' placeholder='市' style='width: 187px;margin-right: 25px'><input type='text' class='country' placeholder='区县' style='width: 187px;'></li>"+
    // "<li style='width:615px'><input type='text' placeholder='详细地址' style='width: 100%;'class='addressS'></li>"+
    "</ul>"+
    "<div class='title clear' style='border: none'>"+
    "<p class='lf'>其他信息</p>"+
    "</div>"+
    "<div style='width: 100%;'>"+
    "<ul style='width: 920px'>"+
    "<li class='line clear other'style='width:100%;position: relative'>" +
    "<input type='text' class='nation' placeholder='民族' style='width: 187px;margin-right: 25px'>" +
    // "<input type='text' class='partymember' placeholder='政治面貌' style='width: 187px;margin-right: 25px'>"
    // "<input type='text' placeholder='毕业学校' class='graduate_schoolname'style='width: 187px;margin-right: 25px'>"
    "<input type='text' class='activeservicestate'><input type='text' class='way' disabled style='width: 187px;margin-right: 25px' placeholder='住校'><input type='text' style='width: 187px;' class='dormitory' disabled placeholder='寝室'>"+
    "</li>"
    "</ul>"+
    "</div>"+
    "</div>"+
    "</form>";
var familay_dom ="<form class='publicMsg layui-form'style='padding-bottom: 20px'>"+
    "<div class='title clear'>"+
    "<p class='lf'  style='color: #010101;font-weight:bold;'>基本信息（账号：<i class='username'style='font-style:normal;font-weight:normal;'></i>）</p>"+
    "<div class='rg'>"+
    "<span class='NoBtn layui-layer-btn1'style='padding-right:0;'>取消</span>"+
    "</div>"+
    "</div>"+
    "<div style='padding-top: 10px'>"+
    "<ul class='clear'>"+
    "<li class='photoWrap lf'style='position: relative;'>" +
    "<img src='' class='photopath'>"+
    "<input type='hidden' name='photopath'></li>"+
    "<li class='rg sexWrap clear' style='width:670px'><input class='lf rname' type='text' style='width:200px;margin-left: 20px'placeholder='姓名'><input class='sex' placeholder='性别' style='margin-left: 32px'><input type='text' placeholder='出生年月' style='width: 200px;margin-left: 31px' readonly class='birthday'></li>"+
    "<li class='rg' style='width:650px'><input type='text' placeholder='证件号' style='width:100%'  class='idcNnmner'></li>"+
    "</ul>"+
    "<div class='title clear' style='border: none'>"+
    "<p class='lf'>联系方式</p>"+
    "</div>"+
    "<ul>"+
    "<li><input type='number' placeholder='手机号' style='width: 187px;margin-right: 25px' class='phone'></li>"+
    "<li class='clear line'style='width:670px'><input type='text' class=' province' placeholder='省份' style='width: 187px;margin-right: 25px'><input type='text' class='city' placeholder='市' style='width: 187px;margin-right: 25px'><input type='text' class='country' placeholder='区县' style='width: 187px;'></li>"+
    "<li style='width:615px'><input type='text' placeholder='详细地址' style='width: 100%;'class='addressS'></li>"+
    "</ul>"+
    "</div>"+
    "</form>";
/*
* 在我的页面查看基本信息  （主要有三种  一种模式是老师   一种模式是学生    一种模式是家长）
* Information    //数据
* obj   //操作对象
* */
function MaskForSeePersonalInformation(Information,obj) {
    this.Information = Information;
    this.oBox = obj;
    var _this = this;
    this.oBox.unbind('click').bind('click',function () {
       _this.mask();
    })
}
MaskForSeePersonalInformation.prototype.mask = function () {
    var _this = this;
    var dom=''
    var identity_id = sessionStorage.identity_id;
    if(identity_id==6){//学生
        var dom = student_dom
    }else if(identity_id==7){//家长
        var dom = familay_dom
    }else {//其他
        var dom = teacher_dom
    }
    var index = top.layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            skin: 'yourClass',
            content: dom,
            shadeClose: false,
            offset: ['10px'],
            area: ['910px', 'auto'],
            success: function (layero, index) {
                $(layero).find('.layui-layer-content').css('height','auto');
                $(layero).find('input').attr('disabled',true);
                var userInformation = new PersonalInformation(_this.Information,$(layero));
                    userInformation.fillPhoto();//填充头像
                    userInformation.fillpage();
                $(layero).find('.NoBtn').unbind('click').bind('click',function(){
                   top.layer.close(index);
                })
            }
        })
}