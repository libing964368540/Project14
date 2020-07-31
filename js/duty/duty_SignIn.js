layui.use(['layer', 'form', 'element'], function () {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element
    duty_SignIn = (function () {
        var _m = {};
        var self = _m;
        _m.init = function () {
            // self.sign();
        }
        //调用签到接口
        _m.sign = function () {
            $('#duty_SignIn .YesBtn').unbind('click').bind('click',function () {
                var params={
                    token:token,
                    faid:userId,
                    duty_id:$(this).attr('data-id')
                }
                var that=$(this);
                tool().Switched_Roles('images1/Score.png','确定签到本次值班',function () {
                    $.axse(urls + '/duty/sign.action', params, function (result) {
                        $(this).removeClass('YesBtn').addClass('gray');
                        sl_Mask.YesTip('签到成功')
                    })
                })
            })
        }
        return _m;
    })();
    duty_SignIn.init();
})