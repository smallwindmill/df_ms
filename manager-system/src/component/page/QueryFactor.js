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


import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

import Confirm from '../main/Confirm';
import config from '../config';

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
  { id: 'calories', numeric: false, disablePadding: false, label: '年份' },
  { id: 'name', numeric: false, disablePadding: true, label: '月份' },
  { id: 'carbs', numeric: true, disablePadding: false, label: '权重' },
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
                align={row.numeric ? 'center' : 'center'}
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

class EnhancedTableToolbar extends React.Component{

  state = {
    open: false,
    selectedDataCopy:{

    }
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  addFactor = (type) => {
    if(type==0){
      this.setState({ open: true, serverURL: config.server.updateFactor,ifAdd: 1,selectedDataCopy:{} });
    }else if(type==1){
      this.setState({ open: true, serverURL: config.server.updateFactor,ifAdd: 0 });
    }
  };

  //添加权重/更新权重时的判断
  addFactorSure = () =>{
        var { selectedDataCopy, ifAdd } = this.state;
        var { id, year, month, factor } = selectedDataCopy;
        if(!year){
            this.tips('请先填写年份');return;
        }

        if(!month){
            this.tips('请先填写月份');return;
        }

        if(!factor){
            this.tips('请填写权重数值');return;
        }

        // fetch(this.state.serverURL,{method:"POST",
        fetch(config.server.updateFactor,{method:"POST",
          headers:{
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({id: id, year: year, month: month, factor: factor})
        }).then(res=>res.json()).then(data=>{
            if(data.code!=200){
              this.tips(data.msg);return;
            }
            // 新增数据
            console.log(ifAdd);
            if(ifAdd){
              this.props.changeFactorData(data, 1);
            }else{
              if(this.state.selectedData){
                this.state.selectedData.factor = this.state.selectedDataCopy.factor;
              }
              this.props.changeFactorData('', 2);   //修改
            }
            this.setState({ open: false});
      }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试');});


  }

  // 更新权重
  updateFactorModal = (type, data) =>{
    this.setState({tName: data.name, tProcedure: data.content, tDuty: data.duty});
    this.setState({selectedData: data, selectedDataCopy: JSON.parse(JSON.stringify(data))});
    // console.log(data);
    this.addFactor(type);
  }

  // 添加权数弹窗
  addFactorModal = ()=>{
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

    var { selectedDataCopy, ifAdd } = this.state;

    return (<Dialog
      aria-labelledby="customized-dialog-title"
      open={this.state.open} style={{marginTop:'-10rem'}}
    >
      <DialogTitle id="customized-dialog-title" onClose={this.handleClose} >
        {ifAdd?'添加':'编辑'}权数
      </DialogTitle>
      <form className={classes.container} noValidate autoComplete="off" style={{padding:"2rem 6rem 3rem"}}>
        <Grid container spacing={24}>
          <Grid item xs={12} style={{paddingTop:0}}>
          <TextField fullWidth style={{marginTop:0}}
            placeholder="请输入设置年份"
            label="年份"
            disabled = {this.state.ifAdd?false:true}
            className={classes.textField}
            value = {selectedDataCopy.year==undefined ? new Date().getFullYear():selectedDataCopy.year}
            onChange={(e)=>{e.persist();selectedDataCopy.year=e.target.value;this.setState({selectedDataCopy:selectedDataCopy})}}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          </Grid>

          <Grid item xs={12} style={{paddingTop:0}}>
          <TextField fullWidth style={{marginTop:0}}
            placeholder="请输入设置月份"
            label="月份"
            value = {selectedDataCopy.month==undefined?(new Date().getMonth()+1):selectedDataCopy.month}
            onChange={(e)=>{e.persist();selectedDataCopy.month=e.target.value;this.setState({selectedDataCopy:selectedDataCopy})}}
            disabled = {this.state.ifAdd?false:true}
            defaultValue=""
            className={classes.textField}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          </Grid>

          <Grid item xs={12} style={{paddingTop:0}}>
          <TextField fullWidth style={{marginTop:0}}
            placeholder="请设置修改后的权数"
            label="权重"
            className={classes.textField}
            value = {selectedDataCopy.factor }
            onChange={(e)=>{e.persist();selectedDataCopy.factor=e.target.value;this.setState({selectedDataCopy:selectedDataCopy})}}
            type="text"
            autoComplete="current-password"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          </Grid>


          <Grid item xs={12} align="center">
            <Button variant="outlined" style={{marginRight: 1+"rem"}} color="primary" onClick={this.addFactorSure} className={classes.button}>
            提交
            </Button>
            <Button variant="outlined" style={{marginRight: 1+"rem"}} color="secondary" className={classes.button}>
              重置
            </Button>
          </Grid>
          </Grid>

        </form>
    </Dialog>)
  }

  tips = this.props.tips;

  render(){
    var classes = '';
    return (
       <div>
          <Toolbar >
                <Typography variant="h6" id="tableTitle" align="left">
                  权数管理
                </Typography>
          </Toolbar>
          <Grid container align="right" style={{margin:'0rem 0 1rem',padding: '0 1.2rem'}}>
            <Grid item xs={12}>
              {/*<span className="btn text-blue"onClick={()=>this.addFactor(0)}>添加权数</span>*/}
            </Grid>
          </Grid>
          {this.addFactorModal()}

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




class QueryFactor
 extends React.Component {
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
    content: "确定删除该名用户吗？"
  }


  componentWillMount() {
    // 组件初次加载数据申请
    fetch(config.server.listAllFactor).then(res=>res.json()).then(data=>{
      // console.log(data);
      if(data.code!=200){
        this.tips(data.msg);return;
      }
      this.changeFactorData(data.results || []);
    }).catch(e=>this.tips('网络出错了，请稍候再试'));

  }


  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }));
      return;
    }
    this.setState({ selected: [] });
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

  // 更新权重弹窗
  updateFactor = (data, index)=>{
    this.refs.modalMethod.updateFactorModal(1, data);
    this.setState({editNum: index});
  }

  // 关闭删除用户弹窗
  deleteModalClose=()=>{
    this.setState({deleteOpen: false})
  }

  changeFactorData = (data, type) =>{
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
        <EnhancedTableToolbar ref="modalMethod" tips = {this.tips}  changeFactorData = {this.changeFactorData} />
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
                .map((n, index)=> {
                  const isSelected = this.isSelected(n.id);
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={'user'+n.id}
                      selected={isSelected}
                    >
                      <TableCell align="center">{page * rowsPerPage+index+1}</TableCell>
                      <TableCell align="center">{n.year}</TableCell>
                      <TableCell align="center" component="th" scope="row" padding="none">
                        {n.month}
                      </TableCell>
                      <TableCell align="center" component="th" scope="row" padding="none">
                        {n.factor}
                      </TableCell>
                      <TableCell align="center">
                        <span className="pointer btn text-blue" onClick={()=>this.updateFactor(n, page * rowsPerPage+index)}>修改</span>
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
          <Confirm open = {this.state.deleteOpen} title = {this.state.title} content={this.state.content} closeFun = {this.deleteModalClose} />
        </div>
        <TablePagination
          className="TablePagination"
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
          message={<span id="message-id" >{this.state.tipInfo}</span>}  />
      </Paper>
    );
  }
}

QueryFactor
.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QueryFactor
);
