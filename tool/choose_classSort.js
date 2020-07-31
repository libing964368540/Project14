var add_edit_MaskS = '<div style="padding:0 30px;color:#898989;font-size: 14px" class="layui-form">' +
    '<div class="clear">' +
    '<div>'+
    '<div class="lf LeftWrap">' +
    '<ul class="wrap"></ul>' +
    '<span class="school_Btn yesTip"style="margin-right: 20px;width: 80px">确定</span>' +
    '<span class="school_Btn NoTip"style="background: #f3f5f8;color:#8b8b8b;width: 80px">取消</span>' +
    '</div>'+
    '<div class="rg RightWrap" style="margin-top: 30px">' +
    '<ul id="treeDemo" class="ztree" ></ul>' +
    '</div>'+
    '</div>'+
    '</div>' +
    '</div>';
/*
* 通过多选班级  并且排序 （用于智能排寝）
* */
function choose_classSort(ids,opt) {
    var oBox = document.getElementById(ids);
    this.typeUrl = opt.url; //寝室接口
    this.fn = opt.fn;
    this.selectedArr = [];
    this.selectedID = [];
    var _this = this;
        oBox.onclick = function () {
           _this.mask();
       }
}
//弹框
choose_classSort.prototype.mask = function () {
    var _this=this;
    var index = top.layer.open({
        type: 1,
        title: '选择班级',
        closeBtn: 1,
        shadeClose: false,
        skin: 'grades',
        area: ['700px', 'auto'],
        content: add_edit_MaskS,
        btnAlign: 'l',
        success: function (layero, index) {
            var parents = $(layero); //获取弹框元素
            //初始化树形班级
            _this.tree(parents);
            //取消按钮的事件
            parents.find('.NoTip').unbind('click').bind('click',function () {
                top.layer.close(index);
                _this.selectedArr = [];
                _this.selectedID = [];
            })
            //确定按钮的事件
            //点击确定按钮事件
            parents.find('.yesTip').unbind('click').bind('click',function () {
                if(_this.selectedArr.length>0){
                   _this.fn(_this.selectedArr.join('；'),_this.selectedID.join('-'));
                }else {
                   sl_Mask.NoTip('请选择班级');
                   return;
                }
                _this.selectedID=[];
                _this.selectedArr=[];
                top.layer.close(index);
            })

        },
        cancel: function(index, layero){
            _this.selectedArr=[];
            _this.selectedID=[];
        }
    })
}
//初始化获取树形结构
choose_classSort.prototype.tree = function (obj) {
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
        _this.chooseClassTreeData(function (dormitoryTree) {
                $(document).ready(function(){
                    zTreeObj = $.fn.zTree.init(obj.find('#treeDemo'), setting, dormitoryTree);
                });
        })
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
             console.log(treeNode);
             //判断是否有子节点
            if(treeNode.isParent){
                for(var i=0;i<treeNode.children.length;i++){
                    _this.addOrDel(treeNode.children[i],obj);
                }
            }else {
                _this.addOrDel(treeNode,obj);
            }
        }
    }
//选择班级的树形结构
choose_classSort.prototype.chooseClassTreeData = function (fn) {
    var _this= this;
    var classTreeData = [
        {grade_id:2016,name:2016,children:[]},
        {grade_id:2017,name:2017,children:[]},
        {grade_id:2018,name:2018,children:[]},
        {grade_id:2019,name:2019,children:[]}
        // {grade_id:2020,name:2020,children:[]},
        // {grade_id:2021,name:2021,children:[]},
        // {grade_id:2022,name:2022,children:[]}
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
                    icon:'img/classgrade.png'
                })
            }
            if(list[i].grade==2017){
                classTreeData[1].children.push({
                    id:list[i].id,
                    name:list[i].name,
                    icon:'img/classgrade.png'
                })
            }
            if(list[i].grade==2018){
                classTreeData[2].children.push({
                    id:list[i].id,
                    name:list[i].name,
                    icon:'img/classgrade.png'
                })
            }
            if(list[i].grade==2019){
                classTreeData[3].children.push({
                    id:list[i].id,
                    name:list[i].name,
                    icon:'img/classgrade.png'
                })
            }
            // if(list[i].grade==2020){
            //     classTreeData[4].children.push({
            //         id:list[i].id,
            //         name:list[i].name,
            //         icon:'img/classgrade.png'
            //     })
            // }
            // if(list[i].grade==2021){
            //     classTreeData[5].children.push({
            //         id:list[i].id,
            //         name:list[i].name,
            //         icon:'img/classgrade.png'
            //     })
            // }
            // if(list[i].grade==2022){
            //     classTreeData[6].children.push({
            //         id:list[i].id,
            //         name:list[i].name,
            //         icon:'img/classgrade.png'
            //     })
            // }
        }
        fn(classTreeData)
    })

}
//选中的学生填充到左侧区域
choose_classSort.prototype.selectedClassgrade= function (data,obj) {
    var _this=this;
    // console.log(this.selectedID);
    // console.log(this.selectedArr);
    if(this.selectedID.indexOf(data.id)>-1){
        sl_Mask.NoTip('已选中该班级');
        return;
    }
    this.selectedArr.push(data.name);
    this.selectedID.push(data.id);
    var dom="";
    if(data.name){
        dom+='<li data-id='+data.id+' style="padding:0;background:#ffffff;display:block;"><div style="display:inline-block;padding:5px 10px;background:#f3f5f8;"><span data-id='+data.id+'>'+data.name+'</span><i class="material-icons" style="font-size: 16px;vertical-align: middle;margin-left: 5px" data-id='+data.id+' data-name="'+data.name+'">clear</i></div></li>' ;
        obj.find('.wrap').append(dom);
        obj.find('.wrap li i').unbind('click').bind('click',function () {
            var ids=$(this).attr('data-id');
            var names=$(this).attr('data-name');
            _this.selectedArr.remove(names);
            _this.selectedID.remove(ids);
            $(this).parent().remove();
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = treeObj.getCheckedNodes(true);
            for(var i=0;i<nodes.length;i++){
                if(!nodes[i].children&&nodes[i].id==ids){
                    nodes[i].checked=false;
                    treeObj.updateNode(nodes[i]);
                }
            }
        })
    }
}
//填充或删除选中节点
choose_classSort.prototype.addOrDel = function (node,obj) {
    var lis =  obj.find('.wrap li');
    var _this = this;
    if(node.checked){
        _this.selectedClassgrade({
              id:node.id,
            name:node.name
        },obj)
    }else {
        if(this.selectedID.indexOf(node.id)>-1){
            _this.selectedArr.remove(node.name);
            _this.selectedID.remove(node.id);
            for(var i=0;i<lis.length;i++){
                if(lis.eq(i).attr('data-id')==node.id){
                    lis.eq(i).remove();
                }
            }

        }
    }
}