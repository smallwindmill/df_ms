var serverIP = "http://"+window.location.host+'/produceMS';
// var serverIP = "http://"+window.location.host+'/produceMS';
// var serverIP = 'http://127.0.0.1:2030/produceMS';
// var serverIP = 'http://101.200.62.233:2030/produceMS';
// var serverIP = 'http://47.101.39.165:2030/produceMS';
// var serverIP = 'http://192.168.1.101:2030/produceMS';

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

      listAllEquipment: serverIP+'/listAllEquipment',
      addEquipment: serverIP+'/addEquipment',
      updateEquipment: serverIP+'/updateEquipment',
      deleteEquipment: serverIP+'/deleteEquipment',

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
      queryWorkTimeForEquipment: serverIP+'/queryWorkHourForEquipment',
      queryUserProgram: serverIP+'/queryUserProgram',
      queryEquipmentProgram: serverIP+'/queryEquipmentProgram',
      queryEqWorkTimeWithIndentID: serverIP+'/queryEqWorkTimeWithIndentID',

      exportTimeIndentServer: serverIP+'/exportAllIndentStatusByDate',// 根据订单状态导出
      exportIndentMatchTemplete: serverIP+'/exportIndentMatchTemplete', //导出订单及模板
      exportWorkHourByDate: serverIP+'/exportWorkHourByDate', //导出工时表
      exportProcedureWorkTime: serverIP+'/exportProcedureWorkHourByDate', //导出详细流程

      listAllIndent: serverIP+'/listAllIndent',

      queryAudioTokenID: serverIP+'/queryAudioTokenID',
      listShowPageData: serverIP+'/listShowPageData',

      queryProcedureInfo: serverIP+'/queryProcedureInfo',
      queryDutyProcedureByStatus: serverIP+'/queryDutyProcedureByStatus',
      queryDutyProcedureById:  serverIP+'/queryDutyProcedureById',
      updateDutyProcedureStatus:  serverIP+'/updateDutyProcedureStatus',

      addProcedureInfo: serverIP+'/addProcedureInfo',
      deleteProcedureDetail: serverIP+'/deleteProcedureDetail',
      updateDutyProcedureDetailStatus: serverIP+'/updateDutyProcedureDetailStatus',

      recycleTemplate: serverIP+'/recycleTemplate',
      recycleIndent: serverIP+'/recycleIndent',

      queryWorkCalendar: serverIP+'/queryWorkCalendar',
      updateWorkCalendar: serverIP+'/updateWorkCalendar',
  },
  baiduAudioAPI: {
    id: "EPZZcrsFYYPUPqhDiq6APbKZ",
    secret: "BGyMaGYUAiFoCdB71mmxtNIYRGmH7Myg"
  },


  templete:{indentUrl:'/produceMSF/assets/订单上传文件模板.xlsx'},//订单上传页面的示例Excel路径

  changeToJson: function(data){
      return JSON.parse(data);
  },
  changeToStr: function(data){
      return JSON.stringify(data);
  },
  pageChangeNum: window.outerHeight >= 1000 ? 13 : (window.outerHeight < 900 ? 7 : 10),
  indentPageNum: 50
}

export default config;
