import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import CloseIcon from '@material-ui/icons/Close';

import {DateFormatInput} from 'material-ui-next-pickers'

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Confirm from './Confirm';
import Snackbar from '@material-ui/core/Snackbar';

import config from './config';//配置文件
import { exportExcel } from 'xlsx-oc';


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
      {value:2, text:'外协'}
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

  exportTimeIndent = () =>{
    if(!this.state.startDate){
        this.tips('请先选择开始时间');return;
    }
    if(!this.state.endDate){
        this.tips('请选择结束时间');return;
    }
    // console.log(new Date(this.state.startDate).format('yyyy-MM-dd'), new Date(this.state.endDate).format('yyyy-MM-dd'));
    if(new Date(this.state.startDate).format('yyyy-MM-dd')>new Date(this.state.endDate).format('yyyy-MM-dd')){
        this.tips('开始时间不能大于结束时间');return;
    }

    fetch(config.server.exportTimeIndentServer).then(res=>res.json()).then(data=>{
      console.log(data);
      this.dlExcel(data.results);
    });
  }


  dlExcel = (data) =>{
      /*  const dataSource = [{
            key: '1',
            cs: 'title',
            sm: '列头显示文字',
            lx: 'string',
            mrz: '',
        }, {
            key: '2',
            cs: 'mm',
            sm: '啦啦啦啦',
            lx: 'string',
            mrz: '',
        }];*/

        const dataSource = data;
        for(var i in data){
          data[i].key = i + 1;
        }

        const exportDefaultExcel = () => {
            var _headers = [
            { k: 'erp', v: 'erp编号' },
            { k: 'materialCode', v: '物料编号' },
            { k: 'materialName', v: '物料名称' },
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
            exportExcel(_headers, dataSource);
        }
        exportDefaultExcel();
  }


  exportAllIndent = () =>{

  }
  exportMatchIndent = () =>{

  }

  exportIndentByTimeType = (e) =>{
    var type = this.state.indentTimeType;
    console.log(type);
    fetch(config.exportIndentByTimeType)
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
    },2000);
  }


  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;

    return (<div>
      <Paper className={classes.root} style={{padding:"0 2rem",width:"auto"}}>
        <div>
          <Toolbar >
                <Typography variant="h6" id="tableTitle" align="left">
                  导出生产订单
                </Typography>
          </Toolbar>

          <Grid container spacing={24} align="center" vertical="center" style={{margin:'2rem 0 1rem',height: '350px',padding: '0 1.2rem'}}>
            <Grid container item xs={3}>
            <Grid item xs={12}>
              <span className="btn text-blue">按时间段导出生产订单</span>
            </Grid>
            <Grid item xs={12}>
              <DateFormatInput  className="inline-block" name='date-input' value={this.state.startDate } onChange={this.onChangeStartDate} style={{marginbottom:'2rem'}} />
              <DateFormatInput name='date-input' className="inline-block"  value={this.state.endDate } onChange={this.onChangeEndDate}/>
            </Grid>
            <Grid item xs={12}>

              <Button variant="outlined" color="default" onClick={this.exportTimeIndent} className={classes.button}>点击由此下载</Button>
            </Grid>
          </Grid>
          <Grid container item xs={3}>
            <Grid item xs={12}>
              <span className="btn text-blue">导出所有生产信息详细数据</span>
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <Button variant="outlined" color="default" onClick={this.exportAllIndent} className={classes.button}>点击由此下载</Button>
            </Grid>
          </Grid>
          <Grid container item xs={3}>
            <Grid item xs={12}>
              <span className="btn text-blue">导出订单名称及对应的生产流程</span>
            </Grid>
            <Grid item xs={12}></Grid>
            <Grid item xs={12}>
              <Button variant="outlined" color="default" onClick={this.exportMatchIndent} className={classes.button}>点击由此下载</Button>
             </Grid>
          </Grid>

          <Grid container item xs={3}>
            <Grid item xs={12}>
              <span className="btn text-blue">按类型导出生产订单</span>
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
            <Grid item xs={12}>
              <Button variant="outlined" color="default" onClick={this.exportIndentByTimeType} className={classes.button}>点击由此下载</Button>
            </Grid>
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
