var MaskForStudentMessage = '<div class="school_Msg" style="padding:30px 30px;position:relative;color:#000000;opacity:0.87">' +
    '<div class="clear">'+
    '<div class="lf" style="width:150px;height:150px;background:#eeeeee;position: relative;overflow: hidden"><img src="" class="photopath" style="width: 100%;position: absolute;left: 0;top:-10px;"></div>'+
    '<div class="lf" style="padding-left:30px">'+
    '<div style="position:relative;margin-bottom:10px">'+
    '<h3 style="color:#000000;font-weight:blod;" class="rname"></h3>'+
    '<i style="position: absolute;top:3px;left:80px;dispaly:inline-block;color:#2387f9;font-size:12px;font-style:normal; ">有效</i>'+
    '</div>'+
    '<div>'+
    '<ul>'+
    '<li class="clear" style="line-height:30px;"><span class="lf">性别：</span><p class="lf sex"></p></li>'+
    '<li class="clear" style="line-height:30px;"><span class="lf">学籍号：</span><p class="lf number" ></p></li>'+
    '<li class="clear" style="line-height:30px;"><span class="lf">出生日期：</span><p class="lf birthday"></p></li>'+
    '<li class="clear" style="line-height:30px;"><span class="lf ">身份证号：</span><p class="lf idcNnmner"></p></li>'+
    '</ul>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '<div>'+
    '<ul style="padding-top:20px">'+
    '<li class="clear lf" style="line-height:30px;width:50%;"><span class="lf">专业部：</span><p class="lf group" ></p></li>'+
    '<li class="clear lf" style="line-height:30px;width:50%;"><span class="lf"  >专业：</span><p class="lf majors" ></p></li>'+
    '<li class="clear lf" style="line-height:30px;width:50%;"><span class="lf" >校内学号：</span><p class="lf schoolnumber"></p></li>'+
    '<li class="clear lf" style="line-height:30px;width:50%;"><span class="lf" >班级：</span><p class="lf classgrades"></p></li>'+
    '<li class="clear lf" style="line-height:30px;width:50%;"><span class="lf" >班内学号：</span><p class="lf classgradenumber"></p></li>'+
    '<li class="clear lf" style="line-height:30px;width:50%;"><span class="lf" >是否住校：</span><p class="lf way" ></p></li>'+
    '<li class="clear lf" style="line-height:30px;width:50%;"><span class="lf" >一卡通：</span><p class="lf cardnumber"></p></li>'+
    '<li class="clear lf" style="line-height:30px;width:50%;"><span class="lf" >宿舍房间：</span><p class="lf dormitory"></p></li>'+
    '<li class="clear lf" style="line-height:30px;width:50%;"><span class="lf" >民族：</span><p class="lf nation"></p></li>'+
    '<li class="clear lf" style="line-height:30px;width:50%;"><span class="lf">手机号：</span><p class="lf phone"></p></li>'+
    // '<li class="clear lf" style="line-height:30px;width:50%;"><span class="lf" >政治面貌：</span><p class="lf partymember"></p></li>'+
    '<li class="clear lf" style="line-height:30px;width:50%;"><span  class="lf">手机号（家长）：</span><p class="lf familyphone"></p></li>'+
    // '<li class="clear" style="line-height:30px;"><span class="lf" >籍贯：</span><p class="lf provinceS"></p></li>'+
    // '<li class="clear " style="line-height:30px;"><span class="lf" >地址：</span><p class="lf address" ></p></li>'+
    // '<li class="clear" style="line-height:30px; "><span class="lf">毕业学校：</span><p class="lf graduate_schoolname" ></p></li>'+
    '</ul>'+

    '</div>'+
    '</div>'
/*
*  查看学生基本信息的弹框
* */
function MaskForStudent(ids,Information) {
    if(typeof ids =='string'){
        var objs = document.getElementById(ids);
        var oBox =  $(objs);
    }else {
        var oBox = $(ids);
    }
    var _this = this;
    this.Information=Information;
    oBox.unbind('click').bind('click', function () {
        var taid=this.getAttribute('data-taid');
        if(taid){
            _this.Mask(taid);
        }else {
             _this.Mask();
        }
    })
}
MaskForStudent.prototype.Mask = function (taid) {
    var _this=this;
    var data=Information||_this.Information;
    var index = top.layer.open({
        type: 1,
        title: '详细信息',
        closeBtn: 1,
//						shadeClose: true,
        skin: '',
        content: MaskForStudentMessage,
        area: ['541px', '570px'],
        success: function(layero, index) {
            if(taid){
                var studentInformation = new PersonalInformation(data,$(layero));
                    studentInformation.fillpage();//填充数据
                    studentInformation.fillPhoto();//填充头像
            }else {
                tool().userList(userId,$(layero));
            }
        }
    })
}