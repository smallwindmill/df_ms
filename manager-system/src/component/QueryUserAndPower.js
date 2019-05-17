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
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import DeleteIcon from '@material-ui/icons/Delete';

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

import { lighten } from '@material-ui/core/styles/colorManipulator';
import CloseIcon from '@material-ui/icons/Close';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';

import Snackbar from '@material-ui/core/Snackbar';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import config from './config';

let counter = 0;
function createData(name, calories, fat, carbs, protein) {
  counter += 1;
  return { id: counter, name, calories, fat, carbs, protein};
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

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'name', numeric: false, disablePadding: true, label: '工号' },
  { id: 'calories', numeric: true, disablePadding: false, label: '用户姓名' },
  { id: 'fat', numeric: true, disablePadding: false, label: '登录权限' },
  { id: 'carbs', numeric: true, disablePadding: false, label: '操作订单和订单状态' },
  { id: 'protein', numeric: true, disablePadding: false, label: '操作订单工时费' },
  { id: 'protein2', numeric: true, disablePadding: false, label: '查询所有订单' },
  { id: 'protein3', numeric: true, disablePadding: false, label: '组长功能' },
  { id: 'protein4', numeric: true, disablePadding: false, label: '操作' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          {rows.map(
            row => (
              <TableCell
                key={row.userID}
                align={row.numeric ? 'right' : 'left'}
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
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
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

  tips = this.props.tips;

  queryByKeyword = (e) =>{
    e.persist();
    // this.setState({keyword:e.target.value});
    // 根据查询条件控制数据显示
    fetch(config.server.listAllUserPowerByName+'?keyword='+e.target.value).then(res=>res.json()).then(data=>{
      console.log(data);
      this.props.changeUserData(data.results || []);
    }).catch(e=>this.tips('网络出错了，请稍候再试'));

  }

  render(){
    return (
      <div>
          <Toolbar>
                <Typography variant="h6" id="tableTitle">
                  人员权限查询
                </Typography>
          </Toolbar>
          <Grid container spacing={24} align="right" style={{margin:'-1rem 0 1rem',padding: '0 1.2rem'}}>
          <Grid item xs={12}>
              <TextField style={{marginTop:0}}
              placeholder="请输入查询信息"
              type="text" autoComplete={false}
              autoComplete="current-password"
              margin="normal"
              onChange = {(e)=>this.queryByKeyword(e)}
              InputLabelProps={{
                shrink: true,
              }}></TextField>
          </Grid></Grid>
      </div>
  )};
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

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

class QueryUserAndPower extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    selectedData:{},
    data: [],
    page: 0,
    rowsPerPage: 10,
    open: false
  };

  componentWillMount() {
    // 组件初次加载数据申请
    fetch(config.server.listAllUserPower).then(res=>res.json()).then(data=>{
      console.log(data);
      this.changeUserData(data.results || []);
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


  handleClick = (event, id) => {
    return;
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

  changeUserData = (data, type) =>{
    // 默认替换
    console.log(data)
    if(type){
      this.setState({data: this.state.data});
    }else{
      this.setState({data: data});
    }
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  // 更新用户权限信息弹窗
  updateUserPower = (data, index) =>{
    this.setState({login: data.login||0,indent: data.handleIndent||0,workhour: data.handleWorkhour||0,allindent: data.listIndent||0,captain: data.captain||0});
    this.setState({open: true,selectedData: data});
  }

  // 更新用户权限
  setUserPowerSure=()=>{
    var { selectedData, login, indent, workhour, allindent, captain } = this.state;
    console.log(selectedData, login, indent, workhour, allindent, captain);

    fetch(config.server.setUserPower,{method:"POST",
      headers:{
        'Content-Type': 'application/json',
      },
      body:JSON.stringify({userID: selectedData.userID, login: login,handleIndent: indent,handleWorkhour: workhour,listIndent: allindent,captain: captain})
    }).then(res=>res.json()).then(data=>{
      console.log(data);
      // 新增数据
      this.changeUserData('', 2);
    }).catch(e=>this.tips('网络出错了，请稍候再试'));
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

  // 更新用户权限弹窗
  updateUserPowerModal = ()=>{
    var classes = '';
    var {selectedData} = this.state;
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

    var {login, indent, workhour,allindent,captain } = this.state;

    return (<Dialog
      aria-labelledby="customized-dialog-title"
      open={this.state.open} style={{marginTop:'-10rem'}}
    >
      <DialogTitle id="customized-dialog-title2"  onClose={this.handleClose}>
        用户权限配置{selectedData.userName ?('  '+selectedData.userName):false}
      </DialogTitle>
      <form className={classes.container} noValidate autoComplete="off" style={{padding:"2rem 6rem 3rem"}}>
        <Grid container spacing={24}>
          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">登录权限</FormLabel>
            <RadioGroup aria-label="登录权限" style={{flexDirection:"row"}} name="login" value={(login || 0)+'' } onChange={(e)=>{e.persist();this.setState({login: e.target.value=='0'?0:1})}}          >
               <FormControlLabel value="0" control={<Radio color="default" />} label="关闭" />
               <FormControlLabel value="1" control={<Radio color="default" />} label="打开" />
            </RadioGroup>
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">操作订单和订单状态</FormLabel>
            <RadioGroup aria-label="Gender" style={{flexDirection:"row"}} name="login" value={(indent || 0)+'' } onChange={(e)=>{e.persist();this.setState({indent: e.target.value=='0'?0:1})}}          >
               <FormControlLabel value="0" control={<Radio color="default" />} label="关闭" />
               <FormControlLabel value="1" control={<Radio color="default" />} label="打开" />
            </RadioGroup>
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">操作订单工时费</FormLabel>
            <RadioGroup aria-label="Gender" style={{flexDirection:"row"}} name="login" value={(workhour || 0)+'' } onChange={(e)=>{e.persist();this.setState({workhour: e.target.value=='0'?0:1})}}          >
               <FormControlLabel value="0" control={<Radio color="default" />} label="关闭" />
               <FormControlLabel value="1" control={<Radio color="default" />} label="打开" />
            </RadioGroup>
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">查询所有订单</FormLabel>
            <RadioGroup aria-label="Gender" name="login" style={{flexDirection:"row"}} value={(allindent || 0)+'' } onChange={(e)=>{e.persist();this.setState({allindent: e.target.value=='0'?0:1})}}
          >
               <FormControlLabel value="0" control={<Radio color="default" />} label="关闭" />
               <FormControlLabel value="1" control={<Radio color="default" />} label="打开" />
            </RadioGroup>
          </Grid>

          <Grid item xs={6} style={{paddingTop:0}}>
            <FormLabel component="legend">组长功能</FormLabel>
            <RadioGroup aria-label="Gender" name="login" style={{flexDirection:"row"}} value={(captain || 0)+'' } onChange={(e)=>{e.persist();this.setState({captain: e.target.value=='0'?0:1})}}
          >
               <FormControlLabel value="0" control={<Radio color="default" />} label="关闭" />
               <FormControlLabel value="1" control={<Radio color="default" />} label="打开" />
            </RadioGroup>
          </Grid>


          <Grid item xs={12} align="center">
            <Button variant="outlined" onClick={this.setUserPowerSure} style={{marginRight: 1+"rem"}} color="primary" className={classes.button}>保存</Button>
            <Button variant="outlined" style={{marginRight: 1+"rem"}} color="secondary" className={classes.button}>重置</Button>
          </Grid>
          </Grid>

        </form>
    </Dialog>)
  }

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root} style={{padding:"0 2rem",width:"auto"}}>
        <EnhancedTableToolbar  changeUserData = {this.changeUserData} tips={this.tips} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((n,index) => {
                  const isSelected = this.isSelected(n.userID);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.userID)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.userID}
                      selected={isSelected}
                    >
                      {/* <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>*/}
                      <TableCell component="th" scope="row" padding="none">
                        {n.userID}
                      </TableCell>
                      <TableCell align="right">{n.userName}</TableCell>
                      <TableCell align="right" className = {n.login?'text-blue':false}>{n.login?'有':'无'}</TableCell>
                      <TableCell align="right" className = {n.handleIndent?'text-blue':false}>{n.handleIndent?'有':'无'}</TableCell>
                      <TableCell align="right" className = {n.handleWorkhour?'text-blue':false}>{n.handleWorkhour?'有':'无'}</TableCell>
                      <TableCell align="right" className = {n.listIndent?'text-blue':false}>{n.listIndent?'有':'无'}</TableCell>
                      <TableCell align="right" className = {n.captain?'text-blue':false}>{n.captain?'有':'无'}</TableCell>
                      <TableCell align="right">
                      <span className={'pointer text-blue '+classes.button}  onClick={()=>this.updateUserPower(n, index)}>修改</span>
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
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />

        {this.updateUserPowerModal()}
        <Snackbar style={{marginTop:'70px'}}
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

QueryUserAndPower.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QueryUserAndPower);
