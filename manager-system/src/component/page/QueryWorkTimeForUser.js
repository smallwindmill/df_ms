// 用户工时查询页面
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

import {DateFormatInput} from 'material-ui-next-pickers';


import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Snackbar from '@material-ui/core/Snackbar';

import Confirm from '../main/Confirm';
import config from '../config';

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


const procedure_rows = [
  { id: 'name', numeric: false, disablePadding: true, label: '序号' },
  { id: 'name', numeric: false, disablePadding: true, label: '用户名称' },
  // { id: 'name', numeric: false, disablePadding: true, label: '产品数量' },
  { id: 'carbs', numeric: true, disablePadding: false, label: '总工时' },
  { id: 'carbs', numeric: true, disablePadding: false, label: '操作' }
  // { id: 'carbs', numeric: true, disablePadding: false, label: '参与项目' }
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
    // const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;
    const { onSelectAllClick, order, orderBy, numSelected, rowCount,rows } = this.props;

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
          {value:0, text:'全部'},
          {value:1, text:'已完成'},
          {value:2, text:'进行中'},
        ],
    dateRange:[{text: "最近一周"},{text: "最近一月"},{text: "最近三月"},{text: "最近一年"},{text: "一年以前"}],
    startDate: new Date((new Date().getTime()-1000*60*60*24*30)),
    endDate: new Date()
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  componentWillMount() {
    this.queryWorktimeByUser()
  }

  queryWorktimeByUser=()=>{
    var { startDate, endDate } = this.state;

    fetch(config.server.queryWorkTimeForUser+'?startDate='+startDate.format('yyyy-MM-dd')+'&endDate='+endDate.format('yyyy-MM-dd')).then(res=>res.json()).then(data=>{
      // console.log(data);
      this.props.changeWorktimeData(data.results || []);
    }).catch(e=>this.tips('网络出错了，请稍候再试'));

  }

  onChangeStartDate = date => {
    this.setState({ startDate: date });
  };

  onChangeEndDate = date => {
    this.setState({ endDate: date });
  };


  addTemplate = () => {
    this.setState({ open: true });
  }

  tips = this.props.tips;

  render(){
    var classes = '';
    var {dateRange} = this.state;
    return (
       <div className={classes.title}>
            <Toolbar >
              <Typography variant="h6" id="tableTitle" align="left">
                {this.props.title}
              </Typography>
        </Toolbar>
        <Grid container align="left"  style={{margin:'1rem 0 1rem',padding: '0 1.2rem'}}>
          <Grid item xs={6} align="left">
            按日期查询：
            <DateFormatInput  className="date-picker inline-block" name='date-input' value={this.state.startDate } onChange={this.onChangeStartDate} style={{marginbottom:'2rem'}} />
            <DateFormatInput name='date-input' className="date-picker inline-block"  value={this.state.endDate } onChange={this.onChangeEndDate}/>
            <span className="btn bg-primary" style={{marginLeft:'1rem'}} onClick={this.queryWorktimeByUser}>查询</span>
          </Grid>

          <Grid item align="right" xs={6}>
            <TextField style={{marginTop:0,marginLeft:'1rem'}}
            placeholder="请输入员工名称或ID查询"
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




class QueryWorkTimeForUser extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: config.pageChangeNum || 13,
    open: true,
    timeModal: false,
    deleteOpen: false,
    selectedData: {},
    title: "确认",
    content: "确定删除该订单吗？"
  }

  componentWillMount() {
    // 组件初次加载数据申请
    var procedureID = this.props.match.params.id;

    var querySingleIndent = this.props.match.params;
    // console.log(procedureID, querySingleIndent);
    this.setState({ifProcedure: true});

    // this.queryWorkHourForUser();

    var queryStart = new Date(new Date()-1000*60*60*24*7).format('yyyy-MM-dd');//一周
    var queryEnd = new Date().format('yyyy-MM-dd');

  }


  queryWorkHourForUser = (startDate, endDate) => {
    fetch(config.server.queryWorkTimeForUser+'?startDate='+startDate+'&endDate='+endDate).then(res=>res.json()).then(data=>{
      // console.log(data);
      if(data.code!=200){
        this.tips(data.msg);return;
      }
      this.changeWorktimeData(data.results || []);
    }).catch(e=>this.tips('网络出错了，请稍候再试'));

  }


  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  queryByKeyword = (e) =>{
    e.persist();

    if(!this.state.dataBak){
      this.state.dataBak = this.state.data;
    }

    this.state.data = this.state.dataBak.filter((item)=>{
      return item.userName.indexOf(e.target.value)!=-1 || item.userID.indexOf(e.target.value)!=-1 ;
    });
    this.setState({data: this.state.data });

  }

  // 查看员工参与项目
  timeInProgram =(n)=>{
    this.setState({selectedData: n});
    // console.log(n);
    fetch(config.server.queryUserProgram+'?userID='+n.id+'&userName='+n.userName).then(res=>res.json()).then(data=>{
      // console.log(data);
      if(data.code!=200){
        this.tips(data.msg);return;
      }
      this.setState({timeModal: true, showProgram: data.results});
    }).catch(e=>this.tips('网络出错了，请稍候再试'));
  }


  timeInProgramModal = ()=>{

    const DialogTitle = withStyles(theme => ({
      root: {
        margin: 0,
        padding: 18,
      },
      titlep: {
        fontSize: 20
      }
    }))(props => {
      const { children, classes, onClose } = props;
      return (
        <MuiDialogTitle disableTypography className={classes.root}>
          <Typography variant="" className={classes.titlep}>{children}</Typography>
        </MuiDialogTitle>
      );
    });

    var { selectedData,showProgram } = this.state;
    const ModalContent = withStyles(theme => ({
      container: {
        minWidth: "30vw",
        minHeight: "30vh",
        maxHeight: "40vh",
        overflowY: "scroll"
      },
      li: {
        padding: "4px 0"
      },
      li_half1: {
        display: "inline-block",
        width: "100%"
      },
      li_half2: {
        display: "none",
        boxSizing: "border-box",
        width: "0%"
      }
    }))(props => {
      const { children, classes, onClose } = props;
      return (<Dialog
        aria-labelledby="customized-dialog-title" className="modal lg"
        open={this.state.timeModal} style={{marginTop:'-10rem'}}
        onClose={()=>this.setState({timeModal: false})}
      >
      <DialogTitle id="customized-dialog-title" >
        <span className="text-blue">{selectedData.userName}</span>参与项目<small style={{paddingLeft: "1rem"}}>共计{showProgram?showProgram.length:''}</small>
      </DialogTitle>
      <div className={classes.container} noValidate autoComplete="off" style={{margin:".5rem 2rem 2rem",padding: "1rem"}}>
        <Grid container spacing={24}>

          <Grid item xs={12} style={{paddingTop:0}}>
            <ul style={{paddingLeft: 0,marginTop:0,listStyle: "none"}}>
              {!showProgram?'':showProgram.map((n,index)=>{
                return <li className={classes.li}>
                          <span className={classes.li_half1}>
                            <i style={{paddingRight:".8rem", fontSize: "smaller"}}>{(index+1)+".  "}</i>
                            <span className="text-primary" style={{paddingRight:".8rem"}} title="erp">{n.erp}</span>
                            <span className="text-blue2" style={{paddingRight:"1.2rem"}} title="物料名称">{n.materialName}</span>
                            <span style={{paddingLeft:".08rem"}} title="流程">{n.name}</span>
                          </span>
                          <span style={{paddingRight:"2rem"}} className={classes.li_half2+" text-blue text-right pointer"}></span>
                        </li>
              })}
            </ul>
          </Grid>

        </Grid>

        </div>
    </Dialog>)})


    return <ModalContent></ModalContent>;
  }

  // 删除用户弹窗
  deleteUser=()=>{
    this.setState({deleteOpen: true})
  }

  // 关闭删除用户弹窗
  deleteModalClose=()=>{
    this.setState({deleteOpen: false})
  }

  toIndent = () => {
    this.setState({ifProcedure: false});
    this.queryIndentWorkHour();
  }

  changeWorktimeData = (data, type) =>{
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


  tips = (msg) => {
    if(msg){
      this.setState({tipInfo:msg});
    }
    this.setState({tipsOpen: true});

    setTimeout(()=>{
      this.setState({tipsOpen: false});
    },4000);
  }


  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page, ifProcedure } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    this.state.date_in =[new Date(), new Date()];

    return (
      <Paper className={classes.root} style={{padding:"0 2rem",width:"auto"}}>
        <EnhancedTableToolbar title="员工工时" toIndent = {this.toIndent} ref="toolbar" ifProcedure={true} queryByKeyword = {this.queryByKeyword} changeWorktimeData={this.changeWorktimeData} tips = {this.tips} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order} rows={procedure_rows}
              orderBy={orderBy}
              rowCount={data.length}
            />
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n, index) => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={page * rowsPerPage + index}
                      selected={isSelected}
                    >
                      <TableCell align="center">{page * rowsPerPage + index+1}</TableCell>
                      <TableCell align="center">{n.userName}</TableCell>
                                            {/*<TableCell align="center">{n.productNum}</TableCell>*/}
                      <TableCell align="center">{ (n.hourcount)?n.hourcount.toFixed(3):0 }</TableCell>
                      {/*<TableCell align="center">{n.planNum}</TableCell>
                    <TableCell align="center"> {n.countHour}</TableCell>
                    <TableCell align="center">{n.singleHour = ((n.countHour/(n.countWorker||1)) || 0).toFixed(5) }</TableCell>
                    <TableCell align="center">{n.factor}</TableCell>
                    <TableCell align="center">{n.cost = ((n.singleHour*n.factor).toFixed(5) || 0)}</TableCell>
                    <TableCell align="center">{n.countWorker}</TableCell>*/}
                    <TableCell align="center" className = "btn text-blue" onClick={()=>this.timeInProgram(n)}>参与项目</TableCell>
                      {/*<TableCell align="center">{n.counthour}</TableCell>*/}
                      {/* <TableCell align="center" className = "btn text-blue" onClick={()=>this.setState({ifProcedure: true})}>查看流程工时</TableCell>*/}

                      {/*<TableCell align="left">{n.remark}</TableCell>
                        <TableCell align="left">{n.feedback}</TableCell>*/}
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
          <Confirm open = {this.state.deleteOpen} title = {this.state.title} content={this.state.content} closeFun = {this.deleteModalClose} />
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
        <Snackbar style={{marginTop:'70px'}} key = {new Date().getTime()+Math.random()}
        anchorOrigin={{horizontal:"center",vertical:"top"}}
        open={this.state.tipsOpen}
        ContentProps={{
          'className':'info'
        }}
        message={<span id="message-id" >{this.state.tipInfo?this.state.tipInfo:''}</span>} />
        {this.timeInProgramModal()}
      </Paper>
    );


  }
}

QueryWorkTimeForUser.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QueryWorkTimeForUser);
