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
import Chip from '@material-ui/core/Chip';

import Confirm from '../main/Confirm';
import config from '../config';

let counter = 0;
function createData( name, content, duty) {
  counter += 1;
  return { id: counter, name, content, duty };
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
  { id: 'name', numeric: false, disablePadding: true, label: '设备名称' },
  { id: 'calories', numeric: false, disablePadding: false, label: '备注' },
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
    dutyModal: false,
    workers: [],
    tDuty: ''
  }

  tips = this.props.tips;

  handleClose = () => {
    this.setState({ open: false, dutyModal: false });
  }

  addEquipment = (type) => {
    if(type==0){
      this.setState({ open: true, serverURL: config.server.addEquipment, ifAdd: 1 });
      this.setState({tID:'', tName: '', remark: '', tDuty: ''});
    }else if(type==1){
      this.setState({ open: true, serverURL: config.server.updateEquipment,ifAdd: 0 });
    }
  }

  //添加设备/更新设备时的判断
  addEquipmentSure=()=>{
      // console.log(this.state);
      var { tID, tName, remark, ifAdd, selectedData } = this.state;
      /*if(!tID){
          this.tips('请先填写设备编号');return;
      }*/

      if(!tName){
          this.tips('请先填写设备名称');return;
      }

      window.loading(true);
      fetch(this.state.serverURL,{method:"POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({id: tID, name: tName, remark: remark})
      }).then(res=>res.json()).then(data=>{
        if(data.code!=200){
          this.tips(data.msg);window.loading(false);return;
        }
        // 新增数据
        if(ifAdd){
          // this.props.changeTemplateData(data.results, 1);
          // 重新请求数据
          this.props.initQueryData();
        }else{
          if(this.state.selectedData){
            this.state.selectedData.name = tName;
            this.state.selectedData.remark = remark;
          }
          this.props.changeTemplateData('', 2);   //修改
        }
        this.setState({open: false});window.loading(false);
    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试');window.loading(false);});
  }

  // 更新设备
  updateTemplateModal = (type, data) =>{
    this.setState({tID: data.id, tName: data.name, remark: data.remark});
    this.setState({selectedData: data, selectedDataCopy: JSON.parse(JSON.stringify(data))});
    // console.log(data);
    this.addEquipment(type);
  }


   /* var {tDuty, workers} = this.state;
    var index = tDuty.split(' ').indexOf(duty.name);
    // console.log(index);
    if(index!=-1){
      // tDuty.splice(index,1);
      tDuty = tDuty.replace(' '+duty.name, '').replace(duty.name, '');
    }else{
      // tDuty.push(duty.name);
      tDuty += (" "+duty.name);
    }
    this.setState({tDuty: tDuty});*/
    // console.log(this.state.tDuty);


  // 添加设备弹窗
  addEquipmentModal = ()=>{
    var classes = '';

    const { workers, tDuty,selectedDataCopy, ifAdd } = this.state;
    const styleCon = {
       height: '10rem',
       overflowY : 'auto',
       padding: '.5rem 0'
    };
    const styleChip = {
      margin:'3px 5px'
    };

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


    return (<div>
        <Dialog
      aria-labelledby="customized-dialog-title"
      open={this.state.open} style={{marginTop:'-15rem'}}
    >
      <DialogTitle id="customized-dialog-title"  onClose={this.handleClose}>
        {ifAdd?'添加设备':'编辑设备'}
      </DialogTitle>
      <form className={classes.container} noValidate autoComplete="off" style={{padding:"2rem 6rem 3rem"}}>
          <Grid container >
          {/*{ifAdd?(
            <Grid item xs={12} style={{paddingTop:'.5rem'}}>
                          <TextField fullWidth style={{marginTop:0}}
                            placeholder="请输入设备编号"
                            label="设备编号"
                            disabled = {ifAdd?false:true}
                            className={classes.textField}
                            value = {this.state.tID}
                            onChange={(e)=>this.setState({tID:e.target.value})}
                            margin="normal"
                            InputLabelProps={{
                              shrink: true,
                            }}
                          />
                          </Grid>):''}*/}

          <Grid item xs={12} style={{paddingTop:'.5rem'}}>
          <TextField fullWidth style={{marginTop:0}}
            placeholder="请输入设备名称"
            label="设备名称"
            className={classes.textField}
            value = {this.state.tName}
            onChange={(e)=>this.setState({tName:e.target.value})}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          </Grid>

          <Grid item xs={12} style={{paddingTop:'.5rem'}}>
          <TextField fullWidth style={{marginTop:0}}
            placeholder="请输入备注信息(可选)"
            label="设备备注"
            className={classes.textField}
            value = {this.state.remark}
            onChange={(e)=>this.setState({remark:e.target.value})}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          </Grid>

          <Grid item xs={12} align="center" style={{marginTop:'1rem'}}>
            <Button variant="outlined" onClick={this.addEquipmentSure} style={{marginRight: 1+"rem"}} color="primary" className={classes.button}>
            提交</Button>
            <Button variant="outlined" style={{marginRight: 1+"rem"}} color="secondary" className={classes.button}>重置</Button>
          </Grid>
          </Grid>

        </form>
    </Dialog>
    </div>)
  }


  render(){
    var classes = '';
    return (
      <div>
        <Toolbar >
              <Typography variant="h6" id="tableTitle" align="left">
                设备管理
              </Typography>
        </Toolbar>
          <Grid container>
                <Grid xs = {12} item align="right">
                  <span className="btn text-blue"  onClick={()=>this.addEquipment(0)} style={{display: 'inline-block', margin: "1rem 12rem 2rem"}}>添加设备</span>
                </Grid>
              </Grid>
          <div className={classes.spacer} />{this.addEquipmentModal()}
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




class HandleEquipment extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: config.pageChangeNum || 13,
    open: true,
    confirmOpen: false,
    title: "确认",
    content: "确定删除该设备吗？"
  };

  componentWillMount() {
    // 组件初次加载数据申请
    this.initQueryData();
  }

  initQueryData = () => {
    fetch(config.server.listAllEquipment).then(res=>res.json()).then(data=>{
      // console.log(data);
      if(data.code!=200){
        this.tips(data.msg);return;
      }
      this.changeTemplateData(data.results || []);
    }).catch(e=>this.tips('网络出错了，请稍候再试'));
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

  // 更新设备弹窗
  updateTemplate = (data, index)=>{
    this.refs.modalMethod.updateTemplateModal(1, data);
    this.setState({editNum: index});
  }

  // 删除设备弹窗
  deleteTemplate=(data, index)=>{
    this.setState({confirmOpen: true});
    var nexFun = ()=>{
      fetch(config.server.deleteEquipment,{method:"POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({id: data.id})
      }).then(res=>res.json()).then(data=>{
        if(data.code!=200){
            this.tips(data.msg);return;
        }
        console.log(this.state.data, index);
        this.state.data.splice(index, 1);
        this.setState({data: this.state.data});
        this.tips('删除设备成功');
      }).catch(e=>this.tips('网络出错了，请稍候再试'));

    };

    this.setState({confirmOpen: true,title: "确认",content: "确定删除该设备吗？",deleteFun: nexFun});
  }


  // 关闭删除设备弹窗
  confirmClose=()=>{
    this.setState({confirmOpen: false});
  }

  confirmSure = ()=>{
    if(this.state.deleteFun){
      this.state.deleteFun();
    }
  }

  changeTemplateData = (data, type) =>{
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
        <EnhancedTableToolbar changeTemplateData = {this.changeTemplateData} ref="modalMethod" initQueryData={this.initQueryData} tips={this.tips} />
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
                      <TableCell align="center">{page * rowsPerPage+(index+1)}</TableCell>
                      <TableCell align="center">{n.name}</TableCell>
                      <TableCell align="center" component="th" scope="row" padding="none">
                        {n.remark}
                      </TableCell>
                      <TableCell align="center">
                        <span className="pointer btn text-blue" onClick={()=>this.updateTemplate(n, page * rowsPerPage+index)}>修改</span>
                        <span className="pointer btn text-red" onClick={()=>this.deleteTemplate(n, page * rowsPerPage+index)}>删除</span>
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
         <Confirm open = {this.state.confirmOpen} title = {this.state.title} content={this.state.content} closeFun = {this.confirmClose} sureFun = {this.confirmSure} />
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

HandleEquipment.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HandleEquipment);
