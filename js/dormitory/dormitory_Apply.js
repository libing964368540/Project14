layui.use(['layer', 'form', 'element'], function(){
    var layer = layui.layer
        ,form = layui.form
        ,element = layui.element;
       //填充学期
})
mainPage=(function(){
    var _m = {};
    var self = _m;
    //初始化
    _m.init=function(){
          self.termSelect(mainPage.all_table);
          self.keywords();
    }
    //获取学期
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
                layui.form.render();
                layui.form.on('select(termid)', function (data) {
                    if(fn){
                        fn();
                    }
                })
                 self.all_table();
            }
        })
    }
    //生成表格
    _m.table = function(filed){
        if(!filed.token||!sessionStorage.identity_id){
            tool().judge_token(function () {
                parent.location.href=loginSrc;
            })
            return;
        }
        if(filed) $.extend(filed,pclogin);
        $('#table1').bootstrapTable({
            url:urls + '/inResidenceApply/getApplys.action',
            queryParams:function(params){
                var obj={
                    size:params.limit,
                    page:params.offset/params.limit,
                }
                if(filed) $.extend(obj,filed);
                return obj;
            },
            sidePagination: "server",
            contentType:"application/x-www-form-urlencoded; charset=UTF-8",
            method: 'POST',
            async:true,
            striped:true,
            paginationShowPageGo: true,
            pagination: true,
            paginationLoop: false,
            pageNumber:1,
            cache:false,
            pageSize: 10,
            pageList: [10, 20, 50,100],
            columns:
                [  {
                    field: 'variablevalue',
                    checkbox:true,
                    width:'43px',
                    visible: false
                },
                    {
                        field: '',
                        align:"center",
                        title: '序号',
                        width:'80px',
                        formatter: function(value, row, index) {
                            var pageSize=$('#table1').bootstrapTable('getOptions').pageSize;
                            //通过表的#id 可以得到每页多少条
                            var pageNumber=$('#table1').bootstrapTable('getOptions').pageNumber;
                            //通过表的#id 可以得到当前第几页
                            return pageSize * (pageNumber - 1) + index + 1;
                            //返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
                        }

                    },{
                    field: 'rname',
                    align:"center",
                    width:'100px',
                    title: '学生姓名',
                    formatter: function(value, row, index) {
                        if(row.student_name){
                            var a='<span style="color: #262626">'+row.student_name+'</span>';
                            return a;
                        }
                    }

                },{
                    field: '',
                    align:"center",
                    width:'80px',
                    title: '性别',
                    formatter: function(value, row, index) {
                        var obj={
                            1:"男",
                            0:"女"
                        }
                        if(row.student_sex){
                           return obj[row.student_sex]
                        }
                    }

                }, {
                    field: 'student_main_number',
                    align:"center",
                    title: '学籍号'
                }, {
                        field: 'classgrade_name',
                        align:"center",
                        title: '班级'
                    },
                    {
                        field: 'des',
                        align:"center",
                        title: '说明'
                    },{
                    field: '',
                    align:"center",
                    title: '操作',
                    // width:'160px',
                    formatter: function(value, row, index) {
                           var obj={};
                           for(var i in row){
                               if(typeof row[i]=='string') {
                                   obj[i] = row[i].split(' ').join('');
                               }else {
                                   obj[i] = row[i]
                               }
                           }
                           var rows = JSON.stringify(obj);
                           if(row.state==0){
                               var a='<a class="blue" data-id='+row.id+' data-rows='+rows+' onclick="sl_Mask.dormitory_Apply($(this),mainPage.Apply)" style="cursor: pointer">待审批</a>'
                           }
                           if(row.state==1){
                               var a='<a class="" data-id='+row.id+'  data-rows='+rows+' onclick="sl_Mask.dormitory_Apply_look($(this))" style="cursor: pointer">已审批</a>'
                           }
                           if(row.state==-1){
                               var a='<a class="red" data-rows='+rows+' onclick="sl_Mask.dormitory_Apply_look($(this))" style="cursor: pointer">已拒绝</a>'
                           }
                            return a;
                    }
                }],
            responseHandler:function(result){
                if(result.error){
                    if(400<=result.error.errorCode&&result.error.errorCode<=500){
                        tool().judge_token(function () {
                            parent.location.href=loginSrc;
                        })
                    }else {
                        sl_Mask.NoTip(result.error.message);
                        return {
                            "rows":'',
                            "total":''
                        }
                    }
                }else{
                    return {
                        "rows":result.data.list,
                        "total":result.data.count
                    }
                }
            },
            formatLoadingMessage: function(){
                return '<img src="../img/loading.gif" style="margin: 60px auto" width="20px" height="20px">';
            },
            onCheck:function(value, row, index){ //单行
                $('#table1  tr.selected td label i.material-icons').text('check_box');
                var flag=$('#table1 th input[type="checkbox"]').prop('checked')
                if(flag){
                    $('#table1 th label').addClass('active');
                    $('#table1 th label i.material-icons').text('check_box');
                }else {
                    $('#table1 th label').removeClass('active');
                    $('#table1 th label i.material-icons').text('check_box_outline_blank');
                }
                // var a= $('#table1').bootstrapTable('getSelections');
                // if(a.length==10){
                //     $('#table1 th label').addClass('active');
                // }
            },
            onUncheck:function(e){ //单行
                for(var i=0;i<$('#table1  tr').length;i++){
                    if(!$('#table1  tr').eq(i).hasClass('selected')){
                        $('#table1  tr:nth-child('+i+') td label i.material-icons').text('check_box_outline_blank');
                    }
                }
                $('#table1 th label').removeClass('active');
                $('#table1 th label i.material-icons').text('check_box_outline_blank');
            },
            onCheckAll:function(value, row, index){ //全选
                $('#table1 th label').addClass('active')
                $('#table1 th label i.material-icons').text('check_box');
                $('#table1  tr td label i.material-icons').text('check_box');
            },
            onUncheckAll:function(value, row, index){ //全不选
                $('#table1 th label').removeClass('active');
                $('#table1 th label i.material-icons').text('check_box_outline_blank');
                $('#table1  tr td label i.material-icons').text('check_box_outline_blank');
            },
            onLoadSuccess:function (data) {
                if(data.rows.length>0){
                    $('#table1').bootstrapTable('showColumn', 'variablevalue');
                }else {
                    $('#table1').bootstrapTable('hideColumn', 'variablevalue');
                }
            }
        })
    }
    //全部
    _m.all_table = function(filed){
        var val1=$('#search').val();
        var semester=$('select[name="termid"]').val();
        $('#account').find('#table1').bootstrapTable('destroy');
        var params={
            token:token,
            faid:userId
        }
        if($.trim(val1)){params.keyword=val1};
        if($.trim(semester)){params.semester=semester};
        if(filed) $.extend(params,filed);
        self.table(params);
    }
    //搜索
    _m.search_table = function () {
        self.all_table()
    }
    //添加新用户
    //键盘事件
    _m.keywords = function () {
        $(document).keyup(function(event) {
            var e=event||window.event;
            if(e.keyCode == 13) {
                self.search_table();
            }
        });
    }
    //批量删除
    _m.deleteUserList = function(type) {
        //获取所有被选中的记录
        var rows = $("#table1").bootstrapTable('getSelections');
        var arr0 =[];
        if (rows.length == 0) {
            sl_Mask.NoTip("请先选择待审批学生");
            return;
        }else {
            for (var i = 0; i < rows.length; i++) {
                // ids += rows[i]['id'] + ",";
                if(rows[i]['state']==0){arr0.push(rows[i]['id'])}//正常状态
            }
            if(arr0.length>0){
                tool().Switched_Roles('images1/Score.png','确定提交本次批量审批',function () {
                    if (arr0.length > 1) {
                        self.ApplyMore(type, 1, arr0);
                    } else {
                        self.ApplyMore(type, 0, arr0);
                    }
                })
             }else {
                sl_Mask.NoTip("请先选择待审批学生");
            }
        }
        // var ids = '';

        // ids = ids.substring(0, ids.length - 1);
        // deleteUser(ids);
    }
    //批量审批的接口
    _m.ApplyMore = function (stateS,num,ids) {
        var arrUrls = ['/inResidenceApply/approve.action','/inResidenceApply/approves.action'];
        var params = {
            token:token,
            faid:userId,
            state:stateS
        }
        if(num==0){params.id = ids.join('-')}//单个审批
        if(num==1){params.ids_str = ids.join('-')}//多个审批
        var loadings= top.layui.layer.load(2);
        $.axse(urls +arrUrls[num], params, function (result) {
            top.layui.layer.close(loadings);
            sl_Mask.YesTip('审批成功');
            $('#table1').bootstrapTable('refresh');
            $('#table1 th label').removeClass('active');
        },function () {
            top.layui.layer.close(loadings);
        })
    }
    //审批
    _m.Apply = function (filed,index) {
        var params={
            token:token,
            faid:userId
           }
        if(filed) $.extend(params,filed);
        var loadings= top.layui.layer.load(2);
        $.axse(urls + '/inResidenceApply/approve.action', params, function (result) {
            top.layui.layer.close(loadings);
            sl_Mask.YesTip('审批成功');
            $('#table1').bootstrapTable('refresh');
            $('#table1 th label').removeClass('active');
            top.layer.close(index);
        },function () {
        })
    }
    return _m;
})();
mainPage.init();
//
// input搜索
var query = new Query_table('QueryWrap',{
    tip:'请输入学生姓名',
    successFn:mainPage.search_table
})
// 点击状态搜索
var ForState = new ForState_Totable('ForState');