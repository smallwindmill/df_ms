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
import Info from '@material-ui/icons/Info';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';

import FormLabel from '@material-ui/core/FormLabel';
import {DateFormatInput} from 'material-ui-next-pickers';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';

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

var rows = [
  // { id: 'name', numeric: false, disablePadding: true, label: '序号' },
  { id: 'name', numeric: false, disablePadding: true, label: '订单编号' },
  { id: 'name', numeric: false, disablePadding: true, label: '物料长代码' },
  { id: 'carbs', numeric: true, disablePadding: false, label: '物料名称' },
  { id: 'calories', numeric: false, disablePadding: false, label: '订单流程' },
  { id: 'calories', numeric: false, disablePadding: false, label: '订单负责人' },
  { id: 'calories', numeric: false, disablePadding: false, label: '流程状态' },
  { id: 'action', numeric: true, disablePadding: false, hidden: true,label: '操作' }
];

var rows2 = [
  { id: 'name', numeric: false, disablePadding: true, label: '流程编号' },
  { id: 'name', numeric: false, disablePadding: true, label: '流程生产人员' },
  { id: 'name', numeric: false, disablePadding: true, label: '生产人数量' },
  { id: 'name', numeric: false, disablePadding: true, label: '负责生产数量' },
  { id: 'carbs', numeric: true, disablePadding: false, label: '流程开始生产时间' },
  { id: 'carbs', numeric: true, disablePadding: false, label: '状态'},
  { id: 'calories', numeric: false, disablePadding: false, label: '操作' },
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
          {this.props.rows.map(
            (row, index) => (!row.hidden &&
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
    chooseList:[
      {value:0, text:'全部'},
      {value:1, text:'已完成'},
      {value:2, text:'进行中'},
      {value:-1, text:'报废'}
    ]
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
            <Grid container>
              <Grid item xs={6}>
                  <Typography variant="h6" id="tableTitle" align="left">
                    负责的订单操作-详情
                  </Typography>
                </Grid>
                <Grid item xs={6} align="right">
                  <span className="text-blue pointer" title="返回上级" onClick={()=>window.ReactHistory.goBack()}>返回</span>
                </Grid>
              </Grid>
        </Toolbar>
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
    overflowX: '',
  },
});




class DutyIndentInfo extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    select: 0,
    data: [],
    infoData: [],
    page: 0,
    rowsPerPage: 10,
    open: true,
    confirmOpen: false,
    modalOpen: false,
    InfoModalOpen: false,
    chooseWorkOpen: false,
    title: "确认",
    content: "确定删除该订单吗？",
    workers:[{name:'确定',id:111}, {name:'删除',id:234},{name:'订单',id:234},{name:'确定',id:111}, {name:'删除',id:234},{name:'订单',id:234},{name:'确定',id:111}, {name:'删除',id:234},{name:'订单',id:234},{name:'确定',id:111}, {name:'删除',id:234},{name:'订单',id:234},{name:'确定',id:111}, {name:'删除',id:234},{name:'订单',id:234}],
    selectedWorkers:[],
    selectedDataCopy: {
      startTime: new Date().format('yyyy-MM-dd')
    }
  }


  componentWillMount() {
    // 组件初次加载数据申请
    var userID = config.changeToJson(localStorage.user).userID;
    var pwd = config.changeToJson(localStorage.user).pwd;

    var procedureID = this.props.match.params.id;

    // console.log(this.props, procedureID);
    this.setState({pid: procedureID});

    fetch(config.server.listIndentById+'?id='+procedureID).then(res=>res.json()).then(data=>{
      console.log(data);
      if(data.code!=200){
          this.tips(data.msg);return;
      }
      // this.changeDutyIndentData(data.results || []);
      this.setState({data: data.results});
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});

    fetch(config.server.queryProcedureInfo+'?id='+procedureID).then(res=>res.json()).then(data=>{
      console.log(data);
      if(data.code!=200){
          this.tips(data.msg);return;
      }
      this.setState({infoData: data.results});
      // this.changeDutyIndentData(data.results || []);
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});
  }

  modalClose = () =>{
    this.setState({open: false, modalOpen: false, InfoModalOpen: false});
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
    this.setState({confirmOpen: true})
  }

  // 关闭删除用户弹窗
  deleteModalClose=()=>{
    this.setState({confirmOpen: false})
  }

  // 穿梭框左右移动
  selectToRight = (worker, index) =>{
    this.state.workers.splice(index,1)
    this.setState({workers: this.state.workers});
    this.state.selectedWorkers.push(worker)
    this.setState({selectedWorkers:  this.state.selectedWorkers});
    // console.log(this.state.workers, this.state.selectedWorkers)
  }

  selectToLeft = (worker, index) =>{
    this.state.selectedWorkers.splice(index,1)
    this.setState({selectedWorkers: this.state.selectedWorkers});
    this.state.workers.push(worker);
    this.setState({workers: this.state.workers});
  }

  addProcedureInfo = () =>{
    // 添加流程详情时请求生产人员
    fetch(config.server.listSystemUserByType+"?type="+4).then(res=>res.json()).then(data=>{
      console.log(data);
      if(data.code!=200){
        this.tips('获取生产人员列表失败，请稍后重试');return;
      }
      this.setState({modalOpen: true, workers: data.results});
    }).catch(e=>this.tips('网络出错了，请稍候再试'));
  }

  // 提交流程详情
  addInfoSure = () =>{
    var { productNum, selectedWorkers, selectedDataCopy, pid } = this.state;
    if(!productNum){
      this.tips('生产数量不能为0');return;
    }

    if(selectedWorkers.length == 0){
      this.tips('至少选择一个生产人员');return;
    }

    // console.log(window.fff = selectedWorkers);
    var workder_in = [];
    for(var i of selectedWorkers){
      workder_in.push(i.id);
    }

    fetch(config.server.addProcedureInfo,{method:"POST",
      headers:{
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({pid: pid, productNum:productNum, startTime: selectedDataCopy.startTime, worker:workder_in.join(' ')})
    }).then(res=>res.json()).then(data=>{
      console.log(data);
    }).catch(e=>this.tips('网络出错了，请稍候再试'));

  }

  changeInfoData = (data)=>{
    this.setState({infoData: data})
  }


  // 关闭删除用户弹窗
  confirmClose=()=>{
    this.setState({confirmOpen: false});
  }

  confirmSure = ()=>{
    if(this.state.deleteFun){
      this.state.deleteFun();
    }
  }

  finishProcedure = ()=>{
    this.setState({InfoModalOpen: true});
  }

  setFinishSure = () => {
    var { id, next_info } = this.state;
    console.log(id, next_info);

    // 设置流程完成
    fetch(config.server.updateProcedureStatus,{method:"POST",
      body:JSON.stringify({id: id, status: 2, remark: next_info})
    }).then(res=>res.json()).then(data=>{
      console.log(data);
      // 重新读取数据
    }).catch(e=>this.tips('网络出错了，请稍候再试'));
  }

  // 报废当前流程
  setScrap = () => {
    var { id, next_info } = this.state;
    var nextFun = () =>{
      fetch(config.server.updateProcedureStatus,{method:"POST",
        body:JSON.stringify({id: id, status: -1})
      }).then(res=>res.json()).then(data=>{
        console.log(data);
        this.props.changeUserData(data.results || []);
      }).catch(e=>this.tips('网络出错了，请稍候再试'));
    };
    this.setState({confirmOpen: true, content: '确定报废当前流程吗？',deleteFun: nextFun});
  }


  tips = (msg) => {
    if(msg){
      this.setState({tipInfo:msg});
    }
    this.setState({tipsOpen: true});

    setTimeout(()=>{
      this.setState({tipsOpen: false});
    },2000);
  }

  // 消息弹窗
  addMessageModal = ()=>{
    var classes = '';
    const DialogTitle = withStyles(theme => ({
      root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
      },
      closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
      },
    }))(props => {
      const { children, classes, onClose } = props;
      return (
        <MuiDialogTitle disableTypography className={classes.root}>
          <Typography variant="h6">{children}</Typography>
          {onClose ? (
            <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          ) : null}
        </MuiDialogTitle>
      );
    });

    const { workers, selectedWorkers } = this.state;
    const styleCon = {
       height: '10rem',
       overflowY : 'auto',
       padding: '.5rem 0'
    };
    const styleChip = {
      margin:'3px 5px'
    };
    return (<Dialog
      aria-labelledby="customized-dialog-title"
      open={this.state.InfoModalOpen} style={{marginTop:'-10rem'}}
    >
      <DialogTitle id="customized-dialog-title" onClose={this.modalClose}>
        流程完成设置
      </DialogTitle>
      <form className={classes.container} noValidate autoComplete="off" style={{padding:"2rem 6rem 3rem"}}>
        <Grid container spacing={24}>
          <Grid item xs={12} style={{margin: "1.5rem 0 1rem",lineHeight:'35px'}}>
            <Info fontSize = "large" color = "primary" style={{marginBottom:'-11px'}}></Info>
              设置当前流程的状态为<span className="text-blue">完成</span>后，将进入下一流程，当前流程将不可操作，请确认操作。
          </Grid>
          <Grid item xs={12} style={{paddingTop:0}}>
            <TextField fullWidth style={{marginTop:0}}
              label="通知下一流程负责人（非必填）"
              className={classes.textField}
              autoComplete="current-password"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e)=>{this.setState({next_info: e.target.value})}}
            ></TextField>
          </Grid>

          <Grid item xs={12} align="right">
            <Button variant="outlined" onClick={this.setFinishSure} style={{marginRight: 1+"rem"}} color="primary" className={classes.button}>
            确定</Button>
            <Button variant="outlined" onClick={this.modalClose} style={{marginRight: 1+"rem"}} color="secondary" className={classes.button}>取消</Button>
          </Grid>
          </Grid>

        </form>
    </Dialog>)
  }

  // 流程详情弹窗
  addInfoModal = ()=>{
    var classes = '';
    const DialogTitle = withStyles(theme => ({
      root: {
        borderBottom: `1px solid ${theme.palette.divider}`,
        margin: 0,
        padding: theme.spacing.unit * 2,
      },
      closeButton: {
        position: 'absolute',
        right: theme.spacing.unit,
        top: theme.spacing.unit,
        color: theme.palette.grey[500],
      },
    }))(props => {
      const { children, classes, onClose } = props;
      return (
        <MuiDialogTitle disableTypography className={classes.root}>
          <Typography variant="h6">{children}</Typography>
          {onClose ? (
            <IconButton aria-label="Close" className={classes.closeButton} onClick={onClose}>
              <CloseIcon />
            </IconButton>
          ) : null}
        </MuiDialogTitle>
      );
    });

    const { workers, selectedWorkers,selectedDataCopy } = this.state;
    const styleCon = {
       height: '10rem',
       overflowY : 'auto',
       padding: '.5rem 0'
    };
    const styleChip = {
      margin:'3px 5px'
    };
    return (<Dialog
      aria-labelledby="customized-dialog-title"
      open={this.state.modalOpen} style={{marginTop:'-10rem'}}
    >
      <DialogTitle id="customized-dialog-title"  onClose={this.modalClose}>
        添加流程详情
      </DialogTitle>
      <form className={classes.container} noValidate autoComplete="off" style={{padding:"2rem 3rem 3rem"}}>
        <Grid container spacing={24}>
          <Grid item xs={6} style={{paddingTop:0}}>
            <div className="bold">生产数量</div>
            <TextField style={{marginTop:0}}
              className={classes.textField}
              autoComplete="current-password"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e)=>{this.setState({productNum: e.target.value})}}
            >
            ))}</TextField>
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">流程开始生产时间</FormLabel>
            <DateFormatInput  className="inline-block" name='date-input' value={ new Date(selectedDataCopy.startTime) } onChange={(date)=>{selectedDataCopy.planFinishDate = date.format('yyyy-MM-dd');this.setState({ selectedDataCopy: selectedDataCopy })} } style={{marginbottom:'2rem'}} />
          </Grid>

          <Grid container style={{paddingTop: "1rem"}}>
            <Grid item xs={6} style={{paddingTop: 0, boxShadow: "9px 0px 16px -12px #666"}}>
              <div className="bold">待选择人员{'  '+(workers.length+selectedWorkers.length)+'/'+workers.length}</div>
              <div className='plane waitingChoose' style = {styleCon}>
              {workers.map((worker,index)=><Chip key = {index} label={worker.name}  style = {styleChip} className={classes.chip} onClick={()=>this.selectToRight(worker, index)}/>)}
              </div>
            </Grid>

            <Grid item xs={6} style={{paddingTop:0,paddingLeft: "23px",paddingBottom: "2rem"}}>
              <div className="bold">已选择人员{'  '+(workers.length+selectedWorkers.length)+'/'+selectedWorkers.length}</div>
              <div className='plane choosed' style = {styleCon}>
              {selectedWorkers.map((worker,index)=><Chip key = {index} style = {styleChip}
                label={worker.name}
                className={classes.chip} onDelete={()=>this.selectToLeft(worker, index)}
              />)}
              </div>
            </Grid>
          </Grid>

          <Grid item xs={12} align="center">
            <Button variant="outlined" onClick={this.addInfoSure} style={{marginRight: 1+"rem"}} color="primary" className={classes.button}>
            确定</Button>
            <Button variant="outlined" onClick={this.modalClose} style={{marginRight: 1+"rem"}} color="secondary" className={classes.button}>取消</Button>
          </Grid>
          </Grid>

        </form>
    </Dialog>)
  }

  render() {
    const { classes } = this.props;
    const { data, infoData, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    rows[rows.length-1].hidden = true;

    return (
      <Paper className={classes.root} style={{padding:"0 2rem",width:"auto"}}>
        <EnhancedTableToolbar />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy} rows={rows}
              rowCount={data.length}
            />
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  return (
                    <TableRow
                      role="checkbox"
                      tabIndex={-1}
                      key={n.id}
                    >
                      <TableCell align="left">{n.erp}</TableCell>
                      <TableCell align="left">{n.materialCode}</TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.materialName}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.procedure}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {n.duty}
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        {(n.status==1)?'已完成':(n.status==-1?'报废':'进行中')}
                      </TableCell>
                    </TableRow>
                  );
                })}

            </TableBody>
          </Table>


        <Toolbar >
            <Grid container>
              <Grid item xs={12}>
                  <Typography variant="h6" id="tableTitle" align="center">
                    详细生产情况
                  </Typography>
                </Grid>
              </Grid>
        </Toolbar>

        <Table className={classes.table} aria-labelledby="tableTitle">
          <EnhancedTableHead
            order={order}
            orderBy={orderBy} rows={rows2}
            rowCount={data.length}
          />
          <TableBody>
            {infoData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((n, index) => {
                return (
                  <TableRow
                    role="checkbox"
                    tabIndex={-1}
                    key={n.id}
                  >
                    <TableCell align="left">{(index+1)}</TableCell>
                    <TableCell align="left">{n.worker}</TableCell>
                    <TableCell align="left">{n.worker.split(' ').length}</TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {n.startTime}
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {n.status==0?'进行中':(n.status==1?'完成':'报废')}
                    </TableCell>
                    <TableCell component="th" scope="row" padding="none">
                      {(n.status==1)?'完成':(n.status==-1?'报废':'进行中')}
                    </TableCell>
                    {(this.state.select==2)?false:<TableCell align="left">
                                            {n.status==0?'':<span className="pointer btn text-red" onClick={this.setScrap}>设为报废</span>}
                                            {n.status==0?'':<span className="pointer btn text-blue" onClick={this.finishProcedure}>设为完成</span>}
                                          </TableCell>}
                  </TableRow>
                );
              })}

          </TableBody>
        </Table>
        {/*<TablePagination
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
                />*/}
        {this.state.status == 2?false:<Grid container align="center" vertical="center" className="pointer addProcedureBtn" style={{paddingTop:"2rem"}}>
                      <Grid item xs={12} onClick={this.addProcedureInfo}><AddIcon style={{marginBottom: '-5px'}} />添加详情</Grid>
                    </Grid>}
          <Confirm open = {this.state.confirmOpen} title = {this.state.title} content={this.state.content} closeFun = {this.deleteModalClose} sureFun = {this.confirmSure} />
        </div>
        {this.addInfoModal()}
        {this.addMessageModal()}
        <Snackbar style={{marginTop:'70px'}}
          anchorOrigin={{horizontal:"center",vertical:"top"}}
          open={this.state.tipsOpen}
          ContentProps={{
            'className':'info'
          }}
          message={<span id="message-id" >{this.state.tipInfo}</span>}
      />
      </Paper>
    );
  }
}

DutyIndentInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DutyIndentInfo);
