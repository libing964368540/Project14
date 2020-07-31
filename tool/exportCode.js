/*
*   生成二维码
*   ids   ids名称
* */
function exportCode(ids) {
   if(typeof ids =='string'){
       var objs = document.getElementById(ids);
       var oBox =  $(objs);
   }else {
       var oBox = $(ids);
   }

   var _this = this;
   this.obj = $(oBox);
    oBox.unbind('click').bind('click',function () {
       _this.mask();
    })
}
//弹框
exportCode.prototype.mask = function () {
    var username=this.obj.attr('data-username');
    var _this = this;
    var index = top.layer.open({
        type: 1,
        title: false,
        closeBtn: 0,
        shadeClose: false,
        area: ['400px', 'auto'],
        content: '<div style="padding:30px 30px 50px;color:#000000;opacity:0.87;position:relative;padding-bottom: 27px">' +
        '<i class="layui-icon layui-icon-close closeBtn" style="font-size: 20px!important;color: #000000;position: absolute;top:14px;right: 14px;font-weight: bold;cursor: pointer">&#x1006;</i> '+
        '<p style="padding:20px 10px 54px;text-align: center;height: 300px" id="qrcodeCanvas"></p>' +
        '<div class="self_Mask_btn">下载二维码<div>' +
        '</div>',
        success: function(layero, index) {
            $(layero).find('#qrcodeCanvas').qrcode({
                text: username
            });  // 生成二维码
            //下载图片
            $(layero).find('.self_Mask_btn').unbind('click').bind('click',function () {
                var canvas =  $(layero).find('#qrcodeCanvas').find('canvas').get(0);
                // var img = canvas.toDataURL("image/png");
                //图片导出为 png 格式
                var type = 'png';
                var imgData = canvas.toDataURL(type);
                // 加工image data，替换mime type
                imgData = imgData.replace(_this._fixType(type),'image/octet-stream');
                // 下载后的文件名
                var filename = '二维码 .' + type;
// download
                _this.saveFile(imgData,filename);
            })
            //关闭弹框
            $(layero).find('.closeBtn').unbind('click').bind('click', function() {
                top.layer.close(index);
            })
        }
    })
}
/**
 * 获取mimeType
 * @param  {String} type the old mime-type
 * @return the new mime-type
 */
exportCode.prototype._fixType = function(type) {
    type = type.toLowerCase().replace(/jpg/i, 'jpeg');
    var r = type.match(/png|jpeg|bmp|gif/)[0];
    return 'image/' + r;
};
/**
 * 在本地进行文件保存
 * @param  {String} data     要保存到本地的图片数据
 * @param  {String} filename 文件名
 */
exportCode.prototype.saveFile = function(data, filename){
    var save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = data;
    save_link.download = filename;

    var event = document.createEvent('MouseEvents');
    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    save_link.dispatchEvent(event);
};


