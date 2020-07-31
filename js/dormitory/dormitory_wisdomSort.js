layui.use(['layer', 'form', 'element'], function() {
    layer = parent.layer === undefined ? layui.layer : top.layer
    form = layui.form ;
    var pp1= new choose_classSort('choose_Classgrade',{
        url:'/classgrade/getClassgrades.action',
        fn:function (names,ids) {
            $('#AllClassgrade textarea').val(names);
            $('input[name="classgradeIds"]').val(ids);
            dormitory_wisdomSort.getStudentCount(ids);
        }
    });
    var man= new choose_classgradeS('choose_ManDormitory',{
        title:'选择男生寝室',
        url:"/dormitory/getDormitorys.action",
        dormitory_type:1,
        fn:function (names,ids) {
            $('#AllManDormitory textarea').val(names);
            $('input[name="dormitoryManIds"]').val(ids);
            dormitory_wisdomSort.getDormitoryCount(ids,$('#AllManDormitory'));
        }
    });
    var wonman= new choose_classgradeS('choose_WonmanDormitory',{
        title:"选择女生寝室",
        url:"/dormitory/getDormitorys.action",
        dormitory_type:2,
        fn:function (names,ids) {
            $('#AllWonmanDormitory textarea').val(names);
            $('input[name="dormitoryWoumanIds"]').val(ids);
            dormitory_wisdomSort.getDormitoryCount(ids,$('#AllWonmanDormitory'),1);
        }
    });
    dormitory_wisdomSort = (function () {
        var _m = {};
        var self = _m;
        //初始化
        _m.init = function () {

        }
        //清空选择的信息
        _m.clear = function (obj) {
            obj.find('textarea').val('');
            obj.find('input').val('');
            obj.find('i').text(0);
        }
        //获取班级集合学生数量
        _m.getStudentCount=function (ids) {
            var params ={
                token:token,
                faid:userId,
                classgrade_ids:ids
            }
            var loadings= top.layui.layer.load(2);
            $.axse(urls+ '/classgrade/getStudentCount.action', params, function (result) {
                top.layui.layer.close(loadings);
                var data = result.data;
                var lenghts = ids.split('-').length
                $('.ClassCount').text(lenghts);//班级总数
                $('.studentCount').text(data.sumCount);//学生总数
                $('.manCount').text(data.count1); //男生总数
                $('.wonmanCount').text(data.count0); //女生总数
            })
        }
        //获取寝室集合学生数量
        _m.getDormitoryCount=function (ids,obj,type) {
            var params ={
                token:token,
                faid:userId,
                dormitory_ids:ids
            }
            var loadings= top.layui.layer.load(2);
            $.axse(urls+'/dormitoryAccountt/getBedCount.action', params, function (result) {
                top.layui.layer.close(loadings);
                console.log(result);
                var data=result.data;
                //填充寝室
                obj.find('.dormitoryCount').text(ids.split('-').length);
                //填充空余床位
                if(type){
                    obj.find('.stayCount').text(data.count0);
                }else {
                    obj.find('.stayCount').text(data.count1);
                }

            })
        }
        //根据寝室集合排寝室
        _m.giveDormitoryForClassgrade = function () {
            $('#startGive').unbind('click').bind('click',function () {
                var classgradeIds = $('input[name="classgradeIds"]').val();
                var dormitoryManIds = $('input[name="dormitoryManIds"]').val();
                var dormitoryWoumanIds = $('input[name="dormitoryWoumanIds"]').val();
                var dormitory_ids_for_type1='';
                var dormitory_ids_for_type2='';
                //选择班级
                if (!$.trim(classgradeIds)) {
                    sl_Mask.NoTip('请选择班级');
                    return;
                }
                //选择男生寝室
                if ($.trim(dormitoryManIds) && $.trim(dormitoryWoumanIds)) {
                    var arr=dormitoryManIds;
                    var arr1=dormitoryWoumanIds;
                    dormitory_ids_for_type1=arr;
                    dormitory_ids_for_type2=arr1;
                }else{
                    sl_Mask.NoTip('请选择寝室');
                    return;
                }
                //判断学生数量是否小于寝室的床位的数量
                var params={
                    token:token,
                    faid:userId,
                    classgrade_ids:classgradeIds,
                    dormitory_ids1:dormitory_ids_for_type1,
                    dormitory_ids2:dormitory_ids_for_type2
                }
                self.giveDormitoryAjax(params);
            })
        }
        //根据寝室集合排寝室的接口
        _m.giveDormitoryAjax = function (params) {
            tool().Switched_Roles('images1/Score.png', '确定开始排寝？', function () {
                var loadings = top.layui.layer.load(2);
                setTimeout(function () {
                    top.layui.layer.close(loadings);
                }, 3000)
                $.axse(urls + '/dormitoryAccountt/arrange.action', params, function (result) {
                    console.log(result);
                    //操作成功
                    sl_Mask.YesTip('操作成功');
                    //清空页面
                    $('#student_all').find('textarea').val('');
                    $('#student_all').find('input').val('');
                    $('#student_all').find('i').text(0);
                    top.layui.layer.close(loadings);
                })
            })
        }

        return _m;
    })();
    dormitory_wisdomSort.giveDormitoryForClassgrade();
})
