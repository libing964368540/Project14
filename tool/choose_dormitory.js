var add_edit_Mask = '<div style="padding:0 30px;color:#898989;font-size: 14px" class="layui-form">' +
    '<div class="clear" style="padding-bottom: 20px">' +
    '<div >'+
    '<div class="lf RightWrap" style="margin-top: 20px;width: 100%;margin-bottom: 10px">' +
    '<div class="searchContent" style="display: none"></div>' +
    '<ul id="treeDemo" class="ztree" ></ul>' +
    '</div>'+
    '<span class="school_Btn yesTip"style="margin-right: 20px;width: 80px">确定</span>' +
    '<span class="school_Btn NoTip"style="background: #f3f5f8;color:#8b8b8b;width: 80px">取消</span>' +
    '</div>'+
    '</div>' +
    '</div>';
/*
* 通过树形选择  寝室  进行智能排寝
* */
function choose_classgradeS(ids,opt) {
    var oBox = document.getElementById(ids);
    var _this = this;
    this.typeUrl = opt.url; //寝室接口
    this.dormitory_type = opt.dormitory_type; //寝室类型  1是男  2是女
    this.title = opt.title;
    this.fn = opt.fn;
    this.selectedArr = [];
    this.selectedID = [];
    oBox.onclick=function () {
        _this.Mask();
    }
}
choose_classgradeS.prototype.Mask = function () {
    var _this=this;
    var index = top.layer.open({
        type: 1,
        title: _this.title,
        closeBtn: 1,
        shadeClose: false,
        skin: 'grades',
        area: ['500px', 'auto'],
        content: add_edit_Mask,
        btnAlign: 'l',
        success: function (layero, index) {
            var parents = $(layero);
            //初始化树形
            _this.tree(parents);
            //确定
            parents.find('.yesTip').unbind('click').bind('click',function () {
                if(_this.selectedArr.length>0){
                    _this.fn(_this.selectedArr.join('；'),_this.selectedID.join('-'));
                    top.layer.close(index);
                }else {
                    sl_Mask.NoTip('请'+_this.title);
                }
            })
            //取消
            //取消按钮的事件
            parents.find('.NoTip').unbind('click').bind('click',function () {
                top.layer.close(index);
                _this.selectedArr = [];
                _this.selectedID = [];
            })
        },
        cancel: function(index, layero){
                _this.selectedArr=[];
                _this.selectedID=[];
            }

    })
}
//初始化获取树形结构
choose_classgradeS.prototype.tree = function (obj) {
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
        check: {
            enable: true,     //这里设置是否显示复选框
            chkboxType: { "Y": "ps", "N": "ps" }      //设置复选框是否与 父/子 级相关联
        },
        callback: {
            onDblClick: null,
            onClick:zTreeonClick,
            onExpand:zTreeonDblClick,
            onCheck: zTreeOnCheck
        }
    };
       if(_this.title=='选择班级'){
           _this.chooseClassTreeData(function (dormitoryTree) {
               $(document).ready(function(){
                   zTreeObj = $.fn.zTree.init(obj.find('#treeDemo'), setting, dormitoryTree);
               });
           })
       }else {
           _this.getDormitoryTreeData(function (dormitoryTree) {
               $(document).ready(function(){
                   zTreeObj = $.fn.zTree.init(obj.find('#treeDemo'), setting, dormitoryTree);
               });
           })
       }


    function showIconForTree(treeId, treeNode) {
        return !treeNode.isParent;
    };
    //双击击时获取zTree节点的Id,和value的值
    function zTreeonDblClick(event, treeId, treeNode, clickFlag) {
        if(treeNode.isParent&&treeNode.children.length==0){

        }
    };
    //单击时获取zTree
    function zTreeonClick(event, treeId, treeNode, clickFlag) {

    }
    //单击多选框
    function zTreeOnCheck(zTree, treeId, treeNode) {
        _this.selectedArr=[];
        _this.selectedID=[];
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var nodes = treeObj.getCheckedNodes(true);
            for(var i=0;i<nodes.length;i++){
               if(!nodes[i].children){
                   _this.selectedArr.push(nodes[i].name);
                   _this.selectedID.push(nodes[i].id);
               }
            }
    }
}
//通过接口获取班级树
choose_classgradeS.prototype.getDormitoryTreeData = function (fn) {
    var dormitoryTree = [
        {school_id:1,
            name:'丁桥校区',
            children:[
                {floor_id:11,name:"一层",school_district_id:1,floor:1,children:[]},
                {floor_id:12,name:"二层",school_district_id:1,floor:2, children:[]},
                {floor_id:13,name:"三层",school_district_id:1,floor:3, children:[]},
                {floor_id:14,name:"四层",school_district_id:1,floor:4, children:[]},
                {floor_id:15,name:"五层",school_district_id:1,floor:5, children:[]},
                {floor_id:16,name:"六层",school_district_id:1,floor:6, children:[]},
                {floor_id:17,name:"七层",school_district_id:1,floor:7, children:[]}
            ]
        },//丁桥校区
        {school_id:2,
            name:'翠苑校区',
            children:[
                {floor_id:21,name:"一层",school_district_id:2,floor:1, children:[]},
                {floor_id:22,name:"二层",school_district_id:2,floor:2, children:[]},
                {floor_id:23,name:"三层",school_district_id:2,floor:3, children:[]},
                {floor_id:24,name:"四层",school_district_id:2,floor:4, children:[]},
                {floor_id:25,name:"五层",school_district_id:2,floor:5, children:[]},
                {floor_id:26,name:"六层",school_district_id:2,floor:6, children:[]},
                {floor_id:27,name:"七层",school_district_id:2,floor:7, children:[]}
            ]
        } //翠苑校区
    ]
    var _this = this;
    var params={
        token:token,
        faid:userId,
        dormitory_type:_this.dormitory_type
    }
    var loadings= top.layui.layer.load(2);
    setTimeout(function () {
        top.layui.layer.close(loadings);
    }, 3000)
    $.axse(urls+ _this.typeUrl, params, function (result) {
        top.layui.layer.close(loadings);
        var list = result.data.list.reverse();
        var sexObj = {
            1:"男生寝室",
            2:"女生寝室"
        }
        for(var i=0;i<list.length;i++){
            var lenghts= list[i].accounts.length;
            var a = lenghts + '/'+ list[i].capacity
            //填充校区
            if(list[i].school_district_id==1){//丁桥
                    dormitoryTree[0].children[list[i].floor-1].children.push({
                        id:list[i].ID,
                        name:sexObj[list[i].dormitory_type]+'-'+list[i].number+'(床位：'+a+')',
                        icon:'img/students.png'
                    })
            }
            if(list[i].school_district_id==2){//翠苑
                dormitoryTree[1].children[list[i].floor-1].children.push({
                    id:list[i].ID,
                    name:sexObj[list[i].dormitory_type]+'-'+list[i].number+'(床位：'+a+')',
                    icon:'img/students.png'
                })
            }
        }
        fn(dormitoryTree)
    });
}
//选择班级的树形结构
choose_classgradeS.prototype.chooseClassTreeData = function (fn) {
    var _this= this;
    var classTreeData = [
        {grade_id:2016,name:2016,children:[]},
        {grade_id:2017,name:2017,children:[]},
        {grade_id:2018,name:2018,children:[]},
        {grade_id:2019,name:2019,children:[]},
        {grade_id:2020,name:2020,children:[]},
        {grade_id:2021,name:2021,children:[]},
        {grade_id:2022,name:2022,children:[]}
    ];
    var params={
        token:token,
        faid:userId,
        size:500
    }
    var loadings= top.layui.layer.load(2);
    setTimeout(function () {
        top.layui.layer.close(loadings);
    }, 3000)
    $.axse(urls+ _this.typeUrl, params, function (result) {
        top.layui.layer.close(loadings);
         var list = result.data.list.reverse();
        for(var i=0;i<list.length;i++){
            if(list[i].grade==2016){
                classTreeData[0].children.push({
                     id:list[i].id,
                     name:list[i].name,
                     icon:'img/students.png'
                })
            }
            if(list[i].grade==2017){
                classTreeData[1].children.push({
                    id:list[i].id,
                    name:list[i].name,
                    icon:'img/students.png'
                })
            }
            if(list[i].grade==2018){
                classTreeData[2].children.push({
                    id:list[i].id,
                    name:list[i].name,
                    icon:'img/students.png'
                })
            }
            if(list[i].grade==2019){
                classTreeData[3].children.push({
                    id:list[i].id,
                    name:list[i].name,
                    icon:'img/students.png'
                })
            }
            if(list[i].grade==2020){
                classTreeData[4].children.push({
                    id:list[i].id,
                    name:list[i].name,
                    icon:'img/students.png'
                })
            }
            if(list[i].grade==2021){
                classTreeData[5].children.push({
                    id:list[i].id,
                    name:list[i].name,
                    icon:'img/students.png'
                })
            }
            if(list[i].grade==2022){
                classTreeData[6].children.push({
                    id:list[i].id,
                    name:list[i].name,
                    icon:'img/students.png'
                })
            }
        }
        fn(classTreeData)
    })

}