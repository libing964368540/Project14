//选择打分项弹框
var Choicedom = '<div class="layui-form" style="padding-top: 45px; ">' +
                '<h3 style="text-align: center;font-size: 18px;font-weight: bold;margin-bottom: 40px;">选择打分项</h3>' +
                 '<i class="layui-icon layui-icon-close closeBtn NoTip" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;cursor: pointer">&#x1006;</i> ' +
                 '<i class="switchBtn" style="position:absolute;top:44px;left: 44px;font-weight: bold;cursor: pointer;color: #2196F3;font-style: normal;display: none">体系</i>'+
                '<div style="width: 320px;margin: 0 auto" class="clear searchWrap">' +
    '<input type="text" class="layui-input lf" style="width: 250px;height: 35px;background: #f3f5f8;border: none;border-radius: 0"placeholder="请输入要查询的内容"name="searchname"><span class="school_Btn lf borderRadiusRight"  id="layui-search">搜索</span></div>' +
                  '<div>' +
    '                    <ul id="lauiUlWrap"style="padding-top: 20px;text-align: center;color: #000000;opacity: 0.87;height: 300px;"></ul>'+
    '<ul id="treeDemo" class="ztree ztreeForScore" style="padding: 20px 45px 10px;text-align: center;color: #000000;opacity: 0.87;height: 400px;overflow-y: auto;display: none"></ul>' +
                  '<div id="test1" style="padding-top: 38px;text-align: center;color: #000000;opacity: 0.87;"></div>'+
    '<div class="yesTip"style="width: 300px;text-align:center;line-height:35px;color:#ffffff;cursor: pointer;background:#2196F3;position:absolute;bottom: 20px;left: 0;right: 0;margin: auto;">确定</div>' +
    '</div>'
/*
  ids    操作对象的id
  url    打分项的接口
  free  传参是否为绑定到树形的打分项    0  为已绑定    1 为未绑定
* */

function choose_Score(ids,urls,free,fn) {
    this.url = urls;
    this.free = free;
    this.fn = fn;
    this.select_id="";
    var _this = this;
    if(free.bind){

    }
    if(typeof ids == 'string'){
        if(ids){
            var OBox = document.getElementById(ids);
            OBox.onclick = function () {
                _this.mask();
            }
        }else {
            _this.mask();
        }

    }else {
       var oBox = ids;
        oBox.unbind('click').bind('click',function () {
            _this.mask();
        })
    }

}
//打分项的选择弹框
choose_Score.prototype.mask = function () {
    var _this = this;
    var index = top.layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        skin: '',
        content: Choicedom,
        shadeClose: false,
        area: ['500px', '600px'],
        success: function (layero, index) {
            var parent = $(layero);
            var searchBtn = $(layero).find('#layui-search');
            var YesBtn =  $(layero).find('.yesTip');
            var switchBtn =$(layero).find('.switchBtn')
               //初始化列表
                _this.get(parent,{
                    keyword:'',
                     page:0
                 })
            if(!_this.free.bind){
                switchBtn.show()
            }
               //通过搜索获取列表
                searchBtn.unbind('click').bind('click',function () {
                    var val1 = $(layero).find('input').val();
                    _this.get(parent,{
                        keyword:val1,
                        page:0
                    })
                })
            //键盘事件
              parent.on('keyup',function(event) {
                var e=event||window.event;
                if(e.keyCode == 13) {
                    var val1 = $(layero).find('input').val();
                    _this.get(parent,{
                        keyword:val1,
                        page:0
                    })
                }
            })
               //确定按钮事件
              YesBtn.unbind('click').bind('click',function () {

                  if (_this.select_id) {
                       _this.fn(_this.select_id);
                      _this.select_id="";
                      top.layer.close(index);
                  } else {
                      sl_Mask.NoTip('请先选择或搜索打分项');
                  }
              })
            switchBtn.unbind('click').bind('click',function () {
                   if($(this).hasClass('active')){
                       $(this).text('体系');
                       $(this).removeClass('active');
                       parent.find('#lauiUlWrap').show();
                       parent.find('#test1').show();
                       parent.find('.searchWrap').show();
                       parent.find('#treeDemo').hide();

                   }else {
                       $(this).text('搜索');
                       parent.find('#lauiUlWrap').hide();
                       parent.find('#test1').hide();
                       parent.find('.searchWrap').hide();
                       parent.find('#treeDemo').show();
                      $(this).addClass('active');
                      _this.tree(parent)
                   }
            })
               //回车键进行搜索
              $(layero).find('.NoTip').unbind('click').bind('click', function () {
                   top.layer.close(index);
              })
        }
    })
}
//获取打分项列表  type用来区分是通过  1  分页获取数据    不传是  搜索分页
choose_Score.prototype.get = function (parent,data,type) {
      var free = this.free;
      var url = this.url;
      var _this = this;
      var params = {
          faid: userId,
          token: token,
          size:6
        }
        if(free)$.extend(data,params)
      if(data) $.extend(data,free);
      $.axse(urls + url, data, function (result) {
           if(type){
               _this.page(parent,result);
           }else {
               _this.page_first(parent,result);
           }

      })
}
// 通过搜索获取打分项      渲染打分项展示
choose_Score.prototype.page_first = function (obj,result) {
        obj.find('ul#lauiUlWrap').empty();//初始化   清空打分项列表
        obj.find('#test1').hide(); //初始化   清空分页
        var dom = '';
        var data = result.data.list;
        if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            dom += '<li style="line-height: 50px;" data-id=' + data[i].id + '><span></span><p>' +     data[i].name + '</p></li>';
        }
        obj.find('ul#lauiUlWrap').append(dom);
        this.choose(obj);
        this.laypage(obj,result);
    }else{
            obj.find('ul#lauiUlWrap').append('<p>暂无内容</p>');
            obj.find('#test1').empty().hide();
    }
}
//layui分页的在弹框中处理
choose_Score.prototype.laypage = function (obj,result) {
    var _this=this;
    if(result.data.count>6){
        obj.find('#test1').show();
        top.laypage.render({
            elem:'test1',
            count:result.data.count,
            theme: '#2387f9',
            limit:6
            ,jump: function(objs, first){
                if(!first){
                    _this.get(obj,{
                        keyword:obj.find('input').val(),
                        page:objs.curr-1
                    },1)
                }
            }
        });
    }else {
        obj.find('#test1').empty().hide();
    }
}
// 通过分页获取打分项       渲染打分项展示
choose_Score.prototype.page = function (obj,result) {
        obj.find('ul#lauiUlWrap').empty();
        var dom = '';
        var data = result.data.list;
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                dom += '<li style="line-height: 50px;" data-id=' + data[i].id + '><span></span><p>' + data[i].name + '</p></li>';
            }
            obj.find('ul#lauiUlWrap').append(dom);
            this.choose(obj);
        }else {
             obj.find('ul#lauiUlWrap').append('<p>暂无内容</p>');
             obj.find('#test1').empty().hide();
        }
}
// 选择打分项操作的处理
choose_Score.prototype.choose = function (obj) {
    var _this = this;
    obj.find('ul li').unbind('click').bind('click', function () {
        obj.find('ul li').removeClass('active');
        obj.find('ul li').find('span').empty();
        $(this).addClass('active');
        $(this).find('span').append('<i class="layui-icon" style="font-size: 25px!important;color: #2387f9;font-weight: bold;">&#xe605;</i>');
        var projectid = $(this).attr('data-id');
        _this.select_id = projectid;
    })
}
//初始化获取树形结构
choose_Score.prototype.tree = function (obj) {
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
            // fontCss : {color:"red"}
        },
        data:{
            key:{
                children:"subProjects"
            }
        },
        callback: {
            onDblClick: null,
            onClick:zTreeonClick,
            onExpand:zTreeonDblClick
        },

    };
    _this.GradeTree(function (tree) {
        $(document).ready(function(){
            zTreeObj = $.fn.zTree.init(obj.find('#treeDemo'), setting, tree);
        });
    });
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
        if(treeNode.isParent&&treeNode.subProjects.length==0){

        }
    };
    //单击时获取zTree
    function zTreeonClick(event, treeId, treeNode, clickFlag) {
        console.log(!treeNode.isParent);
        if(!treeNode.isParent){
            _this.select_id = treeNode.id;
        }
    }
}
choose_Score.prototype.GradeTree = function (fn) {
    var paramsobj ={
        faid:userId,
        token:token,
        projectid:1,
        direction:2,
        hierarchy:10
    }
    var loadings= top.layui.layer.load(2);
    $.axse(urls + '/pproject/getprojecttree.action', paramsobj, function(result) {
        top.layui.layer.close(loadings);
        var data = result.data;
        data.open=true;
        fn(data);
    })

}





/*
* 班级选择班内打分项弹框
* */
var GradeInClassDom = '<div class="layui-form" style="padding-top: 45px; ">' +
    '<h3 style="text-align: center;font-size: 18px;font-weight: bold;margin-bottom: 40px;">选择打分项</h3>' +
    '<i class="layui-icon layui-icon-close closeBtn NoTip" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;cursor: pointer">&#x1006;</i> ' +
    '<div>' +
       ' <ul id="lauiUlWrap"style="text-align: center;color: #000000;opacity: 0.87;height: 300px;"></ul>'+
    '<div class="yesTip"style="width: 300px;text-align:center;line-height:35px;color:#ffffff;cursor: pointer;background:#2196F3;position:absolute;bottom: 20px;left: 0;right: 0;margin: auto;">确定</div>' +
    '</div>';
function GradeInClass(id,data){
    this.url = data.url;
    this.fn = data.fn;
    var _this = this;
    if(id){
        var OBox = document.getElementById(id);
        OBox.onclick = function () {
            _this.mask();
        }
    }else {
        _this.mask();
    }
}
GradeInClass.prototype.mask = function () {
    var _this = this;
    var index = top.layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        skin: '',
        content: GradeInClassDom,
        shadeClose: false,
        area: ['500px', '600px'],
        success: function (layero, index) {
            var parants = $(layero);
            var YesBtn =  $(layero).find('.yesTip');
           //初始化列表
            _this.get(parants);
            //确定按钮事件
            YesBtn.unbind('click').bind('click',function () {
                var projectid = $(layero).find('ul').find('li.active').attr('data-id');
                var values =  $(layero).find('ul li.active').find('p').text();
                if (projectid,values) {
                    _this.fn(projectid,values);
                    top.layer.close(index);
                } else {
                    sl_Mask.NoTip('请先选择打分项');
                }
            })
            //回车键进行搜索
            $(layero).find('.NoTip').unbind('click').bind('click', function () {
                top.layer.close(index);
            })
        }
    })
}
//初始化数据
GradeInClass.prototype.get = function (parants) {
    var _this = this;
    var params = {
        faid: userId,
        token: token
    }
    $.axse(urls + this.url, params, function (result) {
        _this.fill(parants,result);
    })
}
//填充班内打分项
GradeInClass.prototype.fill = function (obj,result) {
    obj.find('ul').empty();
    var dom = '';
    var data = result.data;
    if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            dom += '<li style="line-height: 50px;" data-id=' + data[i].id + '><span></span><p>' + data[i].name + '</p></li>';
        }
        obj.find('ul').append(dom);
        this.choose(obj);
    }else {
        obj.find('ul').append('<p>暂无内容</p>');
    }
}
//添加选中事件
GradeInClass.prototype.choose = function (obj) {
    obj.find('ul li').unbind('click').bind('click', function () {
        obj.find('ul li').removeClass('active');
        obj.find('ul li').find('span').empty();
        $(this).addClass('active');
        $(this).find('span').append('<i class="layui-icon" style="font-size: 25px!important;color: #2387f9;font-weight: bold;">&#xe605;</i>');
    })
}
