import React from 'react';
import ReactDOM from 'react-dom';

// import * as serviceWorker from '../serviceWorker';

import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

import withRouter from '@material-ui/core/Typography';

import Confirm  from './Confirm';


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


class MessageBar extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          open: false,
          mailMessage: [
            {content: "八九十枝花"},
            {content: "野火烧不尽"},
            {content: "日暮苍山远"},
            {content: "风雪夜归人"},
            {content: "为有暗香来"}
          ],
          logOut: false,
          title: "提示",
          content: "确定注销登录吗？"
        }
    }

     componentWillMount() {
        if(!localStorage.userName){
          // this.props.history.push('/login');
          // window.location.href='/login'
        }else{
          // console.log(this.props);
          // window.location.href='/user2'
          // this.props.history.push('/user');
        }
          // console.log(this.props);
    }


    updateBarData = (userName, messages) => {
      // console.log(data);
      this.setState({userName: userName ||[], mailMessage: messages || []});
    }


    componentWillUnmount(){
        // clearInterval(this.timerID);
    }

    mailClick=() => {
      this.setState({open: true});
    }


    handleClose = () => {
      this.setState({open: false});
    }

    logoutClick=()=>{
      this.setState({logOut: true});
      // this.setState({sureFun: this.logoutSureFun})
    }

    logoutSureFun = () =>{
       this.setState({logOut: false});
       this.props.changeLoginData('');
       // window.location.href='/login';
       window.ReactHistory.push('/login');
    }

    logoutClickClose=()=>{
      this.setState({logOut: false});
    }

    // 标记消息已读
    markMessage = (index) =>{
        this.state.mailMessage.splice(index,1);
        this.setState({mailMessage: this.state.mailMessage})
    }

    mailDialog(){
      return (<Dialog
        onClose={this.handleClose}
        aria-labelledby="customized-dialog-title"
        open={this.state.open} style={{marginTop:'-15rem'}}
      >
        <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
          未读消息
        </DialogTitle>
        <DialogContent style={{width: "500px",height: "140px",overflowY:"auto"}}>
          <ul style={{paddingRight:"2rem"}}>{this.state.mailMessage.map((mail, index)=>(
            <li style={{padding:".2rem 0"}} className="mail-message" key={'mailLi'+index}><span>{index+1}. </span>{mail.content+'这是一条特地加长的长长的测试消息'}<small>{new Date().format('yyyy-MM-dd')}</small><span className="text-red pointer" style={{marginLeft:'.5rem'}} onClick={()=>{this.markMessage(index)}}>已读 </span></li>))}</ul>
           { this.state.mailMessage.length==0?<ul><li className="mail-message text-blue">暂无消息</li></ul>:false}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            我知道了
          </Button>
        </DialogActions>
      </Dialog>     )
    }

    render() {
      // var props = this.props;
      var { userName,mailMessage } = this.state;
        return (
          <header className="App-header">
            <div id="logo">极趣科技生产管理系统</div>
            <div id="messagebar">
            {userName?(<div className={"btn "} >
                欢迎你，<span  className="text-blue" style={{paddingRight:1+"rem"}}>{userName}</span>
                {/*<span color="primary"onClick={this.loginClick}>登陆</span>*/}
                <span color="const" style={{display:(userName?'ff':'none')}} className={"btn text-red "} onClick={this.logoutClick}>注销</span>
                <IconButton color="inherit" style = {{marginTop: '-3px'}} onClick={this.mailClick}>
                  <Badge badgeContent={mailMessage.length} color="secondary">
                    <MailIcon />
                  </Badge>
                </IconButton>
              <IconButton color="inherit" style={{display:mailMessage.nnlength?'ff':'none'}}>
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              {this.mailDialog()}
            </div>):false}
              <Confirm open = {this.state.logOut} title = {this.state.title} content={this.state.content}   closeFun = {this.logoutClickClose} sureFun = {this.logoutSureFun}/>
            </div>
          </header>
        )
    }
}


export default MessageBar;


