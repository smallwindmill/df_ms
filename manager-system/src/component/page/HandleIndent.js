// 订单管理页面
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

import InfoIcon from '@material-ui/icons/Info';
import { amber, green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

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
import CircularProgress from '@material-ui/core/CircularProgress';


import Confirm from '../main/Confirm';
import config from '../config';

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
  { id: 'name', numeric: false, disablePadding: true, label: '序号' },
  { id: 'name', numeric: false, disablePadding: true, label: 'erp号' },
  { id: 'carbs', numeric: true, disablePadding: false, label: '货号' },
  { id: 'calories', numeric: false, disablePadding: false, label: '货物名称' },
  { id: 'protein', numeric: true, disablePadding: false, label: '计划生产数量' },
  { id: 'protein', numeric: true, disablePadding: false, label: '计划完工日期' },
  { id: 'protein', numeric: true, disablePadding: false, label: '预计上线日期' },
  { id: 'protein', numeric: true, disablePadding: false, label: '实际开工日期' },
  { id: 'protein', numeric: true, disablePadding: false, label: '实际完成日期' },
  { id: 'protein', numeric: true, disablePadding: false, label: '优先级' },
  { id: 'protein', numeric: true, disablePadding: false, label: '是否新品' },
  { id: 'protein', numeric: true, disablePadding: false, label: '备注' },
  { id: 'protein', numeric: true, disablePadding: false, label: '反馈' },
  { id: 'protein', numeric: true, disablePadding: false, label: '模板编号'},
  { id: 'protein', numeric: true, disablePadding: false, label: '订单状态' },
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
                align='center'
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
  }
});

class EnhancedTableToolbar extends React.Component{

  state = {
    open: false,
    dateRange:[{text: "全部", value: 0},{text: "最近一周", value: 1},{text: "最近一月", value: 2},{text: "最近三月", value: 3},{text: "最近一年", value: 4},{text: "一年以前", value: 5}],
    typeQuery:[
      {text: "全部",code: 0},
      {text: "加急",code: 1},
      {text: "新品",code: 2},
      //{text: "外协",code: 3}
    ],
    sitQuery:[
      {text: "全部",code: 'all'},
      {text: "未开始",code: 0},
      {text: "进行中",code: 1},
      {text: "已完成",code: 2}
    ]
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  addTemplate = () => {
    this.setState({ open: true, fileValue:'' });
  }

  submitFile = () =>{
    if(this.state.fileValue){
      console.log(this.state.fileValue);
      this.uploadFile();
    }else{
      this.tips('请先选择需要上传的文件');
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

        window.loading(true);
        fetch(config.server.uploadExcelForAddIndent,{
          method: 'POST',
          body: formData
        }).then(res => {
          return res.json();
        }).then(data => {
          // console.log(data);
          let erpMsg = '';
          if(data.results.failArr && data.results.failArr.length){
            for(let i in data.results.failArr){
              let inner_msg = data.results.failArr[i].erp || data.results.failArr[i].index;
              erpMsg += ((i>0?'、':'')+inner_msg);
            }
          }
          let errorMsg = data.results.fail?"erp为"+erpMsg+"的"+data.results.fail:data.results.fail;
          if(data.code!=200){
            window.loading(false);
            // this.tips(data.msg || '文件上传出错，请稍后再试','2000');return;
            this.tips(<span>本次共上传<span className="text-primary">{data.results.total}</span>条数据，<span className="text-blue">{data.results.success}</span>条成功，<span className="text-red">{errorMsg}</span>条数据失败</span>, 'stay');
            // nextFunction();
          }

          this.tips(<span>本次共上传<span className="text-blue">{data.results.total}</span>条数据，<span className="text-blue">{data.results.success}</span>条成功，<span className="text-red">{errorMsg}</span>条数据失败</span>, 'stay');
          this.props.initLoadData();
          this.setState({ open: false });
          window.loading(false);
       }).catch(error=>{
            window.loading(false);
            this.tips('文件上传出错，请稍后再试','2000');
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
          <Grid item xs={4} align="center" style={{padding: '0 .5rem'}}>
             {/*{(!this.state.fileValue)?(
                            <Button variant="contained" color="default" className={'oveflow-hidden '+classes.button}>
                           请选择文件
                           <CloudUploadIcon className={classes.rightIcon} />
                           <input type="file" className="invisible" onChange={(e)=>{e.persist();console.log(e.target);this.setState({ fileValue: e.target.files });}} />
                         </Button>
                       ):(
                             <span><AttachFile></AttachFile>
                             <span className="small text-blue">{this.state.fileValue[0].name}</span></span>
                           )*/}

               <Button variant="contained" color="default" className={'oveflow-hidden '+(this.state.fileValue?'hide':'fff')}>
                请选择文件
              <CloudUploadIcon className={classes.rightIcon} />
              <input type="file"
                     className="invisible"
                     accept = ".xlsx,.xls"
                     onChange={(e)=>{e.persist();console.log(e.target);this.setState({ fileValue: e.target.files });}}
              />
              </Button>

              <div className = {'pointer '+(this.state.fileValue?'fff':'hide')} onClick = {()=>document.querySelectorAll('input[type="file"]')[0].click()}>
                <span><AttachFile></AttachFile>
                <span className="small text-blue">{this.state.fileValue?this.state.fileValue[0].name:''}</span></span>
              </div>


          </Grid>
          <Grid item xs={8}>
           <span className=""><small> 请选择一个excel文件上传,
          文件列名依次为:计划完成日期、 预计上线日期、订单编号、货号、货物名称、备注、生产数量、模板编号，是否加急，是否新品。<a className="text-blue" href={config.templete.indentUrl} download="订单模板">点击由此下载模板</a>。</small></span>
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
    var {dateRange, typeQuery, sitQuery} = this.state;
    return (
     <div>
        <Toolbar >
          <div className={classes.title}>
              <Typography variant="h6" id="tableTitle" align="left">
                订单操作
              </Typography>
          </div>
          <div className={classes.spacer} />{this.addTemplateModal()}
        </Toolbar>
        <Grid container  style={{margin:'1rem 0 0',padding: '0 1.2rem'}}>

          <Grid item xs={6} align="left">
            <Grid item xs={12} className="filterTool small">
                  <span className="blod">时间</span>
                  {dateRange.map((date,index)=>(<span key = {index} className={"btn-sm "+(index==0?'bg-primary':'')} onClick={(e)=>this.props.queryIndentByDate(e, date)}> {date.text}</span>))}
            </Grid>
            <Grid item xs={12} align="left" className="filterTool small" style = {{margin: '1rem 0'}}>
                <span className="blod">类型</span>
                {typeQuery.map((data,index)=>(<span key = {index} className={"btn-sm "+(index==0?'bg-primary':'')} onClick={(e)=>this.props.queryIndentByType(e, data, index)}> {data.text}</span>))}
            </Grid>
            <Grid item xs={12} align="left" className="filterTool small" style = {{margin: '1rem 0'}}>
                <span className="blod">状态</span>
                {sitQuery.map((data,index)=>(<span key = {index} className={"type-sit btn-sm "+(data.code==this.props.status?'bg-primary':'')} onClick={(e)=>this.props.queryIndentBySit(e, data, index)}> {data.text}</span>))}
            </Grid>
          </Grid>

          <Grid item align="right" xs={6}>
            <span className="btn text-blue" onClick={this.addTemplate}>导入订单</span>
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
  tableAllCon: {
    position: "relative",
  },
  tableCon: {
    overflowX: 'auto',
    overflowY: 'hidden'
  },
  tableWrapper: {
    height:"60vh",overflow:"auto",width: "fit-content"
  },
  markTd: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  tipsbgColor: {
    backgroundColor: green[600]
  },
  icon: {
    fontSize: 16
  },
  smallicon: {
    marginBottom: -5
  }
});


class HandleIndent extends React.Component {
  state = {
    order: 'asc',
    status: 1,
    orderBy: 'calories',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: config.indentPageNum || 13,
    open: false,
    confirmOpen: false,
    title: "确认",
    selectedData: {},
    actualFinish: new Date().format('yyyy-MM-dd')
  };

  componentWillMount() {
    // 组件初次加载数据申请
    // console.log(this.props);
    this.initLoadData();
  }

  componentDidMount(){
  }

  initLoadData = () => {
    var status = this.state.status;
    fetch(config.server.listAllIndentByDate+`?status=${status}&from=${0}&limit=${config.indentPageNum}`).then(res=>res.json()).then(data=>{
      // console.log(data);
      if(data.code!=200){
        this.tips(data.msg);return;
      }
      this.setState({ data: data.results, total: data.total });
      this.hideInner(true);
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试');});
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

  hideInner (hide) {
    this.setState({loading: hide});
  }

  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
  };

  handleChangePage = (event, pageChange) => {
    console.log('pageChange== ', pageChange);
    let { data, page, queryStart, queryEnd, status, priority, ifNew } = this.state;
       let fromId = pageChange*config.indentPageNum;
       let baseData = {
          from: fromId,
          limit:config.indentPageNum,
          startDate:queryStart,
          endDate:queryEnd,
          status:status,
          priority:priority,
          ifNew:ifNew
       };
       this.hideInner();
       fetch(this.getUrlFormat(config.server.listAllIndentStatusByDate, baseData)).then(res=>res.json()).then(data=>{
         if(data.code !== 200){
           this.tips(data.msg);return;
         }
         this.setState({total: data.total, page: pageChange});
         this.changeIndentData(data.results || []);
       }).catch(e=>this.tips('网络出错了，请稍候再试'));
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

    if(!planNum && planNum==0){
        this.tips('计划生产数量不能为空');return;
    }

    var ifNum = new RegExp(/^\d+$/).test(planNum);
    if(!ifNum){
        this.tips('计划生产数量不能为非数字');return;
    }

    window.loading(true);
    fetch(config.server.updateIndentInfo,{method:"POST",
      headers:{
          'Content-Type': 'application/json',
      },
      body:JSON.stringify({id: id, planNum: planNum,planFinishDate: planFinishDate,planOnline: planOnline,actualStart: actualStart,actualFinish: actualFinish,priority: priority,ifNew: ifNew,ifOutsource: ifOutsource,duty: duty,remark: remark})
    }).then(res=>res.json()).then(data=>{
      // console.log(data);
      if(data.code!=200){
          this.tips(data.msg);window.loading(false);return;
      }
      this.tips('订单信息更新成功');window.loading(false);

      if(!selectedDataBak.actualFinish){
        // selectedDataBak.actualFinish = new Date().format('yyyy.MM.dd');
      }

      for(var i in selectedDataBak){
        selectedDataBak[i] = selectedData[i];
      }

      this.changeIndentData('', 2);
      this.setState({open: false});
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试');window.loading(false);});
  }

  changeIndentData = (data, type) =>{
    this.setState({data: data});
    this.hideInner(true);

    return;
    // 默认替换，1为push，2为修改
    if(type==1){
      this.state.data.push(data);
      this.setState({data: this.state.data});
      // this.data = this.state.data;
      // this.showDataWithAnimationFrame();
    }else if(type==2){
      this.setState({data: this.state.data});
      // this.data = this.state.data;
      // this.showDataWithAnimationFrame();
      // this.state.data[this.state.editNum] = data;
    }else{
      this.setState({data: data});
      // this.data = data;
      // this.showDataWithAnimationFrame();
    }
    this.state.dataBak = this.state.data;
    this.hideInner(true);
  }

  showDataWithAnimationFrame = () => {
    // if(this.state.data.length < data.length){
    this.index = this.index || 0;
    let data = this.data;
    let index = this.index;
    console.log("msg", index, data.length);
    if(index < data.length - 1){
      // console.log("data===", data);
      let data_inner = data.slice(this.index, 500);
      let data_arr_in = this.state.data.concat(data_inner);
      this.setState({data: data_arr_in});
      console.log("data_inner===", data_arr_in);
      this.index += 500;
      window.requestAnimationFrame(this.showDataWithAnimationFrame);
    }else{
      this.index = 0;
      this.hideInner(true);
    }

  }

  // 删除订单确认框
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

    this.setState({confirmOpen: true,title: "确认",content: "确定删除订单<span class='text-blue'>"+data.erp+"</span>吗？",sureFun: nexFun});
  }

  // 关闭删除订单弹窗
  confirmClose=()=>{
    this.setState({confirmOpen: false, ifInfo: false});
  }


  queryByKeyword = (e) =>{
    e.persist();
    let value = e.target.value;
    if(!this.state.dataBak){
      this.state.dataBak = this.state.data;
    }

    if(!this.state.dataBak){
      this.state.dataBak = this.state.data;
    }
    fetch(config.server.listAllIndentByDate+`?keyword=${value}`).then(res=>res.json()).then(data=>{
      if(data.code !== 200){
        this.tips(data.msg);return;
      }
      this.setState({total: data.results.length, page: 0, data: data.results});
    }).catch(e=>this.tips('网络出错了，请稍候再试'));
  }

  // 根据日期筛选值
  queryIndentByDate=(e, data)=>{
    var { queryStart, queryEnd } = this.state;
    e.persist();
    // 切换显示高亮
    var doms = document.querySelectorAll('.filterTool .bg-primary');
    for(var i of doms){
      i.className = i.className.replace('bg-primary','');
    }
    e.target.className += ' bg-primary';

    queryEnd = new Date().format('yyyy-MM-dd');

    let index = data.value;
    if(index==0){
      queryStart = '';//所有
      queryEnd = '';
    }if(index==1){
      queryStart = new Date(new Date()-1000*60*60*24*7).format('yyyy-MM-dd');//一周
    }else if(index==2){
      queryStart = new Date(new Date()-1000*60*60*24*30).format('yyyy-MM-dd');//一月
    }else if(index==3){
      queryStart = new Date(new Date()-1000*60*60*24*90).format('yyyy-MM-dd');//三月
    }else if(index==4){
      queryStart = new Date(new Date()-1000*60*60*24*365).format('yyyy-MM-dd');//一年
    }else if(index==5){
      queryStart = new Date(new Date()-1000*60*60*24*3650).format('yyyy-MM-dd');//一年以前
      queryEnd = new Date(new Date()-1000*60*60*24*365).format('yyyy-MM-dd');
    }

    this.setState({queryStart, queryEnd}, this.queryDataWithPro);
    return;

    fetch(config.server.listAllIndentByDate+'?startDate='+queryStart+'&endDate='+queryEnd).then(res=>res.json()).then(data=>{
      if(data.code!=200){
        this.tips(data.msg);return;
      }
      this.setState({page:1}, ()=>this.changeIndentData(data.results || []));
      // this.tips('查询成功');
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});

  }

  // 根据类型筛选值
  queryIndentByType = (e, data, index) => {
    e.persist();
    // 切换显示高亮
    for(var i of e.target.parentElement.children){
      i.className = i.className.replace('bg-primary','');
    }
    e.target.className += ' bg-primary';

    if(!this.state.dataBak){
      this.state.dataBak = this.state.data;
    }

    if(data.code == 0){
      this.setState({priority: undefined, ifNew: undefined}, this.queryDataWithPro);
    }else if(data.code == 1){
      this.setState({priority: 1, ifNew: undefined},this.queryDataWithPro);
    }else if(data.code == 2){
      this.setState({priority: undefined, ifNew: 1}, this.queryDataWithPro);
    }

    // this.setState({data: this.state.data });
  }

  // 根据订单状态筛选值
  queryIndentBySit = (e, data, index) => {
    e.persist();
    // 切换显示高亮
    for(var i of e.target.parentElement.children){
      i.className = i.className.replace('bg-primary','');
    }
    e.target.className += ' bg-primary';

    if(!this.state.dataBak){
      this.state.dataBak = this.state.data;
    }
    if(data.code == 'all'){
      this.setState({status: undefined}, this.queryDataWithPro);
    }else{
      this.setState({status: data.code}, this.queryDataWithPro);
    }
  }

  getUrlFormat (url, data) {
      if(data){
          let params = Object.keys(data)
                  .filter(item => data[item]!== null && data[item]!== undefined)
                  .map(item=>`${item}=${data[item]}`)
                  .join("&");
          return `${url}?${params}`;
      }
      return url;
  }

  queryDataWithPro = () => {
    let { data, page, queryStart, queryEnd, status, priority, ifNew } = this.state;
    let baseData = {
        from:0,
        limit:config.indentPageNum,
        startDate:queryStart,
        endDate:queryEnd,
        status:status,
        priority:priority,
        ifNew:ifNew
    };
    this.hideInner();
    fetch(this.getUrlFormat(config.server.listAllIndentByDate, baseData)).then(res=>res.json()).then(data=>{
      if(data.code !== 200){
        this.tips(data.msg);return;
      }
      this.setState({page: 0, total: data.total});
      this.changeIndentData(data.results || []);
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});

  }

  // 设置开始订单
  startIndent = (data, index) => {

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
            this.tips(data1.msg);return;
        }
        this.tips('订单已开始');
        // this.state.data[index].status = 1;
        data.status = 1;
        // 新增数据
        this.changeIndentData('', 2);
        this.setState({open: false});
      }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});

    };

    this.setState({confirmOpen: true,title: "确认",content: "确定开始订单<span class='text-blue'>"+data.erp+"</span>吗？",sureFun: nexFun, ifInfo: true});
  }

  // 设置完成订单
  finishIndent = (data, index) => {
    // console.log(data);
    if(!data.actualFinish){
      this.tips('请先设置订单完成时间');return;
    }
    var nexFun = ()=>{
      // 设置订单为完成状态
      fetch(config.server.updateIndentInfo,{method:"POST",
        headers:{
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({id: data.id, status: 2,remark: data.remark})
      }).then(res=>res.json()).then(data1=>{
        // console.log(data);
        if(data1.code!=200){
            this.tips(data1.msg);return;
        }
        this.tips('订单已完成');
        // this.state.data[index].status = 1;
        data.status = 2;
        // 新增数据
        this.changeIndentData('', 2);
        this.setState({open: false});
      }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});

    };

    this.setState({confirmOpen: true,title: "确认",content: "确定修改订单<span class='text-blue'>"+data.erp+"</span>为完成状态吗？",sureFun: nexFun});
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

    var { erp, planNum, planFinishDate, planOnline, actualStart, actualFinish, status, priority, ifNew, remark, feedback} = this.state.selectedData;

    return (<Dialog
      aria-labelledby="customized-dialog-title"
      open={this.state.open} style={{marginTop:'-10rem'}}
    >
      <DialogTitle id="customized-dialog-title"  onClose={this.handleClose}>
        订单{erp?erp:false}信息更新
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
            <DateFormatInput  className="date-picker inline-block" name='date-input' value={ planOnline?new Date(planOnline):'' } onChange={(date)=>{selectedData.planOnline = date.format('yyyy-MM-dd');this.setState({ selectedData: selectedData })} } style={{marginbottom:'2rem'}} />
            <div className="date-clear btn inline-block">
              <CloseIcon onClick={()=>{selectedData.planOnline='';this.setState({selectedData:selectedData})} } />
            </div>
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">计划完成时间</FormLabel>
            <DateFormatInput  className="date-picker inline-block" name='date-input' value={ planFinishDate?new Date(planFinishDate):'' } onChange={(date)=>{selectedData.planFinishDate = date.format('yyyy-MM-dd');this.setState({ selectedData: selectedData })} } style={{marginbottom:'2rem'}} />
            <div className="date-clear btn inline-block">
              <CloseIcon onClick={()=>{selectedData.planFinishDate='';this.setState({selectedData:selectedData})}} />
            </div>
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">实际开始时间</FormLabel>
            <DateFormatInput
                className="date-picker inline-block"
                name='date-input'
                value={ actualStart?new Date(actualStart):'' }
                onChange={(date)=>{selectedData.actualStart = date.format('yyyy-MM-dd');this.setState({ selectedData: selectedData })} }
                style={{marginbottom:'2rem'}}
            />
            <div className="date-clear btn inline-block">
              <CloseIcon onClick={()=>{
                              selectedData.actualStart='';
                              this.setState({selectedData:selectedData})
                         }}
               />
            </div>
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">实际完成时间</FormLabel>
            <DateFormatInput  className="date-picker inline-block"
                name='date-input'
                value={ actualFinish?new Date(actualFinish):'' }
                onChange={(date)=>{selectedData.actualFinish = date.format('yyyy-MM-dd');this.setState({ selectedData: selectedData })} }
                style={{marginbottom:'2rem'}}
            />
            <div className="date-clear btn inline-block">
              <CloseIcon onClick={()=>{
                              selectedData.actualFinish='';
                              this.setState({selectedData:selectedData})}
                          }
                />
            </div>
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">是否加急</FormLabel>
            <RadioGroup aria-label="是否加急"
                        style={{flexDirection:"row"}}
                        name="priority"
                        value={(priority || 0)+''}
                        onChange={(e)=>{
                            e.persist();
                            selectedData.priority=(e.target.value=='0'?0:1);
                            this.setState({selectedData:selectedData})}
                        }
            >
               <FormControlLabel value="0" control={<Radio color="default" />} label="否" />
               <FormControlLabel value="1" control={<Radio color="default" />} label="是" />
            </RadioGroup>
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
              <FormLabel component="legend">是否新品</FormLabel>
              <RadioGroup aria-label="是否新品"
                      style={{flexDirection:"row"}}
                      name="ifNew" value={(ifNew|| 0)+'' }
                      onChange={(e)=>{
                          e.persist();
                          selectedData.ifNew=(e.target.value=='0'?0:1);
                          this.setState({selectedData:selectedData})}
                      }
              >
                 <FormControlLabel value="0" control={<Radio color="default" />} label="否" />
                 <FormControlLabel value="1" control={<Radio color="default" />} label="是" />
              </RadioGroup>
          </Grid>

          <Grid item xs={12} style={{paddingTop:0}}>
            <FormLabel component="legend">备注</FormLabel>
            <TextField fullWidth style={{marginTop:0}}
              placeholder="请输入订单备注"
              className={classes.textField}
              value = {remark}
              onChange={(e)=>{
                  selectedData.remark=e.target.value;
                  this.setState({selectedData: selectedData})}
              }
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>

          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>

          </Grid>



          <Grid item xs={12} align="center">
            <Button variant="outlined"
                onClick={this.setIndentSure}
                style={{marginRight: 1+"rem"}}
                color="primary"
                className={classes.button}
            >
                保存
            </Button>
            <Button variant="outlined"
                 style={{marginRight: 1+"rem"}}
                 color="secondary"
                 className={classes.button}
            >
               重置
            </Button>
          </Grid>
          </Grid>

        </form>
    </Dialog>)
  }

  // 查看设备参与项目
  timeInProgram =(n)=>{
    this.setState({selectedData: n});
    // console.log(n);
    var { startDate, endDate } = this.state;

    fetch(config.server.queryEquipmentProgram+'?userID='+n.id+'&userName='+n.name+'&startDate='+startDate+'&endDate='+endDate).then(res=>res.json()).then(data=>{
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
        设备<span className="text-blue">{selectedData.name}</span>参与项目<small style={{paddingLeft: "1rem"}}>共计{showProgram?showProgram.length:''}</small>
      </DialogTitle>
      <div className={classes.container} noValidate autoComplete="off" style={{margin:".5rem 2rem 2rem",padding: "1rem"}}>
        <Grid container spacing={24}>

          <Grid item xs={12} style={{paddingTop:0}}>
            {/*<ul style={{paddingLeft: 0,marginTop:0,listStyle: "none"}}>
                          {!showProgram?'':showProgram.map((n,index)=>{
                            return <li className={classes.li}>
                                      <span className={classes.li_half1}>
                                        <i style={{ paddingRight:".8rem",fontSize: "smaller" }}>{(index+1)+".  "}</i>
                                        <span className="text-primary" style={{paddingRight:".8rem"}} title="erp">{n.erp}</span>
                                        <span className="text-blue2" style={{paddingRight:"1.2rem"}} title="物料名称">{n.materialName}</span>
                                        <span style={{paddingLeft:".08rem"}} title="流程">{n.name}</span>
                                        <span style={{paddingLeft:".08rem"}} title="工时">{n.eq_hourtime}</span>
                                      </span>
                                      <span style={{paddingRight:"2rem"}} className={classes.li_half2+" text-blue text-right pointer"}></span>
                                    </li>
                          })}
                        </ul>*/}
              <table style={{paddingLeft: 0,marginTop:0,listStyle: "none"}}>
                <thead>
                 <tr className={classes.li} style={{fontSize:"18px"}}>
                     <th>序号</th>
                     <th>erp</th>
                     <th>物料名称</th>
                     <th>流程</th>
                     <th>工时</th>
                 </tr>
                </thead>
                <tbody>
                {!showProgram?'':showProgram.map((n,index)=>{
                  return <tr className={classes.li}>
                              <td><i style={{ paddingRight2:".8rem",fontSize: "smaller" }}>{(index+1)+".  "}</i></td>
                              <td><span className="text-primary" style={{paddingRight2:".8rem"}} title="erp">{n.erp}</span></td>
                              <td><span className="text-blue2 eq-time-name" title={"物料名称:"+n.materialName}>{n.materialName}</span></td>
                              <td><span title="流程">{n.name}</span></td>
                              <td><span title="工时">{ n.eq_hourtime?n.eq_hourtime.toFixed(3):0 }</span></td>
                          </tr>
                })}
                </tbody>
              </table>
          </Grid>

        </Grid>

        </div>
    </Dialog>)})


    return <ModalContent></ModalContent>;
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

    const { loading, status, filterFun, data, order, orderBy, total, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    return (
      <Paper className={classes.root} style={{padding:"0 2rem",width:"auto"}}>
        <EnhancedTableToolbar
          tips = {this.tips}
          initLoadData = { this.initLoadData }
          queryByKeyword = {this.queryByKeyword} queryIndentByDate = {this.queryIndentByDate}
          queryIndentByType = {this.queryIndentByType}
          queryIndentBySit = {this.queryIndentBySit}
          status={status}
        />
        {/*表头*/}
        <div class={classes.tableAllCon}>
          {!loading?(<div className = "backdrop div-inner" >
            <div className="relativeCenter text-blue" >
              <CircularProgress size = {50} />
            </div>
          </div>):''}
          <div className={classes.tableCon}>
            <Table className={classes.table+' nowrap indentTable'} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy} tips = {this.tips}
                rowCount={data.length}
              />
            </Table>
            <div className={classes.tableWrapper}>
              <Table className={classes.table+' nowrap indentTable'} aria-labelledby="tableTitle">
                {/*<EnhancedTableHead
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy} tips = {this.tips}
                                rowCount={data.length}
                              />*/}
                <TableBody>
                  {data.map((n, index) => {
                      const isSelected = this.isSelected(n.id);
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          aria-checked={isSelected}
                          tabIndex={-1}
                          key={index}
                          selected={isSelected} className = {n.priority?'bg-red':(n.ifNew?'bg-blue':'')}
                        >
                          <TableCell align="center">{ page * rowsPerPage+index+1 }</TableCell>
                          <TableCell align="center">{n.erp}</TableCell>
                          <TableCell align="center">{n.materialCode}</TableCell>
                          <TableCell align="center" className={classes.markTd} title={n.materialName}>{n.materialName}</TableCell>
                          <TableCell align="center">{n.planNum}</TableCell>
                          <TableCell align="center">{n.planFinishDate ? (new Date(n.planFinishDate).getDate()?new Date(n.planFinishDate).format('yyyy-MM-dd'):false):false}</TableCell>
                          <TableCell align="center">{n.planOnline ? (new Date(n.planOnline).getDate()?new Date(n.planOnline).format('yyyy-MM-dd'):false):false}</TableCell>
                          <TableCell align="center">{n.actualStart ? (new Date(n.actualStart).getDate()?new Date(n.actualStart).format('yyyy-MM-dd'):false):false}</TableCell>
                          <TableCell align="center">{n.actualFinish ? (new Date(n.actualFinish).getDate()?new Date(n.actualFinish).format('yyyy-MM-dd'):false):false}</TableCell>
                          <TableCell align="center" >{n.priority?"是":"否"}</TableCell>
                          <TableCell align="center">{n.ifNew?"是":"否"}</TableCell>
                          <TableCell align="center" className={classes.markTd} title={n.remark}>{n.remark}</TableCell>
                          <TableCell align="center">{n.feedback}</TableCell>
                          <TableCell align="center">{n.templateID}</TableCell>
                          <TableCell align="center" className = {n.status==2?"text-primary":(n.status==1?"text-blue":"")}>{n.status==2?"完成":(n.status==1?"进行中":"未开始")}</TableCell>
                          <TableCell align="center">
                            {n.status==1?<span className="pointer btn text-primary"   onClick={()=>this.finishIndent(n, page * rowsPerPage+index)}>设为完成</span>:''}
                            {n.status==0?<span className="pointer btn text-blue"   onClick={()=>this.startIndent(n, page * rowsPerPage+index)}>开始订单</span>:''}
                            <span className="pointer btn text-blue"   onClick={()=>this.updateIndent(n, page * rowsPerPage+index)}>修改</span>
                            <span className="pointer btn text-red" onClick={()=>this.deleteIndent(n, page * rowsPerPage+index)}>删除</span>
                          </TableCell>
                        </TableRow>
                      )
                    }) }


                  {/*{emptyRows > 0 && (
                                  <TableRow style={{ height: 49 * emptyRows }}>
                                    <TableCell colSpan={16} />
                                  </TableRow>)}*/}
                </TableBody>
              </Table>
            </div>
              {data.length?'': <div className="emptyShow" align="center" style={{display: 'block', padding:'2rem'}}>暂无数据 </div>}
          </div>
          <TablePagination
            className="TablePagination"
            rowsPerPageOptions={[1*config.page, 2*config.page, 3*config.page]}
            component="div"
            count={total}
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
        </div>
        {this.updateUserPowerModal()}
        {this.timeInProgramModal()}

        <Confirm open = {this.state.confirmOpen} title = {this.state.title} content={this.state.content} closeFun = {this.confirmClose} sureFun = {this.state.sureFun} ifInfo = {this.state.ifInfo} />

        <Snackbar style={{marginTop:'70px'}}
          anchorOrigin={{horizontal:"center",vertical:"top"}}
          open={this.state.tipsOpen}
          ContentProps={{
            'className': 'info text-left'
          }}
          action={[
                  <IconButton key="close" aria-label="close" color="inherit" onClick={()=>this.setState({tipsOpen: false})}>
                    <CloseIcon className={classes.icon} />
                  </IconButton>,
                ]}
          message={<span id="client-snackbar" className={classes.message}>
              <InfoIcon className={classes.smallicon} /> {this.state.tipInfo}
              </span>}
           />
      </Paper>
    );
  }
}

HandleIndent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HandleIndent);
