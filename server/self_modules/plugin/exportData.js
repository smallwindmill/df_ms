// const exportData = {
let cp=require('child_process');

let compareList = {
  id: "",
  materialCode: "货号",
  materialName: "货物名称",
  duty: "流程负责人",
  status: "状态",
  indentID: "订单编号",
  name: "生产流程",
  countHour: "总工时",
  countWorker: "总人数",
  remark: "备注",
  erp: "erp编号",
  planNum: "计划生产数量",
  planOnline: "计划上线日期",
  planFinishDate: "计划完成日期",
  actualStart: "实际开始日期",
  actualFinish: "实际完成日期",
  ifNew: "新品",
  priority: "加急",
  templateID: "对应模板",
  pstatus: "进行",
  procedure: "流程",
  factor: "权数"
};
const ignoreList = ["id", "pstatus"];

class exportData {
   constructor (fs, path, connection) {
     this.fs = fs;
     this.path = path;
     this.connection = connection;
   }

    queryDatabase (name, sqlQuest, sqlParam, _headers) {
        let that = this;
        return new Promise((resolve,reject)=>{
            // var sqlQuest = 'show tables';
            // var judgenull = 0;

            var queryAllData = [];
            // console.log('sqlQuest===', sqlQuest);
            this.connection.latest().query(sqlQuest, sqlParam, function(error,res,fileds){
                if(error){
                    console.log(error);reject(error);
                }else{
                    if(res.length){
                      // console.log('data==', res);
                      resolve(that.startExportExcel(name, res, _headers));
                    }else{
                      console.log('no data...');
                      resolve(JSON.stringify({code:500, msg:'无符合条件的数据'}));
                    }
                }
            })
        })
    }

    startExportExcel (name, data, _headers) {
       let that = this;
        // 将数据转成workSheet
        console.log('                   开始导出sql数据');
        console.log('*************************************************\n');
        name += ("-"+data.length);

        var downloadFile = '../../data/data.json';
        var workdata = [];

        let i_inner = [];
        for(let i in _headers){
            // 转换表头名
            i_inner.push(_headers[i].v);
        }
        workdata.push(i_inner);

        for(let j in data){
          // console.log(data[i][j]);
          let inner = [];
          for(let k in _headers){
              // 转换表头名
              if(data[j].countHour && data[j].countWorker){
                data[j].singleHour = ((data[j].countHour/(data[j].countWorker||1)) || 0).toFixed(5);
                data[j].cost = ((data[j].singleHour*data[j].factor).toFixed(5) || 0);
              }

              let value = data[j][_headers[k].k];
              inner.push(value == null ? '' : value);
          }
          workdata.push(inner);
        }


        // 将workBook写入文件
        return new Promise((resolve, reject)=>{
          // var buf = new Buffer.alloc(1024);
          var buf = Buffer.from(JSON.stringify({name: name, data: workdata}), 'utf-8');
          that.fs.writeFile(that.path.resolve(__dirname, downloadFile), buf, (error)=>{
            if(error){
              console.log('error====', error);
              return;
            }
              console.log('\n*************************************************');
              console.log('       数据导出成功，请在data目录中查看\n');
              console.log('       开始调用Python导出excel \n');

              cp.exec('python '+ that.path.resolve(__dirname, '../../export.py') +' -n '+name, function(err,stdout){
                if(err){
                  console.log('export excel error==', err);
                  resolve(JSON.stringify({code:500, msg:'服务器导出excel出错，请重新尝试'}));
                  return;
                }
                console.log('       导出excel完成 \n');
                resolve({file: that.path.resolve(__dirname,'../../export/'+name+'.xls')});
              });
          })
        }).catch(err=>console.log('error===', err));
    }

    getData (req, res, sqlQuest, sqlParam, name, _headers){
      let that = this;
      let token = req.query.token?(req.query.token*1 - 111111111111111)/400 : 0;
      // let token = req.query.token?(req.query.token*1 - 111111111111111)/400 : 0;
      token = new Date().getTime() - token;
      console.log('req.query.token===', req.query.token, (req.query.token*1 - 111111111111111)/400, token);
      // token有效十秒钟
      if(!token || token > 10000 || token < 0) {
        res.send(JSON.stringify({error: "token超时，请重试"}));
        return;
      }
      /*cp.exec('rm -rf export', (err,stdout) => {

      })*/
      // console.log('_headers===', _headers);
      this.queryDatabase(name, sqlQuest, sqlParam, _headers).then(data=>{
        if(data == "notable"){
          console.log('no no no');
          res.send(JSON.stringify({error: "无该范围内的数据"}));
        }else{
          // res.download(that.path.resolve(__dirname, data.file));
          data.file? res.download(data.file) : res.send(data);
        }
      }).catch(err=>console.log('error===', err));

    }
}

module.exports = exportData;


