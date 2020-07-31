 layui.use(['layer', 'form', 'element'], function () {
         var layer = layui.layer
             , form = layui.form
             , element = layui.element
         var UpTemplate_Score = new UpTemplate('UpFile',{
                    url:'/fileAccount/uploadAccountToDuty.action',
                    filed:"",
                    tip:'确认上传此表格进行批量关联',
                    NoFile_Tip:""
             })
})

        //移除按钮
        //添加账户
      mainPage = (function () {
            var _m = {};
            var self = _m;
            //初始化
            _m.init = function () {
                self.all_table();
                self.addBtnInit();
            }
            //初始化新增按钮
            _m.addBtnInit = function () {
                var identity_id = sessionStorage.identity_id;
                    if(identity_id==3){
                        $('.head').append('<span class="school_Btn rg" style="width: 100px;" id="Import" onclick="mainPage.switch($(this))">值班数据导入</span><span class="school_Btn rg" style="width: 100px;margin-right: 20px" id="addOverTime" onclick="duty_mask().teacher_Work_Add($(this))">编辑值班信息</span>');
                    }
             }
            //生成表格
            _m.table = function (filed) {
                if (!filed.token || !sessionStorage.identity_id) {
                    tool().judge_token(function () {
                        parent.location.href = loginSrc;
                    })
                    return;
                }
                if (filed) $.extend(filed, pclogin);
                $('#account').find('#table1').bootstrapTable('destroy');
                $('#table1').bootstrapTable({
                    url: urls + '/duty/getDuty.action',
                    queryParams: function () {
                        return filed;
                    },
                    sidePagination: "client",
                    contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                    method: 'POST',
                    async:true,
                    pagination: true,
                    paginationLoop: false,
                    pageNumber: 1,
                    pageSize: 10,
                    pageList: [10, 15, 25],
                    // striped: true,
                    columns:
                        [{
                            field: 'teacher',
                            align: "left",
                            title: '值班教师',
                            width: '110px',
                            formatter: function (value, row, index) {
                                var a = row.teacher.rname;
                                return a;
                            }
                        } , {
                            field: 'type',
                            align: "left",
                            title: '类型',
                            formatter: function (value, row, index) {
                                var obj={"0":"干部","1":"教师"}
                                if(row.type!=null){
                                    var a=obj[row.type]
                                    return a;
                                }
                            }
                        },{
                            field: 'school_district_id',
                            align: "left",
                            title: '校区',
                            formatter: function (value, row, index) {
                                var obj={"1":"丁桥校区","2":"翠苑校区"}
                                if(row.school_district_id){
                                    var a=obj[row.school_district_id]
                                    return a;
                                }
                            }
                        }, {
                            field: 'type',
                            align: "left",
                            title: '负责班级',
                            width: "400px",
                            formatter: function (value, row, index) {
                                var classgrades = row.classgrades;
                                var arr = [];
                                if (classgrades && classgrades.length > 0) {
                                    for (var i = 0; i < classgrades.length; i++) {
                                        arr.push(classgrades[i].name);
                                    }
                                    return arr.join('，')
                                } else {
                                    return '无'
                                }
                            }
                        }, {
                            field: '',
                            align: "left",
                            title: '签到',
                            formatter: function (value, row, index) {
                               if(row.sign_state){
                                  return '<span style="color: #787878">已签到</span>' ;
                               } else {
                                   return '<span style="color: #FF4747">未签到</span>';
                               }
                            }
                        }, {
                            field: '',
                            align: "center",
                            title: '操作',
                            formatter: function (value, row, index) {
                                var classgrades=row.classgrades;
                                var arr=[];
                                var arr_id=[];
                                for(var i=0;i<classgrades.length;i++){
                                    arr.push(classgrades[i].name);
                                    arr_id.push(classgrades[i].id);
                                }
                                var class_name=arr.join('-');
                                var class_id = arr_id.join('-');
                                var des=row.des||"";
                                var school_district_id = row.school_district_id||""
                                var a = '<a class="blue" data-time="'+row.time+'" data-teacher="'+row.teacher.id+'" onclick="duty_mask().teacher_Work_edit($(this))" data-des="'+des+'" data-class_name="'+class_name+'"  data-class_id="'+class_id+'" data-id="'+row.id+'" data-type="'+row.type+'" data-school_district_id="'+school_district_id+'">查看</a>';
                                if(row.sign_state){
                                  var a='<a style="color: #787878">查看</a>'
                                }
                                if(sessionStorage.identity_id!=3){
                                  var a="-";
                                }
                                return a;
                            }
                        }],

                    responseHandler: function (result) {
                        if (result.error) {
                            if (400 <= result.error.errorCode && result.error.errorCode <= 500) {
                                tool().judge_token(function () {
                                    parent.location.href = loginSrc;
                                })
                            } else {
                                sl_Mask.NoTip(result.error.message);
                            }
                        } else {
                            return result.data

                        }

                    },
                    formatLoadingMessage: function(){
                        return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
                    }
                })

            }
            //给学期表格传参
            _m.all_table = function (time) {
                var params = {
                    faid: userId,
                    token: token,
                    time: new Date(time.replace(/-/g, "/")).getTime()
                }
                self.table(params);
            }
          //切换
          _m.switch = function (that) {
              // $('.head a').unbind('click').bind('click',function () {
                  if(that.hasClass('switch')){
                      that.removeClass('switch');
                      that.text('导入表格');
                      $('.head span.sl-title').text('值班管理');
                      $('.dutyWrap').hide();
                      var time=$('#addOverTime').attr('data-time');
                      self.all_table(time)
                      $('.dutyWrap').eq(0).show();
                  }else {
                      that.addClass('switch');
                      that.text('返回');
                      $('.head span.sl-title').text('导入Excel表格进行值班设置');
                      $('.dutyWrap').hide();
                      $('.dutyWrap').eq(1).show();
                  }
              // })
          }
            return _m;
        })();
 // mainPage.switch();
 mainPage.addBtnInit();

