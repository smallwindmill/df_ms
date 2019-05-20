// var serverIP = '123.5666.77/produceMS';
var serverIP = 'http://127.0.0.1:12600/produceMS';

var config = {
  server:{
    login: serverIP+'/login',

    listSystemUser: serverIP+'/listSystemUser',
    addSystemUser: serverIP+'/addSystemUser',
    listSystemUserByName: serverIP+'/listSystemUserByName',
    listSystemUserByType: serverIP+'/listSystemUserByType',
    updateSystemUser: serverIP+'/updateSystemUser',
    deleteSystemUser: serverIP+'/deleteSystemUser',

    listAllUserPower: serverIP+'/listAllUserPower',
    listAllUserPowerByName: serverIP+'/listAllUserPowerByName',
    setUserPower: serverIP+'/setUserPower',

    listAllTemplate: serverIP+'/listAllTemplate',
    addTemplate: serverIP+'/addTemplate',
    updateTemplate: serverIP+'/updateTemplate',
    deleteTemplate: serverIP+'/deleteTemplate',


    uploadExcelForAddIndent: serverIP+'/uploadExcelForAddIndent',
    listAllIndentByDate: serverIP+'/listAllIndentByDate',
    updateIndentInfo: serverIP+'/updateIndentInfo',


    updateFactor: serverIP+'/updateFactor',

    listIndentById: serverIP+'/listIndentById',
    listAllIndentStatusByDate: serverIP+'/listAllIndentStatusByDate',

    queryWorkHourByDate: serverIP+'/queryWorkHourByDate',


    exportTimeIndentServer: serverIP+'/exportTimeIndentServer',
    addProcedureInfo: serverIP+'/addProcedureInfo',

    listAllIndent: serverIP+'/listAllIndent',


    queryProcedureInfo: serverIP+'/queryProcedureInfo',
    queryDutyProcedureByStatus: serverIP+'/queryDutyProcedureByStatus',
    queryDutyProcedureById:  serverIP+'/queryDutyProcedureById',
    addProcedureInfo: serverIP+'/addProcedureInfo',
    updateProcedureStatus: serverIP+'/updateProcedureStatus'
  },




  templete:{indentUrl:'/assets/订单上传文件模板.xlsx'},

  changeToJson: function(data){
      return JSON.parse(data);
  },
  changeToStr: function(data){
      return JSON.stringify(data);
  }
}

export default config;
