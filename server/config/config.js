// 数据库配置与百度语音API
var config = {
  mysql_config: {
      host:'localhost',
      user:'root',
      password:'123456.',
      // password:'hidfrobot',
      charset : 'utf8',
      database:'ms',
      useConnectionPooling: true,
      wait_timeout: 3000,
      multipleStatements: true //允许多次运行多条查询语句
  },
  port: 2070,
  baiduAudioAPI: {
    id: "EPZZcrsFYYPUPqhDiq6APbKZ",
    secret: "BGyMaGYUAiFoCdB71mmxtNIYRGmH7Myg"
  }
}


module.exports = config;
