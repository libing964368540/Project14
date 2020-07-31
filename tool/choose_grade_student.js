 var choose_studentDom = '<div style="padding:0 45px 40px;color:#898989;font-size: 14px" class="layui-form">' +
     '<div>' +
              '<div>' +
                    '<div class="sl-formWrap"style="padding-top: 5px;margin-bottom: 20px;padding-left: 20px"><p class="gradeWrap"></p></div>'+
                    '<div class="sl-formWrap" style="padding-top: 5px"><ul class="studentWrap"></ul></div>'+
             '</div>'+
     '</div>' +
     '<div class="clear" style="padding-left: 10px;height:50px;"><span class="school_Btn rg sumbitBtn" >确定</span><ul class="lf clear switchBtn" style="padding-top: 5px"><li class="lf checkAll"><div class="xm-cz" method="全选" title="全选" style="margin-right: 30px"><i class="iconfont icon-quanxuan"></i><span>全选</span></div></li><li class="lf checkRemove"><div class="xm-cz" method="清空" title="清空" style="margin-right: 30px"><i class="iconfont icon-qingkong"></i><span>清空</span></div></li><li class="lf checkBack"><div class="xm-cz" method="反选" title="反选" style="margin-right: 30px"><i class="iconfont icon-fanxuan"></i><span>反选</span></div></li></ul></div>'+
    '</div>';
//该组件是班主任通过班级查找学生
function choose_grade_student(ids,data) {
    var oBox = document.getElementById(ids);
    this.oBox =oBox;
    var _this = this;
    this.selectedArr =[];  //判断是否有选中学生名单
    this.selectedID =[];   //判断是否有选中学生id
    this.classgradeId =""  //绑定班级选中学生的id
    this.OnClick = data.OnClick||false;      //判断单选 还是 多选
    this.page = data.page||0
    var flag = true;
    oBox.onclick = function () {
        if(flag){
            flag = false;
            setTimeout(function () {
                flag = true;
            },2000)
            if(_this.page!=1){
                if($(_this.oBox).attr('title')){
                    _this.selectedArr =$(oBox).attr('title').split('-')||[];
                    _this.selectedID =$(oBox).attr('data-id').split('-')||[];
                    _this.classgradeId =$(oBox).attr('data-classgradeId')||'';
                }
            }else {
                var ids = $('#AllClass').attr('data-id');
                var names= $('#AllClass').text();
                if(!ids){
                    sl_Mask.NoTip('请先选择打分班级');
                    return;
                }else {
                    if(ids.split('-').length>1){
                        return;
                    }
                }
                if($(_this.oBox).attr('title')){
                    _this.selectedArr =$(oBox).attr('title').split('-')||[];
                    _this.selectedID =$(oBox).attr('data-id').split('-')||[];
                    _this.classgradeId =$(oBox).attr('data-classgradeId')||'';
                }
            }
            _this.mask();
        }else {
            sl_Mask.NoTip('您点击过快，请2秒后再试');
        }
    }
}
//获取数据的弹框
choose_grade_student.prototype.mask = function () {
    var _this = this;
    var index = top.layer.open({
        type: 1,
        title: '选择学生',
        closeBtn: 1,
        shadeClose: false,
        skin: 'choose_grade_student',
        area: ['850px', 'auto'],
        content: choose_studentDom,
        btnAlign: 'l',
        success: function (layero, index) {
            $(layero).find('.layui-layer-content').css('height','auto');
            var checkRemoveS = $(layero).find('.checkRemove');
            var checkAllS = $(layero).find('.checkAll');
            var checkBackS = $(layero).find('.checkBack');
            var sumbmit_select = $(layero).find('.sumbitBtn');
            if(!_this.OnClick){
                $(layero).find('.switchBtn').show();
            }
            //填充班级和学生
            // console.log(_this.classgradeIdForpage);
            if(_this.page==1){
                 _this.classgradeForPage($(layero));
            }else {
                _this.classgrade($(layero));
            }

           //清空
            checkRemoveS.unbind('click').bind('click',function () {
                $(layero).find('.switchBtn li').removeClass('active');
                $(this).addClass('active');
                _this.checkRemove($(layero));
            })
            //全选
            checkAllS.unbind('click').bind('click',function () {
                $(layero).find('.switchBtn li').removeClass('active');
                _this.checkAll($(layero));
            })
            //反选
            checkBackS.unbind('click').bind('click',function () {
                $(layero).find('.switchBtn li').removeClass('active');
                $(this).addClass('active');
                _this.checkBack($(layero));
            })
            //确定
            sumbmit_select.unbind('click').bind('click',function () {
                // console.log(_this.selectedArr);
                if(_this.selectedArr.length>0){
                    tool().fill_More_ToPage(_this.selectedArr,$(_this.oBox));
                    $(_this.oBox).attr('data-id',_this.selectedID.join('-'));
                    $(_this.oBox).attr('title',_this.selectedArr.join('-'));
                    $(_this.oBox).attr('data-classgradeId', _this.classgradeId);
                }else {
                    $(_this.oBox).attr('data-id','');
                    $(_this.oBox).attr('title','');
                    $(_this.oBox).attr('data-classgradeId','');
                    $(_this.oBox).html('').text('请选择学生');
                }
                _this.selectedID=[];
                _this.selectedArr=[];
                _this.classgradeId='';
                // console.log(_this.selectedArr);
                top.layer.close(index);
            })
        }
    })

}
//通过班级id 获取学生
choose_grade_student.prototype.classgrade = function (obj) {
    var _this = this;
    var params = {
        token: token,
        faid: userId,
        director_id: userId
    }
    //判断是不是副班主任
    if(sessionStorage.identity_id == 12){
        params.vice_director_aid = userId;
    }else {
        params.director_id = userId;
    }
    var loadings= top.layui.layer.load(2);
    $.axse(urls + '/classgrade/getClassgrades.action', params, function (result) {
        top.layui.layer.close(loadings);
        var dom="";
        var data = result.data.list;
        if (data && data.length > 0) {
            //填充学生
            if(_this.classgradeId){
                 dom = _this.have_Selected(data);
                _this.selected(_this.classgradeId,obj);
            }else {
                dom = _this.No_Selected(data);
                _this.selected(data[0].id,obj);
            }
            obj.find('.gradeWrap').append(dom);
            obj.find('.gradeWrap span').unbind('click').bind('click',function () {
                var ids = $(this).attr('data-id');
                obj.find('.gradeWrap span').removeClass('active')
                _this.classgradeId=ids;
                $(this).addClass('active');
                _this.selected(ids,obj);
                _this.switch_remove(obj);
            })
        }else {
            top.layui.layer.close(loadings);
            sl_Mask.NoTip('班主任账户下未绑定任何班级，请绑定后重试')
        }
    })
}
//通过页面的选中的班级获取学生
 choose_grade_student.prototype.classgradeForPage = function (obj) {
     var _this = this;
     var data=[];
     var dom="";
     //获取页面上的  班级id 和   班级name
     var ids = $('#AllClass').attr('data-id');
     var names= $('#AllClass').text();
     data.push({
         id:ids,
         name:names
     })
     if (data && data.length > 0) {
         // console.log(data)
         //填充学生
             dom= _this.No_Selected(data);
             _this.selected(data[0].id,obj);

         obj.find('.gradeWrap').append(dom);
         obj.find('.gradeWrap span').unbind('click').bind('click',function () {
             var ids = $(this).attr('data-id');
             obj.find('.gradeWrap span').removeClass('active')
             _this.classgradeId=ids;
             $(this).addClass('active');
             _this.selected(ids,obj);
             _this.switch_remove(obj);
         })
     }else {
         sl_Mask.NoTip('请先选择打分班级');
     }
 }
//把所选中的学生放入数组
choose_grade_student.prototype.selected = function (cids,obj) {
    var _this = this;
    var params={
        token:token,
        faid:userId,
        cids:cids,
        size:500,
        state:1,
        sort :4,
        sortType:1
     }
    obj.find('.studentWrap').empty();
    var loadings= top.layui.layer.load(2);
    $.axse(urls+studentList,params,function(result) {
        top.layui.layer.close(loadings);
        var accounts = result.data.list.reverse();
        var dom='';
        //填充学生
        if(_this.classgradeId){
            // if(_this.page==1){
            //     dom= _this.No_fill_selected(accounts);
            //     _this.classgradeId=cids;
            // }else {
                dom = _this.fill_selected(accounts);
            // }
        }else {
            dom= _this.No_fill_selected(accounts);
            _this.classgradeId=cids;
        }
        obj.find('.studentWrap').append(dom);
        obj.find('.studentWrap li').unbind('click').bind('click',function () {
            var ids = $(this).attr('data-id');
            var names= $(this).attr('title');
            if($(this).hasClass('active')){
                $(this).removeClass('active');
                _this.selectedArr.remove(names);
                _this.selectedID.remove(ids);
            }else {
                if(_this.OnClick){
                    obj.find('.studentWrap li').removeClass('active');
                    _this.selectedArr=[];
                    _this.selectedID=[];
                }
                    $(this).addClass('active');
                    _this.selectedArr.push(names);
                    _this.selectedID.push(ids);
            }
        })
    })
}
//切换班级时清空全部
 choose_grade_student.prototype.switch_remove = function (obj) {
     this.selectedArr = [];
     this.selectedID = [];
     obj.find('.switchBtn li').removeClass('active');
 }
 //全选
 choose_grade_student.prototype.checkAll = function (obj) {
     var AllStudent = obj.find('.studentWrap li');
         AllStudent.addClass('active');
     this.selectedArr = [];
     this.selectedID = [];
     for(var i=0;i<AllStudent.length;i++){
         var ids = AllStudent.eq(i).attr('data-id');
         var names =  AllStudent.eq(i).attr('title');
         this.selectedArr.push(names);
         this.selectedID.push(ids);
     }
 }
 //反选
 choose_grade_student.prototype.checkBack = function (obj) {
     var AllStudent = obj.find('.studentWrap li');
         AllStudent.toggleClass('active');
     this.selectedArr = [];
     this.selectedID = [];
     for(var i=0;i<AllStudent.length;i++){
         if(AllStudent.eq(i).hasClass('active')){
             var ids = AllStudent.eq(i).attr('data-id');
             var names =  AllStudent.eq(i).attr('title');
             this.selectedArr.push(names);
             this.selectedID.push(ids);
         }
     }
 }
 //清空
 choose_grade_student.prototype.checkRemove=function (obj) {
     obj.find('.studentWrap li').removeClass('active');
     this.selectedArr = [];
     this.selectedID = [];
 }
 //页面有选中班级时候，数据的处理
 choose_grade_student.prototype.have_Selected=function (data) {
     var _this=this;
     var dom = "";
     for(var i=0;i<data.length;i++){
         if(data[i].id==_this.classgradeId){
             dom+="<span data-id='"+data[i].id+"' class='active'>"+data[i].name+"</span>";
         }else {
             dom+="<span data-id='"+data[i].id+"'>"+data[i].name+"</span>";
         }
     }
     return dom;
 }
 //页面没有选中班级时候，数据的处理
 choose_grade_student.prototype.No_Selected=function (data) {
     var _this=this;
     var dom = "";
     for(var i=0;i<data.length;i++){
         if(i==0){
             dom+="<span data-id='"+data[i].id+"' class='active'>"+data[i].name+"</span>";
         }else {
             dom+="<span data-id='"+data[i].id+"'>"+data[i].name+"</span>";
         }
     }
     return dom;
 }
 //页面有选中学生时候 ，对弹框的填充
 choose_grade_student.prototype.fill_selected = function (accounts) {
     var dom=""
     for(var i=0;i<accounts.length;i++){
         var classnum=accounts[i].accountData.identitysData[6].st_classgrade_number||"";
         if(this.selectedID.indexOf(accounts[i].id)>-1){
             dom +='<li class="lf active" style="margin-bottom: 15px;margin-right: 10px" data-id="'+accounts[i].id+'" title="'+accounts[i].accountData.rname+'"><i>'+classnum+'</i><span>'+accounts[i].accountData.rname+'</span></li>';
         }else {
             dom +='<li class="lf" style="margin-bottom: 15px;margin-right: 10px" data-id="'+accounts[i].id+'" title="'+accounts[i].accountData.rname+'"><i>'+classnum+'</i><span>'+accounts[i].accountData.rname+'</span></li>';
         }
     }
     return dom;
 }
 //页面没有选中学生，对弹框的填充
 choose_grade_student.prototype.No_fill_selected = function (accounts) {
      var dom=""
     for(var i=0;i<accounts.length;i++){
         var classnum=accounts[i].accountData.identitysData[6].st_classgrade_number||"";
         dom +='<li class="lf" style="margin-bottom: 15px;margin-right: 10px" data-id="'+accounts[i].id+'" title="'+accounts[i].accountData.rname+'"><i>'+classnum+'</i><span>'+accounts[i].accountData.rname+'</span></li>';
     }
     return dom;
 }
