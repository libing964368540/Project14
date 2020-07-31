Message_Mask = function () {
    var _m = {};
    var self = _m;
    //查看值班信息的弹窗
    _m.look_duty = function (ids,message_ids,that) {
        if(message_ids){
            tool().AlreadyRead(message_ids);
            tool().WorkMessage(message_ids);
        }
        var index = layui.layer.open({
            type: 2,
            title:"<a style='margin-right:30px;color:#c2c2c2;font-size:12px;position: relative'>我的消息<span class='school_more'></span></a><a style='color:#8f8f8f;font-size:12px'>我的值班</a>",
            area: ['100%','100%'],
            content:'duty_SignIn.html',
            success: function(layero, index) {
                var body = layer.getChildFrame('body', index);
                var iframeWin = window[layero.find('iframe')[0]['name']]; //得到iframe页的窗口对象，执行iframe页的方法：iframeWin.method();
                // console.log(that.attr('data-school'));
                var datas = {
                    time:that.attr('data-time'),            //值班时间
                    teacher:that.attr('data-teacher'),         // 值班教师
                    type:that.attr('data-type'),             // 值班类型
                    school_district_id:that.attr('data-school'),// 值班校区
                    des:that.attr('data-des'),              // 备注
                    classgrades:that.attr('data-classgrades')  // 班级
                }
                tool().dominit(datas,body);
                var loadings= top.layui.layer.load(2);
                var params={
                    token:token,
                    faid:userId,
                    time:new Date(datas.time.replace(/-/g,"/")+' 00:00:00').getTime(),
                    // duty_id:ids
                }
                $.axse(urls + '/duty/getDuty.action', params, function (result) {
                    top.layui.layer.close(loadings);
                    var data = result.data;
                    for(var i=0;i<data.length;i++){
                        if(data[i].id==ids){
                             var sign_state= data[i].sign_state;
                             if(sign_state==0){
                                 body.find('#sumbit').addClass('YesBtn').attr('data-id',ids);
                                 self.sign(body);
                             }else {
                                 body.find('#sumbit').addClass('gray').text('已签到')
                             }
                             body.find('#sumbit').css('display','block');
                        }
                    }

                },function () {
                    top.layui.layer.close(loadings);
                })

                // var sign_state= that.attr('data-sign_state');


            },
            cancel: function(layero,index){
                $('#table1').bootstrapTable('refresh');
            }
        })
    }
    //调用签到接口
    _m.sign = function (body) {
        body.find('.YesBtn').unbind('click').bind('click',function () {
            if(!$(this).hasClass('YesBtn')){
                return
            }
            var params={
                token:token,
                faid:userId,
                duty_id:$(this).attr('data-id')
            }
            var that=$(this);
            tool().Switched_Roles('images1/Score.png','确定签到本次值班',function () {
                var loadings= top.layui.layer.load(2);
                $.axse(urls + '/duty/sign.action', params, function (result) {
                    top.layui.layer.close(loadings);
                    that.removeClass('YesBtn').addClass('gray');
                    sl_Mask.YesTip('签到成功')
                },function () {
                    top.layui.layer.close(loadings);
                })
            })
        })
    }
    return _m;
}