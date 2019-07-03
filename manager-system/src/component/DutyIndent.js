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
import { lighten } from '@material-ui/core/styles/colorManipulator';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Snackbar from '@material-ui/core/Snackbar';

import Confirm from './Confirm';
import config from './config';

let counter = 0;

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

const DialogContent = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing.unit * 2,
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
}))(MuiDialogActions);

const rows = [
  { id: 'name', numeric: false, disablePadding: true, label: '序号' },
  { id: 'name', numeric: false, disablePadding: true, label: '订单编号' },
  { id: 'name', numeric: false, disablePadding: true, label: '货号' },
  { id: 'carbs', numeric: true, disablePadding: false, label: '货物名称' },
  { id: 'calories', numeric: false, disablePadding: false, label: '生产数量' },
  { id: 'calories', numeric: false, disablePadding: false, label: '订单流程' },
  { id: 'calories', numeric: false, disablePadding: false, label: '订单负责人' },
  { id: 'calories', numeric: false, disablePadding: false, label: '流程状态' },
  { id: 'protein', numeric: true, disablePadding: false, label: '操作' }
];

class EnhancedTableHead extends React.Component {
  constructor(props){
    super(props);
    this.state = {

    }
  }
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };



  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            (row, index) => (
              <TableCell
                key={'EnhancedTableHead'+index}
                align={row.numeric ? 'center' : 'center'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
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

class EnhancedTableToolbar extends React.Component{

  state = {
    open: false,
    chooseList:[
      {value:'all', text:'全部'},
      {value:2, text:'已完成'},
      {value:1, text:'进行中'},
      {value:0, text:'未开始'},
      // {value:-1, text:'报废'}
    ],
    selectedDataCopy:{},
    selectedData:{}
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  addTemplate = () => {
    this.setState({ open: true });
  }


  tips = this.props.tips;

  render(){
    var classes = '';
    return (
       <div className={classes.title}>
          <Toolbar >
                <Typography variant="h6" id="tableTitle" align="left">
                  负责的订单操作
                </Typography>
          </Toolbar>
          <Grid container align="right" style={{margin:'-1rem 0 1rem',padding: '0 1.2rem'}}>
            <Grid item xs={12}>
                <TextField style={{marginTop:0,display: 'none', padding:'0 .5rem'}}
                  select label="状态选择:"
                  className={classes.textField}
                  margin="normal"
                  onChange = {(e)=>{e.persist();this.props.queryDutyIndentByType(e)}}
                  SelectProps={{
                  native: true,
                  className: 'text-blue select',
                  align: 'center',
                 }}
                >{this.state.chooseList.map((option, index) => (
                  <option key={'option'+index} value={option.value}>
                    {option.text}
                  </option>
                ))}</TextField>

                <TextField style={{marginTop:0,marginLeft:'1rem'}} label = "筛选"
                placeholder="请输入订单号或货号查询"
                className={classes.textField}
                type="text"
                onChange = {(e)=>this.props.queryByKeyword(e)}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}></TextField>
            </Grid>
          </Grid>
        </div>
      )
  }
};



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




class DutyIndent extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    select: 0,
    data: [],
    page: 0,
    rowsPerPage: config.pageChangeNum || 13,
    open: true,
    confirmOpen: false,
    title: "确认",
    content: "确定删除该订单吗？"
  }

  componentWillMount() {
    // 组件初次加载数据申请
    var userID = config.changeToJson(localStorage.user).userID;
    var pwd = config.changeToJson(localStorage.user).pwd;

    fetch(config.server.queryDutyProcedureByStatus+'?userID='+userID).then(res=>res.json()).then(data=>{
      // console.log(data);
      if(data.code!=200){
          this.tips(data.msg);return;
      }
      this.changeDutyIndentData(data.results || []);
    }).catch(e=>this.tips('网络出错了，请稍候再试'));
  }


  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };


  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;


  startProcedure = (item, msg, ifInfo) => {
    var nexFun = ()=>{
      // 设置订单为开始状态
      fetch(config.server.updateDutyProcedureStatus,{method:"POST",
        headers:{
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({id: item.id, status: 1,remark: item.remark})
      }).then(res=>res.json()).then(data=>{
        // console.log(data);
        if(data.code!=200){
          this.tips(data.msg);return;
        }
        this.tips('订单已开始');
        // this.state.data[index].status = 1;
        item.status = 1;
        // 新增数据
        this.changeDutyIndentData('', 2);
      }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});

    };

    this.setState({confirmOpen: true,title: "确认",content: msg,sureFun: nexFun, ifInfo: ifInfo});
  }


  changeDutyIndentData = (data, type) =>{
    // 默认替换，1为push，2为修改
    if(type==1){
      this.state.data.push(data);
      this.setState({data: this.state.data});
    }else if(type==2){
      this.setState({data: this.state.data});
      // this.state.data[this.state.editNum] = data;
    }else{
      this.setState({data: data});
    }
    this.state.dataBak = this.state.data;
  }

  queryDutyIndentByType = (e) =>{
    var value = e.target.value;
    if(!this.state.dataBak){
      this.state.dataBak = this.state.data;
    }

    /*if(value==0){
      this.state.data = this.state.dataBak.filter((item)=>{
        // return item.ifNew==1;
        return item.status == 0;
      })
    }else if(value==1){
      this.state.data = this.state.dataBak.filter((item)=>{
        // return item.ifNew==1;
        return item.status == 1;
      })
    }else if(value=='all'){
      this.state.data = this.state.dataBak;
    }*/
    if(value=='all'){
      this.state.data = this.state.dataBak;
    }else{
      this.state.data = this.state.dataBak.filter((item)=>{
          // return item.ifNew==1;
          return item.status == value;
      })
    }

    this.setState({data: this.state.data });

  }


  queryByKeyword = (e) =>{
    e.persist();

    if(!this.state.dataBak){
      this.state.dataBak = this.state.data;
    }

    this.state.data = this.state.dataBak.filter((item)=>{
      return (item.erp.toUpperCase().indexOf(e.target.value.toUpperCase())!=-1 || item.materialCode.toUpperCase().indexOf(e.target.value.toUpperCase())!=-1 || item.materialName.toUpperCase().indexOf(e.target.value.toUpperCase())!=-1);
    });
    this.setState({data: this.state.data });

  }

  // 关闭确认框
  confirmClose=()=>{
    this.setState({confirmOpen: false});
  }

  confirmSure = ()=>{
    if(this.state.deleteFun){
      this.state.deleteFun();
    }
  }

  tips = (msg, time) => {
    if(msg){
      this.setState({tipInfo:msg});
    }
    this.setState({tipsOpen: true});

    setTimeout(()=>{
      this.setState({tipsOpen: false});
    },time||4000);
  }

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root} style={{padding:"0 2rem",width:"auto"}}>
        <EnhancedTableToolbar changeDutyIndentData = {this.changeDutyIndentData} queryByKeyword = {this.queryByKeyword} queryDutyIndentByType = {this.queryDutyIndentByType }  tips = {this.tips}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              rowCount={data.length}
            />
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n,index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={n.id}
                    >
                      <TableCell align="center">{page * rowsPerPage+(index+1)}</TableCell>
                      <TableCell align="center">{n.erp}</TableCell>
                      <TableCell align="center">{n.materialCode}</TableCell>
                      <TableCell align="center" component="th" scope="row" padding="none">
                        {n.materialName}
                      </TableCell>
                      <TableCell align="center" component="th" scope="row" padding="none">
                        {n.planNum}
                      </TableCell>
                      <TableCell align="center" component="th" scope="row" padding="none">
                        {n.procedure}
                      </TableCell>
                      <TableCell align="center" component="th" scope="row" padding="none">
                        {n.duty}
                      </TableCell>
                      <TableCell align="center" component="th" scope="row" padding="none" className = {n.status==2?"text-success":(n.status==1?"text-blue":"")}>
                        {n.status==2?"完成":(n.status==1?"进行中":"未开始")}
                      </TableCell>
                      <TableCell align="center">
                            {n.status==0?<span className={"pointer btn "+(n.status?"text-blue":"text-blue")} onClick={()=>this.startProcedure(n, "上一流程未完成，确定开始该流程吗？", true)}>开始流程</span>:n.status==2?
                            <span className={"pointer btn "+(n.status?"text-success":"text-success")} onClick={()=>this.startProcedure(n, "确定重新开始该流程吗？")}>重新开始流程</span>:''}
                            <span className={"pointer btn text-blue"} onClick={()=>{if(n.status==0){this.tips('当前流程还未开始');return;};this.props.history.push('/produceMSF/dutyIndent/info'+n.id)}}>{(n.status==2)?'详情':(n.status==1?'查看':'')}</span>
                          </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
          {data.length?'': <div className="emptyShow" align="center" style={{display: 'block', padding:'2rem'}}>暂无数据 </div>}
        </div>
        <TablePagination
          className="TablePagination"
          rowsPerPageOptions={[10, 20, 30]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': '上一页',
          }}
          nextIconButtonProps={{
            'aria-label': '下一页',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
        <Confirm open = {this.state.confirmOpen} title = {this.state.title} content={this.state.content} closeFun = {this.confirmClose} sureFun = {this.state.sureFun} ifInfo = {this.state.ifInfo} />
        <Snackbar style={{marginTop:'70px'}} key = {new Date().getTime()+Math.random()}
        anchorOrigin={{horizontal:"center",vertical:"top"}}
        open={this.state.tipsOpen}
        ContentProps={{
          'className':'info'
        }}
        message={<span id="message-id" >{this.state.tipInfo?this.state.tipInfo:''}</span>}/>
      </Paper>
    );
  }
}

DutyIndent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DutyIndent);
