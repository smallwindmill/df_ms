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
import AttachFile from '@material-ui/icons/AttachFile';

import {DateFormatInput} from 'material-ui-next-pickers';
import Icon from '@material-ui/core/Icon';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

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
function createData( erp, materialCode, materialName, planNum, planFinishDate, planOnline,
actualStart, actualFinish, status, priority, ifNew, remark, feedback, templateID) {
  counter += 1;
  return { id: counter, erp, materialCode, materialName, planNum, planFinishDate, planOnline,
actualStart, actualFinish, status, priority, ifNew, remark, feedback, templateID };
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
  { id: 'name', numeric: false, disablePadding: true, label: '编号' },
  { id: 'name', numeric: false, disablePadding: true, label: 'erp号' },
  { id: 'carbs', numeric: true, disablePadding: false, label: '物料长代码' },
  { id: 'calories', numeric: false, disablePadding: false, label: '物料名称' },
  { id: 'protein', numeric: true, disablePadding: false, label: '计划生产数量' },
  { id: 'protein', numeric: true, disablePadding: false, label: '计划完工日期' },
  { id: 'protein', numeric: true, disablePadding: false, label: '预计上线日期' },
  { id: 'protein', numeric: true, disablePadding: false, label: '实际开工日期' },
  { id: 'protein', numeric: true, disablePadding: false, label: '实际完成日期' },
  { id: 'protein', numeric: true, disablePadding: false, label: '订单状态' },
  { id: 'protein', numeric: true, disablePadding: false, label: '优先级' },
  { id: 'protein', numeric: true, disablePadding: false, label: '是否新品' },
  { id: 'protein', numeric: true, disablePadding: false, label: '备注' },
  { id: 'protein', numeric: true, disablePadding: false, label: '反馈' },
  { id: 'protein', numeric: true, disablePadding: false, label: '模板编号'},
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
    open: false
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  addTemplate = () => {
    this.setState({ open: true, fileValue:'' });
  }


  tips = this.props.tips;


  render(){
    var classes = '';
    var {dateRange, typeQuery} = this.state;
    return (
     <div>
        <Toolbar >
          <div className={classes.title}>
              <Typography variant="h6" id="tableTitle" align="left">
                已删除订单
              </Typography>
          </div>
          <div className={classes.spacer} />
        </Toolbar>
        <Grid container  style={{margin:'1rem 0 1rem',padding: '0 1.2rem'}}>

          <Grid item xs={6} align="left">

          </Grid>

          <Grid item align="right" xs={6}>
            {/*<span className="btn text-blue" onClick={this.addTemplate}>导入订单</span>*/}
            <TextField style={{marginTop:0,marginLeft:'1rem'}}
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




class RecycleIndent extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: config.pageChangeNum || 13,
    open: false,
    confirmOpen: false,
    title: "确认",
    selectedData: {},
    content: "确定删除该订单吗？",
    actualFinish: new Date().format('yyyy-MM-dd')
  };

  componentWillMount() {
    // 组件初次加载数据申请
    console.log(this.props);
    fetch(config.server.listAllIndentByDate+'?ifDelete=1').then(res=>res.json()).then(data=>{
      if(data.code!=200){
        this.tips(data.msg);return;
      }
      this.changeIndentData(data.results || []);
    }).catch(e=>this.tips('网络出错了，请稍候再试'));
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;


  // 打开更新订单弹窗
  updateIndent = (data, index) =>{
    this.setState({login: data.login||0,indent: data.indent||0,workhour: data.workhour||0,allindent: data.allindent||0,captain: data.captain||0});
    this.setState({open: true, selectedDataBak: data, selectedData: JSON.parse(JSON.stringify(data)) });
  }

  // 更新订单
  setIndentSure=()=>{
    var { selectedDataBak, selectedData } = this.state;
    var { id,planNum,planFinishDate,planOnline,actualStart, actualFinish,priority,ifNew,ifOutsource,duty,status,remark } = this.state.selectedData;

    fetch(config.server.updateIndentInfo,{method:"POST",
      headers:{
          'Content-Type': 'application/json',
      },
      body:JSON.stringify({id: id, planNum: planNum,planFinishDate: planFinishDate,planOnline: planOnline,actualStart: actualStart,actualFinish: actualFinish,priority: priority,ifNew: ifNew,ifOutsource: ifOutsource,duty: duty,status: status,remark: remark})
    }).then(res=>res.json()).then(data=>{
      // console.log(data);
      if(data.code!=200){
          this.tips(data.msg);return;
      }
      this.tips('订单信息更新成功');

      if(!selectedDataBak.actualFinish){
        // selectedDataBak.actualFinish = new Date().format('yyyy.MM.dd');
      }

      for(var i in selectedDataBak){
        selectedDataBak[i] = selectedData[i];
      }

      this.changeIndentData('', 2);
      this.setState({open: false});
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});
  }

  changeIndentData = (data, type) =>{
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

  // 删除用户确认框
  deleteIndent=(data, index)=>{
    this.setState({confirmOpen: true});
    var nexFun = ()=>{
      fetch(config.server.deleteIndent,{method:"POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({id: data.id})
      }).then(res=>res.json()).then(data=>{
        if(data.code!=200){
            this.tips(data.msg);return;
        }

        this.state.data.splice(index, 1);
        this.setState({data: this.state.data});
        this.tips('删除订单成功');
      }).catch(e=>this.tips('网络出错了，请稍候再试'));

    };

    this.setState({confirmOpen: true,title: "确认",content: "确定删除该订单吗？",confirmSure: nexFun});
  }

  // 关闭删除用户弹窗
  confirmClose=()=>{
    this.setState({confirmOpen: false})
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

  // 还原订单
  recycleIndent = (data, index) =>{
    var nexFun = () => {
      fetch(config.server.recycleIndent,{method:"POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({id: data.id})
      }).then(res=>res.json()).then(data=>{
        if(data.code!=200){
          this.tips(data.msg);return;
        }
        // 删除数据
        this.state.data.splice(index, 1);
        this.setState({data: this.state.data});
      }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});

    }

    this.setState({confirmOpen: true,title: "确认",content: "确定还原该订单吗？",confirmSure: nexFun});

  }


  // 设置完成订单
  finishIndent = (data, index) => {
    console.log(data);
    if(!data.actualFinish){
      this.tips('请先设置订单完成时间');return;
    }
    var nexFun = ()=>{
      // 设置订单为完成状态
      fetch(config.server.updateIndentInfo,{method:"POST",
        headers:{
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({id: data.id, status: 1,remark: data.remark})
      }).then(res=>res.json()).then(data1=>{
        // console.log(data);
        if(data1.code!=200){
            this.tips(data.msg);return;
        }
        this.tips('订单已完成');
        // this.state.data[index].status = 1;
        data.status = 1;
        // 新增数据
        this.changeIndentData('', 2);
        this.setState({open: false});
      }).catch(e=>this.tips('网络出错了，请稍候再试'));

    };

    this.setState({confirmOpen: true,title: "确认",content: "确定修改该订单为完成状态吗？",sureFun: nexFun});
  }

  // 更新订单信息弹窗
  updateUserPowerModal = ()=>{
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

    var { selectedData } = this.state;

    var { name, planNum, planFinishDate, planOnline, actualStart, actualFinish, status, priority, ifNew, remark, feedback} = this.state.selectedData;

    return (<Dialog
      aria-labelledby="customized-dialog-title"
      open={this.state.open} style={{marginTop:'-10rem'}}
    >
      <DialogTitle id="customized-dialog-title"  onClose={this.handleClose}>
        订单信息更新{name ?('—'+name):false}
      </DialogTitle>
      <form className={classes.container} noValidate autoComplete="off" style={{padding:"2rem 6rem 3rem"}}>
        <Grid container spacing={24}>

          <Grid item xs={12} style={{paddingTop:0}}>
            <FormLabel component="legend">计划生产数量</FormLabel>
            <TextField fullWidth style={{marginTop:0}}
              placeholder="请输入计划生产数量"
              className={classes.textField}
              value = {planNum}
              onChange={(e)=>{selectedData.planNum=e.target.value;this.setState({selectedData: selectedData})}}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">计划上线时间</FormLabel>
            <DateFormatInput  className="inline-block" name='date-input' value={ planOnline?new Date(planOnline):'' } onChange={(date)=>{selectedData.planOnline = date.format('yyyy-MM-dd');this.setState({ selectedData: selectedData })} } style={{marginbottom:'2rem'}} />
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">计划完成时间</FormLabel>
            <DateFormatInput  className="inline-block" name='date-input' value={ planFinishDate?new Date(planFinishDate):'' } onChange={(date)=>{selectedData.planFinishDate = date.format('yyyy-MM-dd');this.setState({ selectedData: selectedData })} } style={{marginbottom:'2rem'}} />
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">实际开始时间</FormLabel>
            <DateFormatInput  className="inline-block" name='date-input' value={ actualStart?new Date(actualStart):'' } onChange={(date)=>{selectedData.actualStart = date.format('yyyy-MM-dd');this.setState({ selectedData: selectedData })} } style={{marginbottom:'2rem'}} />
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">实际完成时间</FormLabel>
            <DateFormatInput  className="inline-block" name='date-input' value={ actualFinish?new Date(actualFinish):'' } onChange={(date)=>{selectedData.actualFinish = date.format('yyyy-MM-dd');this.setState({ selectedData: selectedData })} } style={{marginbottom:'2rem'}} />
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">是否加急</FormLabel>
            <RadioGroup aria-label="是否加急" style={{flexDirection:"row"}} name="priority" value={(priority || 0)+''} onChange={(e)=>{e.persist();selectedData.priority=(e.target.value=='0'?0:1);this.setState({selectedData:selectedData})}}          >
               <FormControlLabel value="0" control={<Radio color="default" />} label="否" />
               <FormControlLabel value="1" control={<Radio color="default" />} label="是" />
            </RadioGroup>
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
              <FormLabel component="legend">是否新品</FormLabel>
              <RadioGroup aria-label="是否新品" style={{flexDirection:"row"}} name="ifNew" value={(ifNew|| 0)+'' } onChange={(e)=>{e.persist();selectedData.ifNew=(e.target.value=='0'?0:1);this.setState({selectedData:selectedData})}}          >
                 <FormControlLabel value="0" control={<Radio color="default" />} label="否" />
                 <FormControlLabel value="1" control={<Radio color="default" />} label="是" />
              </RadioGroup>
          </Grid>


          <Grid item xs={6} style={{paddingTop:0}}>

          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>

          </Grid>


          <Grid item xs={12} align="center">
            <Button variant="outlined" onClick={this.setIndentSure} style={{marginRight: 1+"rem"}} color="primary" className={classes.button}>保存</Button>
            <Button variant="outlined" style={{marginRight: 1+"rem"}} color="secondary" className={classes.button}>重置</Button>
          </Grid>
          </Grid>

        </form>
    </Dialog>)
  }


  tips = (msg, type) => {
    if(msg){
      this.setState({tipInfo:msg});
    }
    this.setState({tipsOpen: true});

    if(type == 'stay'){

    }else{
      setTimeout(()=>{
        this.setState({tipsOpen: false});
      },4000);
    }
  }

  render() {
    const { classes } = this.props;
    const { filterFun, data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root} style={{padding:"0 2rem",width:"auto"}}>
        <EnhancedTableToolbar  tips = {this.tips}  queryByKeyword = {this.queryByKeyword}  />
        <div className={classes.tableWrapper}>
          <Table className={classes.table+' nowrap'} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy} tips = {this.tips}
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
                      key={index}
                      selected={isSelected}
                    >
                      <TableCell align="center">{ page * rowsPerPage+index+1 }</TableCell>
                      <TableCell align="center">{n.erp}</TableCell>
                      <TableCell align="center">{n.materialCode}</TableCell>
                      <TableCell align="center">{n.materialName}</TableCell>
                      <TableCell align="center">{n.planNum}</TableCell>
                      <TableCell align="center">{n.planFinishDate ? new Date(n.planFinishDate).format('yyyy-MM-dd'):false}</TableCell>
                      <TableCell align="center">{n.planOnline ? new Date(n.planOnline).format('yyyy-MM-dd'):false}</TableCell>
                      <TableCell align="center">{n.actualStart ? new Date(n.actualStart).format('yyyy-MM-dd'):false}</TableCell>
                      <TableCell align="center">{n.actualFinish ? new Date(n.actualFinish).format('yyyy-MM-dd'):false}</TableCell>
                      <TableCell align="center" className = {n.status?'text-blue':''}>{'已删除'||(n.status?"完成":"进行中")}</TableCell>
                      <TableCell align="center" className = {n.priority?'text-blue':''}>{n.priority?"是":"否"}</TableCell>
                      <TableCell align="center" className = {n.ifNew?'text-blue':''}>{n.ifNew?"是":"否"}</TableCell>
                      <TableCell align="center">{n.remark}</TableCell>
                      <TableCell align="center">{n.feedback}</TableCell>
                      <TableCell align="center">{n.templateID}</TableCell>
                      <TableCell align="center">
                        <span className="pointer btn text-blue"   onClick={()=>this.recycleIndent(n, index)}>还原</span>
                        {/*<span className="pointer btn text-red" onClick={()=>this.deleteIndent(n, index)}>删除</span>*/}
                      </TableCell>
                    </TableRow>
                  )
                }) }


              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={16} />
                </TableRow>)}
            </TableBody>
          </Table>
            {data.length?'': <div className="emptyShow" align="center" style={{display: 'block', padding:'2rem'}}>暂无数据 </div>}
        </div>
        <TablePagination
          rowsPerPageOptions={[1*config.page, 2*config.page, 3*config.page]}
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
        {this.updateUserPowerModal()}
        <Confirm open = {this.state.confirmOpen} title = {this.state.title} content={this.state.content} closeFun = {this.confirmClose} sureFun = {this.state.confirmSure} />
        <Snackbar style={{marginTop:'70px'}}
          anchorOrigin={{horizontal:"center",vertical:"top"}}
          open={this.state.tipsOpen}
          onClose={()=>this.setState({tipsOpen: false})}
          ContentProps={{
            'className':'info'
          }}
          message={this.state.tipInfo}  />
      </Paper>
    );
  }
}

RecycleIndent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RecycleIndent);
