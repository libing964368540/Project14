/*封装页面上搜索按钮
* */
function Query_table(id,data) {
    var oBox = document.getElementById(id);
    this.inputs = $(oBox).find('input');  // 要搜索的内容
    this.searchBtn = $(oBox).find('.school_Btn'); // 搜索按钮
    this.successFn = data.successFn;            //搜索内容不为空的时候执行
    this.tip = data.tip;                        //input的提示语句
    var _this = this;
    //点击搜索执行
    this.searchBtn.unbind('click').bind('click',function () {
        _this.successFn();
    })
    //input获得焦点
    this.inputs.on('focus',function () {
         _this.focusFn();
    })
    //input失去焦点
    this.inputs.on('blur',function () {
        _this.blurFn();
    })
}
Query_table.prototype.focusFn = function () {
    this.inputs.css({'padding-left':'15px'}).attr('placeholder','');
}
Query_table.prototype.blurFn = function () {
    if(!$.trim(this.inputs.val())){
        this.inputs.val('')
        this.inputs.css({'padding-left':'20px'}).attr('placeholder',this.tip);
    }
}
/*
* 页面上的状态刷选按钮
* */
function ForState_Totable(id) {
    var oBox = document.getElementById(id);
    var stateBtn = $(oBox).find('li');
        stateBtn.unbind('click').bind('click',function () {
            stateBtn.removeClass('active');
            $(this).addClass('active');
        })
}
