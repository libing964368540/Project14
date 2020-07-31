layui.use(['layer', 'form', 'element'], function() {
    var layer = layui.layer
        , form = layui.form
        , element = layui.element

 class_seat_xsc =(function () {
     var _m={};
     var self=_m;
     _m.init=function () {
        self.getClass();
     }
     //获取班级
     _m.getClass = function () {
         var params={
             token:token,
             faid:userId,
             size:300
         }
         var loadings = top.layui.layer.load(2);
         $.axse(urls + '/classgrade/getClassgrades.action', params, function (result) {
             top.layui.layer.close(loadings);
              var list=result.data.list;
              var dom="";
              for(var i=0;i<list.length;i++){
                 dom+='<option value="'+list[i].id+'">'+list[i].name+'</option>'
              }
              $('select[name="classgaderid"]').html(dom);
             layui.form.render()
             class_seat_xsc.getSeat(list[0].id)
             layui.form.on('select(classgaderid)', function (majordata) {
                 class_seat_xsc.getSeat(majordata.value)
             })
         },function () {
             top.layui.layer.close(loadings);
         })
     }
     //获取座位表
     _m.getSeat = function (classgrade_id) {
            if(classgrade_id){

            }
         var params={
             token:token,
             faid:userId,
             classgrade_id:classgrade_id
         }
         $.axse(urls + '/classgradeSeat/getSeats.action', params, function (result) {
             $('.director_class').text(result.data.classgrade.name);
             if(result.data.classgrade.director){
                 $('.director_rname').text(result.data.classgrade.director.rname);
             }else {
                 $('.director_rname').text('暂无');
             }
             $('.tableWrap li').find('.photo').remove();
             $('.tableWrap li').find('dd').text('暂无');
             var accouts=result.data.seats;
             if(accouts&&accouts.length>0){
                 for(var i=0;i<accouts.length;i++){
                     var dom="";
                     var index=accouts[i].index;
                     dom+="<div class='photo'><div class='imgWrap'><img src='"+ImgurlHttp+accouts[i].student.photoPath+"' alt=''></div>" + "</div>";
                     $('.tableWrap li').eq(index).find('dt').append(dom);
                     if(accouts[i].student.temporary_state){
                         $('.tableWrap li').eq(index).find('dd').text(accouts[i].student.rname+'（临时请假）');
                     }else {
                         $('.tableWrap li').eq(index).find('dd').text(accouts[i].student.rname);
                     }
                 }
             }
         })
     }
     return _m;
 })();
    class_seat_xsc.init();
    setTimeout(function () {
        tool().editMajorGroup($('#account'), '', 2, function(id){
            class_seat_xsc.getSeat(id)
        });
    },2000)


})
