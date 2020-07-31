/*
* download 下载模板的封装
* read//下载阅读（班主任）
* */
function DownLoadTemplate(id,data,read) {
    var oBox = document.getElementById(id);
    this.url = data.url;
    this.flag = true;
    this.filed= data.filed||{};
    var _this = this;
    oBox.onclick = function () {
        if(read){
            var identityid=sessionStorage.identity_id;
            if(identityid==4) {
                _this.downReader();
            }else {
                sl_Mask.NoTip('请切换班主任权限')
            }
        }else {
            sl_Mask.successTip('提示','确认下载文件？',function () {
                _this.down();
                _this.flag = false;
            })
        }

    }
}
DownLoadTemplate.prototype.down =function () {
    if(!this.flag){
        return;
    }
    var _this = this;
    // var index = layer.load(2);
        var index=layer.msg('下载中请稍候...', {icon: 16,time:false,shade : [0.5 , '#f3f5f8' , true],
            skin: 'msgStyleDownLoad'//skin属性可以将layer的标签提取出来，重新定义样式
        });
        var params={
            token:token,
            faid:userId
        }
        if(_this.filed)$.extend(params,_this.filed);
        $.axse(urls + _this.url, params, function (result) {
            _this.flag = true;
            layer.close(index);
            var data=result.data;
            var httpUrl=ImgurlHttp+data;
            // window.open(httpUrl);
            location.href = ImgurlHttp+data;
        },function () {
            _this.flag = true;
            layer.close(index);
        })
}
//下载班级阅读量的弹框（班主任）
DownLoadTemplate.prototype.downReader = function () {
    var _this = this;
    var index = top.layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        shadeClose: false,
        skin:'add_director',
        area: ['400px', 'auto'],
        content: '<div style="padding:30px 50px 24px;color:#898989;position:relative"class="layui-form major_set">' +
        '<i class="layui-icon layui-icon-close closeBtn NoTip self_Mask_close">&#x1006;</i> '+
        '<p class="self_Mask_title" style="padding-bottom:20px;">下载月成绩单</p>' +
        '<div style="padding:20px 0 20px">' +
        '<ul style="overflow-y: auto">' +
        '<li class="clear self_Mask_row"><label class="layui-form-label" style="width:80px;text-align:left;padding:9px 0;">选择月份</label><input class="layui-input rg" type="text" style="width:220px;border: none;border-radius: 0;background: #f3f5f8" readOnly name="time" placeholder="选择月份" id="test3" lay-verify="required"></li>' +
        '</ul>' +
        '</div>' +
        '<div class="yesTip self_Mask_btn" lay-filter="formDemo" lay-submit>下载</div>' +
        '</div>',
        success: function(layero, index) {
            top.layui.form.render();
            top.layui.laydate.render({
                elem: '#test3'
                ,type: 'month'
            });
            $(layero).find('.closeBtn').unbind('click').bind('click',function () {
                top.layer.close(index);
            })
            //确定按钮
            top.layui.form.on('submit(formDemo)', function(data){
                console.log(data);
                var time = data.field.time.split('-').join('');
                var classgradeId = $('select[name="classgaderid"]').val()
                _this.filed={
                    time:time,
                    classgradeId:classgradeId
                }
                _this.down();
                _this.flag = false;
                top.layer.close(index);
            });

        }
    })
}
/** 上传文件的处理* */
function UpTemplate(id,data) {
    var oBox = document.getElementById(id);
    this.oBox = oBox;
    this.url = data.url;          //上传路径
    this.filed = data.filed ||''; //上传特例参数
    this.tip = data.tip;          //弹框提示内容
    this.NoFile_Tip = data.NoFile_Tip||'请先选择Excel文件'  //当文件没有上传的时候的提示
    this.str = "";
    var _this = this;
    oBox.onclick = function () {
        _this.changeStr();
    }
}
//拼接字符串
UpTemplate.prototype.changeStr = function () {
    var _this=this;
    var identityid=sessionStorage.identity_id;
    var arr=[];
    var params={
        token:token,
        faid:userId,
        identity_id:identityid,
        clientType:0
    }
    if(this.filed)$.extend(params,this.filed);
    //拼接字符串
    for(i in params){
       arr.push(i+"="+params[i]);
    }
    this.str = urls+ this.url+'?'+ arr.join('&');
    _this.Up();
}
//上传文件
UpTemplate.prototype.Up = function () {
    var _this=this;
    var inputs = $(this.oBox).prev().find('input');
    var Filename = $(this.oBox).prev().find('.Filename');
    var files = inputs.get(0).files;
    if(inputs.val()){
        tool().Switched_Roles('images1/Score.png',_this.tip,function () {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                var form = new FormData(); //new 一个form对象
                form.append('uploadFile', file); //把上传的文件append到form对象里
                form.name = 'uploadFile'
                var index = layer.load(2)
                $.ajax({
                    url: _this.str,
                    type: 'post',
                    data: form,
                    async: true,
                    cache: false,
                    processData: false,
                    contentType: false,
                    success: function (result) {
                        layer.close(index);
                        if (result.error) {
                            if(result.error.message) {
                                if (result.error.message.indexOf("[") != -1) {
                                    var message = JSON.parse(result.error.message);
                                    var dom = '';
                                    for (var i = 0; i < message.length; i++) {
                                        dom += '<li style="padding-bottom: 15px;"><span style="display: inline-block;width: 15px;height: 15px;margin-right: 10px;vertical-align: top;"><i class="material-icons" style="color: #ff4747;font-size: 20px;margin-right: 10px;margin-top: 1px">error_outline</i></span><p style="display: inline-block;max-width: 500px;">' + message[i] + '</p></li>';
                                    }
                                    tool().AgainUpExl(dom);
                                } else {
                                    sl_Mask.NoTip(result.error.message);
                                }
                            }else {
                                sl_Mask.NoTip(result.error.message);
                            }
                            inputs.val('');
                            Filename.text('未上传任何文件')
                        } else {
                            sl_Mask.YesTip('上传成功');
                            inputs.val('');
                            Filename.text('未上传任何文件');
                        }
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        sl_Mask.NoTip('服务器内部错误')
                        layer.close(index);
                    }

                })
            }
        })
    }else {
        sl_Mask.NoTip(_this.NoFile_Tip);
    }

}
