// 导出表单页面
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import CloseIcon from '@material-ui/icons/Close';

import {DateFormatInput} from 'material-ui-next-pickers';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Confirm from '../main/Confirm';
import Snackbar from '@material-ui/core/Snackbar';

import config from '../config';

// import { exportExcel } from 'xlsx-oc';


let counter = 0;
function createData( name, calories,fat, carbs, protein) {
  counter += 1;
  return { id: counter, name, calories, fat, carbs, protein };
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}


const rows = [
  { id: 'name', numeric: false, disablePadding: true, label: '序号' },
  { id: 'calories', numeric: false, disablePadding: false, label: '编号' },
  { id: 'name', numeric: false, disablePadding: true, label: '用户名' },
  { id: 'carbs', numeric: true, disablePadding: false, label: '密码' },
  { id: 'protein', numeric: true, disablePadding: false, label: '操作' }
];

class EnhancedTableHead extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }

  render() {
    const { order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            (row, index) => (
              <TableCell
                key={'EnhancedTableHead2'+index}
                align={row.numeric ? 'left' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
              >
                {row.label}
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  // onRequestSort: PropTypes.func.isRequired,
  // onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.primary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.primary,
  },
  title: {
    flex: '0 0 auto',
  },
});


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});




class ExportProduceIndent extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    page: 0,
    rowsPerPage: 10,
    open: true,
    deleteOpen: false,
    title: "确认",
    content: "确定删除该名用户吗？",
    selectedDate: new Date(),
    indentTimeTypes:[
      {value:0, text:'加急'},
      {value:1, text:'新品'},
      // {value:2, text:'外协'}
    ],
    indentTimeType: 0,
    startDate: new Date(),
    endDate: new Date()
  };

  onChangeStartDate = date => {
    this.setState({ startDate: date });
  };

  onChangeEndDate = date => {
    this.setState({ endDate: date });
  };

  // 根据日期导出订单表
  exportTimeIndent = () =>{

    var  { startDate, endDate } = this.state;
    if(!startDate){
        this.tips('请先选择开始时间');return;
    }
    if(!endDate){
        this.tips('请选择结束时间');return;
    }
    // console.log(new Date(startDate).format('yyyy-MM-dd'), new Date(endDate).format('yyyy-MM-dd'));
    if(new Date(startDate).format('yyyy-MM-dd')>new Date(endDate).format('yyyy-MM-dd')){
        this.tips('开始时间不能大于结束时间');return;
    }

    var _headers = [
        { k: 'erp', v: 'erp编号' },
        { k: 'materialCode', v: '货号' },
        { k: 'materialName', v: '货物名称' },
        { k: 'planNum', v: '计划生产数量' },
        { k: 'planOnline', v: '计划上线时间' },
        { k: 'planFinishDate', v: '计划完成时间' },
        { k: 'actualStart', v: '实际开始时间' },
        { k: 'actualFinish', v: '实际完成时间' },
        { k: 'procedure', v: '流程' },
        { k: 'duty', v: '负责人员' },
        { k: 'ifNew', v: '是否新品' },
        { k: 'priority', v: '是否加急' },
        { k: 'templateID', v: '模板编号' },
        { k: 'status', v: '状态' }
    ];

    var fileName = '订单表'+new Date(startDate).format('yyyy-MM-dd').replace(/-/g,'')+'-'+new Date(endDate).format('yyyy-MM-dd').replace(/-/g,'')+'';

    this.openWebWorker(`${config.server.exportTimeIndentServer}?startDate=${startDate.format('yyyy-MM-dd')}&endDate=${endDate.format('yyyy-MM-dd')}&name=${fileName}`, _headers, fileName);
    return;

    fetch(config.server.exportTimeIndentServer +'?startDate='+startDate.format('yyyy-MM-dd')+'&endDate='+endDate.format('yyyy-MM-dd')).then(res=>res.json()).then(data=>{
      if(data.results.length){
        this.dlExcel(_headers, data.results, fileName);
      }else{
        this.tips('未找到符合查询条件的数据！');
      }
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});
  }


  dlExcel = (_headers, dataSource, fileName) =>{
    // 导表方法
    for(var i in dataSource){
      dataSource[i].key = i + 1;
    }
    // exportExcel(_headers, dataSource, fileName);
  }


  exportAllIndent = () =>{
    var _headers = [
        { k: 'erp', v: 'erp编号' },
        { k: 'materialCode', v: '货号' },
        { k: 'materialName', v: '货物名称' },
        { k: 'planNum', v: '计划生产数量' },
        { k: 'planOnline', v: '计划上线时间' },
        { k: 'planFinishDate', v: '计划完成时间' },
        { k: 'actualStart', v: '实际开始时间' },
        { k: 'actualFinish', v: '实际完成时间' },
        { k: 'procedure', v: '流程' },
        { k: 'duty', v: '负责人员' },
        { k: 'ifNew', v: '是否新品' },
        { k: 'priority', v: '是否加急' },
        { k: 'templateID', v: '模板编号' },
        { k: 'status', v: '状态' }
    ];
    var fileName = '全部订单详细表';
    this.openWebWorker(`${config.server.exportTimeIndentServer}?name=${fileName}`, _headers, fileName);
    return;

    fetch(config.server.exportTimeIndentServer).then(res=>res.json()).then(data=>{
      if(data.results.length){
        this.dlExcel(_headers, data.results, fileName);
      }else{
        this.tips('未找到符合查询条件的数据！');
      }
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});
  }

  exportMatchIndent = () =>{
      var _headers = [
          { k: 'erp', v: 'erp编号' },
          { k: 'materialCode', v: '货号' },
          { k: 'materialName', v: '货物名称' },
          { k: 'name', v: '流程名称' },
          { k: 'procedure', v: '详细流程' },
          { k: 'duty', v: '流程对应负责人' }
      ];
      var fileName = '订单及对应流程表';

      this.openWebWorker(`${config.server.exportIndentMatchTemplete}?name=${fileName}`, _headers, fileName);
      return;

      fetch(config.server.exportIndentMatchTemplete).then(res=>res.json()).then(data=>{
        if(data.results.length){
          this.dlExcel(_headers, data.results, fileName);
        }else{
          this.tips('暂无数据！');
        }
      }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});
  }

  // 根据订单类型导出
  exportIndentByTimeType = (e) =>{
    // 根据数据类型过滤
    var type = this.state.indentTimeType;

    // console.log(type);

    var _headers = [
        { k: 'erp', v: 'erp编号' },
        { k: 'materialCode', v: '货号' },
        { k: 'materialName', v: '货物名称' },
        { k: 'planNum', v: '计划生产数量' },
        { k: 'planOnline', v: '计划上线时间' },
        { k: 'planFinishDate', v: '计划完成时间' },
        { k: 'actualStart', v: '实际开始时间' },
        { k: 'actualFinish', v: '实际完成时间' },
        { k: 'procedure', v: '流程' },
        { k: 'duty', v: '负责人员' },
        { k: 'ifNew', v: '是否新品' },
        { k: 'priority', v: '是否加急' },
        { k: 'templateID', v: '模板编号' },
        { k: 'status', v: '状态' }
    ];

    if(type==0){
      var fileName = '订单详细表-优先';
      this.openWebWorker(`${config.server.exportTimeIndentServer}?priority=1&name=${fileName}`, _headers, fileName);
      return;
    }else if(type==1){
      var fileName = '订单详细表-新品';
      this.openWebWorker(`${config.server.exportTimeIndentServer}?ifNew=1&name=${fileName}`, _headers, fileName);
      return;
    }

    fetch(config.server.exportTimeIndentServer).then(res=>res.json()).then(data=>{
      if(data.results.length){
        if(type==0){
          var fileName = '订单详细表-优先';
          this.openWebWorker(`${config.server.exportIndentMatchTemplete}?priority = 1&name=${fileName}`, _headers, fileName);
          return;

          this.dlExcel(_headers, data.results.filter(function(index) {
            return index.priority == 1;
          }), fileName);
        }else if(type==1){
          var fileName = '订单详细表-新品';
          this.openWebWorker(`${config.server.exportIndentMatchTemplete}?ifNew= 1&name=${fileName}`, _headers, fileName);
          return;

          this.dlExcel(_headers, data.results.filter(function(index) {
            return index.ifNew == 1;
          }), fileName);
        }
      }else{
        this.tips('未找到符合查询条件的数据！');
      }
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});

  }

  // 导出订单工时
  exportIndentWorkHour = (e) => {
    var _headers = [
          { k: 'erp', v: 'erp编号' },
          { k: 'materialCode', v: '货号' },
          { k: 'materialName', v: '货物名称' },
          { k: 'countHour', v: '总工时' },
          { k: 'singleHour', v: '单数量工时' },
          { k: 'factor', v: '权数' },
          { k: 'countWorkers', v: '总人数' },
          { k: 'cost', v: '工时费' }
      ];
      var fileName = '订单工时表';
      this.openWebWorker(`${config.server.exportWorkHourByDate}?name=${fileName}`, _headers, fileName);
      return;

      fetch(config.server.exportWorkHourByDate).then(res=>res.json()).then(data=>{
        if(data.results.length){
          this.dlExcel(_headers, data.results, fileName);
        }else{
          this.tips('暂无数据！');
        }
      }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});
  }

  // 导出流程工时
  exportProcedureWorkHour = (e) => {
    var _headers = [
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
      var fileName = '流程工时表';

      this.openWebWorker(`${config.server.exportProcedureWorkTime}?name=${1}`, _headers, fileName);
      return;

      fetch(config.server.exportProcedureWorkTime).then(res=>res.json()).then(data=>{
        if(data.results.length){
          for(var n of data.results){
            n.singleHour = ((n.countHour/(n.countWorker||1)) || 0).toFixed(5);
            n.cost = ((n.singleHour*n.factor).toFixed(5) || 0);
          }
          this.dlExcel(_headers, data.results, fileName);
        }else{
          this.tips('暂无数据！');
        }
      }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});
  }


  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  // 删除用户弹窗
  deleteUser=()=>{
    this.setState({deleteOpen: true})
  }

  // 关闭删除用户弹窗
  deleteModalClose=()=>{
    this.setState({deleteOpen: false})
  }

  // 消息提醒
  tips = (msg) => {
    if(msg){
      this.setState({tipInfo:msg});
    }
    this.setState({tipsOpen: true});

    setTimeout(()=>{
      this.setState({tipsOpen: false});
    },4000);
  }

  toArrayBuffer(e) {
      for (var t = new ArrayBuffer(e.length), r = new Uint8Array(t), n = 0; n != e.length; ++n) r[n] = 255 & e.charCodeAt(n);
      return t
  }

  openWebWorker (url, _headers, name) {
    var w;
    let that = this;
    console.log("url===", url);
    function startWorker(){
      if(typeof(Worker)!=="undefined"){
        if(typeof(w)=="undefined"){
          // w=new Worker("/excel-worker.js");
          w=new Worker("/worker.js");
        }
        w.postMessage(JSON.stringify({url: url, _headers: _headers, fileName: name}));
        w.onmessage = function (event) {
          // document.getElementById("result").innerHTML=event.data;
          console.log(event.data);
          let params = event.data;
          if(params.msg) that.tips(params.msg);
          if(params.type == 'data') {
            let name = params.name;
            let content = params.content;
              /*var o = File(name);
              return o.open("w"), o.encoding = "binary", Array.isArray(content) && (content = Blob(content)), o.write(content), o.close();*/
              var a = new Blob([that.toArrayBuffer(content)], {
                  type: "application/octet-stream"
              });
              // if ("undefined" !== typeof navigator && navigator.msSaveBlob) return navigator.msSaveBlob(content, name);
              // if ("undefined" !== typeof saveAs) return saveAs(a, name);
              if ("undefined" !== typeof URL && "undefined" !== typeof document && document.createElement && URL.createObjectURL) {
                  var s = URL.createObjectURL(a);
                 /* if ("function" == typeof({}).download) return URL.revokeObjectURL && "undefined" !== typeof setTimeout && setTimeout(function() {
                      URL.revokeObjectURL(s)
                  }, 6e4), chrome.downloads.download({
                      url: s,
                      filename: name,
                      saveAs: !0
                  });*/
                  var i = document.createElement("a");
                  if (null != i.download) return i.download = name, i.href = s, document.body.appendChild(i), i.click(), document.body.removeChild(i), URL.revokeObjectURL && "undefined" !== typeof setTimeout && setTimeout(function() {
                      URL.revokeObjectURL(s)
                  }, 6e4)
              }
          };
        };
      }else{
        console.log("Sorry, your browser does not support Web Workers...");
      }
    }

    // startWorker();
    function stopWorker(){
      w.terminate();
    }

    let i = document.createElement("a");
    i.href = url+'&name=1&token='+(new Date().getTime()*400+111111111111111);
    i.target = "_blank";
    i.click();
  }


  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;

    return (<div>
      <Paper className={classes.root} style={{padding:"0 2rem",width:"auto",boxShadow:'none'}}>
        <div>
          <Toolbar >
                <Typography variant="h6" id="tableTitle" align="left">
                  导出生产订单
                </Typography>
          </Toolbar>

          <Grid container spacing={24} align="left" vertical="center" style={{margin:'0rem 0 1rem',padding: '0 1.2rem'}}>
            <Grid container item xs={6} className="exportCon" style={{flexDirection: "row"}}>
              <Grid item  xs={12} style={{marginBottom: "1rem"}}>
                <span className="btn text-blue">按时间段导出生产订单</span>
              </Grid>
              <Grid item style={{flex:1}} xs={6}>
                <DateFormatInput  className="date-picker inline-block" name='date-input' value={this.state.startDate } onChange={this.onChangeStartDate} style={{marginbottom:'2rem'}} />
                <DateFormatInput name='date-input' className="date-picker inline-block"  value={this.state.endDate } onChange={this.onChangeEndDate}/>
              </Grid>
              <Grid item style={{flex:1}} xs={12}>
                <Button variant="outlined" style={{marginBottom: "-0px"}} color="default" onClick={this.exportTimeIndent} className={classes.button}>点击由此下载</Button>
              </Grid>
            </Grid>
            <Grid container item xs={6} className="exportCon" style={{flexDirection: "row"}}>
              <Grid item  xs={12} style={{marginBottom: "1rem"}}>
                <span className="btn text-blue">导出所有生产信息详细数据</span>
              </Grid>
              <Grid item style={{flex:1}} xs={6}></Grid>
              <Grid item style={{flex:1}} xs={12}>
                <Button variant="outlined" color="default" onClick={this.exportAllIndent} className={classes.button}>点击由此下载</Button>
              </Grid>
            </Grid>
            <Grid container item xs={6} className="exportCon" style={{flexDirection: "row"}}>
              <Grid item  xs={12} style={{marginBottom: "1rem"}}>
                <span className="btn text-blue">导出订单名称及对应的生产流程</span>
              </Grid>
              <Grid item style={{flex:1}} xs={6}></Grid>
              <Grid item style={{flex:1}} xs={12}>
                <Button variant="outlined" color="default" onClick={this.exportMatchIndent} className={classes.button}>点击由此下载</Button>
               </Grid>
            </Grid>

            <Grid container item xs={6} className="exportCon" style={{flexDirection: "row"}}>
              <Grid item  xs={12} style={{marginBottom: "1rem"}}>
                <span className="btn text-blue">按类型导出生产订单</span>
              </Grid>
              <Grid item style={{flex:1}} xs={6}>
                <TextField style={{marginTop:0,padding:'0 .5rem'}}
                  select
                  className={classes.textField}
                  autoComplete="current-password"
                  margin="normal" onChange={(e)=>{this.setState({indentTimeType: e.target.value})}}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  SelectProps={{
                  native: true,
                  className: 'text-blue select leftSelect',
                  align: 'center',
                  MenuProps: {
                  }}}
                >{this.state.indentTimeTypes.map((option, index) => (
                  <option key={'option'+index} value={option.value}>
                    {option.text}
                  </option>
                ))}</TextField>
              </Grid>
              <Grid item style={{flex:1}} xs={12}>
                <Button variant="outlined" color="default" onClick={this.exportIndentByTimeType} className={classes.button}>点击由此下载</Button>
              </Grid>
            </Grid>

            <Grid container item xs={6} className="exportCon" style={{flexDirection: "row"}}>
              <Grid item  xs={12} style={{marginBottom: "1rem"}}>
                <span className="btn text-blue">导出订单工时</span>
              </Grid>
              <Grid item style={{flex:1}} xs={6}>
              </Grid>
              <Grid item style={{flex:1}} xs={12}>
                <Button variant="outlined" color="default" onClick={this.exportIndentWorkHour} className={classes.button}>点击由此下载</Button>
              </Grid>
            </Grid>

            <Grid container item xs={6} className="exportCon" style={{flexDirection: "row"}}>
              <Grid item  xs={12} style={{marginBottom: "1rem"}}>
                <span className="btn text-blue">导出流程工时</span>
              </Grid>
              <Grid item style={{flex:1}} xs={6}>
              </Grid>
              <Grid item style={{flex:1}} xs={12}>
                <Button variant="outlined" color="default" onClick={this.exportProcedureWorkHour} className={classes.button}>点击由此下载</Button>
              </Grid>
            </Grid>
        </Grid>
        </div>
        <div className={classes.tableWrapper}>
          <Confirm open = {this.state.deleteOpen} title = {this.state.title} content={this.state.content} closeFun = {this.deleteModalClose} />
        </div>
      </Paper>
      <Snackbar style={{marginTop:'70px'}}
          anchorOrigin={{horizontal:"center",vertical:"top"}}
          open={this.state.tipsOpen}
          onClose={this.handleClose}
          ContentProps={{
            'className':'info'
          }}
          message={<span id="message-id" >{this.state.tipInfo?this.state.tipInfo:''}</span>}
      />
      </div>
    );
  }
}

ExportProduceIndent.propTypes = {
  classes: PropTypes.object.isRequired,
};

Date.prototype.format = function(fmt) {
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
        if(new RegExp("("+ k +")").test(fmt)){
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
         }
     }
    return fmt;
}

export default withStyles(styles)(ExportProduceIndent);
