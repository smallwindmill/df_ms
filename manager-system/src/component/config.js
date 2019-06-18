// var serverIP = 'http://127.0.0.1:2030/produceMS';
// var serverIP = 'http://101.200.62.233:2030/produceMS';
var serverIP = 'http://47.101.39.165:2030/produceMS';
//var serverIP = 'http://192.168.1.101:2030/produceMS';

// 接口地址拼接
var config = {
  server:{
      login: serverIP+'/login',

      queryMessage: serverIP+'/queryMessage',
      markMessageRead: serverIP+'/markMessageRead',

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
      deleteIndent: serverIP+'/deleteIndent',

      listAllFactor: serverIP+'/listAllFactor',
      updateFactor: serverIP+'/updateFactor',

      listIndentById: serverIP+'/listIndentById',
      listAllIndentStatusByDate: serverIP+'/listAllIndentStatusByDate',

      queryWorkHourByDate: serverIP+'/queryWorkHourByDate',
      queryProcedureWorkTime: serverIP+'/queryProcedureWorkHourByDate',
      queryWorkTimeForUser: serverIP+'/queryWorkHourForUser',

      exportTimeIndentServer: serverIP+'/listAllIndentStatusByDate',//exportTimeIndentServer
      exportIndentMatchTemplete: serverIP+'/listIndentMatchTemplete',
      addProcedureInfo: serverIP+'/addProcedureInfo',

      listAllIndent: serverIP+'/listAllIndent',
      listShowPageData: serverIP+'/listShowPageData',

      queryProcedureInfo: serverIP+'/queryProcedureInfo',
      queryDutyProcedureByStatus: serverIP+'/queryDutyProcedureByStatus',
      queryDutyProcedureById:  serverIP+'/queryDutyProcedureById',
      updateDutyProcedureStatus:  serverIP+'/updateDutyProcedureStatus',

      addProcedureInfo: serverIP+'/addProcedureInfo',
      updateDutyProcedureDetailStatus: serverIP+'/updateDutyProcedureDetailStatus',

      recycleTemplate: serverIP+'/recycleTemplate',
      recycleIndent: serverIP+'/recycleIndent',

      queryWorkCalendar: serverIP+'/queryWorkCalendar',
      updateWorkCalendar: serverIP+'/updateWorkCalendar',
  },




  templete:{indentUrl:'/produceMSF/assets/订单上传文件模板.xlsx'},

  changeToJson: function(data){
      return JSON.parse(data);
  },
  changeToStr: function(data){
      return JSON.stringify(data);
  },
  pageChangeNum: 9

}

export default config;
