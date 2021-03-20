import { exportExcel } from 'xlsx-oc';

this.addEventListener('message', function (e) {
  this.postMessage('You said: ' + e.data);
  console.log(exportExcel);
}, false);



dlExcel = (_headers, dataSource, fileName) =>{
    // 导表方法
    for(var i in dataSource){
      dataSource[i].key = i + 1;
    }
    exportExcel(_headers, dataSource, fileName);
}
