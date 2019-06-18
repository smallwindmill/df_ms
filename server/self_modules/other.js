
 //数据库导入员工
 var user_arr2 = [];
  var user_arr = [
     [  1 , '00006', 198820, '张崇超'],
     [  2 , '00175', 123456, '朝清'],
     [  3 , '00011', 123456, '袁芳'],
     [  5 , '00032', 123456   , '杨鑫'],
     [  7 , '00039', 123456   , '廖红玉'   ],
     [  8 , '00080', 123456   , '高庆'],
     [  9 , '00048', 123456   , '张玉'],
     [ 10 , '00044', 123456   , '文晓凤'   ],
     [ 11 , '00016', 123456   , '殷涛'],
     [ 13 , '00114', 123456   , '黄丹'     ],
     [ 14 , '09527','', '大屏幕'   ],
     [ 15 , '00033', 123456   , '何莉'     ],
     [ 16 , '00084', 123456   , '汪兵'     ],
     [ 17 , '00017', 123456   , '饶玲'     ],
     [ 18 , '00273', 123456   , '严雪梅'   ],
     [ 21 , 'DFSH00009' , 123456   , '胡梦婕'   ],
     [ 22 , '00058', 123456   , '陈杰'     ],
     [ 23 , '00183', 123456   , '郑蓉'     ],
     [ 24 , '00004', 123456   , '张兵'   ]
  ];

  setTimeout(()=>{
   for(var i of user_arr2){

      var sqlQuest = "start transaction;insert into user(userID, userName,type,pwd) values(?, ?, ?, ?);";
      var userID = i[1].length!=9?('DFCD'+i[1]):i[1];
      var sqlParam = [userID, i[3], 4 ,i[2]];
      console.log(sqlParam);
      //continue;
      connection.query(sqlQuest,sqlParam,function(error,res1){
          if(error){
              console.log(error);connection.query('commit');
              res.send(JSON.stringify({code:500,'msg':'新增用户失败'}));
          }else{
              //var sqlQuest3 = "select * from user where uid = ?;insert into userPower(userID) select userID from user where uid = ?";
              var type = 4;
              var login, handleIndent, handleWorkhour, listIndent, captain, showpage;
              if(type==1){
                login = handleIndent = handleWorkhour = listIndent = captain = showpage = 1;
              }else if(type==2 || type==3){
                login = handleIndent = handleWorkhour = listIndent = 0;
                login = captain = showpage = 1;
              }else if(type==4){
                login = handleIndent = handleWorkhour = listIndent = captain = showpage = 0;
              }

              var sqlQuest3 = "select * from user where uid = ?;insert into userPower(userID, login, handleIndent, handleWorkhour, listIndent, type, captain, showpage) values((select userID from user where uid = ?), ?, ?, ?, ?, ?, ?, ?)";
              var sqlParam3 = [res1[1].insertId, res1[1].insertId, login, handleIndent, handleWorkhour, listIndent, type, captain, showpage];
              connection.query(sqlQuest3, sqlParam3,function(error,res2){
                  if(error){
                      console.log(error);
                      connection.query('rollback;commit');
                      console.log(JSON.stringify({code:500,'msg':'新增用户失败', results:''}));
                  }else{
                      console.log(res1);connection.query('commit');
                      console.log(JSON.stringify({code:200,'msg':'新增用户成功', results: res2[0]}));
                  }
              })
          }
      })
    }
  }, 3000);
