
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

  var user_arr2 = [
    ['易加慧','DFCD00182'],
    ['张玉','DFCD00053'],
    ['胡菲','DFCD00198'],
    ['王娟','DFCD00228'],
    ['蒙娟','DFCD00050'],
    ['石张英','DFCD00031'],
    ['张茜','DFCD00091'],
    ['曾富兰','DFCD00101'],
    ['刘永琼','DFCD00166'],
    ['刘春雷','DFCD00018'],
    ['覃雪梅','DFCD00220'],
    ['罗金凤','DFCD00078'],
    ['黄丹','DFCD00114'],
    ['李春梅','DFCD00180'],
    ['吴丹','DFCD00184'],
    ['代翔','DFCD00204'],
    ['冉小艳','DFCD00274'],
    ['孙娟','DFCD00275'],
    ['张霞','DFCD00227'],
    ['邓艳琼','DFCD00226'],
    ['曾志强','DFCD00276'],
    ['何霞','DFCD00225'],
    ['刘影','DFCD00090'],
    ['干利红','DFCD00272'],
    ['王珂','DFCD00236'],
    ['罗珊','DFCD00188'],
    ['杨静','DFCD00237'],
    ['袁丽蓉','DFCD00012'],
    ['刘蓉','DFCD00094'],
    ['秦萍','DFCD00035'],
    ['易书','DFCD00070'],
    ['郑蓉','DFCD00183'],
    ['李莉','DFCD00179'],
    ['杜婷','DFCD00177'],
    ['裴秋玲','DFCD10223'],
    ['刘梅','DFCD10210'],
    ['龚发红','DFCD10232'],
    ['林传花', 'DFCD10709'],
    ['杨沙','DFCD10212'],
    ['赵亚丽','DFCD10215'],
    ['罗辉','DFCD10241'],
    ['杜海英','DFCD10243'],
    ['梁攀','DFCD10227'],
    ['李超帆','DFCD10228'],
    ['蒋京川','DFCD10237'],
    ['姚学兰','DFCD10236'],
    ['雷丽','DFCD10245'],
    ['徐志文','DFCD10248'],
    ['胡世强','DFCD10247'],
    ['毛正巧','DFCD10250'],
    ['许彩琼','DFCD10252'],
    ['青景洋','DFCD10253'],
    ['任欢','DFCD10255'],
    ['李安容','DFCD10263'],
    ['毛惠淋','DFCD10264'],
    ['王科','DFCD10265'],
    ['骆洪西','DFCD10258'],
    ['雷伟','DFCD10257'],
    ['王廷威','DFCD10256'],
    ['张利平','DFCD10260'],
    ['张懿','DFCD10262'],
    ['李世豪','DFCD10266'],
    ['朱远航','DFCD10267'],
    ['陈鹏宇','DFCD10268'],
    ['陈祎琳','DFCD10269'],
    ['王鑫玲','DFCD10271'],
    ['陈阳','DFCD10270'],
    ['青强','DFCD10272']


  ]

  setTimeout(()=>{
   for(var i of user_arr2){

      var sqlQuest = "start transaction;insert into user(userID, userName,type) values(?, ?, ?);";
      var userID = i[1].length!=9?('DFCD'+i[1]):i[1].replace(/ /g,'');
      var sqlParam = [userID, i[0].replace(/ /g,''), 4 ];
      console.log(sqlParam);
      //continue;
      connection.query(sqlQuest,sqlParam,function(error,res1){
          if(error){
              console.log(error);connection.query('commit');
              console.log(JSON.stringify({code:500,'msg':'新增用户失败'}));
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
