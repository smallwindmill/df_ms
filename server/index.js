var express = require('express');
var mysql = require('mysql');
var moment = require('moment');
var request = require('request');
var querystring = require('querystring');
var bodyParser = require('body-parser');
var path = require('path');
var multiparty = require('connect-multiparty');
var fs = require('fs');
var compression = require('compression');

var xlsx = require('node-xlsx');

var config = require('./config/config');
var connection = require('./config/mysqlconnect');//mysqlQueryPoll

var app = express();
app.use(compression());//gzip压缩

var multipartMiddleware = multiparty();


// var connection = mysqlConnectionInstance;
// console.log(connection);
/*var mysql_config = config.mysql_config;//数据库配置
var handleDisconnection = ()=>{
  connection = mysql.createConnection(mysql_config);
  connection.connect(function(err){
    if(err){
      setTimeout(function(){handleDisconnection()},1000);
      console.log(err);
      console.log('\r\n'+moment().format('YYYYMMDD-HHmmss')+'-请求重新连接\r\n');
    }else{
      console.log('\r\n'+moment().format('YYYYMMDD-HHmmss')+'-重新连接成功\r\n');
    }
  })
  connection.on('error', function(err) {
      console.log('db error', err);
      if(err.code === 'PROTOCOL_CONNECTION_LOST') {
          console.log('db error执行重连:'+err.message);
          console.log('\r\n'+moment().format('YYYYMMDD-HHmmss')+'-请求重新连接\r\n');
          handleDisconnection();
      } else {
          throw err;
      }
  })
}

handleDisconnection();*/



app.use('/produceMSF/', express.static(path.resolve(__dirname, './ms'))); //设置读取文件路径
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));// 上传文件大小设置
app.use(bodyParser.json());// post请求需设置，支持请求体格式,需要配置请求头 'Content-Type':'application/x-www-form-urlencoded'
app.use(multiparty({ uploadDir: path.resolve(__dirname, './temp') }));// 设置文件上传缓存位置
// console.log(path.resolve(__dirname, './temp'));

// 解决跨域问题，允许所有访问
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Origin', 'http://192.168.30.190:8080');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  // console.log(req.method);

  if (req.method == 'OPTIONS') {
    res.sendStatus(200); //让options请求快速返回
  }
  else {
    next();
  }
})

var frontRequestUrl = "/produceMS";
startSever();


function startSever() {

  function verifyUse(str) {
    if (str) {
      return str;
    } else {
      return '';
    }
  }
  // 填充权重因子, 如果当前月份的权重在数据库中不能存在，则重新填充
  var countFactor = (date) => {
    var defaultFactor = 41;

    var year = moment().format('YYYY');
    var month = moment().format('MM');
    if (date) {
      year = moment(new Date(date)).format('YYYY');
      month = moment(new Date(date)).format('MM');
    }


    var sqlQuest = 'select * from factor where year = ? and month = ?';
    // var sqlParam = [parse.status, parse.remark, finishTime, parse.id];
    var sqlParam = [year, month];
    connection.latest().query(sqlQuest, sqlParam, function (error, res1) {
      if (error) {
        console.log(error);
      } else {
        if (!res1.length) {
          console.log(date, year, month, defaultFactor);
          var sqlQuest = 'insert into factor(year, month, factor) values(?, ?, ?);';
          // var sqlParam = [parse.status, parse.remark, finishTime, parse.id];
          var sqlParam = [year, month, defaultFactor];
          connection.latest().query(sqlQuest, sqlParam, function (error, res2) {
            if (error) {
              console.log(error);
            } else {
              console.log(year, month, defaultFactor + '权重创建完成');
            }
          })
        } else {
          // console.log(year, month, defaultFactor+'权重已存在');
        }
      }
    })
  }

  app.use('/produceMSF/', (req, res) => {
    res.sendFile(path.join(__dirname, '/') + '/ms/index.html');
  })

  // 由于前端跨域，由服务器获取百度语音tokenID
  app.get(frontRequestUrl + '/queryAudioTokenID', (req, res) => {

    var url = 'https://openapi.baidu.com/oauth/2.0/token';
    var id = config.baiduAudioAPI.id;
    var secret = config.baiduAudioAPI.secret;
    // var tokenidURL = 'https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id='+id+'&client_secret='+secret;
    var options = {
      url: url,//req.query
      headers: {
        device: "asdfasdfaadfasdf"
      },
      form: {
        grant_type: "client_credentials",
        client_id: id,
        client_secret: secret
      }  //req.body
    };

    request.post(options, function (error, response, body) {
      // console.info('response:' + JSON.stringify(response));
      if (error) {
        res.send(JSON.stringify({ code: 500, msg: '获取tokenID失败', results: [] }));
      } else {
        // access_token
        res.send(JSON.stringify({ code: 200, msg: '获取tokenID成功', results: body }));
      }

    });
  })

  // 用户登录
  app.post(frontRequestUrl + '/login', (req, res) => {
    var reqData = req.body;
    var sqlQuest = 'select user.* from user  where userID="' + reqData.userID + '"';

    countFactor(new Date());//自动填充当前月份权重

    // 填充近一年的权重
    /*for(var i = 0;i<12;i++){
      var time = new Date()-(i+1)*1000*60*60*24*30;
      countFactor(new Date(time));
    }*/

    // 获取用户未读消息
    var queryMessage = (nextFun) => {
      var sqlQuest0 = 'select captain,handleIndent,showpage,handleWorkhour,handleTemplate,login from userPower where userID="' + reqData.userID + '"';
      connection.latest().query(sqlQuest0, [], function (error, res0, fileds) {
        if (error) {
          console.log(error);
        } else {

          var sqlQuest1 = 'select * from message where userID="' + reqData.userID + '" and status = 0';
          connection.latest().query(sqlQuest1, [], function (error, res1, fileds) {
            if (error) {
              console.log(error);
            } else {
              nextFun(res0[0], res1);
            }
          })

        }
      })
    }

    connection.latest().query(sqlQuest, [], function (error, res1, fileds) {
      if (error) {
        console.log(error); res.send(JSON.stringify({ code: 500, msg: '登录出错，请稍后再试。', results: [] }));
      } else {
        if (res1.length) {
          if (res1[0].type == 4) {
            res.send(JSON.stringify({ code: 500, msg: '该用户为生产人员，无系统登录权限', results: res1 }));
          } else if (res1[0].pwd == reqData.pwd) {

            var fun = (power, message) => {
              power ? res1[0].power = power : '';
              message ? res1[0].messages = message : '';
              res1[0]['pass'] = '*%' + res1[0]['pwd'].replace(/1/g, '2a3') + '%&';
              delete res1[0]['pwd'];
              res.send(JSON.stringify({ code: 200, msg: '登录成功', results: res1[0] }));
            }
            // 获取用户下的通知消息列表
            queryMessage(fun);
          } else {
            res.send(JSON.stringify({ code: 500, msg: '用户密码错误, 请检查后重试', results: [] }));
          }
        } else {
          res.send(JSON.stringify({ code: 500, msg: '该用户名不存在, 请检查后重试', results: [] }));
        }

      }
    })
  })

  // 用户管理部分
  var userManage = require('./self_modules/userManage');
  userManage(app, connection);

  // 模板管理部分
  var template = require('./self_modules/template');
  template(app, connection);

  // 订单管理
  var uploadFile = require('./self_modules/plugin/uploadFile');
  var indent = require('./self_modules/indent');
  indent(app, multipartMiddleware, fs, moment, connection, uploadFile, xlsx, countFactor, path);

  // 工时管理
  var workhour = require('./self_modules/workhour');
  workhour(app, connection, moment);

  // 生产订单管理
  var produceIndent = require('./self_modules/produceIndent');
  produceIndent(app, connection);

  // 组长功能部分
  var captain = require('./self_modules/captain');
  captain(app, connection, moment);
}




var server = app.listen(config.port, function (req, res) {
  // console.log(server.address());
  console.log('server start from ' + server.address().address + server.address().port);
})




