var add_edit_Mask = '<div style="padding:0 30px;color:#898989;font-size: 14px" class="layui-form">' +
    '<div class="clear">' +
    '<div class="rg" style="line-height: 30px;padding: 5px;padding-left:17px;width:320px;">' +
    '<input type="text" class="layui-input" id="layui-search"><i class="material-icons search_delBtn" style="font-size: 16px;vertical-align: middle;margin-left: 5px;display: none;cursor: pointer;" >cancel</i></div>'+
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
* 该组件是封装通过 搜索 和 树形结构  查询学生的的弹框
*  fn   为回调函数
*
* */
function choose_Student(ids,data,type,fn) {
    var oBox =  document.getElementById(ids);
    this.selectedArr = [];
    this.selectedID = [];
    this.oBox=oBox;
    this.typeUrl = data.url;                  // 全部学生  还是停住 学生的url
    this.field = data.field;                  // 1 为全部学生    2 为 住校学生  3 为不包括（停住）住校学生
    this.treeType = data.treeType;           // 不传值tree以专业部开头      1 树形以年级为开头
    // this.Groups =data.Groups||false;       // 判断 是 班级 还是 学生 （默认学生）
    this.title = data.title||'选择学生'         //设置弹框头部的名字
    this.IsRadio = data.IsRadio||0             //判断单选  还是多选
    this.type = type||1                        // 判断 是 班级 还是 学生 （默认学生）
    this.fn = fn;
    var _this = this;
    oBox.onclick = function () {
        if($(_this.oBox).attr('title')){
            _this.selectedArr =$(oBox).attr('title').split('-')||[];
            _this.selectedID =$(oBox).attr('data-id').split('-')||[];
        }
        _this.mask();
    }
}
choose_Student.prototype.mask = function () {
    var _this=this;
    var index = top.layer.open({
        type: 1,
        title: _this.title,
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
            if(_this.type==2){searchBtn.attr('placeholder','请搜索班级名称...')}else {
                searchBtn.attr('placeholder','搜索学生姓名...')
            }
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
            //取消按钮的事件
            parents.find('.NoTip').unbind('click').bind('click',function () {
                top.layer.close(index);
                _this.selectedArr = [];
                _this.selectedID = [];
            })
            //点击确定按钮事件
            parents.find('.yesTip').unbind('click').bind('click',function () {
                if(_this.selectedArr.length>0){
                    tool().fill_More_ToPage(_this.selectedArr,$(_this.oBox));
                    $(_this.oBox).attr('data-id',_this.selectedID.join('-'));
                    $(_this.oBox).attr('title',_this.selectedArr.join('-'));
                    if(_this.IsRadio==1){
                        $('#StudentForClass').html('').text('请选择学生');
                        $('#StudentForClass').attr('data-id','');
                        $('#StudentForClass').attr('title','');
                    }
                }else {
                    $(_this.oBox).attr('data-id','');
                    $(_this.oBox).attr('title','');
                    if(_this.type==2){
                        $(_this.oBox).html('').text('请选择班级');
                    }else {
                        $(_this.oBox).html('').text('请选择学生');
                    }
                }
                if(_this.fn){
                   _this.fn(_this.selectedID);//回调函数
                }
                _this.selectedID=[];
                _this.selectedArr=[];
                top.layer.close(index);
            })
            //二次填充数据
            if(_this.selectedArr.length>0){
                _this.Tow_fill(_this.selectedArr,_this.selectedID,parents);
            }
        },
        cancel: function(index, layero){
            _this.selectedArr=[];
            _this.selectedID=[];
        }
    })
}
//通过姓名获取学生接口
choose_Student.prototype.getStudent= function (keyword,parents) {
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
        if(_this.field==3){
            params.checkStop=1;
        }
    var loadings= top.layui.layer.load(2);
    $.axse(urls+_this.typeUrl, params, function (result) {
        top.layui.layer.close(loadings);
        parents.find('#treeDemo').hide();
         var dom="";
         var list=result.data.list;
              parents.find('.searchContent').show().empty();
             if(list.length>0){
                 for(var i=0;i<list.length;i++){
                     if(_this.field==1){
                         if(_this.type==2){
                             dom+="<li data-id='"+list[i].id+"' title='"+list[i].name+"'><span><i class='s_Icon_class'></i>"+list[i].name+"</span></li>";
                         }else {
                             dom+="<li data-id='"+list[i].id+"' title='"+list[i].accountData.rname+"'><span><i class='s_Icon'></i>"+list[i].accountData.rname+"</span></li>";
                         }

                     }else {
                         dom+="<li data-id='"+list[i].id+"' title='"+list[i].rname+"'><span><i class='s_Icon'></i>"+list[i].rname+"</span></li>";
                     }
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
    },function () {
        top.layui.layer.close(loadings);
    })
}
//初始化获取树形结构
choose_Student.prototype.tree = function (obj) {
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
            enable: true,
            nocheckInherit: true
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onDblClick: null,
            onClick:zTreeonClick,
            onExpand:zTreeonDblClick,
            onCheck: zTreeOnCheck
        }
    };
    if(_this.treeType==1){
        _this.GradeTree(function (tree) {
            $(document).ready(function(){
                zTreeObj = $.fn.zTree.init(obj.find('#treeDemo'), setting, tree);
            });
        })
    }else {
        classgrade_Tree.tree(function (tree) {
            $(document).ready(function(){
                zTreeObj = $.fn.zTree.init(obj.find('#treeDemo'), setting, tree);
            });
        },_this.type)
    }

    function showIconForTree(treeId, treeNode) {
        return !treeNode.isParent;
    };
    //双击击时获取zTree节点的Id,和value的值
    function zTreeonDblClick(event, treeId, treeNode, clickFlag) {
            // console.log(event);
            // console.log(treeId);
            // console.log(treeNode);
            // console.log(clickFlag);
        // var treeValue = treeNode.id + "," + treeNode.name;
        //        alert(treeNode.id + "," + treeNode.name);
        if(treeNode.isParent&&treeNode.children.length==0){
            if(treeNode.type=="group"){
                _this.Major(treeNode.id);
            }
            if(treeNode.type=="major"){
                _this.grade(treeNode.Major_id);
            }
            if(treeNode.type=="grade"){
                treeNode.nocheck=false;
                    nocheckNode(treeNode)
                // console.log(treeNode);
                _this.classgrade(treeNode.grade_id);
            }

        }
      };
    //单击时获取zTree
    function zTreeonClick(event, treeId, treeNode, clickFlag) {
        // console.log(!treeNode.isParent);
        if(!treeNode.choose_Radio){ //有多选框的时候不执行单选
            return;
        }
        if(!treeNode.isParent){
            _this.selectedStudent({
                id:treeNode.choose_id,
                name:treeNode.name
            },obj)
        }
    }
    //给班级添加学生并添加多选框
    function nocheckNode(e) {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
            nocheck = e.nocheck,
            nodes = zTree.getSelectedNodes();//被选中的节点
           // console.log(zTree);
        for (var i=0, l=nodes.length; i<l; i++) {
            nodes[i].nocheck = nocheck;
            zTree.updateNode(nodes[i]);
        }
    }
    //单击多选框
    function zTreeOnCheck(zTree, treeId, treeNode) {
        // console.log(treeNode);
        //判断是否有子节点
        if(treeNode.isParent){
            // console.log(treeNode.children);
            for(var i=0;i<treeNode.children.length;i++){
                _this.addOrDel(treeNode.children[i],obj);
            }
        }else {
            _this.addOrDel(treeNode,obj);
        }

    }
}
//给树形结构中插入动态的专业
choose_Student.prototype.Major = function (groupId) {
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
choose_Student.prototype.grade = function (majorid) {
    var _this=this;
    var arr_C=[];
    var params ={
        faid:userId,
        token:token,
        major_id:majorid,
        size:100
    }
    var loadings= top.layui.layer.load(2);
    $.axse(urls+Get_MajorClass,params,function(result){
        top.layui.layer.close(loadings);
        var data=result.data.list;
        if(_this.type==1){
            for(var i=0;i<data.length;i++){
                arr_C.push({
                    "grade_id":data[i].id,
                    "name":data[i].name,
                    "children":[],
                    "type":"grade"
                })
            }
        }else {
            for(var i=0;i<data.length;i++){
                arr_C.push({
                    "choose_id":data[i].id,
                    "name":data[i].name,
                    icon:'img/classgrade.png'
                })
            }
        }
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var parentZNode = treeObj.getNodeByParam("Major_id", majorid, null);//获取指定父节点
        newNode = treeObj.addNodes(parentZNode,arr_C, false);
    },function () {
        top.layui.layer.close(loadings);
    })
}
//给树形结构中插入动态插入学生
choose_Student.prototype.classgrade = function (cids) {
    var _this = this;
    var params={
        token:token,
        faid:userId,
        size:100,
        state:1
    }
    if(this.field==1){params.cids=cids}
    if(this.field==2){params.classgrade_ids=cids}
    if(this.field==3){params.classgrade_ids=cids;  params.checkStop=1}
    var loadings= top.layui.layer.load(2);
    $.axse(urls+ _this.typeUrl, params, function (result) {
        top.layui.layer.close(loadings);
          var list = result.data.list;
          var jsondata=[];
          if(_this.field==1){
                 for(var i=0;i<list.length;i++){
                             jsondata.push({
                                 choose_id:list[i].id,
                                 name:list[i].accountData.rname,
                                 icon:'img/students.png',
                                 nocheck:false
                             })
                 }
          }else {
              for(var i=0;i<list.length;i++){
                  jsondata.push({
                          choose_id:list[i].id,
                          name:list[i].rname,
                          icon:'img/students.png',
                          nocheck:false
                        })
              }
          }
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var parentZNode = treeObj.getNodeByParam("grade_id", cids, null);//获取指定父节点
            newNode = treeObj.addNodes(parentZNode,jsondata, false);
    },function () {
        top.layui.layer.close(loadings);
    })
}
//选中的学生填充到左侧区域
choose_Student.prototype.selectedStudent = function (data,obj) {
    var _this=this;
       // console.log(this.selectedID);
       // console.log(this.selectedArr);
       if(this.selectedID.indexOf(data.id)>-1){
           if(_this.type==2){
               sl_Mask.NoTip('已选中该班级');
           }else {
               sl_Mask.NoTip('已选中该学生');
           }
          return;
       }
       if(this.IsRadio==1){
           _this.selectedArr = [];
           _this.selectedID = [];
       }
    this.selectedArr.push(data.name);
    this.selectedID.push(data.id);
      var dom="";
          if(data.name){
              dom+='<li data-id='+data.id+'><span data-id='+data.id+'>'+data.name+'</span><i class="material-icons" style="font-size: 16px;vertical-align: middle;margin-left: 5px" data-id='+data.id+' data-name="'+data.name+'">clear</i></li>' ;
              if(this.IsRadio==1){
                  obj.find('.wrap').empty().append(dom);
              }else{
                  obj.find('.wrap').append(dom);
              }
              obj.find('.wrap li i').unbind('click').bind('click',function () {
                  var ids=$(this).attr('data-id');
                  var names=$(this).attr('data-name');
                  _this.selectedArr.remove(names);
                  _this.selectedID.remove(ids);
                  $(this).parent().remove();
                  if(_this.type==2){return}
                  //关联树形选择框
                  var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                  var nodes = treeObj.getCheckedNodes(true);
                  for(var i=0;i<nodes.length;i++){
                      if(!nodes[i].children&&nodes[i].choose_id==ids){
                          nodes[i].checked=false;
                          treeObj.updateNode(nodes[i]);
                      }
                  }
              })
          }
}
//弹框修改学生时默认填充
choose_Student.prototype.Tow_fill = function (data_name,data_id,obj) {
    var _this=this;
    var dom="";
    for(var i=0;i<data_name.length;i++){
        dom+='<li data-id='+data_id[i]+'><span data-id='+data_id[i]+'>'+data_name[i]+'</span><i class="material-icons" style="font-size: 16px;vertical-align: middle;margin-left: 5px" data-id='+data_id[i]+' data-name="'+data_name[i]+'">clear</i></li>'
    }
    obj.find('.wrap').append(dom);
    obj.find('.wrap li i').unbind('click').bind('click',function () {
        var ids=$(this).attr('data-id');
        var names=$(this).attr('data-name');
        _this.selectedArr.remove(names);
        _this.selectedID.remove(ids);
        $(this).parent().remove();
        if(_this.type==2){return}
        //关联树形选择框
        var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
        var nodes = treeObj.getCheckedNodes(true);
        for(var i=0;i<nodes.length;i++){
            if(!nodes[i].children&&nodes[i].choose_id==ids){
                nodes[i].checked=false;
                treeObj.updateNode(nodes[i]);
            }
        }
    })
}
/*新增通过年级为开头tree筛选*/
choose_Student.prototype.GradeTree = function (fn) {
    var _this= this;
    var classTreeData = [
        {grade_id:2016,name:2016,children:[],nocheck:true},
        {grade_id:2017,name:2017,children:[],nocheck:true},
        {grade_id:2018,name:2018,children:[],nocheck:true},
        {grade_id:2019,name:2019,children:[],nocheck:true}
        // {grade_id:2020,name:2020,children:[]},
        // {grade_id:2021,name:2021,children:[]},
        // {grade_id:2022,name:2022,children:[]}
    ];
    var params={
        token:token,
        faid:userId,
        size:100
    }
    var loadings= top.layui.layer.load(2);
    $.axse(urls+ '/classgrade/getClassgrades.action', params, function (result) {
        top.layui.layer.close(loadings);
        var list = result.data.list.reverse();
        var identity_id = sessionStorage.identity_id;
        if(identity_id==8){
            var groupids =JSON.parse(sessionStorage.positionId);
                if(!groupids[8].majorGroup){
                    sl_Mask.NoTip('专业部权限下未绑定班级，请绑定后重新登录再试');
                    return;
                }
            var arr=[];
            for(var i=0;i<list.length;i++){
                if(list[i].major.group.id==groupids[8].majorGroup.id){
                  arr.push(list[i]);
                }
            }
            list = arr;
        }
        for(var i=0;i<list.length;i++){
            if(list[i].grade==2016){
                if(_this.type==1){
                    classTreeData[0].children.push({
                        "grade_id":list[i].id,
                        "name":list[i].name,
                        "children":[],
                        "type":"grade",
                        nocheck:true
                    })
                }else {
                    classTreeData[0].children.push({
                        "choose_id":list[i].id,
                         "name":list[i].name,
                         icon:'img/classgrade.png',
                         nocheck:true,
                        choose_Radio:true
                  })
                }

            }
            if(list[i].grade==2017){
                if(_this.type==1){
                    classTreeData[1].children.push({
                        "grade_id":list[i].id,
                        "name":list[i].name,
                        "children":[],
                        "type":"grade",
                         nocheck:true
                    })
                }else {
                    classTreeData[1].children.push({
                        "choose_id":list[i].id,
                        "name":list[i].name,
                        icon:'img/classgrade.png',
                        nocheck:true,
                        choose_Radio:true
                })
                }
            }
            if(list[i].grade==2018){
                if(_this.type==1){
                    classTreeData[2].children.push({
                        "grade_id":list[i].id,
                        "name":list[i].name,
                        "children":[],
                        "type":"grade",
                         nocheck:true
                    })
                }else{
                    classTreeData[2].children.push({
                        "choose_id":list[i].id,
                        "name":list[i].name,
                        icon:'img/classgrade.png',
                        nocheck:true,
                        choose_Radio:true
                     })

                }

            }
            if(list[i].grade==2019){
                if(_this.type==1){
                    classTreeData[3].children.push({
                        "grade_id":list[i].id,
                        "name":list[i].name,
                        "children":[],
                        "type":"grade",
                        nocheck:true
                    })
                }else{
                    classTreeData[3].children.push({
                        "choose_id":list[i].id,
                        "name":list[i].name,
                        icon:'img/classgrade.png',
                        nocheck:true,
                        choose_Radio:true
                })

                }

            }
            // if(list[i].grade==2020){
            //     if(_this.type==1){
            //         classTreeData[4].children.push({
            //             "grade_id":list[i].id,
            //             "name":list[i].name,
            //             "children":[],
            //             "type":"grade"
            //         })
            //     }else {
            //         classTreeData[4].children.push({
            //             "choose_id":list[i].id,
            //                  "name":list[i].name,
            //                icon:'img/classgrade.png'
            //     })
            //
            //     }
            //
            // }
            // if(list[i].grade==2021){
            //     if(_this.type==1){
            //         classTreeData[5].children.push({
            //             "grade_id":list[i].id,
            //             "name":list[i].name,
            //             "children":[],
            //             "type":"grade"
            //         })
            //     }else {
            //         classTreeData[5].children.push({
            //             "choose_id":list[i].id,
            //              "name":list[i].name,
            //              icon:'img/classgrade.png'
            //     })
            //     }
            //
            // }
            // if(list[i].grade==2022){
            //     if(_this.type==1){
            //         classTreeData[6].children.push({
            //             "grade_id":list[i].id,
            //             "name":list[i].name,
            //             "children":[],
            //             "type":"grade"
            //         })
            //     }else {
            //         classTreeData[6].children.push({
            //             "choose_id":list[i].id,
            //              "name":list[i].name,
            //                icon:'img/classgrade.png'
            //        })
            //
            //     }
            // }
        }
        fn(classTreeData)
    },function () {
        top.layui.layer.close(loadings);
    })
}

//通过多选框填充或删除选中节点
choose_Student.prototype.addOrDel = function (node,obj) {
    var lis =  obj.find('.wrap li');
    var _this = this;
    if(node.checked){
        _this.selectedStudent({
            id:node.choose_id,
            name:node.name
        },obj)
    }else {
        if(this.selectedID.indexOf(node.choose_id)>-1){
            _this.selectedArr.remove(node.name);
            _this.selectedID.remove(node.choose_id);
            for(var i=0;i<lis.length;i++){
                if(lis.eq(i).attr('data-id')==node.choose_id){
                    lis.eq(i).remove();
                }
            }

        }
    }
}