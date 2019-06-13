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
import {DateFormatInput, TimeFormatInput} from 'material-ui-next-pickers';

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
  { id: 'name', numeric: false, disablePadding: true, label: '货号' },
  { id: 'carbs', numeric: false, disablePadding: false, label: '货物名称' },
  { id: 'calories', numeric: false, disablePadding: false, label: '订单流程' },
  { id: 'calories', numeric: false, disablePadding: false, label: '订单负责人' },
  { id: 'calories', numeric: false, disablePadding: false, label: '流程状态' },
  { id: 'calories', numeric: false, disablePadding: false, label: '操作' },
  { id: 'calories', numeric: false, disablePadding: false, label: '操作' }
];

var rows2 = [
  { id: 'name', numeric: false, disablePadding: true, label: '流程编号' },
  { id: 'name', numeric: false, disablePadding: true, label: '负责生产数量' },
  { id: 'name', numeric: false, disablePadding: true, label: '流程生产人员' },
  { id: 'name', numeric: false, disablePadding: true, label: '生产人数量' },
  { id: 'name', numeric: false, disablePadding: true, label: '实际生产数量' },
  { id: 'carbs', numeric: true, disablePadding: false, label: '开始生产时间' },
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
                align={'center'}
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
                    {this.props.allPower?'':'负责的'}订单操作-详情
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
    rowsPerPage: config.pageChangeNum || 13,
    open: true,
    confirmOpen: false,
    modalOpen: false,
    InfoModalOpen: false,
    chooseWorkOpen: false,destroyModalOpen: false,
    title: "确认",
    content: "确定删除该订单吗？",
    workers:[{name:'确定',id:111}, {name:'删除',id:234},{name:'订单',id:234},{name:'确定',id:111}, {name:'删除',id:234},{name:'订单',id:234},{name:'确定',id:111}, {name:'删除',id:234},{name:'订单',id:234},{name:'确定',id:111}, {name:'删除',id:234},{name:'订单',id:234},{name:'确定',id:111}, {name:'删除',id:234},{name:'订单',id:234}],
    selectedWorkers:[],
    selectedDataCopy: {
      startTime: new Date().format('yyyy-MM-dd'),
      startDateTime: new Date()
    },
    selectIndex:''
  }


  componentWillMount() {
    // 组件初次加载数据申请
    var userID = config.changeToJson(localStorage.user).userID;
    var pwd = config.changeToJson(localStorage.user).pwd;

    var procedureID = this.props.match.params.id || this.props.match.params.indent;

    var querySingleIndent = this.props.match.params.indent;

    // 判断是否有权限操作详情，为true时不可以，为false表示组长，可以操作
    if(querySingleIndent){
      this.setState({allPower: true});
    }else if(querySingleIndent){
      this.setState({allPower: false});
    }
    // console.log(this.props, this.props.match.params);
    this.setState({pid: procedureID});

    // fetch(config.server.queryDutyProcedureById+'?id='+procedureID+'&userID='+userID).then(res=>res.json()).then(data=>{
    fetch(config.server.queryDutyProcedureById+'?id='+procedureID).then(res=>res.json()).then(data=>{
      if(data.code!=200){
          this.tips(data.msg);return;
      }
      // this.changeDutyIndentData(data.results || []);
      this.setState({data: data.results[0]});
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});

    // 请求流程细节信息
    fetch(config.server.queryProcedureInfo+'?pid='+procedureID).then(res=>res.json()).then(data=>{
      if(data.code!=200){
          this.tips(data.msg);return;
      }
      this.setState({infoData: data.results});
      // this.changeDutyIndentData(data.results || []);
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});
  }

  modalClose = () =>{
    this.setState({open: false, modalOpen: false, InfoModalOpen: false, destroyModalOpen: false});
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

  // 判断是否新增
  addProcedureInfo = (ifAdd, data, index) =>{
    // 添加流程详情时请求生产人员
    if(ifAdd==0){
      this.setState({ifAdd: true, productNum: '', actualNum:''});
    }else{
      // this.setState({ifAdd: false, selectedData: JSON.parse(JSON.stringify(data)), selectedIndex: index});
      this.setState({ifAdd: false, selectedInfoData:data, productNum: data.productNum, actualNum: data.actualNum,selectedIndex: index});
    }

    fetch(config.server.listSystemUserByType+"?type="+4).then(res=>res.json()).then(data=>{
      if(data.code!=200){
        if(data.results && data.results.length){
          this.tips(data.msg);
        }else{
          this.tips('生产人员数量为0，请先添加生产人员');
        }
        return;
      }
      this.setState({modalOpen: true, workers: data.results, selectedWorkers: []});
    }).catch(e=>this.tips('网络出错了，请稍候再试'));
  }

  // 提交流程详情
  addInfoSure = () =>{
    var { productNum, actualNum, selectedWorkers, selectedDataCopy, selectedInfoData, pid, ifAdd } = this.state;

    if(!productNum){
      this.tips('生产数量不能为0');return;
    }

    var ifNum = new RegExp(/^\d+$/).test(productNum);
    if(!ifNum){
        this.tips('生产数量不能为非数字');return;
    }

    if(selectedWorkers.length == 0){
      this.tips('至少选择一个生产人员');return;
    }

    // console.log(window.fff = selectedWorkers);
    var workder_in = [];
    for(var i of selectedWorkers){
      // workder_in.push(i.id);
      workder_in.push(i.name);
    }

    if(ifAdd){
      var server = config.server.addProcedureInfo;
    }else{
      var server = config.server.updateDutyProcedureDetailStatus;
    }

    fetch(server,{method:"POST",
      headers:{
        'Content-Type': 'application/json',
      },
      // body:JSON.stringify({pid: pid, productNum:productNum, startTime: selectedDataCopy.startTime + ' '+selectedDataCopy.startDateTime.format('hh:mm:ss'), worker:workder_in.join(' ')})
      body:JSON.stringify({pid: pid,id: selectedInfoData?selectedInfoData.id:'', productNum:productNum, actualNum: actualNum, worker:workder_in.join(' ')})
    }).then(res=>res.json()).then(data=>{
      if(data.code!=200){
        this.tips(data.msg);return;
      }
      if(ifAdd){
        this.changeInfoData(data.results, 1);
        this.tips('新增流程详情成功');
      }else{
        selectedInfoData.productNum = productNum;
        selectedInfoData.actualNum = actualNum;
        selectedInfoData.worker = workder_in.join(' ');
        this.tips('修改流程详情成功');
        this.setState({selectedInfoData, selectedInfoData});
      }

      this.modalClose();
    }).catch(e=>this.tips('网络出错了，请稍候再试'));

  }

  changeInfoData = (data, type)=>{
    if(type==1 && data){
      this.state.infoData.push(data);
      // console.log(this.state.infoData);
      this.setState({infoData: this.state.infoData});
    }else{
      this.setState({infoData: data});
    }

  }


  // 关闭删除用户弹窗
  confirmClose=()=>{
    this.setState({confirmOpen: false});
  }

  confirmSure = ()=>{
    if(this.state.confirmSure){
      this.state.confirmSure();
    }
  }

  finishProcedure = (data_out, index)=>{

    var { infoData } = this.state;

    var info_finish = 0;
    if(infoData.length==0){
      this.tips('请至少添加一条详情数据');return;
    }
    for(var i of infoData){
      if(i.status==0) info_finish++;
    }
    if(info_finish!=0){
      this.tips('详情表中还有'+info_finish+'条记录为进行状态，请完成后再设置流程状态');return;
    }

    this.setState({InfoModalOpen: true, selectedDataCopy: data_out, selectIndex: index});
  }

  scrapProcedure = (data_out, index)=>{
    this.setState({destroyModalOpen: true, selectedDataCopy: data_out, selectIndex: index});
  }

  // 设置流程完成
  setFinishSure = (data_out, index) => {
    var { id, next_info, data,infoData, selectedDataCopy } = this.state;
    // console.log(id, next_info);
    var pid = this.props.match.params.id;


    // console.log(this.state);
    // 设置流程完成
    fetch(config.server.updateDutyProcedureStatus,{method:"POST",
      headers:{
         'Content-Type': 'application/json',
      },
      body:JSON.stringify({pid: pid,id: selectedDataCopy.id, status: 2, remark: next_info})
    }).then(res=>res.json()).then(data=>{
      if(data.code != 200){
        this.tips(data.msg);return;
      }
      this.tips('该流程已完成');
      this.state.data.status = 2;
      this.setState({InfoModalOpen: false});

      this.setState({data: this.state.data});
      // 重新读取数据
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试');});

  }

  // 报废当前环节
  setScrap = (data_out, index) => {
    var { id, destroy_info, selectedDataCopy, selectIndex } = this.state;
    var pid = this.props.match.params.id;

    if(!destroy_info){
      this.tips('请填写报废原因');return;
    }

    var nextFun = () =>{
      fetch(config.server.updateDutyProcedureDetailStatus,{method:"POST",
        headers:{
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({id: selectedDataCopy.id, status: -1, remark: destroy_info})
      }).then(res=>res.json()).then(data=>{
        if(data.code != 200){
          this.tips(data.msg);return;
        }
        this.state.infoData[selectIndex].status= -1;
        this.setState({infoData: this.state.infoData});this.tips('该流程环节已报废');this.setState({destroyModalOpen: false});
      }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});
    };

    nextFun();
    // this.setState({confirmOpen: true, content: '确定报废当前流程吗？',confirmSure: nextFun});
  }

  // 设置当前环节已完成
  finishProcedureDetail = (n, index) =>{

    this.setState({selectedDataCopy:n, selectIndex: index});

    if(!n.actualNum){
      this.tips('实际完成产品数量不能为空');return;
    }

    var nextFun = () =>{
      var { id, destroy_info, selectedDataCopy, selectIndex } = this.state;

      console.log(this.state.selectedDataCopy, this.state.selectIndex);

      var pid = this.props.match.params.id;

      fetch(config.server.updateDutyProcedureDetailStatus,{method:"POST",
        headers:{
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({id: selectedDataCopy.id, status: 1})
      }).then(res=>res.json()).then(data=>{
        if(data.code != 200){
          this.tips(data.msg);return;
        }
        this.state.infoData[selectIndex].status= 1;
        this.setState({infoData: this.state.infoData});this.tips('该步骤已完成');
        this.setState({destroyModalOpen: false});
      }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});
    };

    this.setState({confirmOpen: true, content: '确定当前步骤已完成吗？',confirmSure: nextFun});
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

  // 报废流程弹窗
  setScrapModal = ()=>{
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
      aria-labelledby="customized-dialog-title" className="modal lg"
      open={this.state.destroyModalOpen } style={{marginTop:'-10rem'}}
    >
      <DialogTitle id="customized-dialog-title" onClose={this.modalClose}>
        流程报废设置
      </DialogTitle>
      <form className={classes.container} noValidate autoComplete="off" style={{padding:"2rem 6rem 3rem"}}>
        <Grid container spacing={24}>
          <Grid item xs={12} style={{margin: "1.5rem 0 1rem",lineHeight:'35px'}}>
            <Info fontSize = "large" color = "secondary" style={{marginBottom:'-11px'}}></Info>
              设置当前流程的状态为<span className="text-red">报废</span>后，当前流程细节将不可修改，请确认操作。
          </Grid>
          <Grid item xs={12} style={{paddingTop:0}}>
            <TextField fullWidth style={{marginTop:0}}
              label="报废原因（必填）"
              className={classes.textField}
              autoComplete="current-password"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e)=>{this.setState({destroy_info: e.target.value})}}
            ></TextField>
          </Grid>

          <Grid item xs={12} align="right">
            <Button variant="outlined" onClick={this.setScrap} style={{marginRight: 1+"rem"}} color="primary" className={classes.button}>
            确定</Button>
            <Button variant="outlined" onClick={this.modalClose} style={{marginRight: 1+"rem"}} color="secondary" className={classes.button}>取消</Button>
          </Grid>
          </Grid>

        </form>
    </Dialog>)
  }

  // 完成消息弹窗
  setFinishModal = ()=>{
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
      aria-labelledby="customized-dialog-title"  className="modal lg"
      open={this.state.InfoModalOpen} style={{marginTop:'-10rem'}}
    >
      <DialogTitle id="customized-dialog-title" onClose={this.modalClose}>
        流程完成设置
      </DialogTitle>
      <form className={classes.container} noValidate autoComplete="off" style={{padding:"2rem 6rem 3rem"}}>
        <Grid container spacing={24}>
          <Grid item xs={12} style={{margin: "1.5rem 0 1rem",lineHeight:'35px'}}>
            <Info fontSize = "large" color = "primary" style={{marginBottom:'-11px'}}></Info>
              设置当前流程的状态为<span className="text-blue">完成</span>后，将进入下一流程，当前流程将不可修改，请确认操作。
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

    const { workers, ifAdd, selectedWorkers,selectedDataCopy, productNum, actualNum } = this.state;
    const styleCon = {
       height: '20rem',
       overflowY : 'auto',
       padding: '.5rem 0'
    };
    const styleChip = {
      margin:'3px 5px'
    };
    return (<Dialog
      aria-labelledby="customized-dialog-title"
      open={this.state.modalOpen} style={{marginTop:'-10rem'}} className="modal lg"
    >
      <DialogTitle id="customized-dialog-title"  onClose={this.modalClose}>
        {ifAdd?'添加':'编辑'}流程详情
      </DialogTitle>
      <form className={classes.container} noValidate autoComplete="off" style={{padding:"2rem 3rem 3rem"}}>
        <Grid container spacing={24}>
          <Grid item xs={6} style={{paddingTop:0}}>
            <div className="bold">计划生产数量</div>
            <TextField style={{marginTop:0}}
              className={classes.textField}
              autoComplete="current-password"
              margin="normal"
              value = {productNum}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e)=>{this.setState({productNum: e.target.value})}}
            >
            ))}</TextField>
          </Grid>
          <Grid item xs={6} style={{paddingTop:0}}>
            <div className="bold">实际生产数量</div>
            <TextField style={{marginTop:0}}
              className={classes.textField}
              autoComplete="current-password"
              margin="normal"
              value = {actualNum}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e)=>{this.setState({actualNum: e.target.value})}}
            >
            ))}</TextField>
          </Grid>


          <Grid item xs={6} style={{paddingTop:0}}>
            {/*<FormLabel component="legend">开始生产时间</FormLabel>
                        <DateFormatInput  className="inline-block" name='date-input' value={ new Date(selectedDataCopy.startTime) } onChange={(date)=>{selectedDataCopy.planFinishDate = date.format('yyyy-MM-dd');this.setState({ selectedDataCopy: selectedDataCopy })} } style={{marginbottom:'2rem'}} />
                        <TimeFormatInput name='time-input' value={selectedDataCopy.startDateTime?new Date(selectedDataCopy.startDateTime):new Date() } onChange={(date)=>{console.log(date);selectedDataCopy.startDateTime = date;this.setState({ selectedDataCopy: selectedDataCopy })} }/>*/}
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
    const { data, infoData, order, orderBy, selected, rowsPerPage, page, allPower } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    rows[rows.length-1].hidden = true;

    return (
      <Paper className={classes.root} style={{padding:"0 2rem",width:"auto"}}>
        <EnhancedTableToolbar allPower = {this.state.allPower} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy} rows={rows}
              rowCount={data.length}
            />
            <TableBody>
                  <TableRow
                    role="checkbox"
                    tabIndex={-1}
                    key={data.id}
                  >
                    <TableCell align="center">{data.erp}</TableCell>
                    <TableCell align="center">{data.materialCode}</TableCell>
                    <TableCell align="center" component="th" scope="row" padding="none">
                      {data.materialName}
                    </TableCell>
                    <TableCell align="center" component="th" scope="row" padding="none">
                      {data.procedure}
                    </TableCell>
                    <TableCell align="center" component="th" scope="row" padding="none">
                      {data.duty}
                    </TableCell>
                    <TableCell align="center" component="th" scope="row" padding="none" className={data.status==2?"text-success":(data.status==1?"text-blue":"")}>
                      {data.status==2?"完成":(data.status==1?"进行中":"未开始")}
                    </TableCell>
                    <TableCell align="center" component="th" scope="row" padding="none" className={data.status==2?'':'text-blue'}>
                      {(allPower || data.status!=1)?'——':(<span className="btn" onClick={()=>this.finishProcedure(data)} > 设为完成</span>)}
                    </TableCell>

                  </TableRow>
            </TableBody>
          </Table>


        <Toolbar >
            <Grid container>
              <Grid item xs={12}>
                  <Typography variant="h6" id="tableTitle" align="center" style={{padding:'3rem 2rem 1rem 0',fontWeight: 'bold'}}>
                    详细生产情况
                  </Typography>
                </Grid>
              </Grid>
        </Toolbar>

        <div style={{maxHeight: '55vh',overflow: 'auto',background:'rgba(200,200,200)'}}>
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
                    <TableCell align="center">{(index+1)}</TableCell>
                    <TableCell align="center">{n.productNum}</TableCell>
                    <TableCell align="center">{n.worker}</TableCell>
                    <TableCell align="center">{n.worker.split(' ').length}</TableCell>
                    <TableCell align="center">{n.actualNum}</TableCell>
                    <TableCell align="center" component="th" scope="row" padding="none">
                      {new Date(n.startTime).format('yyyy-MM-dd hh:mm:ss')}
                    </TableCell>
                    <TableCell align="center" component="th" scope="row" padding="none">
                      {n.status==2?'已完成':(n.status==-1?'已报废':(n.status==1?'已完成':'进行中'))}
                    </TableCell>
                    <TableCell align="center" id={n.status}>
                      {!allPower && data.status==1?
                        (n.status==0?<span className='pointer btn text-red' onClick={()=>this.scrapProcedure(n, index)}>设为报废</span>:(<span className={n.status==-1?'text-notice':''}>{n.status== 1?'':'——'}</span>) )
                      :('——')}

                      {!allPower && data.status==1?
                        (n.status==0?(<span className="pointer btn text-blue" onClick={()=>{this.addProcedureInfo(1, n, index)}}>修改</span>):(<span  className={n.status==1?'text-success':''}>{n.status== 1?'——':''}</span>))
                      :(<span className="text-success">——</span>)}

                      {!allPower && data.status==1?
                        (n.status==0?(<span className="pointer btn text-success" onClick={()=>this.finishProcedureDetail(n, index)}>设为完成</span>):(<span  className={n.status==1?'text-success':''}>{n.status== 1?'——':''}</span>))
                      :(<span className="text-success">——</span>)}
                    </TableCell>
                  </TableRow>
                );
              })}

          </TableBody>
        </Table>
        </div>
        {infoData.length?'': <div className="emptyShow" align="center" style={{display: 'block', paddingTop:'3.0rem', paddingBottom:'1.5rem',position: 'relative',top: 0,left: 0}}>暂无详细情况数据 </div>}
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
        {(this.state.data.status != 1 || allPower)?false:(<Grid container align="center" vertical="center" style={{paddingTop:"4rem", paddingRight: "1rem"}}>
                              <Grid item xs={12}>
                                <span onClick={()=>this.addProcedureInfo(0)} className="pointer addProcedureBtn"><AddIcon style={{marginBottom: '-5px'}} />添加详情</span>
                              </Grid>
                            </Grid>)}
          <Confirm open = {this.state.confirmOpen} title = {this.state.title} content={this.state.content} closeFun = {this.deleteModalClose} sureFun = {this.confirmSure} />
        </div>
        {this.addInfoModal()}
        {this.setFinishModal()}
        {this.setScrapModal()}
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
