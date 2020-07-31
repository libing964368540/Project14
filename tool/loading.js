layui.use(['layer', 'form', 'element','laydate'], function() {
    layer = parent.layer === undefined ? layui.layer : top.layer;
    loadings = (function () {
        var _m = {};
        var self =_m;
        _m.init=function () {
            self.tip();
        }
        _m.tip = function () {
            var loading=window.top.layui.layer.msg('<div class="object" id="object_one"></div><div class="object" id="object_two"></div><div class="object" id="object_three"></div><div class="object" id="object_four"></div><div class="object" id="object_five"></div><div class="object" id="object_six"></div><div class="object" id="object_seven"></div><div class="object" id="object_eight"></div><div class="object" id="object_nine"></div>',{
                skin: 'aaa',//skin属性可以将layer的标签提取出来，重新定义样式
                time:2000,
                shade: [1, '#ffffff'] // 透明度  颜色
            },function () {

            })
            setTimeout(function () {
                $('.layui-layout-admin .layui-header').css('opacity',1)
                $('.layui-layout-admin .layui-body').css('opacity',1)
            },1400);
        }

        return _m;
    })()
})