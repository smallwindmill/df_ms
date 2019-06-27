storageFile = function(path,file,fs, moment,connection, floder, nextFun){
    // 复制文件,先判断文件是否存在
    //let name = 'upload/'+floder+'/'+file.originalFilename.split('.')[len-2]+moment().format("YYYYMMDDHHMMSS");
    let len = file.originalFilename.split('.').length;
    // let name = 'upload/'+floder+'/'+file.originalFilename.split('.')[len-2]+moment().format("YYYYMMDDHHMMSS")+'.'+file.originalFilename.split('.')[len-1];
    let name = path.resolve(__dirname, '../../upload')+'/'+floder+'/'+file.originalFilename.split('.')[len-2]+moment().format("YYYYMMDDHHMMSS")+'.'+file.originalFilename.split('.')[len-1];
    let newName='';

    var verExists = (name) => {
      fs.exists(name,function(exists){
            // 存在时取别名
          if(exists){
            let len = name.split('.').length;
            newName=name.split('.')[len-2]+'(1)'+'.'+file.originalFilename.split('.')[len-1];
            verExists(newName);
          }else{
          // 不存在则以该名称存储
            fs.writeFileSync(name,fs.readFileSync(file.path),function(err){
               if(err){
                console.log(err);
               }
            });
            // 解析文件
            if(nextFun){
              nextFun(name);
            }
          }
       })
    }
    console.log('file path', name);
    // 判断文件夹是否存在
   fs.exists(path.resolve(__dirname, '../../upload')+'/'+floder,function(exists){
    if(!exists){
      fs.mkdir(path.resolve(__dirname, '../../upload')+'/'+floder, function(err){
        if(err){
          console.log(err)
        }else{
          verExists(name);
        }
      });
    }else{
      verExists(name);
    }
  })






}




module.exports = {
  storageFile: storageFile
};


