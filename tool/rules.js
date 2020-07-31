/*    填充学生打分规则
*     id   //打分项id
*     obj  //要填充的父元素
*     flag  //为true的时候班级打分关联学生
*/
function getRulesForStudet(id,obj,flag,radio) {
    this.id=id;


    this.flag = flag;
    this.rulesAll=[];
    this.radio = radio;
    if(this.radio){
        this.obj= obj.find('.btnWrap');
        this.wrap = obj;
    }else {
        this.obj=obj;
    }
    this.getRules();

}
//获取打分规则
getRulesForStudet.prototype.getRules = function () {
    var _this = this;
    var params = {
        faid: userId,
        token: token,
        projectid: _this.id,
        hierarchy: 0
    }
    $.axse(urls + '/pproject/getprojecttree.action', params, function (result) {
            _this.obj.empty();
            var data = result.data;
            if(_this.flag){
                $('input[name="namesForStudent"]').val(data.name);
            }else {
                if(_this.radio){
                    _this.wrap.find('input[name="names"]').val(data.name);
                    _this.wrap.find('.yesBtn').attr('dataId',_this.id);
                }else{
                    $('input[name="names"]').val(data.name);
                }
            }
            var dom = "";
            var rules = data.rules;
            _this.rules = data.rules;
            for (var i = 0; i < rules.length; i++) {
                if(rules[i].operation==1){
                    rules[i].value='&nbsp+'+ rules[i].value
                }else if(rules[i].operation==2){
                    rules[i].value='&nbsp-'+ rules[i].value
                }
                if( rules[i].bind_rule_id){
                    dom += '<div style="position: relative;margin-bottom: 10px"><i class="material-icons contact gray" style="position:absolute;font-size: 16px;left: 10px;z-index: 1;top: 10px;" data-id=' + rules[i].id + '>attach_file</i><span class="layui-btn gray" data-id=' + rules[i].id + '>' + rules[i].name + rules[i].value + '</span></div>';
                 } else {
                    dom += '<div style="position: relative;margin-bottom: 10px;"><span class="layui-btn gray" data-id=' + rules[i].id + '>' + rules[i].name + rules[i].value + '</span></div>';
                }
            }
            _this.obj.append(dom);
            _this.obj.find('span.layui-btn').unbind('click').bind('click', function (e) {
                //如果提供了事件对象，则这是一个非IE浏览器
                if (e && e.stopPropagation) {
                    e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
                }
                else {
                    window.event.cancelBubble = true;//否则，我们需要使用IE的方式来取消事件冒泡
                    return false;
                }

                if (_this.radio) {//关联学生的打分规则时候单选
                    var index = $(this).index();
                    _this.obj.find('span.layui-btn').addClass('gray').removeClass('blue');
                    $(this).addClass('blue').removeClass('gray');
                } else {  //多选
                    $(this).toggleClass('gray');
                    $(this).toggleClass('blue');
                }
                // $(this).prev().toggleClass('gray');
                // $(this).prev().toggleClass('blue');
            })
            _this.obj.find('i.contact').unbind('click').bind('click',function (e) {
                //如果提供了事件对象，则这是一个非IE浏览器
                if (e && e.stopPropagation) {
                    e.stopPropagation(); //因此它支持W3C的stopPropagation()方法
                }
                else {
                    window.event.cancelBubble = true;//否则，我们需要使用IE的方式来取消事件冒泡
                    return false;
                }
                var ids=$(this).attr('data-id');
                sl_Mask.look_S_RulesForClassgrade(ids);
            })
    })
}
/*
*     填充班级的打分规则
*     id   //打分项id
*     obj  //要填充的父元素
*     flag  //为true的只能单选班级规则       为false的时候多选规则
* */
function getRulesForClassGrade(id,obj,flag) {
    this.id=id;
    this.obj=obj;
    this.flag = flag;
    this.rulesAll=[];
    this.getRules();
}
getRulesForClassGrade.prototype.getRules = function () {
    var _this = this;
    var params = {
        faid: userId,
        token: token,
        project_id: _this.id,
        hierarchy: 0
    }
    $.axse(urls + classRecordTree, params, function (result) {
        _this.obj.find('.btnWrap').empty();
        var data = result.data[0];
        _this.obj.find('input[name="names"]').val(data.name);
        var dom = "";
        var rules = data.rules;
        for (var i = 0; i < rules.length; i++) {
            if (rules[i].operation == 1) {
                rules[i].value = '&nbsp+' + rules[i].value
            } else if (rules[i].operation == 2) {
                rules[i].value = '&nbsp-' + rules[i].value
            }
            dom += '<div style="margin-bottom: 10px"><span class="layui-btn gray" data-id=' + rules[i].id + '>' + rules[i].name + rules[i].value + '</span></div>';
        }
        _this.obj.find('.btnWrap').append(dom);
        _this.obj.find('.btnWrap').find('span.layui-btn').unbind('click').bind('click', function () {
            if (_this.flag) {//关联学生的打分规则时候单选
                var index = $(this).index();
                _this.obj.find('.btnWrap').find('span.layui-btn').addClass('gray').removeClass('blue');
                $(this).addClass('blue').removeClass('gray');
            } else {  //多选
                $(this).toggleClass('gray');
                $(this).toggleClass('blue');
            }
        })
    })
}
