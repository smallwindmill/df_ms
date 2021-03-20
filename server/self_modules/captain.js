/** 组长功能*/const captain = (app, connection, moment) =>{  var frontRequestUrl = "/produceMS";  // 每次调用工时接口时，重新计算一遍数据  countIndentWorkTimeRepeat = (nextFun) => {    var sqlQuest = 'update workhour,factor set cost = factor.factor*singleHour where workhour.factor = factor.id';    connection.latest().query(sqlQuest,function(error,res1){        if(error){            connection.print(error);        }else{           // connection.print('id为'+pid+'的流程已完成，工时统计也完成');           if(nextFun){              nextFun();           }        }    })  }  // 计算流程工时  var countProcedureWorkTime = (id) => {    // var sqlQuest = 'select max(finishTime)-min(startTime) from procedureDetail where pid = ?';    // 该流程所用的时间（两位小数）    // var sqlQuest = 'update `procedure` a set countHour = (select ROUND(TIMESTAMPDIFF(MINUTE,min(startTime),max(finishTime))/60,2),max(finishTime),min(startTime), pid from procedureDetail GROUP BY pid = ?) b where a.id = b.pid';    // var sqlQuest = 'update `procedure` a,(select ROUND(TIMESTAMPDIFF(MINUTE,min(startTime),max(finishTime))/60,2) as ithour,max(finishTime),min(startTime), pid from procedureDetail where pid = ?) b set countHour = b.ithour where a.id = b.pid';    var sqlQuest = 'update `procedure` a,(select sum(hourcount) as ithour,sum(workercount) as itworker, pid from procedureDetail where pid = ? and type!=1) b set countWorker = b.itworker, countHour = b.ithour where a.id = b.pid';    connection.latest().query(sqlQuest,[id],function(error,res1){        if(error){            connection.print(error);        }else{           connection.print('id为'+id+'的流程已完成，工时统计也完成');        }    })  }  // 流程完成消息发送  var insertMessage = (id, remark) => {    // var sqlQuest = 'select * from `procedure` where indentID = (select indentID from `procedure` where id = ?) and id > ?';    // 发送消息，同时更新下一流程的状态    var sqlQuest = 'select * from `procedure` ,(select erp, indentID as pid,`procedure`.name as lastName from `procedure` left join indent on `procedure`.indentID = indent.id where `procedure`.id = ?) b where indentID = b.pid and id >= ?;update `procedure` d,(select id from `procedure` a, (select indentID as pid from `procedure` where id = ?) b where a.indentID = b.pid and id > ?  limit 1) c set status = 1 where d.id = c.id and status != 2;'    // var sqlParam = [parse.status, parse.remark, finishTime, parse.id];    var sqlParam = [id, id, id, id];    connection.latest().query(sqlQuest,sqlParam,function(error,res1){        if(error){            connection.print(error);connection.print('消息发送失败');        }else{           if(!res1[0].length || res1[0].length==1){              // 订单内的流程已全部完成              // countIndentWorkTime(indent);              // res.send(JSON.stringify({code:200,'msg':'状态更新成功', results: res1}));              var remark = '订单'+res1[0][0].erp+'的最后一个流程'+res1[0][0].lastName+'已完成，请审批//%//'+(remark || '');              /*var sqlQuest1 = "insert into message(userID, `from`, content, time, status) values(?,?,?,?,0)";              var sqlParam1 = [ 'allType2', res1[0][0].duty, remark, moment().format('YYYY.MM.DD HH:mm:ss')];*/              var sqlQuest1 = "insert into message(userID, `from`, content, time, status) select userID,?,?,?,0 from user where type=2";              var sqlParam1 = [res1[0][0].duty, remark, moment().format('YYYY.MM.DD HH:mm:ss')];              connection.latest().query(sqlQuest1,sqlParam1,function(error2,res2){                // connection.print(sqlQuest1, sqlParam1);                  if(error2){                    connection.print(error2);                  }else{                    // connection.print('消息发送成功');                    connection.print('id为'+id+'的订单流程已完全完成, 给领班发送消息');                  }              })            }else{              // 消息内容处理              remark = res1[0][0].erp+'订单的'+res1[0][0].lastName+'流程已完成,'+res1[0][1].name+'可开始生产//%//'+(remark || '');              var sqlQuest1 = "insert into message(userID, `from`, content, time, status) values(?,?,?,?,0)";              var sqlParam1 = [ res1[0][1].duty, res1[0][0].duty, remark, moment().format('YYYY.MM.DD HH:mm:ss')];              connection.latest().query(sqlQuest1,sqlParam1,function(error2,res2){                // connection.print(sqlQuest1, sqlParam1);                  if(error2){                    connection.print(error2);                  }else{                    connection.print('消息发送成功');                  }              })            }        }    })  }   /*   *   *负责订单处理   */  // 获取用户负责的订单列表(根据状态查询)   app.get([frontRequestUrl+'/queryDutyProcedureByStatus', frontRequestUrl+'/queryDutyProcedureById'],function(req,res){      var userID = req.query.userID;      var id = req.query.id?req.query.id:'';       // var sqlQuest = 'select id,name,erp,materialCode,materialName,userName as duty,`procedure`, status from indent left join user on duty=user.userID';// where userName like "%'+userName+'%"';       var sqlQuest = '';// where userName like "%'+userName+'%"';       // var sqlQuest = 'select id, erp,materialCode, materialName, name as `procedure`,userName as duty,userID, status from `procedure` left join user on duty=userID where userID = ? or userName = ?';// where userName like "%'+userName+'%"';       // connection.print(sqlQuest, userID);       var sqlParam;       /*if(id){        sqlQuest = 'select `procedure`.id,indent.erp, indent.materialCode, indent.materialName, `procedure`.name as `procedure`,userName as duty,userID, `procedure`.status from `procedure` left join user on  duty=userID  left join indent on indentID = indent.id where (userID = ?  or userName = ? ) and `procedure`.id = ? where indent.status!=0 order by `procedure`.id';        sqlParam = [userID, userID, id];       }*/       // 根据订单查询流程       if(id){        sqlQuest = 'select `procedure`.id,indent.erp, indent.materialCode, indent.materialName,indent.planNum, `procedure`.name as `procedure`,userName as duty,userID, `procedure`.status from `procedure` left join user on  duty=userID  left join indent on indentID = indent.id where  `procedure`.id = ? order by `procedure`.id';        sqlParam = [id];       }else{        sqlQuest = 'select `procedure`.id,indent.erp, indent.materialCode, indent.materialName,indent.planNum, `procedure`.name as `procedure`,userName as duty,userID, `procedure`.status from `procedure` left join user on  duty=userID  left join indent on indentID = indent.id where (userID = ?  or userName = ?) and indent.status!=10  order by `procedure`.id';        sqlParam = [userID, userID];       }      // 存入用户名称与用户id的关系问题       connection.latest().query(sqlQuest,sqlParam,function(error,res1,fileds){           if(error){               connection.print(error);               res.send(JSON.stringify({code:500,msg:'查询负责订单状态失败',results:res1}));           }else{              // connection.print(sqlQuest,sqlParam);               if(res1.length){                   res.send(JSON.stringify({code:200,msg:'查询负责订单状态成功',results:res1}));               }else{                   res.send(JSON.stringify({code:500,msg:'暂无负责订单信息',results:res1}));               }           }       })   })  // 更新流程状态  app.post(frontRequestUrl+'/updateDutyProcedureStatus',function(req,res){      var parse = req.body;      var sqlQuest = "update `procedure` set status=?, remark = ? where id = ?";      var sqlParam = [parse.status, parse.remark, parse.id];      var autoNext = parse.autoNext;      // 在订单已完成的情况下，无法重新开始（追加）流程      if(parse.status == 1){        var sqlQuest1 = "select status from indent,(select indentID from `procedure` where id = ?) a where id = a.indentID";        connection.latest().query(sqlQuest1, [parse.id],function(error2,res2){          if(error2){            connection.print(error2);            res.send(JSON.stringify({code:500,'msg':'更新出错'}));          }          if(res2[0] && res2[0].status==2){            res.send(JSON.stringify({code:500,'msg':'该订单已完成，无法开始流程'}));          }else if(res2[0] && res2[0].status!=2){                      //            connection.latest().query(sqlQuest,sqlParam,function(error,res1){                if(error){                    connection.print(error);                    res.send(JSON.stringify({code:500,'msg':'更新出错'}));                }else{                  res.send(JSON.stringify({code:200,'msg':'状态更新成功', results: res1}));                }            })          }else{            connection.print(res2);            res.send(JSON.stringify({code:500,'msg':'更新出错'}));          }        })      }else if(parse.status == 2 ){        // 如果流程为完成时的处理        connection.latest().query(sqlQuest,sqlParam,function(error,res1){            if(error){                connection.print(error);                res.send(JSON.stringify({code:500,'msg':'更新出错'}));            }else{              // 如果用户勾选了自动，开始发送消息与自动开始下一个流程              if(autoNext){                insertMessage(parse.id, parse.remark);              }              // 计算当前流程的工时              countProcedureWorkTime(parse.id);              res.send(JSON.stringify({code:200,'msg':'状态更新成功', results: res1}));            }        })      }      //作废      return;      // 如果状态为完成，流程状态与订单状态随之变化，并结束当前流程      if(parse.status && parse.status == 1 ){        var sqlQuest1 = "update `procedure` set status=? where id = ?";        connection.latest().query(sqlQuest1,[1, parse.pid],function(error1,res1){            if(error1){                connection.print(error1);                res.send(JSON.stringify({code:500,'msg':'更新出错'}));            }else{              // 消息通知下一流程              insertMessage(parse.pid, parse.remark);              // 计算当前流程的工时              countProcedureWorkTime(parse.pid);              // res.send(JSON.stringify({code:200,'msg':'状态更新成功', results: res1}));              /*var sqlQuest2 = "update indent set status = 1, remark = ? where id = (select indentID from `procedure` where id = ?);select indentID,erp from `procedure` where id = ?;";              connection.latest().query(sqlQuest2,[parse.remark, parse.pid, parse.pid],function(error2,res2){                  if(error2){                      connection.print(error2);                      res.send(JSON.stringify({code:500,'msg':'更新出错'}));                  }else{                    // 添加消息告知下一流程                      // res.send(JSON.stringify({code:200,'msg':'状态更新成功', results: res1}));                  }              })*/            }        })      }  })  /**  * 流程详细信息处理  *  * type  0员工  1设备  * status  0进行中  1完成  -1弃置  */  // 获取所有流程细节记录  app.get(frontRequestUrl+'/queryProcedureInfo',function(req,res){      var parse = req.query;      var sqlQuest = "select * from `procedureDetail` where pid = '"+parse.pid+"' order by id";      connection.latest().query(sqlQuest,function(error,res1){          if(error){              connection.print(error);              res.send(JSON.stringify({code:500,'msg':'获取流程细节失败'}));          }else{            /*connection.latest().query(sqlQuest,function(error,res1){                if(error){                    connection.print(error);                    res.send(JSON.stringify({code:500,'msg':'获取流程细节失败'}));                }else{                    res.send(JSON.stringify({code:200,'msg':'获取流程细节成功', results: res1}));                }            })*/              res.send(JSON.stringify({code:200,'msg':'获取流程细节成功', results: res1}));          }      })  })  // 新增流程细节记录  app.post(frontRequestUrl+'/addProcedureInfo',function(req,res){      var parse = req.body;      var sqlQuest0 = "select materialCode,materialName,duty from `procedure` where id = '"+parse.pid+"'";      connection.latest().query(sqlQuest0,function(error,res0){        if(error){          connection.print(error);return;        }        if(res0.length==0){           // res.send(JSON.stringify({code:500,'msg':'该流程已完成，请重新设置'}));           res.send(JSON.stringify({code:500,'msg':'该流程不存在，请检查后重试'}));        }else{          // 新增          var sqlQuest = "insert into procedureDetail(pid, productNum,actualNum, worker, startTime, finishTime, remark, type, status, workercount) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";          var startTime = moment().format('YYYY.MM.DD HH:mm:ss');          var sqlParam = [parse.pid, parse.productNum, parse.actualNum?parse.actualNum:null, parse.worker, startTime, parse.finishTime, parse.remark, parse.type || 0, 0, parse.worker.split(' ').length];          connection.latest().query(sqlQuest,sqlParam,function(error,res1){              if(error){                  connection.print(error);                  res.send(JSON.stringify({code:500,'msg':'新增流程细节失败'}));              }else{                  connection.latest().query("select * from procedureDetail where id = ?",[res1.insertId],function(error,res2){                      if(error){                          connection.print(error);                          res.send(JSON.stringify({code:500,'msg':'新增流程细节失败'}));                      }else{                          // connection.print(res1);                          res.send(JSON.stringify({code:200,'msg':'新增流程细节成功', results: res2[0]}));                      }                  })              }          })        }      })  })  // 更新流程细节记录(完成或弃置)  app.post(frontRequestUrl+'/updateDutyProcedureDetailStatus',function(req,res){      var parse = req.body;      var finishTime = req.body.finishTime;      // 流程详情的完成代码仍为1，不是订单的2      // connection.print('finishtime===', finishTime);      if(parse.status==1 && !finishTime){        finishTime = moment().format('YYYY.MM.DD HH:mm:ss');      }else if(parse.status==1 && finishTime){        finishTime = moment(finishTime).format('YYYY.MM.DD HH:mm:ss');      }      var sqlQuest, sqlParam ;      // 如果详情状态为完成，计算该流程详情的工时      if(parse.status==1){        // sqlQuest = "update procedureDetail set status=?, remark = ?, finishTime=? where id = ?;update procedureDetail set hourcount = ROUND(TIMESTAMPDIFF(MINUTE,startTime,finishTime)/60,5) where id = ?";        sqlQuest = "update procedureDetail set status=?, finishTime=? where id = ?;select DATE_FORMAT(startTime,'%Y-%m-%d %H:%i:%s') as startTime, DATE_FORMAT(finishTime,'%Y-%m-%d %H:%i:%s') as finishTime from procedureDetail  where id = ?";        sqlParam = [parse.status, finishTime, parse.id, parse.id];      }else if(parse.status==-1){        // 弃置        sqlQuest = "update procedureDetail set status=? ,remark=?, finishTime=? where id = ?";        sqlParam = [parse.status, parse.remark, finishTime, parse.id];      }else{        // 信息修改        /*sqlQuest = "update procedureDetail set productNum=?, actualNum =?, worker=?, workercount=?, remark = ?  where id = ?";        sqlParam = [parse.productNum,parse.actualNum?parse.actualNum:null, parse.worker, parse.worker.split(' ').length, parse.remark, parse.id];*/        sqlQuest = "update procedureDetail set productNum=?,remark=?, actualNum =? where id = ?";        sqlParam = [parse.productNum, parse.remark, parse.actualNum?parse.actualNum:null, parse.id];      }      connection.latest().query(sqlQuest,sqlParam,function(error,res1){          if(error){              connection.print('组长结束流程详情出错====', error);              res.send(JSON.stringify({code:500,'msg':'更新出错'}));          }else{            // res.send(JSON.stringify({code:200,'msg':'状态更新成功', results: res5}));            // 计算工时            if(res1[1]){              var stime = res1[1][0].startTime;              var etime = res1[1][0].finishTime;              var costTime = (etime-stime)/1000/60/60; //将时间差转化为小时              var actualCostTime = 0;              connection.print(stime, etime);              let sqlQuest1 = "select distinct DATE_FORMAT(date,'%Y-%m-%d %H:%i:%s') as date,hour from workCalendar where date >= ? and date <= ?";              let sqlParam = [stime.split(' ')[0], etime.split(' ')[0]];              //查询当前详情跨过的工作日              connection.latest().query(sqlQuest1,sqlParam,function(error2,res2){                  if(error2){                      connection.print(error2);                      res.send(JSON.stringify({code:500,'msg':'更新出错'}));                  }else{                      if(res2){                        var eachDay = 0;                        var countTime = 0;                        connection.print(sqlParam, res2);                        if(res2.length>=2){                          // 工时跨天时，先计算出开始与结束当天的工作时间                          var startHour = (new Date(stime.split(' ')[0]+' 17:30') - new Date(stime))/1000/60/60;                          var endHour = (new Date(etime) - new Date(etime.split(' ')[0]+' 08:30'))/1000/60/60;                          countTime += (startHour<0?0:startHour);                          countTime += (endHour<0?0:endHour);                          connection.print('first and last',countTime);                        }                        if(res2.length>=3){                          // 时间跨度两天以上                          for(let i in res2){                            if(i==0){continue;}                            if(i==res2.length-1){continue;}                            // connection.print(countTime);                            countTime += res2[i].hour;                          }                        }                        if(res2.length==1){                          // 只有一天                          /*countTime += (new Date(stime.split(' ')[0]+' 17:30') - new Date(stime))/1000/60/60;                          countTime += (new Date(etime) - new Date(etime.split(' ')[0]+' 08:30'))/1000/60/60;*/                          stime = (stime.split(' ')[1] < '08:30')?(new Date(stime.split(' ')[0]+' 08:30')):stime;                          // etime = (etime.split(' ')[1] > '17:30')?(new Date(etime.split(' ')[0]+' 17:30')):etime;                          etime = (etime.split(' ')[1] > '20:30')?(new Date(etime.split(' ')[0]+' 20:30')):etime;                          // connection.print(stime, etime);                          countTime += (new Date(etime) - new Date(stime))/1000/60/60;                          if(countTime > (10 || res2[0].hour)){                            countTime = (10 || res2[0].hour);                          }                        }                        if(res2.length==0){                          connection.print('未配置工时');                        }                        connection.print(parse.id+'流程细节的工时为'+countTime);                        // 此时的countTime为当前流程的总工时                        // connection.print('countTime:', countTime);                        var sqlQuest6 = "update procedureDetail set hourcount = ?*workercount where id = ?";                        /*if(costTime>8){                          actualCostTime = costTime - 16*(res2.length-1);                        }*/                        // 将计算完成的工时总数存储进详情表                        connection.latest().query(sqlQuest6,[countTime.toFixed(5), parse.id],function(error6,res6){                            if(error6){                                connection.print(error6);                                connection.print('输入计算流程详情工时出错'+parse.id);                                res.send(JSON.stringify({code:500,'msg':'更新出错'}));                            }else{                                connection.print('输入计算流程详情工时成功'+parse.id);                                res.send(JSON.stringify({code:200,'msg':'状态更新成功', results: ''}));                            }                        })                      }                  }              })            }else{              res.send(JSON.stringify({code:200,'msg':'状态更新成功', results: ''}));            }          }      })  })  // 删除流程细节  app.post(frontRequestUrl+'/deleteProcedureDetail',function(req,res){        var parse = req.body;        var sqlQuest = "delete from procedureDetail where id=?";        var sqlParam = [parse.id];        connection.latest().query(sqlQuest,sqlParam,function(error,res1){            if(error){                connection.print(error);                res.send(JSON.stringify({code:500,'msg':'删除出错'}));            }else{                res.send(JSON.stringify({code:200,'msg':'细节删除成功', results: []}));            }        })  })}module.exports = captain;