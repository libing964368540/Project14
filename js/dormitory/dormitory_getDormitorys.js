layui.use(['layer', 'form', 'element','laydate'], function() {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element
   //下载模板
    var download = new DownLoadTemplate('dormitory_down',{
             url:'/fileAccount/getResidentStudent.action'
    });
    var UpTemplate_dormitory = new UpTemplate('UpFile',{
              url:'/fileAccount/uploadAccountToDormitory.action',
              filed:'',
              tip:'确认上传此表格进行批量关联',
              NoFile_Tip:""
          })
    mainPage = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            self.all_table();
            self.school_area();
            self.sleeproom_type();
            self.floor();
            self.switch();
            self.del();
        }
        //生成表格
        _m.table = function (filed) {
            if(!filed.token||!sessionStorage.identity_id){
                tool().judge_token(function () {
                    parent.location.href=loginSrc;
                })
                return;
            }
            if(filed) $.extend(filed,pclogin);
            $('#account').find('#table1').bootstrapTable('destroy');
            $('#table1').bootstrapTable({
                url: urls + sleepRoomList,
                queryParams: function () {
                    return filed;
                },
                sidePagination: "client",
                contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                method: 'POST',
                async:true,
                pagination: true,
                paginationLoop: false,
                cache:false,
                pageNumber: 1,
                pageSize: 10,
                pageList: [10, 15, 25],
                // striped:true,
                columns:[
                    // [{
                    //     field: '',
                    //     align: "center",
                    //     title: '序号',
                    //     width: '80px',
                    //     formatter: function (value, row, index) {
                    //         // var pageSize=$('#table1').bootstrapTable('getOptions').pageSize;
                    //         // //通过表的#id 可以得到每页多少条
                    //         // var pageNumber=$('#table1').bootstrapTable('getOptions').pageNumber;
                    //         // //通过表的#id 可以得到当前第几页
                    //         // return pageSize * (pageNumber - 1) + index + 1;
                    //         // // 返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
                    //         return index+1;
                    //     }
                    // },{
                    {
                        field: '',
                        align: "left",
                        title: '寝室名称',
                        width: '15%',
                        formatter: function (value, row, index) {
                           var obj={1:'男生寝室',2:'女生寝室'};
                           var a = obj[row.dormitory_type]+'-'+row.number;
                           return a;
                        }
                    },{
                        field: '',
                        align: "left",
                        title: '校区',
                        width: '15%',
                        formatter: function (value, row, index) {
                            var arr={"1":'丁桥校区',"2":"翠苑校区"};
                            var a=arr[row.school_district_id];
                            return a;
                        }
                    }, {
                        field: 'floor',
                        align: "left",
                        title: '楼层',
                        width: '15%'
                    }, {
                        field: '',
                        align: "left",
                        title: '床位',
                        width: '15%',
                        formatter: function (value, row, index) {
                           var lenghts= row.accounts.length;
                           var a = lenghts + '/'+ row.capacity
                            return a;
                        }
                    }, {
                        field: '',
                        align: "left",
                        title: '入住学生',
                        formatter: function (value, row, index) {
                           var accounts = row.accounts;
                            var arr=[];
                            if(accounts&&accounts.length>0){
                                for (var i=0;i<accounts.length;i++){
                                    if(row.accounts[i]){
                                        arr.push(row.accounts[i].account.rname)
                                    }
                                }
                            }
                            if(arr.length>1){
                                // var str=arr[0]+'等'+arr.length+'人'
                                var str = arr.join('；')
                            }else {
                                var str=arr[0]
                            }
                            return str;
                        }
                    }, {
                        field: '',
                        align: "center",
                        title: '操作',
                        width: '160px',
                        formatter: function (value, row, index) {
                            var a = '<a class="blue" onclick="tool().DormMessage('+row.ID+')">查看</a>'
                            return a;
                        }
                    }],
                responseHandler: function (result) {
                if (result.error) {
                    if (400 <= result.error.errorCode && result.error.errorCode <= 500) {
                        tool().judge_token(function () {
                            parent.location.href=loginSrc;
                        })
                    }else {
                        sl_Mask.NoTip(result.error.message);
                    }
                } else {
                    return result.data.list.reverse()
                }

                },
                formatLoadingMessage: function(){
                    return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
                }
            })

        }
        //给学期表格传参
        _m.all_table = function () {
            var dormitory_type=$('select[name="dormitory_type"]').val();
            var school_district_id=$('select[name="school_district_id"]').val();
            var floor=$('select[name="floor"]').val();
            var params = {
                faid: userId,
                token: token
            }
            if(dormitory_type){
                params.dormitory_type=dormitory_type;
            }
            if(school_district_id){
                params.school_district_id=school_district_id;
            }
            if(floor){
                params.floor=floor;
            }
            self.table(params);
        }
        //通过学区筛选
        _m.school_area = function () {
            form.on('select(school_district_id)', function(data){
                var params={
                    faid: userId,
                    token: token,
                    school_district_id:data.value,
                    dormitory_type:$('select[name="dormitory_type"]').val(),
                    floor:$('select[name="floor"]').val()
                }
                self.table(params);
            })
        }
        //通过寝室类型筛选
        _m.sleeproom_type = function () {
            form.on('select(dormitory_type)', function(data){
                var params={
                    faid: userId,
                    token: token,
                    dormitory_type:data.value,
                    school_district_id:$('select[name="school_district_id"]').val(),
                    floor:$('select[name="floor"]').val()
                }
                self.table(params);
            })
        }
        //通过楼层筛选
        _m.floor = function () {
            form.on('select(floor)', function(data){
                var params={
                    faid: userId,
                    token: token,
                    floor:data.value,
                    dormitory_type:$('select[name="dormitory_type"]').val(),
                    school_district_id:$('select[name="school_district_id"]').val()
                }
                self.table(params);
            })
        }
        //切换
        _m.switch = function () {
            $('.head a').unbind('click').bind('click',function () {
                if($(this).hasClass('switch')){
                    $(this).removeClass('switch');
                    $(this).text('导入表格');
                    $('.head span').text('寝室住宿管理 列表');
                    $('.head i').show();
                    $('.tableWrap').hide();
                    $('.tableWrap').eq(0).show();
                    mainPage.all_table();
                }else {
                    $(this).addClass('switch');
                    $(this).text('返回');
                    $('.head span').text('导入Excel批量更新住校生信息');
                    $('.head i').hide();
                    $('.tableWrap').hide();
                    $('.tableWrap').eq(1).show();
                }
            })
        }
        //清空全部寝室
        _m.del = function () {
            $('#AllDel').unbind('click').bind('click',function () {
                tool().Switched_Roles('images1/del.png','确认要全部清空？', function() {
                      var params = {
                          token:token,
                          faid:userId
                      }
                    $.axse(urls+'/dormitoryCheck/clearAll.action',params,function(result){
                          sl_Mask.YesTip('操作成功');
                        mainPage.all_table();
                    })

                })
            })
        }
        return _m;

    })();
    mainPage.init();


})
