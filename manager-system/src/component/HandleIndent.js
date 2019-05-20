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
    dateRange:[{text: "最近一周"},{text: "最近一月"},{text: "最近三月"},{text: "最近一年"},{text: "一年以前"}]
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  addTemplate = () => {
    this.setState({ open: true, fileValue:'' });
  }

  queryIndentByDate=(e, data, index)=>{
    var { queryStart, queryEnd } = this.state;
    e.persist();
    // 切换显示高亮
    for(var i of e.target.parentElement.children){
      i.className = i.className.replace('text-blue','');
    }

    e.target.className += ' text-blue';

    queryEnd = new Date().format('yyyy-MM-dd');

    if(index==0){
      queryStart = new Date(new Date()-1000*60*60*24*7).format('yyyy-MM-dd');//一周
    }else if(index==1){
      queryStart = new Date(new Date()-1000*60*60*24*30).format('yyyy-MM-dd');//一月
    }else if(index==2){
      queryStart = new Date(new Date()-1000*60*60*24*90).format('yyyy-MM-dd');//三月
    }else if(index==3){
      queryStart = new Date(new Date()-1000*60*60*24*365).format('yyyy-MM-dd');//一年
    }else if(index==4){
      queryStart = new Date(new Date()-1000*60*60*24*3650).format('yyyy-MM-dd');//一年以前
      queryEnd = new Date(new Date()-1000*60*60*24*365).format('yyyy-MM-dd');
    }

    fetch(config.server.listAllIndentByDate+'?startDate='+queryStart+'&endDate='+queryEnd).then(res=>res.json()).then(data=>{
      if(data.code!=200){
        this.tips(data.msg);return;
      }
      this.props.changeIndentData(data.results || []);
      this.tips('查询成功');
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});

  }

  submitFile = () =>{
    if(this.state.fileValue){
      console.log(this.state.fileValue);
      this.uploadFile();
    }else{
      this.tips('请选择文件后再上传');
    }
  }

  uploadFile = () =>{
    var that = this;
    var file = this.state.fileValue[0];
    var name_File = file.name.split('.')[file.name.split('.').length - 1];
    var supprort_fie = ['xls', 'xlsx', 'XLS', 'XLSX'];
    if (supprort_fie.indexOf(name_File) != '-1') {
        var formData = new FormData();
        var zipFillInName = '';
        formData.append('name', file.name);
        formData.append('file', file);
        console.log(config.changeToJson(localStorage.user).userID);
        formData.append('id', config.changeToJson(localStorage.user).userID);
        var uploadTypeUrl;

        fetch(config.server.uploadExcelForAddIndent,{
          method: 'POST',
          body: formData
        }).then(res => {
          return res.json();
        }).then(data => {
          console.log(data);
          if(data.code!=200){
              this.tips('文件上传出错，请稍后再试','1000');return;
              // nextFunction();
          }

          this.tips(<span>本次共上传<span class="text-blue">{data.results.total}</span>条数据，<span class="text-red">{data.results.fail}</span>条失败，<span class="text-blue">{data.results.success}</span>条成功</span>, 'stay');
          this.setState({ open: false });

       }).catch(error=>{
            console.log(error);
        })

    } else {
        this.tips('暂不支持该文件格式');
    }
  }

  tips = this.props.tips;

  // 添加订单弹窗
  addTemplateModal = ()=>{
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


    return (<div><Dialog

      aria-labelledby="customized-dialog-title"
      open={this.state.open} style={{marginTop:'-10rem'}}
    >
      <DialogTitle id="customized-dialog-title" onClose={this.handleClose} >
        导入订单文件
      </DialogTitle>
        <DialogContent style={{minWidth:'350px',minHeight:'100px',display:'flex',alignItems: 'center'}}>
          <Grid item xs={3} align="center">
             {(!this.state.fileValue)?(
               <Button variant="contained" color="default" className={'oveflow-hidden '+classes.button}>
              请选择文件
              <CloudUploadIcon className={classes.rightIcon} />
              <input type="file" className="invisible" onChange={(e)=>{e.persist();console.log(e.target);this.setState({ fileValue: e.target.files });}} />
            </Button>
          ):(
                <span><AttachFile></AttachFile>
                <span className="text-blue">已选择文件：{this.state.fileValue[0].name}</span></span>
              )
            }
          </Grid>
          <Grid item xs={9}>
           <span className=""><small> 请选择一个excel文件上传,
          文件列名依次为:编号、物料长代码、物料名称、计划生产数量、计划完工日期、 预计上线日期、制单日期、优先级、新品、备注、模板选择。<a className="text-blue" href={config.templete.indentUrl} download="订单模板">点击由此下载模板</a>。</small></span>
          </Grid>


        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{this.handleClose() }} color="primary">取消</Button>
          <Button onClick={()=>{this.submitFile() }} color="primary">
            上传
          </Button>
        </DialogActions>

    </Dialog>

    </div>)
  }

  render(){
    var classes = '';
    var {dateRange} = this.state;
    return (
     <div>
        <Toolbar >
          <div className={classes.title}>
              <Typography variant="h6" id="tableTitle" align="left">
                订单操作
              </Typography><span className="btn text-blue" style={{position:'absolute',right: '9rem',top:'2rem'}} onClick={this.addTemplate}>导入订单</span>
          </div>
          <div className={classes.spacer} />{this.addTemplateModal()}
        </Toolbar>
        <Grid container align="left"  style={{margin:'1rem 0 1rem',padding: '0 1.2rem'}}>
          <Grid item xs={12} className="small">
                <span className="blod">时间</span>
                {dateRange.map((date,index)=>(<span key = {index} className="btn" onClick={(e)=>this.queryIndentByDate(e, date, index)}> {date.text}</span>))}
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




class HandleIndent extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: 10,
    open: false,
    confirmOpen: false,
    title: "确认",
    selectedData: {},
    selectedDataCopy: {},
    content: "确定删除该订单吗？"
  };

  componentWillMount() {
    // 组件初次加载数据申请
    fetch(config.server.listAllIndentByDate).then(res=>res.json()).then(data=>{
      console.log(data);
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
    this.setState({open: true,selectedData: data, selectedDataCopy: JSON.parse(JSON.stringify(data)) });
  }

  // 更新订单
  setIndentSure=()=>{
    var { selectedData,selectedDataCopy } = this.state;
    var { id,planNum,planFinishDate,planOnline,actualFinish,priority,ifNew,ifOutsource,duty,status,remark } = this.state.selectedDataCopy;

    console.log(id,planNum,planFinishDate,planOnline,actualFinish,priority,ifNew,ifOutsource,duty,status,remark);

    fetch(config.server.updateIndentInfo,{method:"POST",
      headers:{
          'Content-Type': 'application/json',
      },
      body:JSON.stringify({id: id, planNum: planNum,planFinishDate: planFinishDate,planOnline: planOnline,actualFinish: actualFinish,priority: priority,ifNew: ifNew,ifOutsource: ifOutsource,duty: duty,status: status,remark: remark})
    }).then(res=>res.json()).then(data=>{
      // console.log(data);
      if(data.code!=200){
          this.tips(data.msg);return;
      }
      this.tips('订单信息更新成功');
      console.log(selectedData);
      selectedData = selectedDataCopy;
      // 新增数据
      this.changeIndentData('', 2);
      this.setState({open: false});
    }).catch(e=>this.tips('网络出错了，请稍候再试'));
  }

  changeIndentData = (data, type) =>{
    // 默认替换，1为push，2为修改
    if(type==1){
      this.state.data.push(data);
      this.setState({data: this.state.data});
    }else if(type==2){
      console.log(this.state.data);
      this.setState({data: this.state.data});
      // this.state.data[this.state.editNum] = data;
    }else{
      this.setState({data: data});
    }

  }

  // 删除用户弹窗
  deleteUser=()=>{
    this.setState({confirmOpen: true})
  }

  // 关闭删除用户弹窗
  confirmClose=()=>{
    this.setState({confirmOpen: false})
  }

  finishIndent = (data, index) => {
    var nexFun = ()=>{
      // 设置订单为完成状态
      fetch(config.server.updateIndentInfo,{method:"POST",
        headers:{
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({id: data.id, status: 1,remark: data.remark})
      }).then(res=>res.json()).then(data=>{
        // console.log(data);
        if(data.code!=200){
            this.tips(data.msg);return;
        }
        this.tips('订单已完成');
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

    var { selectedDataCopy } = this.state;

    var { name, planNum, planFinishDate, planOnline, actualFinish, status, priority, ifNew, remark, feedback} = this.state.selectedDataCopy;

    return (<Dialog
      aria-labelledby="customized-dialog-title"
      open={this.state.open} style={{marginTop:'-10rem'}}
    >
      <DialogTitle id="customized-dialog-title"  onClose={this.handleClose}>
        订单信息更新{name ?('—'+name):false}
      </DialogTitle>
      <form className={classes.container} noValidate autoComplete="off" style={{padding:"2rem 6rem 3rem"}}>
        <Grid container spacing={24}>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">计划生产数量</FormLabel>
            <TextField fullWidth style={{marginTop:0}}
              placeholder="请输入计划生产数量"
              className={classes.textField}
              value = {planNum}
              onChange={(e)=>{selectedDataCopy.planNum=e.target.value;this.setState({selectedDataCopy: selectedDataCopy})}}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">计划完成时间</FormLabel>
            <DateFormatInput  className="inline-block" name='date-input' value={ planFinishDate?new Date(planFinishDate):new Date() } onChange={(date)=>{selectedDataCopy.planFinishDate = date.format('yyyy-MM-dd');this.setState({ selectedDataCopy: selectedDataCopy })} } style={{marginbottom:'2rem'}} />
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">计划上线时间</FormLabel>
            <DateFormatInput  className="inline-block" name='date-input' value={ planOnline?new Date(planOnline):new Date() } onChange={(date)=>{selectedDataCopy.planOnline = date.format('yyyy-MM-dd');this.setState({ selectedDataCopy: selectedDataCopy })} } style={{marginbottom:'2rem'}} />
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">实际完成时间</FormLabel>
            <DateFormatInput  className="inline-block" name='date-input' value={ actualFinish?new Date(actualFinish):new Date() } onChange={(date)=>{selectedDataCopy.actualFinish = date.format('yyyy-MM-dd');this.setState({ selectedDataCopy: selectedDataCopy })} } style={{marginbottom:'2rem'}} />
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">是否新品</FormLabel>
            <RadioGroup aria-label="是否新品" style={{flexDirection:"row"}} name="priority" value={(priority || 0)+''} onChange={(e)=>{e.persist();selectedDataCopy.priority=(e.target.value=='0'?0:1);this.setState({selectedDataCopy:selectedDataCopy})}}          >
               <FormControlLabel value="0" control={<Radio color="default" />} label="否" />
               <FormControlLabel value="1" control={<Radio color="default" />} label="是" />
            </RadioGroup>
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
              <FormLabel component="legend">是否加急</FormLabel>
              <RadioGroup aria-label="是否加急" style={{flexDirection:"row"}} name="ifNew" value={(ifNew|| 0)+'' } onChange={(e)=>{e.persist();selectedDataCopy.ifNew=(e.target.value=='0'?0:1);this.setState({selectedDataCopy:selectedDataCopy})}}          >
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
      },2000);
    }
  }

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root} style={{padding:"0 2rem",width:"auto"}}>
        <EnhancedTableToolbar  tips = {this.tips} changeIndentData = {this.changeIndentData} />
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
                      key={n.id}
                      selected={isSelected}
                    >
                      <TableCell align="left">{n.id}</TableCell>
                      <TableCell align="left">{n.erp}</TableCell>
                      <TableCell align="left">{n.materialCode}</TableCell>
                      <TableCell align="left">{n.materialName}</TableCell>
                      <TableCell align="left">{n.planNum}</TableCell>
                      <TableCell align="left">{n.planFinishDate ? new Date(n.planFinishDate).format('yyyy-MM-dd'):false}</TableCell>
                      <TableCell align="left">{n.planOnline ? new Date(n.planOnline).format('yyyy-MM-dd'):false}</TableCell>
                      <TableCell align="left">{n.actualStart ? new Date(n.actualStart).format('yyyy-MM-dd'):false}</TableCell>
                      <TableCell align="left">{n.actualFinish ? new Date(n.actualFinish).format('yyyy-MM-dd'):false}</TableCell>
                      <TableCell align="left" className = {n.status?'text-blue':''}>{n.status?"完成":"进行中"}</TableCell>
                      <TableCell align="left" className = {n.priority?'text-blue':''}>{n.priority?"是":"否"}</TableCell>
                      <TableCell align="left" className = {n.ifNew?'text-blue':''}>{n.ifNew?"是":"否"}</TableCell>
                      <TableCell align="left">{n.remark}</TableCell>
                      <TableCell align="left">{n.feedback}</TableCell>
                      <TableCell align="left">{n.templateID}</TableCell>
                      <TableCell align="left">
                        <span className="pointer btn text-blue"   onClick={()=>this.updateIndent(n, index)}>修改</span>
                        {n.status?'已完成':<span className="pointer btn text-blue"   onClick={()=>this.finishIndent(n, index)}>设为完成</span>}
                        {/*<span className="pointer btn text-red" onClick={this.deleteUser}>删除</span>*/}
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
          <Confirm open = {this.state.confirmOpen} title = {this.state.title} content={this.state.content} closeFun = {this.confirmClose} sureFun = {this.state.sureFun} />
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
        {this.updateUserPowerModal()}
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

HandleIndent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HandleIndent);
