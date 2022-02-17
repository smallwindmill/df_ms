/*
 * 订单功能
 */
const exportData = require("./plugin/exportData");

const indent = (app, multipartMiddleware, fs, moment, connection, uploadFile, xlsx, countFactor, path) => {

    let frontRequestUrl = "/produceMS";
    let myExportData = new exportData(fs, path, connection);

    // 上传excel文件新增订单
    app.post(frontRequestUrl + '/uploadExcelForAddIndent', multipartMiddleware, function(req, res) {
        let file = req.files.file;
        let userID = req.body.id;
        // console.log("req====", req.files, req.body);
        // connection.print(file,req.body);
        let nextFun = (file_path) => {
            let sheets = xlsx.parse(file_path); //获取到所有sheet
            let sheet = sheets[0];

            let total = success = fail = 0; //数据统计
            let failArr = [];
            // type 1 模板不存在
            let importDataLen = sheet['data'].length - 1;


            sheet['data'] = sheet['data'].filter(self => { return self.length != 0 });
            // console.log("req====", sheet['data']);
            // for (let rowId in sheet['data']) {
            let rowId = 0;
            const insertIndentFun = () => {
                let row = sheet['data'][rowId];
                rowId++;
                // 标题栏不处理
                if (rowId == 0) return;
                if (rowId > sheet['data'].length - 1) return console.log("add indent with excel finish");
                total++;
                let procedure = duty = '';
                if (row.length) {
                    connection.print(rowId, row);
                    // connection.print('rowId', rowId, sheet['data'][rowId]);
                    // return insertIndentFun();
                    let row_dir = row;
                    let sqlQuest0 = "select * from template where id = '" + row[7] + "'";
                    // 查询对应的模板是否存在
                    (function(row) {
                        connection.latest().query(sqlQuest0, [], function(error, res0) {
                            // connection.print(row);
                            if (error) {
                                connection.print(error);
                                return;
                            }
                            if (res0.length) {
                                // connection.print(res0[0].duty.split(' '));
                                let procedureArr = res0[0].procedure.replace(/ $/, '').replace(/^ /, '').split(' ');
                                let userArr = res0[0].duty.replace(/ $/, '').replace(/^ /, '').split(' ');
                                // 添加订单记录
                                let sqlQuest2 = "start transaction;insert into indent(name,erp, materialCode,materialName,planNum,planOnline,planFinishDate,priority,ifNew,remark,templateID,status) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                                connection.print('*********************start transaction*******************');
                                // connection.print(row[0] );
                                // 判断上传的数据类型，转换为日期格式
                                row[0] = row[0] ? row[0] : '';
                                let planFinishDate, planOnline;
                                // connection.print(typeof(row[0]));

                                if (new Date(row[0]).getDate()) {
                                    if (typeof(row[0]) == 'string') {
                                        planFinishDate = moment(new Date(row[0])).format('YYYY.MM.DD');
                                    } else {
                                        planFinishDate = moment(new Date(1900, 0, row[0] - 1)).format('YYYY.MM.DD');
                                    }
                                } else {
                                    planFinishDate = '';
                                }

                                if (new Date(row[1]).getDate()) {
                                    if (typeof(row[1]) == 'string') {
                                        planOnline = moment(new Date(row[1])).format('YYYY.MM.DD');
                                    } else {
                                        planOnline = moment(new Date(1900, 0, row[1] - 1)).format('YYYY.MM.DD');
                                    }
                                } else {
                                    planOnline = '';
                                }
                                // connection.print(planFinishDate);
                                let sqlParam2 = [res0[0].name2, row[2], row[3], row[4], row[6], planOnline, planFinishDate, row[8], row[9], row[5], row[7], 0];
                                // 根据订单开始时间设置权重
                                //countFactor(row[6].replace(/-/g,'.'));
                                countFactor(planFinishDate);
                                connection.latest().query(sqlQuest2, sqlParam2, function(error, res1) {
                                    if (error) {
                                        connection.redlog(error);
                                        // connection.print(error,res1);
                                        connection.print('roll back!!!!!!!!!');
                                        connection.latest().query('rollback;commit;');
                                        fail++;
                                        failArr.push({ index: rowId * 1 + 1, erp: row[2], name: row[4] });
                                        if (rowId == sheet['data'].length - 1) {
                                            connection.print('新增订单失败，共' + total + '个订单', success, fail);
                                            connection.latest().query('commit');
                                            res.send(JSON.stringify({ code: 500, 'msg': '新增订单失败，请检查Excel填写是否正确', results: { total: total, success: success, fail: fail, failArr: failArr } }));
                                        }
                                        insertIndentFun(); //继续添加下一条记录
                                    } else {
                                        // 添加流程记录
                                        // 方法一（暂废）
                                        /*for(let i = 0,len = procedureArr.length;i < len;i++){
                  let dealProcedure = (function(rowId){
                    let sqlQuest3 = "insert into `procedure`(indentID, name, materialCode,materialName,duty,status) values(?, ?, ?, ?, ?, ?)";
                    // let sqlParam3 = [res1.insertId, procedureArr[i], row[2], row[3], userArr[i], 0];
                    //let sqlParam3 = [res1.insertId, procedureArr[i], row[1], row[2], userArr[i], 0];
                    connection.print(res1);
                    let sqlParam3 = [res1.insertId, procedureArr[i], row[3], row[4], userArr[i], 0];
                    connection.latest().query(sqlQuest3,sqlParam3,function(error,res1){
                      if(error){
                        connection.print(error);
      connection.print('roll back!!!!!!!!!');
                        // connection.latest().query('rollback;');
                      }else{

                        if(i == procedureArr.length-1){
                          success++;
                        }

                        if(rowId == sheet['data'].length-1){
                          if(i == procedureArr.length-1){
                            connection.latest().query('commit');
                            res.send(JSON.stringify({code:200,'msg':'新增订单成功', results: {total: total,success: success, fail: fail}}));
                          }
                        }
                      }

                    })
                  })(rowId)
                }*/
                                        // 方法二
                                        let dealProcedure = (i, rowId) => {
                                            let sqlQuest3 = "insert into `procedure`(indentID, name, materialCode,materialName,duty,status) values(?, ?, ?, ?, ?, ?)";
                                            let sqlParam3 = [res1[1].insertId, procedureArr[i], row[3], row[4], userArr[i], 0];
                                            connection.latest().query(sqlQuest3, sqlParam3, function(error1, res1) {
                                                if (error1) {
                                                    connection.redlog('添加流程数据失败：', error1);
                                                    connection.print('roll back!!!!!!!!!');
                                                    connection.latest().query('rollback;commit;');
                                                    fail++;
                                                    failArr.push({ index: rowId * 1 + 1, erp: row[2], name: row[4] });
                                                }
                                                // 如果未处理完成流程，前进一步
                                                if (i < procedureArr.length - 1) {
                                                    i++;
                                                    dealProcedure(i, rowId);
                                                }
                                                if (i == procedureArr.length - 1) {
                                                    success++;
                                                    connection.print(fail, success, sheet['data'].length);
                                                    connection.print('rowId2===', rowId);
                                                    connection.print(rowId == sheet['data'].length - 1, (fail + success == sheet['data'].length - 1));
                                                    if (fail + success == sheet['data'].length - 1) {
                                                        // if(rowId == sheet['data'].length-1 && (fail+success == sheet['data'].length-1)){
                                                        connection.print('新增订单成功，共' + total + '个订单');
                                                        connection.latest().query('commit');
                                                        res.send(JSON.stringify({ code: 200, 'msg': '新增订单成功', results: { total: total, success: success, fail: fail, failArr: failArr } }));
                                                    }
                                                    insertIndentFun(); //继续添加下一条记录
                                                }
                                            })
                                        };
                                        dealProcedure(0, rowId);
                                    }
                                })
                            } else {
                                connection.print('新增订单失败,编号为' + row[7] + '的模板不存在');
                                fail++;
                                failArr.push({ index: (rowId * 1 + 1), erp: row[2], name: row[4], type: 1 });
                                if (fail + success == sheet['data'].length - 1) {
                                    // if(rowId == sheet['data'].length-1 && (fail+success == sheet['data'].length-1)){
                                    connection.print('新增订单成功，共' + total + '个订单');
                                    connection.latest().query('commit');
                                    res.send(JSON.stringify({ code: 200, 'msg': '新增订单成功', results: { total: total, success: success, fail: fail, failArr: failArr } }));
                                }
                                insertIndentFun(); //继续添加下一条记录
                            }
                        })
                    })(row)
                }
            }
            insertIndentFun();
        }

        uploadFile.storageFile(path, file, fs, moment, connection, userID, nextFun);

    })


    // 删除订单信息，用字段标识，不从数据库移除
    app.post(frontRequestUrl + '/deleteIndent', function(req, res) {
        let parse = req.body;

        let sqlQuest = "select ifDelete from indent where id='" + parse.id + "'";

        if (parse.id == 'all') {

            let sqlQuest2 = "start transaction;delete from indent where ifDelete=1;delete from `procedure` where indentID not in (select id from indent);delete from `proceduredetail` where pid not in (select id from `procedure`);";
            connection.print('*********************start transaction*******************');
            connection.latest().query(sqlQuest2, [parse.id], function(error2, res2) {
                if (error2) {
                    connection.redlog(error2);
                    connection.print('roll back!!!!!!!!!');
                    connection.latest().query('rollback;commit;');
                    res.send(JSON.stringify({ code: 500, 'msg': '清空订单失败' }));
                } else {
                    connection.latest().query('commit');
                    res.send(JSON.stringify({ code: 200, 'msg': '清空订单成功' }));
                }
            })

        } else {
            connection.latest().query(sqlQuest, function(error, res1) {
                if (error) {
                    connection.print(error);
                    res.send(JSON.stringify({ code: 500, 'msg': '删除订单失败' }));
                } else {
                    // 判断是标记删除，还是彻底删除
                    if (res1[0] && res1[0].ifDelete == 1) {
                        // 删除订单时也应删除对应的流程表
                        let sqlQuest2 = "start transaction;delete from indent where id=? and ifDelete=1;delete from `procedure` where indentID not in (select id from indent);delete from `procedureDetail` where pid not in (select id from `procedure`);";
                        connection.print('*********************start transaction*******************');
                        connection.latest().query(sqlQuest2, [parse.id], function(error2, res2) {
                            if (error2) {
                                connection.redlog("彻底删除订单f==", error2);
                                connection.print('roll back!!!!!!!!!');
                                connection.latest().query('rollback;commit;');
                                res.send(JSON.stringify({ code: 500, 'msg': '彻底删除订单失败' }));
                            } else {
                                connection.latest().query('commit');
                                connection.print("彻底删除订单s==", parse.id);
                                res.send(JSON.stringify({ code: 200, 'msg': '彻底删除订单成功' }));
                            }
                        })
                    } else {
                        let sqlQuest2 = "update indent set ifDelete= 1,erp = concat(erp,'-del') where id='" + parse.id + "'";
                        connection.latest().query(sqlQuest2, function(error2, res2) {
                            if (error2) {
                                connection.print("删除订单f==", error2);
                                res.send(JSON.stringify({ code: 500, 'msg': '删除订单失败' }));
                            } else {
                                connection.print("删除订单s==", parse.id);
                                res.send(JSON.stringify({ code: 200, 'msg': '删除订单成功' }));
                            }
                        })
                    }
                }
            })

        }

    })

    // 还原订单信息
    app.post(frontRequestUrl + '/recycleIndent', function(req, res) {
        let parse = req.body;
        let sqlQuest = "update indent set ifDelete= 0,erp = replace(erp,'-del','') where id='" + parse.id + "'";
        connection.latest().query(sqlQuest, function(error, res1) {
            if (error) {
                connection.print("还原订单f==", error);
                res.send(JSON.stringify({ code: 500, 'msg': '还原订单失败' }));
            } else {
                connection.print("还原订单s==", parse.id);
                res.send(JSON.stringify({ code: 200, 'msg': '还原订单成功' }));
            }
        })
    })

    // 获取所有订单列表(根据时间段查询、erp查询、id查询)
    app.get([frontRequestUrl + '/listAllIndentByDate', frontRequestUrl + '/listAllIndentById'], function(req, res) {
        let startDate = req.query.startDate ? req.query.startDate : '';
        let endDate = req.query.endDate ? req.query.endDate : '';
        let id = req.query.id ? req.query.id : '';
        let erp = req.query.erp ? req.query.erp : '';
        startDate = startDate.replace(/-/g, '.');
        endDate = endDate.replace(/-/g, '.');
        let status = req.query.status ? req.query.status : '[0-9]{1}';
        let ifNew = req.query.ifNew ? req.query.ifNew : '[0-9]{1}';
        let priority = req.query.priority ? req.query.priority : '[0-9]{1}';
        let limit = req.query.limit ? req.query.limit * 1 : 30;
        let from = req.query.from ? req.query.from * 1 : 0;
        let ifDelete = req.query.ifDelete ? req.query.ifDelete : 0;
        let keyword = req.query.keyword ? req.query.keyword : 0;
        // let sqlQuest = 'select * from indent';// where userName like "%'+userName+'%"';
        // id,name,erp,materialCode,materialName,userName as duty,`procedure`, status
        let sqlQuest = '';
        let sqlParam = '';
        if (id) {
            sqlQuest = 'select * from indent  where id=? and ifDelete = ? order by indent.planOnline'; // where userName like "%'+userName+'%"';
            sqlParam = [id, ifDelete];
        } else if (erp) {
            sqlQuest = 'select * from indent  where erp = ? and ifDelete = ? order by indent.planOnline'; // where userName like "%'+userName+'%"';
            sqlParam = [erp, ifDelete];
        } else if (startDate && endDate) {
            sqlQuest = 'select count(*) as total from indent  where ((planOnline >= ? and planOnline <= ?) or (actualStart>=? and actualStart <= ?) or (actualFinish>=? and actualFinish <= ?)) and ifDelete = ? and status REGEXP ? and ifNew REGEXP ? and priority REGEXP ?; select * from indent  where ((planOnline >= ? and planOnline <= ?) or (actualStart>=? and actualStart <= ?) or (actualFinish>=? and actualFinish <= ?)) and ifDelete = ? and status REGEXP ? and ifNew REGEXP ? and priority REGEXP ? order by indent.planOnline, id limit ?,?'; // where userName like "%'+userName+'%"';
            sqlParam = [startDate, endDate, startDate, endDate, startDate, endDate, ifDelete, status, ifNew, priority, startDate, endDate, startDate, endDate, startDate, endDate, ifDelete, status, ifNew, priority, from, limit];
        } else if (keyword) {
            sqlQuest = "select * from indent where ifDelete = 0 and erp REGEXP ? or materialName REGEXP ?  or materialCode REGEXP ? limit 500";
            sqlParam = [keyword, keyword, keyword];
        } else {
            sqlQuest = 'select count(*) as total from indent where ifDelete = ? and status REGEXP ? and ifNew REGEXP ? and priority REGEXP ?;select * from indent where ifDelete = ? and status REGEXP ? and ifNew REGEXP ? and priority REGEXP ? order by indent.planOnline, id limit ?,?';
            sqlParam = [ifDelete, status, ifNew, priority, ifDelete, status, ifNew, priority, from, limit];
        }
        // console.log(sqlQuest, sqlParam);
        connection.latest().query(sqlQuest, sqlParam, function(error, res1, fileds) {
            if (error) {
                connection.print(error);
                res.send(JSON.stringify({ code: 500, msg: '查询订单失败', results: res1 }));
            } else {
                // connection.print(res1.length, res1[0][0].total);
                if (res1.length == 2 && res1[0][0]) {
                    res.send(JSON.stringify({ code: 200, msg: '查询订单成功', total: res1[0][0].total, results: res1[1] }));
                } else if (res1.length) {
                    res.send(JSON.stringify({ code: 200, msg: '查询订单成功', results: res1 }));
                } else {
                    res.send(JSON.stringify({ code: 200, msg: '暂无订单信息', results: res1 }));
                }
            }
        })
    })

    // 获取所有订单状态列表(根据时间段查询)
    app.get([frontRequestUrl + '/listAllIndentStatusByDate', frontRequestUrl + '/listIndentStatusById'], function(req, res) {
        let userName = req.query.keyword ? req.query.keyword : '';

        let startDate = req.query.startDate ? req.query.startDate : '';
        let endDate = req.query.endDate ? req.query.endDate : '';
        let id = req.query.id ? req.query.id : '';
        let erp = req.query.erp ? req.query.erp : '';
        startDate = startDate.replace(/-/g, '.');
        endDate = endDate.replace(/-/g, '.');
        let status = req.query.status ? req.query.status : '[0-9]{1}';
        let ifNew = req.query.ifNew ? req.query.ifNew : '[0-9]{1}';
        let priority = req.query.priority ? req.query.priority : '[0-9]{1}';
        let limit = req.query.limit ? req.query.limit * 1 : 30;
        let from = req.query.from ? req.query.from * 1 : 0;
        let keyword = req.query.keyword ? req.query.keyword : 0;
        // let sqlQuest = 'select * from indent';// where userName like "%'+userName+'%"';
        // id,name,erp,materialCode,materialName,userName as duty,`procedure`, status
        let sqlQuest = '';
        let sqlParam = '';
        if (erp) {
            sqlQuest = 'select  a.*,a.name as `procedure`, indent.erp, indent.planNum, indent.planOnline, indent.planFinishDate, indent.actualStart, indent.actualFinish, indent.ifNew, indent.priority, indent.templateID, indent.status as pstatus, user.userName as duty from `procedure` a inner join indent on a.indentID = indent.id left join user on a.duty = user.userID where  indent.erp = ?';
            sqlParam = [erp];
        } else if (startDate && endDate) {
            sqlQuest = "select count(*) as total from `procedure` a inner join indent on a.indentID = indent.id where ((indent.planOnline >= ? and indent.planOnline <= ?) or (indent.actualStart >= ? and indent.actualStart <= ?) or (indent.actualFinish >= ? and indent.actualFinish <= ?)) and ifDelete = 0 and a.status REGEXP ? and ifNew REGEXP ? and priority REGEXP ?;  select  a.*,a.name as `procedure`, indent.erp, indent.planNum, indent.planOnline, indent.planFinishDate, indent.actualStart, indent.actualFinish, indent.ifNew, indent.priority, indent.templateID, indent.status as pstatus, user.userName as duty from `procedure` a inner join indent on a.indentID = indent.id left join user on a.duty = user.userID where ((indent.planOnline >= ? and indent.planOnline <= ?) or (indent.actualStart >= ? and indent.actualStart <= ?) or (indent.actualFinish >= ? and indent.actualFinish <= ?)) and ifDelete = 0 and a.status REGEXP ? and ifNew REGEXP ? and priority REGEXP ? order by indentID, a.id limit ?,?";
            sqlParam = [startDate, endDate, startDate, endDate, startDate, endDate, status, ifNew, priority, startDate, endDate, startDate, endDate, startDate, endDate, status, ifNew, priority, from, limit];
        } else if (keyword) {
            sqlQuest = "select a.*,a.name as `procedure`, indent.erp, indent.planNum, indent.planOnline, indent.planFinishDate, indent.actualStart, indent.actualFinish, indent.ifNew, indent.priority, indent.templateID, indent.status as pstatus, user.userName as duty from `procedure` a inner join indent on a.indentID = indent.id left join user on a.duty = user.userID  where ifDelete = 0 and indent.erp REGEXP ? or a.materialName REGEXP ?  or a.materialCode REGEXP ? limit 500";
            sqlParam = [keyword, keyword, keyword];
        } else {
            sqlQuest = "select  count(*) as total from `procedure` a inner join indent on a.indentID = indent.id where ifDelete = 0 and a.status REGEXP ? and ifNew REGEXP ? and priority REGEXP ?;select  a.*,a.name as `procedure`, indent.erp, indent.planNum, indent.planOnline, indent.planFinishDate, indent.actualStart, indent.actualFinish, indent.ifNew, indent.priority, indent.templateID, indent.status as pstatus, user.userName as duty from `procedure` a inner join indent on a.indentID = indent.id left join user on a.duty = user.userID  where ifDelete = 0 and a.status REGEXP ? and ifNew REGEXP ? and priority REGEXP ? order by indentID, a.id  limit ?,?";
            sqlParam = [status, ifNew, priority, status, ifNew, priority, from, limit];
        }
        // console.log(sqlQuest, sqlParam);
        connection.latest().query(sqlQuest, sqlParam, function(error, res1, fileds) {
            if (error) {
                connection.print(error);
                res.send(JSON.stringify({ code: 500, msg: '查询订单状态失败', results: res1 }));
            } else {
                // connection.print(res1.length, res1[0][0]);
                if (res1.length == 2 && res1[0][0]) {
                    res.send(JSON.stringify({ code: 200, msg: '查询订单状态成功', total: res1[0][0].total, results: res1[1] }));
                } else if (res1.length) {
                    res.send(JSON.stringify({ code: 200, msg: '查询订单状态成功', results: res1 }));
                } else {
                    res.send(JSON.stringify({ code: 200, msg: '暂无订单信息', results: res1 }));
                }
            }
        })
    })


    // 获取生产面板的订单数据(根据时间段查询)
    app.get([frontRequestUrl + '/listShowPageData'], function(req, res) {
        // let sqlQuest = 'select * from indent';// where userName like "%'+userName+'%"';
        // id,name,erp,materialCode,materialName,userName as duty,`procedure`, status
        // let sqlQuest = 'select DISTINCT * from indent a left join `procedure` b on a.id = b.indentID where b.status != 0 GROUP BY a.id';
        //let sqlQuest = 'select * from (select DISTINCT c.userName as duty,b.*,a.erp, a.planNum, a.actualStart,a.planFinishDate,a.ifNew,a.priority,a.remark from indent a left join `procedure` b on a.id = b.indentID LEFT JOIN user c on b.duty = c.userID  where a.ifDelete = 0 order by a.status,a.id) yy GROUP BY yy.id';
        let sqlQuest = 'select * from (select DISTINCT c.userName as myduty,a.remark as myRemark, b.*,a.erp, a.planNum, a.actualStart,a.planFinishDate,a.ifNew,a.priority,a.status as pstatus from indent a left join `procedure` b on a.id = b.indentID LEFT JOIN user c on b.duty = c.userID  where a.ifDelete = 0 and a.status!=2 order by b.indentID,b.status desc,b.id desc) yy group by yy.indentID';

        connection.latest().query(sqlQuest, function(error, res1, fileds) {
            if (error) {
                connection.print(error);
                res.send(JSON.stringify({ code: 500, msg: '查询订单状态失败', results: res1 }));
            } else {
                // connection.print(res1);
                if (res1.length) {
                    res.send(JSON.stringify({ code: 200, msg: '查询订单状态成功', results: res1 }));
                } else {
                    res.send(JSON.stringify({ code: 200, msg: '暂无订单信息', results: res1 }));
                }
            }
        })
    })



    // 计算订单工时
    let countIndentWorkTime = (indentID) => {
        // 该流程所用的时间（五位小数）
        /*
        UPDATE workhour,(SELECT DISTINCT indent.id,countHour FROM indent  INNER JOIN (SELECT indentID, sum(countHour) AS countHour, sum(countWorker) AS countWorker FROM `procedure` GROUP BY indentID  ) a ON indent.id = a.indentID ) ff SET workhour.countHour = ff.countHour  where workhour.indentID = ff.id    更新订单工时语句
        update `procedure` a,(select sum(hourcount) as ithour,sum(workercount) as itworker, pid from procedureDetail) b set countWorker = b.itworker, countHour = b.ithour where a.id = b.pid  更新流程工时语句
        */
        // let sqlQuest = 'insert into workhour(indentID, erp,materialCode,planNum,countHour,countWorkers) (select indentID, erp,materialCode,planNum,countHour,countWorkers from indent INNER JOIN  (select sum(countHour) as countHour,indentID,countWorkers from `procedure` INNER join (select sum(workercount) as countWorkers,pid from proceduredetail group by pid) pro_de  on pro_de.pid = `procedure`.id GROUP BY indentID) a on  indent.id = a.indentID where id = ?);select actulStartTime from indent where id=?';
        let sqlQuest = 'insert into workhour(indentID, erp,materialCode,planNum,countHour,countWorkers) (select distinct indentID, erp,materialCode,planNum,countHour,countWorker from indent INNER JOIN  (select indentID,sum(countHour) as countHour,sum(countWorker) as countWorker from `procedure` group by indentID ) a on  indent.id = a.indentID where id = ?);select actualFinish as actualStart from indent where id=?';
        let sqlParam = [indentID, indentID];
        connection.latest().query(sqlQuest, sqlParam, function(error, res1) {
            if (error) {
                connection.print(error);
            } else {
                // 根据订单创建时间的权重计算
                connection.print(res1[1][0]);
                let year = moment(new Date(res1[1][0].actualStart)).format('YYYY');
                let month = moment(new Date(res1[1][0].actualStart)).format('MM');

                // let sqlQuest = 'update workhour set factor = (select id from factor where year = ? and month = ? ) where indentID = ?;update workhour set singleHour = countHour/planNum,cost = (select a.factor from factor a,workhour b where a.id = b.factor and b.indentID = ?)*singleHour where indentID = ?';
                // 判断当前权重因子是否存在, 存在多个时只获取一个，避免之后报错
                countFactor(res1[1][0].actualStart);
                let sqlQuest2 = 'update workhour set factor = (select id from factor where year = ? and month = ? limit 1) where indentID = ?;select distinct a.factor from factor a,workhour b where a.id = b.factor and b.indentID = ?';
                let sqlParam2 = [year, month, indentID, indentID, indentID];
                connection.latest().query(sqlQuest2, sqlParam2, function(error2, res2) {
                        if (error2) {
                            connection.print(error2);
                        } else {
                            let sqlQuest3 = 'update workhour set singleHour = countHour/planNum,cost = ?*singleHour where indentID = ?';
                            let sqlParam3 = [res2[1][0].factor || 41, indentID];
                            connection.print(sqlQuest3, sqlParam3, res2[1][0].factor);
                            connection.latest().query(sqlQuest3, sqlParam3, function(error3, res3) {
                                if (error3) {
                                    connection.print(error3);
                                } else {
                                    connection.print('**************************id为' + indentID + '的订单已完成，工时统计也完成');
                                }
                            })
                        }
                    })
                    // connection.print('id为'+pid+'的订单已完成，工时统计也完成');
            }
        })

    }

    // 更新订单信息(计算订单工时)
    app.post(frontRequestUrl + '/updateIndentInfo', function(req, res) {
        let parse = req.body;
        // let sqlQuest = "update indent set planFinishDate = ?,planOnline = ?,actualStart=?,actualFinish=?,priority=?,ifNew=?,ifOutsource=?,duty=?,status = ?, remark=? where id = ?";
        // 需要mysql语句处理的字段，可以不必拼接，直接放入下面的自动拼接语句里
        let planFinishDate = parse.planFinishDate;
        let planOnline = parse.planOnline;
        let actualStart = parse.actualStart;
        let actualFinish = parse.actualFinish;
        if (planFinishDate) planFinishDate = planFinishDate.replace(/-/g, '.');
        if (planOnline) planOnline = planOnline.replace(/-/g, '.');
        if (actualStart) actualStart = actualStart.replace(/-/g, '.');
        if (actualFinish) actualFinish = actualFinish.replace(/-/g, '.');
        //
        let sqlQuest = "update indent set planNum=?, planFinishDate = ?,planOnline = ?,actualStart=?,actualFinish=?,priority=?,ifNew=?,ifOutsource=?, remark=? where id = ?";
        let sqlParam = [parse.planNum, planFinishDate, planOnline, actualStart, actualFinish, parse.priority, parse.ifNew, parse.ifOutsource, parse.remark, parse.id];

        if (parse.status == 2) {
            sqlQuest = 'select * from `procedure` where indentID = ? and status != 2';
            sqlParam = [parse.id];
            connection.latest().query(sqlQuest, sqlParam, function(error8, res8) {
                if (error8) {
                    connection.print(error8);
                    res.send(JSON.stringify({ code: 500, 'msg': '更新订单失败' }));
                    return;
                }

                if (res8.length > 0) {
                    res.send(JSON.stringify({ code: 500, 'msg': '该订单下还有' + res8.length + '个流程未完成，请确认全部完成后再操作' }));
                } else if (res8.length == 0) {
                    // 确认所有流程完成后，才能修改订单状态
                    sqlQuest = "update indent set status = ?, remark=? where id = ?";
                    sqlParam = [parse.status, parse.remark, parse.id];
                    connection.latest().query(sqlQuest, sqlParam, function(error, res1) {
                        if (error) {
                            connection.print(error);
                            res.send(JSON.stringify({ code: 500, 'msg': '更新订单失败' }));
                        } else {
                            countIndentWorkTime(parse.id); // 订单完成后，结算订单工时
                            res.send(JSON.stringify({ code: 200, 'msg': '更新订单成功' }));
                        }
                    })
                } else {
                    res.send(JSON.stringify({ code: 500, 'msg': '更新订单失败' }));
                    connection.redlog('流程数量不匹配，更新订单完成失败');
                }
            })
        } else if (parse.status == 1) {
            sqlQuest = "update indent set status = 1, remark=? where id = ?;update `procedure` set status =1 where indentID = ? order by id limit 1;";
            sqlParam = [parse.remark, parse.id, parse.id];
            connection.latest().query(sqlQuest, sqlParam, function(error, res1) {
                if (error) {
                    connection.print(error);
                    res.send(JSON.stringify({ code: 500, 'msg': '更新订单失败' }));
                } else {
                    res.send(JSON.stringify({ code: 200, 'msg': '更新订单成功' }));
                }
            })
        } else {
            connection.latest().query(sqlQuest, sqlParam, function(error, res1) {
                if (error) {
                    connection.print(error);
                    res.send(JSON.stringify({ code: 500, 'msg': '更新订单失败' }));
                } else {
                    res.send(JSON.stringify({ code: 200, 'msg': '更新订单成功' }));
                }
            })
        }


    })



    /*
     *
     *导出订单数据
     *
     */

    // 获取所有订单状态列表(根据时间段查询)
    app.get([frontRequestUrl + '/exportAllIndentStatusByDate'], function(req, res) {
        let userName = req.query.keyword ? req.query.keyword : '';

        let startDate = req.query.startDate ? req.query.startDate : '';
        let endDate = req.query.endDate ? req.query.endDate : '';
        let id = req.query.id ? req.query.id : '';
        let erp = req.query.erp ? req.query.erp : '';

        let priority = req.query.priority;
        let ifNew = req.query.ifNew;

        let name = '';
        let sqlQuest = '';
        let sqlParam = '';
        if (startDate) {
            sqlQuest = 'select  a.*, indent.erp, indent.planNum, indent.planOnline, indent.planFinishDate, indent.actualStart, indent.actualFinish, indent.ifNew, indent.priority, indent.templateID, indent.status as pstatus, user.userName as duty from `procedure` a inner join indent on a.indentID = indent.id left join user on a.duty = user.userID where  (indent.planOnline >= ? and indent.planOnline <= ?) and ifDelete = 0 order by indentID, a.id';
            sqlParam = [startDate.replace(/-/g, '.'), endDate.replace(/-/g, '.')];
            name = '订单表' + startDate.replace(/-/g, '') + '-' + endDate.replace(/-/g, '');
        } else {
            sqlQuest = 'select  a.*, indent.erp, indent.planNum, indent.planOnline, indent.planFinishDate, indent.actualStart, indent.actualFinish, indent.ifNew, indent.priority, indent.templateID, indent.status as pstatus, user.userName as duty from `procedure` a inner join indent on a.indentID = indent.id left join user on a.duty = user.userID where ifDelete = 0 order by indentID, a.id';
            name = '全部订单详细表';
        }

        if (ifNew) {
            sqlQuest = 'select  a.*, indent.erp, indent.planNum, indent.planOnline, indent.planFinishDate, indent.actualStart, indent.actualFinish, indent.ifNew, indent.priority, indent.templateID, indent.status as pstatus, user.userName as duty from `procedure` a inner join indent on a.indentID = indent.id left join user on a.duty = user.userID where ifDelete = 0 and indent.ifNew = 1 order by indentID, a.id';
            name = '订单详细表-新品';
        } else if (priority) {
            sqlQuest = 'select  a.*, indent.erp, indent.planNum, indent.planOnline, indent.planFinishDate, indent.actualStart, indent.actualFinish, indent.ifNew, indent.priority, indent.templateID, indent.status as pstatus, user.userName as duty from `procedure` a inner join indent on a.indentID = indent.id left join user on a.duty = user.userID where ifDelete = 0 and indent.priority = 1 order by indentID, a.id';
            name = '订单详细表-优先';
        }

        let _headers = [
            { k: 'erp', v: 'erp编号' },
            { k: 'materialCode', v: '货号' },
            { k: 'materialName', v: '货物名称' },
            { k: 'planNum', v: '计划生产数量' },
            { k: 'planOnline', v: '计划上线时间' },
            { k: 'planFinishDate', v: '计划完成时间' },
            { k: 'actualStart', v: '实际开始时间' },
            { k: 'actualFinish', v: '实际完成时间' },
            { k: 'name', v: '流程' },
            { k: 'duty', v: '负责人员' },
            { k: 'ifNew', v: '是否新品' },
            { k: 'priority', v: '是否加急' },
            { k: 'templateID', v: '模板编号' },
            { k: 'status', v: '状态' }
        ];
        myExportData.getData(req, res, sqlQuest, sqlParam, name, _headers);
    })


    // 导出订单及对应流程表
    app.get([frontRequestUrl + '/exportIndentMatchTemplete'], function(req, res) {
        // let sqlQuest = 'select a.erp, a.materialCode, materialName, b.name ,GROUP_CONCAT(b.`procedure`) as `procedure`,GROUP_CONCAT(b.duty) as `duty` from indent a INNER JOIN template b where templateID = b.id and a.ifDelete = 0 GROUP BY a.id ORDER BY a.id';
        let sqlQuest = "select a.erp, a.materialCode, materialName, b.name ,b.`procedure`, b.duty from indent a INNER JOIN (select template.id,template.name, template.procedure,replace(GROUP_CONCAT(userName),',',' ') as duty  from template,user where duty like CONCAT('%',userID,'%') and  ifDelete = 0 GROUP BY template.id) b where templateID = b.id and a.ifDelete = 0  GROUP BY a.id ORDER BY a.id";

        let sqlParam = '';
        // connection.print("priority  ifNew===",  req.query, name);
        let _headers = [
            { k: 'erp', v: 'erp编号' },
            { k: 'materialCode', v: '货号' },
            { k: 'materialName', v: '货物名称' },
            { k: 'name', v: '流程名称' },
            { k: 'procedure', v: '详细流程' },
            { k: 'duty', v: '流程对应负责人' }
        ];
        let name = '订单及对应流程表';

        myExportData.getData(req, res, sqlQuest, sqlParam, name, _headers);
    })


    // 导出流程工时
    app.get([frontRequestUrl + '/exportProcedureWorkHourByDate'], function(req, res) {

        let startTime = req.query.startTime ? req.query.startTime : '';
        let endTime = req.query.endTime ? req.query.endTime : '';

        let sqlQuest = '';
        let sqlParam = '';

        if (req.query.indentID) {
            sqlQuest = "select a.*,user.userName as duty, i.erp,i.planNum,i.factor from `procedure` a inner join (select b.id,workhour.indentID, b.planNum,b.erp,factor.factor from indent b left join workhour on b.id = workhour.indentID left join factor on workhour.factor = factor.id) i on a.indentID = i.indentID left join user on a.duty = user.userID where indentID=? order by indentID";
        } else {
            sqlQuest = "select a.*,user.userName as duty, i.erp,i.planNum,i.factor from `procedure` a inner join (select b.id,b.status,b.ifDelete,workhour.indentID, b.planNum,b.erp,factor.factor from indent b left join workhour on b.id = workhour.indentID left join factor on workhour.factor = factor.id where  b.ifDelete != 1) i on a.indentID = i.id left join user on a.duty = user.userID where a.status = 2 order by indentID";
        }

        sqlParam = [req.query.indentID];
        let _headers = [
            { k: 'erp', v: 'erp编号' },
            { k: 'materialCode', v: '货号' },
            { k: 'materialName', v: '货物名称' },
            { k: 'name', v: '流程名称' },
            { k: 'countHour', v: '总工时' },
            { k: 'singleHour', v: '单数量工时' },
            { k: 'factor', v: '权数' },
            { k: 'countWorker', v: '总人数' },
            { k: 'cost', v: '工时费' }
        ];
        let name = "流程工时表";
        myExportData.getData(req, res, sqlQuest, sqlParam, name, _headers);
    })


    // 导出订单工时列表(根据时间段查询)
    app.get([frontRequestUrl + '/exportWorkHourByDate', frontRequestUrl + '/listSystemUserByName'], function(req, res) {

        let startTime = req.query.startTime ? req.query.startTime : '';
        let endTime = req.query.endTime ? req.query.endTime : '';

        let sqlQuest = '';
        let sqlParam = '';
        if (startTime) {
            // sqlQuest = 'select * from workhour where startTime = ?, endTime = ?';
            sqlQuest = "select  workhour.*,indent.planNum, indent.materialName, indent.actualStart,indent.actualFinish, factor.factor as factor from workhour left join indent on workhour.indentID = indent.id inner join factor on workhour.factor = factor.id where actualStart>? and actualFinish<? and indent.ifdelete!=1";
            sqlParam = [startTime, endTime];
        } else {
            // sqlQuest = 'select workhour.*,indent.*,factor.factor as factor from workhour inner join indent on workhour.indentID = indent.id inner join factor on workhour.factor = factor.id';
            sqlQuest = "select  workhour.*,indent.planNum, indent.materialName, indent.actualStart,indent.actualFinish, factor.factor as factor from workhour left join indent on workhour.indentID = indent.id inner join factor on workhour.factor = factor.id where indent.ifdelete!=1";
        }

        let _headers = [
            { k: 'erp', v: 'erp编号' },
            { k: 'materialCode', v: '货号' },
            { k: 'materialName', v: '货物名称' },
            { k: 'countHour', v: '总工时' },
            { k: 'singleHour', v: '单数量工时' },
            { k: 'factor', v: '权数' },
            { k: 'countWorkers', v: '总人数' },
            { k: 'cost', v: '工时费' }
        ];
        let name = "订单工时表";

        myExportData.getData(req, res, sqlQuest, sqlParam, name, _headers);
    })




}


module.exports = indent;