var classgrade_Tree = (function () {
          var _m = {};
          var self = _m;
          _m.init = function () {
              var aa=self.tree();
          }
          _m.tree = function (fn,type) {
              var index=top.layui.layer.load(2)
              var arr=[];
              var params ={
                  faid:userId,
                  token:token
              }
              $.axse(urls+Get_MajorGroup,params,function(result){
                   var data=result.data;
                  var identity_id = sessionStorage.identity_id;
                  var groupids =JSON.parse(sessionStorage.positionId);
                  if(identity_id==8){
                      arr.push({
                          "id":groupids[8].majorGroup.id,
                          "name":groupids[8].majorGroup.name,
                          "type":"group",
                          "children":[]
                          // "children":self.major(groupids[8].majorGroup.id,type)
                      })
                  }else {
                      for(var i=0;i<data.length;i++){
                          arr.push({
                              "id":data[i].id,
                              "name":data[i].name,
                              "type":"group",
                              "children":[]
                              // "children":self.major(data[i].id,type)
                          })
                      }
                  }

                      top.layui.layer.close(index);
                      console.log(arr);
                      fn(arr)
                   return arr;
              },function () {
                  top.layui.layer.close(index);
              })
          }
          // 专业
          _m.major = function (groupId,type) {
              var arr_M=[];
              var params={
                  faid:userId,
                  token:token,
                  groupid:groupId
              }
              $.axse(urls+Get_Major,params,function(result){
                  var data=result.data;
                  for(var i=0;i<data.length;i++){
                      arr_M.push({
                          "id":data[i].id,
                          "name":data[i].name,
                          "type":"major",
                          "children":[]
                          // "children":self.classgrade(data[i].id,type)
                      })
                  }
                  return arr_M;
              })
              return arr_M;

          }
          // 班级
          _m.classgrade = function (majorid,type) {
              var arr_C=[];
              var params ={
                  faid:userId,
                  token:token,
                  major_id:majorid,
                  size:100
              }
              $.axse(urls+Get_MajorClass,params,function(result){
                  var data=result.data.list;
                  if(type==1){
                      for(var i=0;i<data.length;i++){
                          arr_C.push({
                              "id":data[i].id,
                              "name":data[i].name,
                              "children":[]
                          })
                      }
                  }else {
                      for(var i=0;i<data.length;i++){
                          arr_C.push({
                              "id":data[i].id,
                              "name":data[i].name,
                              icon:'img/classgrade.png'
                          })
                      }
                  }

                  return arr_C;
              })
              return arr_C;
          }
          return _m;

})();