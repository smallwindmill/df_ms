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
function createData( sId, mCode, mName, indentProcess, proceeDuty, dutySatus) {
  counter += 1;
  return { id: counter, sId, mCode, mName, indentProcess, proceeDuty, dutySatus };
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
  { id: 'name', numeric: false, disablePadding: true, label: '物料长代码' },
  { id: 'carbs', numeric: true, disablePadding: false, label: '物料名称' },
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
                align={row.numeric ? 'left' : 'left'}
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
      // {value:0, text:'全部'},
      {value:1, text:'已完成'},
      {value:2, text:'进行中'},
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

  queryDutyIndentByType = (e) =>{
    var {userId} = this.state.selectedDataCopy;

    this.props.onSelectChange(e.target.value);

    console.log(e.target.value);
    if(e.target.value){
      fetch(config.server.queryWorkHourByDate+'?userId='+userId+'&status='+e.target.value).then(res=>res.json()).then(data=>{
          console.log(data);
    }).catch(e=>this.tips('网络出错了，请稍候再试'));
    }
  }


  tips = (msg) => {
    if(msg){
      this.setState({tipInfo:msg});
    }
    this.setState({tipsOpen: true});

    setTimeout(()=>{
      this.setState({tipsOpen: false});
    },1000);
  }


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
              <TextField style={{marginTop:0,padding:'0 .5rem'}}
                select label="状态选择:"
                className={classes.textField}
                margin="normal"
                onChange = {(e)=>{e.persist();this.queryDutyIndentByType(e)}}
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
            </Grid></Grid>
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
    data: [
      createData('74475686796','BM234','通用流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",1),
      createData('74475686796','BM234','外协生产流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",0),
      createData('74475686796','BM234','组装流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",0),
      createData('74475686796','BM234','通用流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",1),
      createData('74475686796','BM234','组装流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",0),
      createData('74475686796','BM234','通用流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",0),
      createData('74475686796','BM234','组装流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",1),
      createData('74475686796','BM234','通用流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",0),
      createData('74475686796','BM234','通用流程', "成品备料:领料:SMT:DIP:清洗:测试:包装:入库", "何莉:汪兵:高庆:陈杰:殷涛:文晓凤:张玉:饶玲:汪世芳",0),
    ],
    page: 0,
    rowsPerPage: 10,
    open: true,
    confirmOpen: false,
    title: "确认",
    content: "确定删除该订单吗？"
  };


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

  selectChange = (value) =>{
      // console.log(value);
      this.setState({select: value});
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


  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root} style={{padding:"0 2rem",width:"auto"}}>
        <EnhancedTableToolbar changeDutyIndentData = {this.changeDutyIndentData}  onSelectChange={this.selectChange} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              rowCount={data.length}
            />
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={n.id}
                    >
                      <TableCell align="left">{n.id}</TableCell>
                      <TableCell align="left">{n.sId}</TableCell>
                      <TableCell align="left">{n.mCode}</TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.mName}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.indentProcess}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.proceeDuty}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {(n.dutySatus==1)?'已完成':(n.dutySatus==-1?'报废':'未完成')}
                      </TableCell>
                      <TableCell align="left">
                            <span className="pointer btn text-red" onClick={()=>this.props.history.push('/dutyIndent/info')}>查询</span>
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
          <Confirm open = {this.state.confirmOpen} title = {this.state.title} content={this.state.content} closeFun = {this.confirmClose} sureFun = {this.confirmSure} />
        </div>
        <TablePagination
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
      </Paper>
    );
  }
}

DutyIndent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DutyIndent);
