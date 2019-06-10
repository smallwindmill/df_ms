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

import Confirm from './Confirm';
import config from './config';

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
  { id: 'calories', numeric: false, disablePadding: false, label: '工号' },
  { id: 'name', numeric: false, disablePadding: true, label: '用户名' },
  { id: 'carbs', numeric: true, disablePadding: false, label: '密码' },
  { id: 'type', numeric: false, disablePadding: true, label: '用户类型' },
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
                align= 'center'
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
    userType: [
      {value:4,text:'生产员工'},
      {value:3,text:'组长'},
      {value:2,text:'领班'},
      {value:1,text:'主管'}
    ],
    userTypeArr: [
      {value:0,text:'全部'},
      {value:1,text:'主管'},
      {value:2,text:'领班'},
      {value:3,text:'组长'},
      {value:4,text:'生产员工'},
    ],
    selectUserType: 4
  }

  handleClose = () => {
    this.setState({ open: false });
  };

  addUser = (type) => {
    if(type==0){
      this.setState({ open: true, serverURL: config.server.addSystemUser,ifAdd:1 });
      this.setState({selectUserType: 4, userName: '', userID: '', pwd: ''});
    }else if(type==1){
      this.setState({ open: true, serverURL: config.server.updateSystemUser,ifAdd:0 });
    }
  };

  // 添加用户/更新用户时的判断
  addUserSure = () =>{

    var {selectUserType, userID, userName, pwd, ifAdd} = this.state;
    if(!userID){
      this.tips('用户工号不能为空');return;
    }
    if(userID.length!=4){
      this.tips('用户工号需要四位数');return;
    }
    if(!userName){
      this.tips('用户名称不能为空');return;
    }

    if(selectUserType!=4 && !pwd){
      this.tips('请设置用户密码');return;
    }

    // 新增(更新)用户上传数据
    fetch(this.state.serverURL,{method:"POST",
      headers:{
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({type:selectUserType, userID:userID, userName:userName, pwd: pwd})
    }).then(res=>res.json()).then(data=>{
      // 新增数据
      if(data.code!=200){
          this.tips(data.msg);return;
      }

      if(ifAdd && data.results){
        for(var i of data.results){
         this.props.changeUserData(i, 1);
        }
      }else{
        // 更新数据
        if(this.state.selectedData){
          this.state.selectedData.userName = userName;
          this.state.selectedData.userID = userID;
          this.state.selectedData.type = selectUserType;
          this.state.selectedData.pwd = pwd;
        }
        this.props.changeUserData('', 2);
      }
      this.setState({open: false});

    }).catch(e=>{console.log(e);this.tips('网络出错了，请稍候再试')});

  }


  queryByKeyword = (e) =>{
    e.persist();
    // 根据查询条件控制数据显示
      fetch(config.server.listSystemUserByName+'?keyword='+e.target.value).then(res=>res.json()).then(data=>{
        console.log(data);
        this.props.changeUserData(data.results || []);
      }).catch(e=>this.tips('网络出错了，请稍候再试'));
  }

  // 更新用户信息
  updateUserModal = (type, data) =>{
    this.setState({selectUserType: data.type||4, userName: data.userName, userID: data.userID, pwd: data.pwd});
    this.setState({selectedData: data});
    this.addUser(type);
  }


  tips = this.props.tips;

  // 添加用户弹窗
  addUserModal = ()=>{
    var classes = '';
    var {ifAdd} = this.state;

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


    return (<Dialog
      aria-labelledby="customized-dialog-title"
      open={this.state.open} style={{marginTop:'-10rem'}}
    >
      <DialogTitle id="customized-dialog-title"  onClose={this.handleClose}>
        {ifAdd?"添加用户":"更新用户信息"}
      </DialogTitle>
      <form className={classes.container} noValidate autoComplete="off" style={{padding:"2rem 6rem 3rem"}}>
        <Grid container spacing={24}>
          <Grid item xs={12} style={{paddingTop:0}}>
          <TextField fullWidth style={{marginTop:0}}
            label="请选择用户角色"
            select
            className={classes.textField}
            autoComplete="current-password"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            value = {this.state.selectUserType}
            onChange={(e)=>this.setState({selectUserType: e.target.value})}
            SelectProps={{
            native: true,
            MenuProps: {
              className: classes.menu,
            }}}
          >{this.state.userType.map(option => (
            <option key={'option'+option.value} value={option.value}>
              {option.text}
            </option>
          ))}</TextField>
          </Grid>

          <Grid item xs={12} style={{paddingTop:0}}>
          <TextField fullWidth style={{marginTop:0}}
            placeholder="请输入四位用户工号"
            label="用户工号"
            className={classes.textField}
            value = {this.state.userID}
            disabled = {this.state.ifAdd?false:true}
            onChange={(e)=>this.setState({userID: e.target.value})}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          </Grid>

          <Grid item xs={12} style={{paddingTop:0}}>
          <TextField fullWidth style={{marginTop:0}}
            placeholder="请输入用户姓名"
            label="用户姓名"
            value = {this.state.userName}
            onChange={(e)=>this.setState({userName: e.target.value})}
            className={classes.textField}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          </Grid>

          { this.state.selectUserType && this.state.selectUserType!=4 ? <Grid item xs={12} style={{paddingTop:0}}>
          <TextField fullWidth style={{marginTop:0}}
            placeholder="请输入密码"
            label="密码" type="password"
            className={classes.textField}
            value = {this.state.pwd }
            onChange={(e)=>this.setState({pwd: e.target.value})}
            autoComplete="current-password"
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          </Grid>:false}

          <Grid item xs={12} align="center">
            <Button variant="outlined" onClick={this.addUserSure} style={{marginRight: 1+"rem"}} color="primary" className={classes.button}>提交</Button>
            <Button variant="outlined" style={{marginRight: 1+"rem"}} color="secondary" className={classes.button}>重置</Button>
          </Grid>
          </Grid>

        </form>
    </Dialog>)
  }

  render(){
    var classes = '';
    var { userTypeArr } = this.state;
    return (
       <div>
          <Toolbar >
                <Typography variant="h6" id="tableTitle" align="left">
                  人员管理
                </Typography>
          </Toolbar>
          <Grid container align="right" style={{padding: '1rem 1.2rem'}}>
            <Grid item xs={6} align="left" className="filterTool small" style = {{margin: '1rem 0'}}>
                <span className="blod">类型</span>
                {userTypeArr.map((data,index)=>(<span key = {index} className={"btn "+(index==0?'text-blue':'')} onClick={(e)=>this.props.queryUserByType(e, data)}> {data.text}</span>))}
            </Grid>
            <Grid item xs={6}>
            <span className="btn text-blue" onClick={()=>this.addUser(0)} style={{margin:'0rem 0 4rem',padding: '0 1.2rem'}}>添加用户</span>
              <TextField style={{marginTop:0,marginLeft:'1rem'}}
              placeholder="请输入用户名称查询"
              className={classes.textField}
              type="text"
              onChange = {(e)=>this.queryByKeyword(e)}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}></TextField>
              </Grid>
          </Grid>

        {this.addUserModal()}
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




class QueryUser extends React.Component {
  state = {
    open: false,
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: config.pageChangeNum || 13,
    open: true,
    confirmOpen: false
  };


  componentWillMount() {
    // 组件初次加载数据申请
    fetch(config.server.listSystemUser).then(res=>res.json()).then(data=>{
      // console.log(data);
      // this.setState({pageUserType: config.changeToJson(localStorage.user).type});
      var pageUserType = config.changeToJson(localStorage.user).type;
      this.changeUserData(data.results.filter((n)=>{return pageUserType<=n.type}) || []);
    }).catch(e=>this.tips('网络出错了，请稍候再试'));
  }


  handleSelectAllClick = event => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.userID) }));
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


  // 更新用户弹窗
  updateUser=(data, index)=>{
    // 根据查询条件控制数据显示
    this.refs.modalMethod.updateUserModal(1, data);
    this.setState({editNum: index});
  }

  // 删除用户弹窗
  deleteUser=(data, index)=>{
    console.log(data);
    var nexFun = ()=>{

      fetch(config.server.deleteSystemUser,{method:"POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({userID: data.userID})
      }).then(res=>res.json()).then(data=>{
        if(data.code != 200){
          this.tips('删除人员失败');
          return;
        }
        this.state.data.splice(index, 1);
        this.setState({data: this.state.data});
        this.tips('删除人员成功');
      }).catch(e=>this.tips('网络出错了，请稍候再试'));

    };

    this.setState({confirmOpen: true,title: "确认",content: "确定删除用户<span class='text-blue'>"+data.userName+"</span>吗？",deleteFun: nexFun});
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

  queryUserByType = (e, data) => {
    e.persist();
    // 切换显示高亮
    for(var i of e.target.parentElement.children){
      i.className = i.className.replace('text-blue','');
    }
    e.target.className += ' text-blue';

    if(!this.state.dataBak){
      this.state.dataBak = this.state.data;
    }

    if(data.value == 0){
      this.state.data = this.state.dataBak;
    }else{
      this.state.data = this.state.dataBak.filter((item)=>{ return item.type==data.value;});
    }

    this.setState({data: this.state.data });
  }

  changeUserData = (data, type) =>{
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
    const { data, order, orderBy, selected, rowsPerPage, page, pageUserType } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root} style={{padding:"0 2rem",width:"auto"}}>
        <EnhancedTableToolbar changeUserData = {this.changeUserData} queryUserByType = {this.queryUserByType} ref="modalMethod" tips = {this.tips} />
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
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={'user'+index}
                    >
                      <TableCell align="center">{page * rowsPerPage+index+1}</TableCell>
                      <TableCell align="center">{n.userID}</TableCell>
                      <TableCell align="center" component="th" scope="row" padding="none">
                        {n.userName}
                      </TableCell>
                      <TableCell align="center" component="th" scope="row" padding="none" onMouseEnter = {(e)=>{if(n.type!=4)(e.target.innerHTML=n.pwd || '无') }}  onMouseOut = {(e)=>{if(n.type!=4) (e.target.innerHTML="******") }}>
                        {n.type!=4?'*******':'无'}
                      </TableCell>
                      <TableCell align="center" component="th" className = {n.type!=4?'text-blue':''} scope="row" padding="none">
                        {n.type==4?'生产员工':(n.type==3?'组长':n.type==2?'领班':n.type==1?'主管':'')}
                      </TableCell>
                      <TableCell align="center">
                        <span className="pointer btn text-blue" onClick={()=>this.updateUser(n, index)}>修改</span>
                        <span className="pointer btn text-red" onClick={()=>this.deleteUser(n, index)}>删除</span>
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
          <Confirm open = {this.state.confirmOpen} title = {this.state.title} content={this.state.content} closeFun = {this.confirmClose} sureFun={this.confirmSure} />
        </div>
        <TablePagination
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
          message={<span id="message-id" >{this.state.tipInfo?this.state.tipInfo:''}</span>}/>
      </Paper>
    );
  }
}

QueryUser.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QueryUser);
