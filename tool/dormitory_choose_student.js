var add_edit_Mask = '<div style="padding:0 30px;color:#898989;font-size: 14px" class="layui-form">' +
    '<div class="clear">' +
    '<div class="rg" style="line-height: 30px;padding: 5px;padding-left:17px;width:320px;">' +
    '<input type="text" class="layui-input" id="layui-search" placeholder="搜索学生姓名..."><i class="material-icons search_delBtn" style="font-size: 16px;vertical-align: middle;margin-left: 5px;display: none;cursor: pointer;" >cancel</i></div>'+
    '<div>'+
    '<div class="lf LeftWrap">' +
    '<ul class="wrap"></ul>' +
    '<span class="school_Btn yesTip"style="margin-right: 20px;width: 80px">确定</span>' +
    '<span class="school_Btn NoTip"style="background: #f3f5f8;color:#8b8b8b;width: 80px">取消</span>' +
    '</div>'+
    '<div class="rg RightWrap">' +
    '<div class="searchContent" style="display: none"></div>' +
    '<ul id="treeDemo" class="ztree" ></ul>' +
    '</div>'+
    '</div>'+
    '</div>' +
    '</div>';
/*
* 该插件主要用于 添加寝室以及竞赛人员添加  弹框 用于单选学生和班级
*  objs 调用时传入的对象
* */
function dormitory_choose_student(objs) {

    this.oBox = objs.obj;  //操作对象
    this.url = objs.url;   //获取学生的链接
    this.selectedArr = [];
    this.selectedID = [];
    this.treeType = objs.treeType;
    this.fn = objs.fn;
    this.mask();
              // 不传值tree以专业部开头      1 树形以年级为开头
}
dormitory_choose_student.prototype.mask = function () {
    var  _this=this;
    var index = top.layer.open({
        type: 1,
        title: '选择学生',
        closeBtn: 1,
        shadeClose: false,
        skin: 'grades',
        area: ['700px', 'auto'],
        content: add_edit_Mask,
        btnAlign: 'l',
        success: function (layero, index) {
            var parents = $(layero);
            var searchBtn = $(layero).find('#layui-search');
            //首次加载树形刷选
            _this.tree(parents);
            //通过姓名搜索学生
            searchBtn.on('keyup',function () {
                var values = this.value;
                if(values){parents.find('.search_delBtn').show();
                }else {parents.find('.search_delBtn').hide();}
                _this.getStudent(values,parents);
            })
            //删除姓名搜索学生
            parents.find('.search_delBtn').unbind('click').bind('click',function () {
                searchBtn.val('');
                $(this).hide();
                _this.getStudent('',parents);
            })
            //确认按钮处理事件
            parents.find('.yesTip').unbind('click').bind('click',function () {
                 // alert(_this.selectedArr+'__'+_this.selectedID);
                if(_this.selectedArr.length>0){
                    _this.fn(_this.selectedID[0]);
                }
                _this.selectedID=[];
                _this.selectedArr=[];
                top.layer.close(index);
            })
            //取消按钮处理的事件
            parents.find('.NoTip').unbind('click').bind('click',function () {
                _this.selectedArr = [];
                _this.selectedID = [];
                top.layer.close(index);
            })
        },
        cancel: function(index, layero){
            _this.selectedArr=[];
            _this.selectedID=[];
        }
    })
}
//通过姓名获取学生接口
dormitory_choose_student.prototype.getStudent= function (keyword,parents) {
    var _this = this;
    if(!keyword){
        parents.find('#treeDemo').show();
        parents.find('.searchContent').hide().empty();
        return;
    }
    var params={
        token:token,
        faid:userId,
        keyword:keyword,
        size:200,
        state:1
    }
    $.axse(urls+_this.url, params, function (result) {
        parents.find('#treeDemo').hide();
        var dom="";
        var list=result.data.list;
        parents.find('.searchContent').show().empty();
        if(list.length>0){
            for(var i=0;i<list.length;i++){
                dom+="<li data-id='"+list[i].id+"' title='"+list[i].accountData.rname+"'><span><i class='s_Icon'></i>"+list[i].accountData.rname+"</span></li>";
            }
        }else{
              dom +="<li style='line-height: 30px;text-align: center'>无匹配数据</li>";
        }
        parents.find('.searchContent').append(dom);
        parents.find('.searchContent').find('li').unbind('click').bind('click',function () {
            _this.selectedStudent({
                id: $(this).attr('data-id'),
                name:$(this).attr('title')
            },parents);
        })
    })
}
//初始化获取树形结构
dormitory_choose_student.prototype.tree = function (obj) {
    var _this = this;
    // var zTreeObj;
    // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    var setting = {
        isSimpleData : true,              //数据是否采用简单 Array 格式，默认false
        treeNodeKey : "id",               //在isSimpleData格式下，当前节点id属性
        treeNodeParentKey : "pId",        //在isSimpleData格式下，当前节点的父节点id属性
        showLine : true,                  //是否显示节点间的连线
        checkable : true,
        enable : true,
        view: {
            showIcon: showIconForTree
        },
        callback: {
            onDblClick: null,
            onClick:zTreeonClick,
            onExpand:zTreeonDblClick
        }
    };
    if(_this.treeType==1){
        _this.GradeTree(function (tree) {
            $(document).ready(function(){
                zTreeObj = $.fn.zTree.init(obj.find('#'), setting, tree);
            });
        });
    }else {
        classgrade_Tree.tree(function (tree) {
            $(document).ready(function(){
                zTreeObj = $.fn.zTree.init(obj.find('#treeDemo'), setting, tree);
            });
        },1)
    }
   
    function showIconForTree(treeId, treeNode) {
        return !treeNode.isParent;
    };
    //双击击时获取zTree节点的Id,和value的值
    function zTreeonDblClick(event, treeId, treeNode, clickFlag) {
        console.log(event);
        console.log(treeId);
        console.log(treeNode);
        console.log(clickFlag);
        // var treeValue = treeNode.id + "," + treeNode.name;
        //        alert(treeNode.id + "," + treeNode.name);
        if(treeNode.isParent&&treeNode.children.length==0){
            // _this.classgrade(treeNode.id)
            if(treeNode.type=="group"){
                _this.Major(treeNode.id);
            }
            if(treeNode.type=="major"){
                _this.grade(treeNode.Major_id);
            }
            if(treeNode.type=="grade"){
                _this.classgrade(treeNode.grade_id);
            }
        }
    };
    //单击时获取zTree
    function zTreeonClick(event, treeId, treeNode, clickFlag) {
        console.log(!treeNode.isParent);
        if(!treeNode.isParent){
            _this.selectedStudent({
                id:treeNode.id,
                name:treeNode.name
            },obj)
        }
    }

}
//给树形结构中插入动态的专业
dormitory_choose_student.prototype.Major = function (groupId) {
    var arr_M=[];
    var params={
        faid:userId,
        token:token,
        groupid:groupId
    }
    $.axse(urls+Get_Major,params,function(result){
        var data=result.data;
        for(var i=0;i<data.length;i++){
            arr_M.push({
                "Major_id":data[i].id,
                "name":data[i].name,
                "type":"major",
                "children":[]
            })
        }
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var parentZNode = treeObj.getNodeByParam("id", groupId, null);//获取指定父节点
        newNode = treeObj.addNodes(parentZNode,arr_M, false);
    })
}
//给树形结构中插入动态的班级
dormitory_choose_student.prototype.grade = function (majorid) {
    var _this=this;
    var arr_C=[];
    var params ={
        faid:userId,
        token:token,
        major_id:majorid,
        size:100
    }
    $.axse(urls+Get_MajorClass,params,function(result){
        var data=result.data.list;
            for(var i=0;i<data.length;i++){
                arr_C.push({
                    "grade_id":data[i].id,
                    "name":data[i].name,
                    "children":[],
                    "type":"grade"
                })
            }
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var parentZNode = treeObj.getNodeByParam("Major_id", majorid, null);//获取指定父节点
        newNode = treeObj.addNodes(parentZNode,arr_C, false);
    })
}
//给树形结构中插入动态插入学生
dormitory_choose_student.prototype.classgrade = function (cids) {
    var _this = this;
    var params={
        token:token,
        faid:userId,
        size:100
    }
    params.cids=cids
    var loadings = top.layui.layer.load(2);
    $.axse(urls+ _this.url, params, function (result) {
        top.layui.layer.close(loadings);
        var list = result.data.list;
        var jsondata=[];
            for(var i=0;i<list.length;i++){
                jsondata.push({
                    id:list[i].id,
                    name:list[i].accountData.rname,
                    icon:'img/students.png'
                })
            }
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var parentZNode = treeObj.getNodeByParam("grade_id", cids, null);//获取指定父节点
        newNode = treeObj.addNodes(parentZNode,jsondata, false);
    },function () {
        top.layui.layer.close(loadings);
    })
}
//选中的学生填充到左侧区域
dormitory_choose_student.prototype.selectedStudent = function (data,obj) {
    var _this=this;
    console.log(this.selectedID);
    console.log(this.selectedArr);
    if(this.selectedID.indexOf(data.id)>-1){
        sl_Mask.NoTip('已选中该学生');
        return;
    }
    this.selectedID=[];
    this.selectedArr=[];
    this.selectedArr.push(data.name);
    this.selectedID.push(data.id);
    var dom="";
    dom+='<li><span data-id='+data.id+'>'+data.name+'</span><i class="material-icons" style="font-size: 16px;vertical-align: middle;margin-left: 5px" data-id='+data.id+' data-name="'+data.name+'">clear</i></li>'
    obj.find('.wrap').empty().append(dom);
    obj.find('.wrap li i').unbind('click').bind('click',function () {
        var ids=$(this).attr('data-id');
        var names=$(this).attr('data-name');
        _this.selectedArr.remove(names);
        _this.selectedID.remove(ids);
        $(this).parent().remove();
    })
}


/*新增通过年级为开头tree筛选*/
dormitory_choose_student.prototype.GradeTree = function (fn) {
    var _this = this;
    var classTreeData = [
        {grade_id: 2016, name: 2016, children: []},
        {grade_id: 2017, name: 2017, children: []},
        {grade_id: 2018, name: 2018, children: []},
        {grade_id: 2019, name: 2019, children: []}
        // {grade_id: 2020, name: 2020, children: []},
        // {grade_id: 2021, name: 2021, children: []},
        // {grade_id: 2022, name: 2022, children: []}
    ];
    var params = {
        token: token,
        faid: userId,
        size: 500
    }
    var loadings = top.layui.layer.load(2);
    $.axse(urls + '/classgrade/getClassgrades.action', params, function (result) {
        top.layui.layer.close(loadings);
        var list = result.data.list.reverse();
        for (var i = 0; i < list.length; i++) {
            if (list[i].grade == 2016) {
                    classTreeData[0].children.push({
                        "grade_id": list[i].id,
                        "name": list[i].name,
                        "children": [],
                        "type": "grade"
                    })
            }
            if (list[i].grade == 2017) {
                    classTreeData[1].children.push({
                        "grade_id": list[i].id,
                        "name": list[i].name,
                        "children": [],
                        "type": "grade"
                    })
            }
            if (list[i].grade == 2018) {
                    classTreeData[2].children.push({
                        "grade_id": list[i].id,
                        "name": list[i].name,
                        "children": [],
                        "type": "grade"
                    })
            }
            if (list[i].grade == 2019) {
                    classTreeData[3].children.push({
                        "grade_id": list[i].id,
                        "name": list[i].name,
                        "children": [],
                        "type": "grade"
                    })
            }
            // if (list[i].grade == 2020) {
            //         classTreeData[4].children.push({
            //             "grade_id": list[i].id,
            //             "name": list[i].name,
            //             "children": [],
            //             "type": "grade"
            //         })
            //      }
            // if (list[i].grade == 2021) {
            //         classTreeData[5].children.push({
            //             "grade_id": list[i].id,
            //             "name": list[i].name,
            //             "children": [],
            //             "type": "grade"
            //         })
            // }
            // if (list[i].grade == 2022) {
            //         classTreeData[6].children.push({
            //             "grade_id": list[i].id,
            //             "name": list[i].name,
            //             "children": [],
            //             "type": "grade"
            //         })
            // }
        }
        fn(classTreeData)
    },function () {
        top.layui.layer.close(loadings);
    })
}
