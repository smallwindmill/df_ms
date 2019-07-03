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

import { exportExcel } from 'xlsx-oc';


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
  { id: 'ff', numeric: true, disablePadding: false, label: '数量' },
  { id: 'calories', numeric: false, disablePadding: false, label: '生产流程' },
  { id: 'calories', numeric: false, disablePadding: false, label: '流程负责人' },
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
                align = 'center'
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
    dateRange:[{text: "全部"},{text: "最近一周"},{text: "最近一月"},{text: "最近三月"},{text: "最近一年"},{text: "一年以前"}],
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
    this.setState({ open: true });
  }

  submitFile = () =>{
      if(this.state.fileValue){
        console.log(this.state.fileValue);
      }else{
        this.tips('请选择文件后再上传');
      }
  }

  tips = this.props.tips;


  render(){
    var classes = '';
    var {dateRange, typeQuery, sitQuery} = this.state;
    return (
       <div className={classes.title}>
            <Toolbar >
              <Typography variant="h6" id="tableTitle" align="left">
                {this.state.chooseMonth?this.state.chooseMonth+'月':'所有'}订单状态
              </Typography>
        </Toolbar>
        <Grid container  style={{margin:'1rem 0 0',padding: '0 1.2rem'}}>
            <Grid item align="left" xs={6}>
              <Grid item xs={12} className="filterTool small">
                  <span className="blod">时间</span>
                  {dateRange.map((date,index)=>(<span key = {index} className={"btn-sm "+(index===0?'bg-primary':'')} onClick={(e)=>this.props.queryIndentStatusByDate(e, date, index)}> {date.text}</span>))}
              </Grid>
              <Grid item xs={12} className="filterTool small" style = {{margin: '1rem 0'}}>
                  <span className="blod">类型</span>
                  {typeQuery.map((data,index)=>(<span key = {index} className={"btn-sm "+(index===0?'bg-primary':'')} onClick={(e)=>this.props.queryIndentStatusByType(e, data, index)}> {data.text}</span>))}
              </Grid>
              <Grid item xs={12} align="left" className="filterTool small" style = {{margin: '1rem 0'}}>
                <span className="blod">状态</span>
                {sitQuery.map((data,index)=>(<span key = {index} className={"type-sit btn-sm "+(index==0?'bg-primary':'')} onClick={(e)=>this.props.queryIndentStatusBySit(e, data, index)}> {data.text}</span>))}
              </Grid>
            </Grid>

            <Grid item align="right" xs={6}>
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




class QueryIndentStatus extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: config.pageChangeNum || 13,
    open: true,
    deleteOpen: false,
    title: "确认",
    content: "确定删除该订单吗？"
  }



  componentWillMount() {
    // 组件初次加载数据申请

    var queryStart = new Date(new Date()-1000*60*60*24*7).format('yyyy-MM-dd');//一周
    var queryEnd = new Date().format('yyyy-MM-dd');
    // fetch(config.server.listAllIndentStatusByDate+'?startDate='+queryStart+'&endDate='+queryEnd).then(res=>res.json()).then(data=>{
    fetch(config.server.listAllIndentStatusByDate).then(res=>res.json()).then(data=>{
      if(data.code !== 200){
        this.tips(data.msg);return;
      }
      this.changeIndentStatusData(data.results || []);
    }).catch(e=>this.tips('网络出错了，请稍候再试'));

  }

  componentDidMount(){
    setTimeout(()=>{document.querySelectorAll('.filterTool .type-sit')[2].click();}, 100);//默认展示进行中订单
  }


  handleChangePage = (event, page) => {
    this.setState({ page });
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  // 删除用户弹窗
  deleteUser=()=>{
    this.setState({deleteOpen: true});
    this.dlExcel();
  }

  // 关闭删除用户弹窗
  deleteModalClose=()=>{
    this.setState({deleteOpen: false})
  }

  queryByKeyword = (e) =>{
    e.persist();

    if(!this.state.dataBak){
      this.state.dataBak = this.state.data;
    }
    this.state.data = this.state.dataBak.filter((item)=>{
      // return item.ifNew==1;
      return (item.erp.toUpperCase().indexOf(e.target.value.toUpperCase())!==-1 || item.materialCode.toUpperCase().indexOf(e.target.value.toUpperCase())!==-1 || item.materialName.toUpperCase().indexOf(e.target.value.toUpperCase())!==-1);
    });

    this.setState({data: this.state.data });

  }

  // 根据日期筛选值
  queryIndentStatusByDate=(e, data, index)=>{
    var { queryStart, queryEnd } = this.state;
    e.persist();
    // 切换显示高亮
    var doms = document.querySelectorAll('.filterTool .bg-primary');
    for(var i of doms){
      i.className = i.className.replace('bg-primary','');
    }
    e.target.className += ' bg-primary';

    queryEnd = new Date().format('yyyy-MM-dd');

    if(index==0){
      queryStart = '';//一周
      queryEnd = '';
    }else if(index==1){
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

    fetch(config.server.listAllIndentStatusByDate+'?startDate='+queryStart+'&endDate='+queryEnd).then(res=>res.json()).then(data=>{
      if(data.code!==200){
        this.tips(data.msg);return;
      }
      this.changeIndentStatusData(data.results || []);
      // this.tips('查询成功');
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});

  }

  // 根据类型筛选值
  queryIndentStatusByType = (e, data, index) => {
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
  queryIndentStatusBySit = (e, data, index) => {
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

  queryDataWithPro = () => {
    var { priority, ifNew, status } = this.state;
    if(status!=undefined && priority){
      this.state.data = this.state.dataBak.filter((item)=>{ return item.status==status && item.priority==priority});
    }else if(status!=undefined && ifNew){
      this.state.data = this.state.dataBak.filter((item)=>{ return item.status==status && item.ifNew==ifNew});
    }else if(priority){
      this.state.data = this.state.dataBak.filter((item)=>{ return item.priority==priority});
    }else if(ifNew){
      this.state.data = this.state.dataBak.filter((item)=>{ return item.ifNew==ifNew});
    }else if(status!=undefined){
      this.state.data = this.state.dataBak.filter((item)=>{ return item.status==status});
    }else{
      this.state.data = this.state.dataBak;
    }

    this.setState({data: this.state.data });

  }



  changeIndentStatusData = (data, type) =>{
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
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root} style={{padding:"0 2rem",width:"auto"}}>
        <EnhancedTableToolbar tips = {this.tips} queryByKeyword = {this.queryByKeyword} queryIndentStatusByDate = {this.queryIndentStatusByDate} queryIndentStatusByType = {this.queryIndentStatusByType} queryIndentStatusBySit = {this.queryIndentStatusBySit}/>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              rowCount={data.length}
            />
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n,index) => {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isSelected}  className = {n.priority?'bg-red2':(n.ifNew?'bg-blue2':'')}
                    >
                      <TableCell align="center">{page * rowsPerPage+(index+1)}</TableCell>
                      <TableCell align="center">{n.erp}</TableCell>
                      <TableCell align="center">{n.materialCode}</TableCell>
                      <TableCell align="center">{n.materialName}</TableCell>
                      <TableCell align="center">{n.planNum}</TableCell>
                      <TableCell align="center" component="th" scope="row" title="流程名称" padding="none">
                        {n.name}
                      </TableCell>
                      <TableCell align="center" component="th" scope="row" padding="none">
                        {n.duty}
                      </TableCell>
                      <TableCell align="center" component="th" scope="row" padding="none" className = {n.status?'text-blue':''}>
                        {n.status==2?"完成":(n.status==1?"进行中":"未开始")}
                      </TableCell>
                      <TableCell align="center">
                        {n.status !=0?<span className="pointer btn text-blue" onClick = {()=>this.props.history.push('/produceMSF/indent/info'+n.id)}>{n.status==2?'详情':'查看'}</span>:'——'}
                        {/*<span className="pointer btn text-blue">{1==1?'':'修改'}</span>
                        <span className="pointer btn text-red" onClick={this.deleteUser}>删除</span>*/}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={8} />
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

        <Snackbar style={{marginTop:'70px'}}
        anchorOrigin={{horizontal:"center",vertical:"top"}}
        open={this.state.tipsOpen}
        ContentProps={{
          'className':'info'
        }}
        message={<span id="message-id" >{this.state.tipInfo}</span>}  />
      </Paper>
    );
  }
}

QueryIndentStatus.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QueryIndentStatus);
