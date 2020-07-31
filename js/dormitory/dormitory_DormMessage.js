layui.use(['layer', 'form', 'element','laydate'], function() {
    var  layer = layui.layer
        , form = layui.form
        , element = layui.element
    DormMessage = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {
            self.del();
        }
        //清空寝室
        _m.del = function () {
           $('#del').unbind('click').bind('click',function () {
               var ids = $(this).attr('data-id');
               tool().Switched_Roles('images1/del.png','确认要全部清空？', function() {
                   var params = {
                       token:token,
                       faid:userId,
                       dormitory_ids:ids
                   }
                   $.axse(urls+'/dormitoryCheck/clearForDids.action',params,function(result){
                       tool().DormMessageFill(ids,$('#account'))
                       sl_Mask.YesTip('操作成功');
                   })
               })
           }) 
        }
        return _m;
    })();
    DormMessage.init();
})
