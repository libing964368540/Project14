layui.use(['layer', 'form', 'element','laydate'], function() {
        var layer = parent.layer === undefined ? layui.layer : top.layer
        var laydate = layui.laydate;
//设定开始时间和结束时间
     StartEndTime = (function () {
        var _m = {};
        var self = _m;
        _m.init = function () {
            var aa = laydate.render({
                elem: '#s_time',
                type: 'datetime',
                format: 'yyyy-MM-dd HH:mm:ss',
                change: function (value, date, endDate) {
                    var start_time = new Date(value.replace(/-/g, "/")).getTime();
                    var end_time = new Date($('#e_time').val().replace(/-/g, "/")).getTime();
                    if (end_time < start_time) {
                        sl_Mask.NoTip('开始时间不能大于结束时间');
                    }
                },
                done: function (value, date, endDate) {
                    if(value){
                        bb.config.min = {
                            year: date.year,
                            month: date.month - 1,
                            date: date.date,
                            hours: date.hours,
                            minutes: date.minutes,
                            seconds: date.seconds
                        };
                    }else {
                        bb.config.min = self.Reset_time()
                    }
                    if ($.trim(value) && $.trim($('input[name="e_time"]').val())) {
                        var s_time = new Date(value.replace(/-/g, "/")).getTime();
                        var e_time = new Date($('#e_time').val().replace(/-/g, "/")).getTime();
                        var text = tool().stay_long(s_time, e_time);
                        $('.stay_long').val(text);
                    }else{
                        $('.stay_long').val('');
                    }
                }
            });

            var bb = laydate.render({
                elem: '#e_time',
                type: 'datetime',
                min: $('#s_time').val(),
                format: 'yyyy-MM-dd HH:mm:ss',
                change: function (value, date, endDate) {
                    var start_time = new Date($('#s_time').val().replace(/-/g, "/")).getTime();
                    var end_time = new Date(value.replace(/-/g, "/")).getTime();
                    if (end_time < start_time) {
                        sl_Mask.NoTip('结束时间不能小于开始时间');
                    }
                },
                done: function (value, date, endDate) {
                    if(value){
                        aa.config.max = {
                            year: date.year,
                            month: date.month - 1,
                            date: date.date,
                            hours: date.hours,
                            minutes: date.minutes,
                            seconds: date.seconds
                        };
                    }else {
                        aa.config.max = self.Reset_time();
                    }
                    if ($.trim($('input[name="s_time"]').val()) && $.trim(value)) {
                        var s_time = new Date($('#s_time').val().replace(/-/g, "/")).getTime();
                        var e_time = new Date(value.replace(/-/g, "/")).getTime();
                        var text = tool().stay_long(s_time, e_time);
                        $('.stay_long').val(text);
                    }else{
                        $('.stay_long').val('');
                    }
                }
            });
        }
        //yyyy-mm-rr
         _m.get =function (type) {
             var aa = laydate.render({
                 elem: '#s_time',
                 format: 'yyyy-MM-dd',
                 change: function (value, date, endDate) {
                     var start_time = new Date(value.replace(/-/g, "/")+' 00:00:00').getTime();
                     var end_time = new Date($('#e_time').val().replace(/-/g, "/")+' 00:00:00').getTime();
                     if (end_time < start_time) {
                         sl_Mask.NoTip('开始时间不能大于结束时间');
                     }
                 },
                 done: function (value, date, endDate) {
                      if(value){
                          bb.config.min = {
                              year: date.year,
                              month: date.month - 1,
                              date: date.date,
                              hours: 0,
                              minutes: 0,
                              seconds: 0
                          };
                      }else {
                          bb.config.min = self.Reset_time()
                      }
                     if ($.trim(value) && $.trim($('#e_time').val())) {
                         var s_time = new Date(value.replace(/-/g, "/")+' 00:00:00').getTime();
                         var e_time = new Date($('#e_time').val().replace(/-/g, "/")+' 00:00:00').getTime();
                         var text = tool().stay_long(s_time, e_time,1);
                         $('.stay_long').val(text);
                     }else{
                         $('.stay_long').val('');
                     }
                 }
             });

             var bb = laydate.render({
                 elem: '#e_time',
                 min: $('#s_time').val()||"",
                 format: 'yyyy-MM-dd',
                 change: function (value, date, endDate) {
                     var start_time = new Date($('#s_time').val().replace(/-/g, "/")+' 00:00:00').getTime();
                     var end_time = new Date(value.replace(/-/g, "/")+' 00:00:00').getTime();
                     console.log(value);
                     console.log(start_time);
                     console.log(end_time);
                     if (end_time < start_time) {
                         sl_Mask.NoTip('结束时间不能小于开始时间');
                     }
                 },
                 done: function (value, date, endDate) {
                     if(value) {
                         aa.config.max = {
                             year: date.year,
                             month: date.month - 1,
                             date: date.date,
                             hours: 0,
                             minutes: 0,
                             seconds: 0
                         };
                     }else {
                         aa.config.max = self.Reset_time()
                     }
                     if ($.trim($("#s_time").val()) && $.trim(value)) {
                         var s_time = new Date($('#s_time').val().replace(/-/g, "/")+' 00:00:00').getTime();
                         var e_time = new Date(value.replace(/-/g, "/")+' 00:00:00').getTime();
                         var text = tool().stay_long(s_time, e_time,1);
                         $('.stay_long').val(text);
                     }else{
                         $('.stay_long').val('');
                     }
                 }
             });
         }
         _m.topGet = function (obj) {
             var aa = top.layui.laydate.render({
                 elem: '#s_time',
                 format: 'yyyy-MM-dd',
                 change: function (value, date, endDate) {
                     var start_time = new Date(value.replace(/-/g, "/")+' 00:00:00').getTime();
                     var end_time = new Date(obj.find('#e_time').val().replace(/-/g, "/")+' 00:00:00').getTime();
                     if (end_time < start_time) {
                         sl_Mask.NoTip('开始时间不能大于结束时间');
                     }
                 },
                 done: function (value, date, endDate) {
                     if(value){
                         bb.config.min = {
                             year: date.year,
                             month: date.month - 1,
                             date: date.date,
                             hours: 0,
                             minutes: 0,
                             seconds: 0
                         };
                     }else {
                         bb.config.min = self.Reset_time()
                     }
                     if ($.trim(value) && $.trim($('input[name="e_time"]').val())) {
                         var s_time = new Date(value.replace(/-/g, "/")+' 00:00:00').getTime();
                         var e_time = new Date(obj.find('#e_time').val().replace(/-/g, "/")+' 00:00:00').getTime();

                         var text = tool().stay_long(s_time, e_time);
                         $('.stay_long').val(text);
                     }else{
                         $('.stay_long').val('');
                     }
                 }
             });

             var bb = top.layui.laydate.render({
                 elem: '#e_time',
                 min: obj.find('#s_time').val(),
                 format: 'yyyy-MM-dd',
                 change: function (value, date, endDate) {
                     var start_time = new Date(obj.find('#s_time').val().replace(/-/g, "/")+' 00:00:00').getTime();
                     var end_time = new Date(value.replace(/-/g, "/")+' 00:00:00').getTime();
                     if (end_time < start_time) {
                         sl_Mask.NoTip('结束时间不能小于开始时间');
                     }
                 },
                 done: function (value, date, endDate) {
                     if(value) {
                         aa.config.max = {
                             year: date.year,
                             month: date.month - 1,
                             date: date.date,
                             hours: 0,
                             minutes: 0,
                             seconds: 0
                         };
                     }else {
                         aa.config.max = self.Reset_time()
                     }
                     if ($.trim($('input[name="s_time"]').val()) && $.trim(value)) {
                         var s_time = new Date(obj.find('#s_time').val().replace(/-/g, "/")+' 00:00:00').getTime();
                         var e_time = new Date(value.replace(/-/g, "/")+' 00:00:00').getTime();
                         var text = tool().stay_long(s_time, e_time);
                         $('.stay_long').val(text);
                     }else{
                         $('.stay_long').val('');
                     }
                 }
             });
         }
        //清空日期后重置时间
         _m.Reset_time =function () {
             var date= new Date();
             var obj={
                 year: date.getFullYear(),
                 month: date.getMonth() +1,
                 date: date.getDate,
                 hours: 0,
                 minutes: 0,
                 seconds: 0
             };
             return obj;
         }
        return _m;
    })();
 })
