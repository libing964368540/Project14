layui.use(['layer', 'form', 'element'], function(){
    var layer = layui.layer
        ,form = layui.form
        ,element = layui.element
    var Information=null;
    var downFileData=null;
    if(sessionStorage.identity_id==8){
        mainPage.majorClass();
        form.render();
    }else {
        tool().editMajorGroup($('#student_all'),'',2,mainPage.oneClass_table);
        form.render();
    }
})
mainPage=(function(){
    var _m = {};
    var self = _m;
    //初始化
    _m.init=function(){
        self.all_table();
        self.keyword();
        self.downFile();
    }
    //下载报告
    _m.downFile = function () {
        var objs= {
            project_id:1
        }
        $.extend(downFileData,objs);
        delete downFileData.page;
        delete downFileData.size;
        var val1=$('#search').val();
        var val_cids=$('select[name="classgaderid"]').val();
        if(!$.trim(val1)){ delete downFileData.keyword};
        if(!$.trim(val_cids)){ delete downFileData.cids};
        var download_Score = new DownLoadTemplate('DownFile',{
            url:'/fileAccount/getStudentPerformance.action',
            filed:downFileData
        })
    }
    //生成表格
    _m.table=function (filed) {
        if(!filed.token||!sessionStorage.identity_id){
            tool().judge_token(function () {
                top.location.href=loginSrc;
            })
            return;
        }
        if(filed) $.extend(filed,pclogin);
         $('#student_all').find('#table1').bootstrapTable('destroy');
           $('#table1').bootstrapTable({
               url:urls + studentList,
               queryParams:function(params){
                   var obj={
                       size:params.limit,
                       page:params.offset/params.limit,
                       state: 1
                   }
                   //核心素养排序
                   if(params.sort=='total'){
                           obj.sort=1;
                           obj.sortType=params.order=='asc'?0:1;
                   }
                   //学号排序
                   if(params.sort=='rq'){
                       obj.sort=2;
                       obj.sortType=params.order=='asc'?0:1;
                   }
                   //默认值
                   if (!params.sort) {
                       obj.sort=1;
                       obj.sortType = 1;
                   }
                   if(filed) $.extend(obj,filed);

                   downFileData = obj;

                   return obj;
               },
               sidePagination: "server",
               contentType:"application/x-www-form-urlencoded; charset=UTF-8",
               method: 'POST',
               async:true,
               pagination: true,
               // striped:true,
               cache:false,
               paginationLoop: false,
               paginationShowPageGo: true,
               pageNumber:1,
               pageSize: 10,
               pageList: [10, 20, 50,100],
               columns: [{
                   field: '',
                   align:"left",
                   title: '学生姓名',
                   width:'60px',
                   formatter: function(value, row, index) {
                       if(row.accountData.photopath){
                           var a='<span class="school_imgwrap"><img src="'+ImgurlHttp+row.accountData.photopath+'" alt="" ></span>'
                       }else {
                           var a='<span class="school_imgwrap"><img src="../../images1/header.png" alt="" ></span>'
                       }
                       return a;
                   }
               } ,{
                   field: '',
                   align: "left",
                   title: '',
                   width:'100px',
                   formatter: function(value, row, index) {
                       var rname=row.accountData.rname;
                       var a='<a onclick="ForStudent().SeeClassUser('+row.id+')" href="javascript:;" class="tableRname">'+rname+'</a>'
                       return a;
                   }
               }, {
                    field: 'rq',
                    align: "left",
                    title: '学籍号',
                    sortable:true,
                    class:'SortClass',
                   formatter: function(value, row, index) {
                       if(row.accountData.identitysData[6]){
                           if(row.accountData.identitysData[6].st_main_number){
                               var a= row.accountData.identitysData[6].st_main_number
                           }else {
                               var a= '暂无'
                           }
                           return a

                       }else {
                           return '暂无'
                       }
                   }

               }, {
                   field: 'msg',
                   align: "left",
                   width: '14.2%',
                   title: '专业部',
                   formatter: function(value, row, index) {
                       if(row.accountData.identitysData[6]){
                           if(row.accountData.identitysData[6].majors){
                               var a=tool().basicMHandle(row.accountData.identitysData[6].majors,4);
                               return a;
                           }else {
                               return '暂无'
                           }
                       }else {
                           return '暂无'
                       }
                   }
               }, {
                   field: 'banji',
                   align: "left",
                   // width: '14.2%',
                   title: '班级',
                   formatter: function(value, row, index) {
                       if(row.accountData.identitysData[6]){
                           if(row.accountData.identitysData[6].classgrades){
                               var a= tool().basicMHandle(row.accountData.identitysData[6].classgrades,1);
                           }else {
                               var a= '暂无'
                           }
                           return a

                       }else {
                           return '暂无'
                       }
                   }
               },
                   {
                       field: '',
                       align: "left",
                       title: '总加分',
                       formatter: function(value, row, index) {
                           if(row.accountData.identitysData[6].st_performance){
                               var st_performance=row.accountData.identitysData[6].st_performance.aValue
                               return st_performance;
                           }else{
                               return Num;
                           }

                       }
                   },
                   {
                       field: '',
                       align: "left",
                       title: '总减分',
                       formatter: function(value, row, index) {
                           if(row.accountData.identitysData[6].st_performance){
                               var st_performance=row.accountData.identitysData[6].st_performance.mValue;
                               if(st_performance){
                                   return '- '+st_performance;
                               }else {
                                   return 0;
                               }

                           }else{
                               return 0;
                           }

                       }
                   },
                   {
                       field: '',
                       align: "left",
                       title: '核心素养',
                        sortable:true,
                       class:'SortClass',
                       formatter: function(value, row, index) {
                           var grade = row.accountData.identitysData[6].st_performance.grade;
                           var Num = 0;
                           if(row.accountData.identitysData[6].st_performance){
                               var st_performance=Num+row.accountData.identitysData[6].st_performance.value
                               return st_performance+'（'+grade+'）';
                           }else{
                               return Num+'（'+grade+'）';
                           }

                       }
                   },
                   {
                       field: '',
                       align: "left",
                       title: '操作',
                        width: '12%',
                       formatter: function(value, row, index) {
                           var rname=row.accountData.rname;
                           // var a='<a class="blue" onclick="ForStudent().SeeClassUser('+row.id+')"style="margin-right: 20px">查看</a>'
                           var b="<a class='red' onclick='ForStudent().studentRecord("+row.id+")'>打分</a>";
                           return b;
                       }
                   }
               ],
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
               onClickCell:function (value, row, index) {
                        // console.log(this);
               },
               onClickRow:function (value, row, index) {
                   Information= value
               }

           })
    }
    //全部
    _m.all_table = function(){
           var val1=$('#search').val();
           var val_cids=$('select[name="classgaderid"]').val();
            var params={
               token:token,
               faid:userId,
               iids:'6',
               state:1
             }
             if($.trim(val1)){params.keyword=val1};
             if($.trim(val_cids)){params.cids=val_cids};
             self.table(params);
    }
    //通过班级筛选学生
    _m.oneClass_table = function (cids) {
        self.all_table();
        self.downFile();

    }
    //搜索
    _m.search = function () {
        self.all_table();
        self.downFile();
    }
    //键盘事件
    _m.keyword = function () {
            $(document).keyup(function(event) {
                var e=event||window.event;
                if(e.keyCode == 13) {
                    self.search()
                }
            });
        self.downFile();
        }
    //在专业部权限下所有班级
    _m.majorClass=function () {
        //通过专业部获取专业， 通过专业获取班级
        var obj=JSON.parse(sessionStorage.positionId);
        if(obj[8].majorGroup) {
            $('select[name="groupid"]').html('<option value="'+obj[8].majorGroup.id+'">'+obj[8].majorGroup.name+'</option>');
            $('select[name="groupid"]').hide();
            tool().editMajor($('#student_all'),obj[8].majorGroup.id,'',2,mainPage.oneClass_table);
        }
    }

    return _m;

})();
mainPage.init();
var query = new Query_table('QueryWrap',{
    tip:'请输入学生姓名',
    successFn:mainPage.search
})

