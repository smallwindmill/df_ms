// 数据库连接配置
var mysql = require('mysql');
var config = require('./config.js');
var moment = require('moment');

var mysql_config = config.mysql_config;//数据库配置

// var connection;
// 不使用连接池


class mysqlConnection{

  constructor(connection){
    this.connection = '';
    this.update();
  }

  update(){
    // var connection = this.connection;
    var that = this;

    var connection = mysql.createConnection(mysql_config);
    that.connection = connection;
    connection.connect(function(err){
      if(err){
        setTimeout(function(){that.connection.end();that.update()},1000);
        console.log('出错了:',err);
        console.log('\r\n'+moment().format('YYYYMMDD-HHmmss')+'-请求重新连接\r\n');
      }else{
        console.log('\r\n'+moment().format('YYYYMMDD-HHmmss')+'-重新连接成功\r\n');
      }
    })
    connection.on('error', function(err) {
        console.log('db error', err);
        // if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        if(err) {
            console.log('db error执行重连:'+err.message);
            console.log('\r\n'+moment().format('YYYYMMDD-HHmmss')+'-请求重新连接\r\n');
            that.connection.end();that.update();
        } else {
            throw err;
        }
        // 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR
    })
  }

  lastest(){
    return this.connection;
  }


  /*var connection = mysql.createConnection(mysql_config);
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
  })*/
}
// handleDisconnection();


//连接池查询
/*var poolConn = mysql.createPool(mysql_config);
// mysqlQueryPoll
// beginTransaction
var connection = {
  query: (sql,params,callback)=>{
          poolConn.getConnection(function(err,conn){
              if(err){
                  // if(callback) callback(err,null,null);
                  // poolConn.releaseConnection(conn);
                  console.log('连接出错：', error);
              }else{
                  // var query = conn.query('select * from indent where planNum3 = 1240',params,function(err,vals,fields){
                  var query = conn.query(sql,params,function(err,vals,fields){
                      //释放连接
                      // conn.release();
                      //事件驱动回调
                      // console.log(vals,fields);
                      if(err) console.log(err);
                      // console.log(sql,params,callback);
                      if(callback){
                        callback(err,vals);
                        // poolConn.releaseConnection(conn);
                      };
                  });
                  // console.log("sql:::"+query.sql);
              }
              setTimeout(()=>{poolConn.releaseConnection(conn)}, 5000);
          });
  },
  beginTransaction: (sql,params,callback)=>{
    conn.beginTransaction(function (err) {
     try{
         conn.query(sql1,function (err,results) {
             if (err) {
                 console.log(err)
                 //回滚事务
                 conn.rollback(function () {
                 });
             }
             console.log("11111");
             console.log("22222");
             conn.query(sql2,function (err,results) {

                 if (err) {
                     conn.rollback(function () {
                     });

                 }else{
                     console.log('提交事务');
                     conn.commit(function() {
                         console.log("success  ok ！！")
                     });
                 }
             });
         })
     }finally {
         conn.release();//返回连接对象到 连接池中
     }
  }
}*/

var mysqlConnectionInstance = new mysqlConnection();
// mysqlConnectionInstance.update();

module.exports = mysqlConnectionInstance;
