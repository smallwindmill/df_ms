import { exportExcel } from 'xlsx-oc';

let requestData = (url, _headers, fileName) =>{
    fetch(url).then(res=>res.json()).then(data=>{
      if(data.results.length){
        dlExcel(_headers, data.results, fileName);
      }else{
        self.postMessage({msg: '暂无数据！'});
      }
    }).catch(e=>{
        console.log(e);self.postMessage({msg: '网络出错了，请稍候再试'})
    });
}

self.startWorker = () => {
  self.addEventListener('message', function (e) {
    let params = JSON.parse(e.data);
    self.postMessage('You said: ' + e.data);
    requestData(params.url, params._headers, params.fileName);
    console.log(exportExcel);
  }, false);
}




let dlExcel = (_headers, dataSource, fileName) =>{
    // 导表方法
    for(var i in dataSource){
      dataSource[i].key = i + 1;
    }
    exportExcel(_headers, dataSource, fileName);
}
