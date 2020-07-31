var ImgurlHttp = true; //生产环境
var urls = true;
 ImgurlHttp = ImgurlHttp ? 'http://itzx.price51.com/' : 'http://school.price51.com:80/';
if(location.host.indexOf('localhost')!=-1){
    urls="http://localhost:5000/SHSS1" ;
}else{
    // urls = urls ? 'http://itzx.price51.com/SHSS1' : 'http://school.price51.com:80/SHSS1';
    urls = 'http://'+location.host+'/SHSS1'
}
var loginSrc ='/SHSSVIEW/page/login.html';
var token = $.cookie(sessionStorage.username+'tokens')!='null'?$.cookie(sessionStorage.username+'tokens'):false;
var userId = $.cookie(sessionStorage.username+'userIds')!='null'?$.cookie(sessionStorage.username+'userIds'):false;
  //判断登录设备
var pclogin = {
      clientType:0,
      identity_id:sessionStorage.identity_id
  };

/**
 * ajax封装
 * url 发送请求的地址
 * data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
 * dataType 预期服务器返回的数据类型，常用的如：xml、html、json、text
 * successfn 成功回调函数
 * failfn 条件不符合回调函数
 * errorfn 失败回调函数
 */
jQuery.axse = function(url, data, successfn, errorfn) {
     data = (data == null || data == "" || typeof(data) == "undefined") ? { "date": new Date().getTime() }:data;
    data.clientType = 0;
    if(!data.token){
         tool().judge_token(function () {
            tool().clear_sessionStorage();
            top.location.href=loginSrc;
         })
        return;
    }
    if(sessionStorage.identity_id){
        data.identity_id = sessionStorage.identity_id;
    } else {
        tool().judge_token(function () {
            tool().clear_sessionStorage();
            top.location.href=loginSrc;
        })
        return;
    }
    jQuery.support.cors=true;
    $.ajax({
        type: "get",
        data: data,
        url: url,
        beforeSend:function () {
           // console.log(1);
        },
        async:true,
        timeout : 500000,
        dataType: "json",
        crossDomain: true == !(document.all),
        cache:false,
        success: function(e) {
            //如果errorCode  为400  到  500 内，token失效，返回登录页面
            if(e.error){
                if(400<=e.error.errorCode&&e.error.errorCode<=500){
                    tool().judge_token(function () {
                        tool().clear_sessionStorage();
                        top.location.href=loginSrc;
                    })
                }else{
                    if(!e.error.message){
                        e.error.message='数据异常'
                    }
                    if(errorfn) {
                        errorfn(e);
                    }
                    top.layer.msg('<i class="material-icons msgIconStyleFail">cancel</i>'+e.error.message,{
                        skin: 'msgStyle'//skin属性可以将layer的标签提取出来，重新定义样式
                    });

                }
            }else{
                successfn(e);
            }
        },
        error: function(e) {
           top.layer.msg('<i class="material-icons msgIconStyleFail">cancel</i>服务器繁忙，请稍后再试',{
                skin: 'msgStyle',//skin属性可以将layer的标签提取出来，重新定义样式
            });
            if(errorfn) {
                errorfn(e);
            }
            //				errorfn(e);
        },
        statusCode: {
            400: function() {
                alert('请求错误 : 请求参数错误');
            },
            404: function() {
                alert('请求错误 : 请求不存在');
            },
            500: function() {
                alert('请求错误 : 服务器错误');
            },
            503: function() {
                alert('网络繁忙')
            }
        }
    });
};
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
     }
    return -1;
 };
Array.prototype.remove = function(val) {
           var index = this.indexOf(val);
           if (index > -1) {
                this.splice(index, 1);
           }
          return this;
       };

//接口汇总
// 获取学期
       var termList ='/time/gettimes.action';
// 1. 账号类型
       //(1)获取身份
       var  IdentityList ='/identity/getidentitys.action';
// 2. 学生相关
      // (1)获取学生账户列表
         var studentList ='/account/getAccountsForStudent.action';
      // (2)获取个体学生的信息
          var   onestudentList='/accountData/getAccountForID.action';
      // (3)获取打分项
         var studentRecord ='/pprojectForStudent/getIntervenes.action';
      // (4)新建打分项
         var createStudentRecord ='/pprojectForStudent/createIntervene.action';
      //  (5)修改打分节点
         var reviseStudentRecord ='/pproject/modificationintervene.action';
       //  学生批量打分
          var addStudent_Record = '/pprojectForStudent/operation.action';
       // 学生评分记录
       var studentHistoryRecord ='/performance/getForStudentID.action';
       //绑定打分项
       var bindclassRecord ='/pprojectForClassgrade/bindIntervene.action'
       //修改学生信息
       var modifyStudentMessage ='/account/edit/modificationdata.action';

// 3. 班级相关
       //创建班级
       var createClass ='/classgrade/create.action'
       //获取班级账户列表
         var ClassList ='/classgrade/getClassgrades.action';
       //获取个体班级的信息
         var oneClass ='/classgrade/getClassgradeForID.action';
         //获取班级目录节点
       var ClassContents = '/pprojectForClassgrade/getProject.action';
       //添加班级目录节点
       var addClassContents ='/pprojectForClassgrade/createCatalogue.action';
       //获取班级打分项
         var ClassRecord ='/pprojectForClassgrade/getInterveneProjects.action';
       //新建班级打分项
         var createClassRecord ='/pprojectForClassgrade/createIntervene.action';
         //班级打分tree
        var classRecordTree ='/pprojectForClassgrade/getProject.action';
       //修改打分节点   (同学生)

       //班级批量打分
         var MoreClassRecord = '/pprojectForClassgrade/operation.action';
         //班级评分记录
         var classRecordHistoty = '/pprojectForClassgrade/getRecords.action';
       //修改班级信息
          var modifyClass = '/classgrade/modification.action';
          //删除班级节点
         var delClassRecord ='/pprojectForClassgrade/remove.action';
         //根据班主任账号获取班级
         var Headermaster_class = '/classgrade/getClassgrades.action';
// 4. 专业相关
        //获取专业部
        var Get_MajorGroup ='/major/getMajorGroups.action';
        //通过专业部获取专业
        var Get_Major = '/major/getMajorsForGroupId.action';
        //通过专业获取班级
        var Get_MajorClass ='/classgrade/getClassgrades.action';
        //通过班级获取学生
        var Get_classStudent ='/account/getAccountsForStudent.action';

// 5. 请假相关
       var leaveMessage_one = '/leave/getApplyForID.action';
// 6. 寝室
        var sleepRoomList ='/dormitory/getDormitorys.action';
        //给寝室绑定账户
        var sleepRoomBindUser ='/dormitory/bindForAccount.action';
        //通过id修改寝室信息
         var oneRoomMessage='/dormitory/getForDormitoryID.action';
         //获取住校生
         var get_liveSchool ='/accountStudent/getStudentForInResidence.action';
 //  晚自修  （座位表）
        var setState ='/accountStudent/setTemporaryState.action';
