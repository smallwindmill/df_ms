var express = require('express');
var mysql = require('mysql');
var moment = require('moment');
var request = require('request');
var querystring = require('querystring');
var bodyParser= require('body-parser');
var path= require('path');
var multiparty = require('connect-multiparty');
var fs= require('fs');
var compression = require('compression');

var xlsx = require('node-xlsx');

var config = require('./config/config');
var connection = require('./config/mysqlconnect');//mysqlQueryPoll

var app = express();
app.use(compression());//gzip压缩

 // 填充权重因子, 如果当前月份的权重在数据库中不能存在，则重新填充
var countFactor = (date)=>{
  var defaultFactor = 41;

  var year = moment().format('YYYY');
  var month = moment().format('MM');
  if(date){
    year = moment(new Date(date)).format('YYYY');
    month = moment(new Date(date)).format('MM');
  }


  var sqlQuest = 'start transaction;select * from factor where year = ? and month = ?';
  // var sqlParam = [parse.status, parse.remark, finishTime, data.id];
  var sqlParam = [year, month];
  connection.lastest().query(sqlQuest,sqlParam,function(error,res1){
      if(error){
          console.log(error);
      }else{
        if(!res1.length){
            console.log(date, year, month, defaultFactor);
            var sqlQuest = 'insert into factor(year, month, factor) values(?, ?, ?);commit;';
            // var sqlParam = [parse.status, parse.remark, finishTime, data.id];
            var sqlParam = [year, month, defaultFactor];
            connection.lastest().query(sqlQuest,sqlParam,function(error,res2){
                if(error){
                  console.log(error);
                  connection.lastest().query('commit;');
                }else{
                  console.log(year, month, defaultFactor+'权重创建完成');
                }
            })
        }else{
           connection.lastest().query('commit;');
           console.log(year, month, defaultFactor+'权重已存在');
        }
      }
  })
}


// 处理订单工时统计疏漏的部分 2020.1.10
var countIndentWorkTime = (indentID) => {
  // 该流程所用的时间（五位小数）
  var sqlQuest = 'select actualFinish as actualStart from indent where id=?';
  var sqlParam = [indentID];
  connection.lastest().query(sqlQuest,sqlParam,function(error,res1){
      if(error){
          console.log(error);
      }else{
        // 根据订单创建时间的权重计算
        console.log(res1[0]);
        var year = moment(new Date(res1[0].actualStart)).format('YYYY');
        var month = moment(new Date(res1[0].actualStart)).format('MM');
        // var sqlQuest = 'update workhour set factor = (select id from factor where year = ? and month = ? ) where indentID = ?;update workhour set singleHour = countHour/planNum,cost = (select a.factor from factor a,workhour b where a.id = b.factor and b.indentID = ?)*singleHour where indentID = ?';
        // 判断当前权重因子是否存在, 存在多个时只获取一个，避免之后报错
        countFactor(res1[0].actualStart);
        var sqlQuest2 = 'update workhour set factor = (select id from factor where year = ? and month = ? limit 1) where indentID = ?;select distinct a.factor from factor a,workhour b where a.id = b.factor and b.indentID = ?';
        var sqlParam2 = [year, month, indentID, indentID, indentID];
        connection.lastest().query(sqlQuest2,sqlParam2,function(error2,res2){
            if(error2){
                console.log(error2);
            }else{
                var sqlQuest3 = 'update workhour set singleHour = countHour/planNum,cost = ?*singleHour where indentID = ?';
                var sqlParam3 = [res2[1][0].factor, indentID];
                console.log(sqlQuest3, sqlParam3, res2[1][0].factor);
                connection.lastest().query(sqlQuest3,sqlParam3,function(error3,res3){
                    if(error3){
                        console.log(error3);
                    }else{
                       console.log('id为'+indentID+'的订单已完成，工时统计也完成');
                    }
                })
            }
        })
         // console.log('id为'+pid+'的订单已完成，工时统计也完成');
      }
  })


}

// 从数据库获取为空的数据（因为权重因子重复的问题）
var getDealData = () => {
  return new Promise((reslove, reject)=>{
    var sqlQuest = 'select indentID,indent.erp from workhour left join indent on indent.id = workhour.indentId  where singleHour is NULL order by indentId asc';
    connection.lastest().query(sqlQuest,function(error,res1){
      if(error){
        console.log("error==", error);
        console.log(error);
      }
      reslove(res1);
    });
  })
}


function DealLostIndentWorkhour(){
  // var indentArray = [995 ,1141 ,1166 ,1253 ,1322 ,2615 ,2680 ,2683 ,2702 ,2703 ,2836 ,3303 ,3313 ,3322 ,3332 ,3342 ,3405 ,3406 ,3407 ,3408 ,3419 ,3524 ,3531 ,3586 ,3727 ,3754 ,3755 ,3756 ,3791 ,3809 ,3814 ,3819 ,3834 ,3847 ,3900 ,3901 ,3902 ,3903 ,3904 ,3905 ,3906 ,3908 ,3909 ,3910 ,3911 ,3912 ,3913 ,3914 ,3915 ,3917 ,3918 ,3920 ,3921 ,3923 ,3924 ,3925 ,3926 ,3935 ,3936 ,3938 ,3939 ,3941 ,3943 ,3944 ,3999 ,4013 ,4015 ,4019 ,4023 ,4027 ,4095 ,4104 ,4118 ,4119 ,4206 ,4207 ,4210 ,4218 ,4219 ,4220 ,4223 ,4229 ,4230 ,4235 ,4241 ,4243 ,4244 ,4247 ,4254 ,4255 ,4357 ,4361 ,4365 ,4367 ,4382 ,4392 ,4410 ,4416 ,4417 ,4434 ,4446 ,4450 ,4451 ,4454 ,4455 ,4458 ,4459 ,4460 ,4461 ,4462 ,4463 ,4467 ,4471 ,4476 ,4477 ,4480 ,4482 ,4483 ,4484 ,4487 ,4488 ,4585 ,4674 ,4675 ,4676 ,4677 ,4683 ,4695 ,4696 ,4697 ,4700 ,4701 ,4702 ,4704 ,4705 ,4706 ,4707 ,4709 ,4710 ,4711 ,4738 ,4739 ,4740 ,4741 ,4742 ,4743 ,4744 ,4745 ,4746 ,4747 ,4748 ,4749 ,4750 ,4751 ,4754 ,4757 ,4758 ,4759 ,4760 ,4761 ,4762 ,4764 ,4765 ,4766 ,4767 ,4768 ,4769 ,4770 ,4771 ,4772 ,4779 ,4784 ,4785 ,4789 ,4790 ,4795 ,4796 ,4797 ,4798];
  getDealData().then((indentArray)=>{
    for(let i in indentArray){
      // console.log(indentArray[i].indentID);
      // connection.lastest().query("delete from workhour where indentID = "+indentArray[i].indentID, (error, data)=>{
        // if(error) return;
        countIndentWorkTime(indentArray[i].indentID);
      // })

    }
  });
}


// DealLostIndentWorkhour();


// 处理读取日历数据重复，导致计算工时变长的问题  2020.2.28
function dealWorkHourByCalendar(){
  var sqlQuest = `select *,DATE_FORMAT(startTime,'%Y-%m-%d %H:%i:%s') as startTime,DATE_FORMAT(finishTime,'%Y-%m-%d %H:%i:%s') as finishTime from procedureDetail where startTime > "2020-02-27" or hourcount>9`;
// finishTime
  connection.lastest().query(sqlQuest,function(error,res1){
    if(error){
      console.log("error==", error);
      console.log(error);
    }
    // console.log("res1====", res1);
    for(let i in res1){
      // countCorrectHourForDetail(res1[i]);
      countProcedureWorkTime(res1[i].pid);
      // countIndentWorkTime0228(res1[i].pid);
    }
  });
}


function countCorrectHourForDetail(data){
    var stime = data.startTime;
    var etime = data.finishTime;
    var costTime = (etime-stime)/1000/60/60; //将时间差转化为小时
    var actualCostTime = 0;

    // console.log("date===", data.id, stime, etime);
    let sqlQuest1 = "select distinct DATE_FORMAT(date,'%Y-%m-%d %H:%i:%s') as date,hour from workCalendar where date >= ? and date <= ?";
    let sqlParam = [stime.split(' ')[0], etime.split(' ')[0]];
    //查询当前详情跨过的工作日
    connection.lastest().query(sqlQuest1,sqlParam,function(error2,res2){
        if(error2){
            console.log(error2);
            console.log(JSON.stringify({code:500,'msg':'更新出错'}));
        }else{
            if(res2){
              var eachDay = 0;
              var countTime = 0;
              console.log(sqlParam, res2);

              if(res2.length>=2){
                // 工时跨天时，先计算出开始与结束当天的工作时间
                var startHour = (new Date(stime.split(' ')[0]+' 17:30') - new Date(stime))/1000/60/60;
                var endHour = (new Date(etime) - new Date(etime.split(' ')[0]+' 08:30'))/1000/60/60;
                countTime += (startHour<0?0:startHour);
                countTime += (endHour<0?0:endHour);
                console.log('first and last',countTime);
                console.log("two days");

              }

              if(res2.length>=3){
                // 时间跨度两天以上
                for(let i in res2){
                  if(i==0){continue;}
                  if(i==res2.length-1){continue;}
                  console.log("three days");
                  countTime += res2[i].hour;
                }
              }

              if(res2.length==1){
                // 只有一天
                /*countTime += (new Date(stime.split(' ')[0]+' 17:30') - new Date(stime))/1000/60/60;
                countTime += (new Date(etime) - new Date(etime.split(' ')[0]+' 08:30'))/1000/60/60;*/
                stime = (stime.split(' ')[1] < '08:30')?(new Date(stime.split(' ')[0]+' 08:30')):stime;
                etime = (etime.split(' ')[1] > '17:30')?(new Date(etime.split(' ')[0]+' 17:30')):etime;
                // console.log(stime, etime);
                countTime += (new Date(etime) - new Date(stime))/1000/60/60;
                if(countTime > res2[0].hour){
                  countTime = res2[0].hour;
                }

              }

              if(res2.length==0){
                console.log('未配置工时');
              }

              console.log(data.id+'流程细节的工时为'+countTime);
              // 此时的countTime为当前流程的总工时
              var sqlQuest6 = "update procedureDetail set hourcount = ?*workercount where id = ?";


              // 将计算完成的工时总数存储进详情表
              connection.lastest().query(sqlQuest6,[countTime.toFixed(5), data.id],function(error6,res6){
                  if(error2){
                      console.log(error2);console.log('计算流程详情'+data.id+'工时出错');
                      console.log(JSON.stringify({code:500,'msg':'更新出错'}));
                  }else{
                      console.log(JSON.stringify({code:200,'msg':'状态更新成功', results: ''}));
                  }
              })

            }
        }
    })
}


function countProcedureWorkTime(id) {
    var sqlQuest = 'update `procedure` a,(select sum(hourcount) as ithour,sum(workercount) as itworker, pid from procedureDetail where pid = ? and type!=1) b set countWorker = b.itworker, countHour = b.ithour where a.id = b.pid';

    connection.lastest().query(sqlQuest,[id],function(error,res1){
        if(error){
            console.log(error);
        }else{
           console.log('id为'+id+'的流程已完成，工时统计也完成');
        }
    })

}


function countIndentWorkTime0228(id){
  var sqlQuest0 = 'select indentId from `procedure` where id='+id;

   connection.lastest().query(sqlQuest0,function(error,res){
      if(error){
          console.log(error);
      }else{
          var indentId = res[0].indentId;
          console.log('indentId====', indentId);
          var sqlQuest = 'update workhour aa,(select distinct indentID,countHour,countWorker from indent INNER JOIN  (select indentID,sum(countHour) as countHour,sum(countWorker) as countWorker from `procedure` group by indentID ) a on  indent.id = a.indentID where id = ?) cc set aa.countHour = cc.countHour,aa.countWorkers=cc.countWorker where aa.indentId=cc.indentID;select actualFinish as actualStart from indent where id=?';
          connection.lastest().query(sqlQuest,[indentId, indentId],function(error,res1){
              if(error){
                  console.log(error);
              }else{
                 // console.log('id为'+id+'的流程已完成，工时统计也完成');
                 var sqlQuest3 = 'update workhour set singleHour = countHour/planNum,cost = ?*singleHour where indentID = ?';
                 var sqlParam3 = [41, indentId];
                 console.log(sqlQuest3, sqlParam3, res2[1][0].factor);
                 connection.lastest().query(sqlQuest3,sqlParam3,function(error3,res3){
                     if(error3){
                         console.log(error3);
                     }else{
                        console.log('**************************id为'+indentId+'的订单已完成，工时统计也完成');
                     }
                 })
              }
          })
        }
   })
}


dealWorkHourByCalendar();









