 canvas_echars = (function () {
    var _m={};
    var self=_m;
    //计算百分比
    _m.Percentage = function (value,total) {
        if(value&&total){
            var num= (total-value+1)/total;
            if(num<1){
                num = Math.floor(num*100)/100;
            }
        }else {
            var num=0;
        }
        return num;
    }
    //通过echars 画出学生饼图
     _m.PercentPie = function (obj,projectPerformanc) {
         var top= self.Percentage(projectPerformanc.top,projectPerformanc.population)||0;
         var top_majorGroup = self.Percentage(projectPerformanc.top_majorGroup,projectPerformanc.population_majorGroup)||0;
         // var top_major = self.Percentage(projectPerformanc.top_major,projectPerformanc.population_major)||0;
         var top_classgrade = self.Percentage(projectPerformanc.top_classgrade,projectPerformanc.population_classgrade)||0;
         var option1 = {
             value:top*100,//百分比,必填
             name:'超过',//必填
             title:'',
             backgroundColor:null,
             color:['#FF4081','#ffd9e6'],
             fontSize:12,
             //必填
             domEle:obj.find("#canvas_top_Wrap").get(0)
         }
         var option2 = {
             value:top_majorGroup*100,//百分比,必填
             name:'超过',//必填
             title:'',
             backgroundColor:null,
             color:['#FF9800','#ffeacc'],
             fontSize:12,
            //必填
             domEle:obj.find("#canvas_top_majorGroup_Wrap").get(0)
         }
         var option3 = {
             value:top_classgrade*100,//百分比,必填
             name:'超过',//必填
             title:'',
             backgroundColor:null,
             color:['#8BC34A','#e8f3db'],
             fontSize:12,
            //必填
             domEle:obj.find("#canvas_top_classgrade_Wrap").get(0)
         }
         var percentPie1 = new PercentPie(option1);
         var percentPie2 = new PercentPie(option2);
         var percentPie3 = new PercentPie(option3);
         percentPie1.init();
         percentPie2.init();
         percentPie3.init();
         //填充名次
         //填充全校
         var RankingTop =projectPerformanc.top?'全校第'+projectPerformanc.top:'全校第'+0
             obj.find('.top').text(RankingTop); //填充专业部
         // obj.find('.top_rank').text(projectPerformanc.top||0); //填充专业部
         var RankingTop_majorGroup = projectPerformanc.top_majorGroup?'专业部第'+projectPerformanc.top_majorGroup:'专业部第'+0
             obj.find('.top_majorGroup').text(RankingTop_majorGroup); //填充班级
         // obj.find('.top_majorGroup_rank').text(projectPerformanc.top_majorGroup||0); //填充班级
         var RankingTop_classgrade = projectPerformanc.top_classgrade?'班级第'+projectPerformanc.top_classgrade:'班级第'+0
             obj.find('.top_classgrade').text(RankingTop_classgrade); //填充班级
         // obj.find('.top_classgrade_rank').text(projectPerformanc.top_classgrade||0); //填充班级
     }
    return _m;
})();