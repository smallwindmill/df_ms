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
import config  from './config';


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
          mailMessage: [],
          logOut: false,
          title: "提示",
          content: "确定注销登录吗？"
        }
    }

    componentDidMount() {
      this.state.messageTimer = setInterval(this.queryMessageTimer, 10000);
      this.mailClick();
    }

    componentWillUnmount() {
      if(this.state.messageTimer){
        clearInterval(this.state.messageTimer);
      }
    }

    // 更新消息等数据
    updateBarData = (userName, messages) => {
      this.setState({userName: userName || '', mailMessage: messages || []});
    }

    queryMessageTimer = () => {
      var userID = config.changeToJson(localStorage.user || '{}').userID;

      if(!userID) return;
      fetch(config.server.queryMessage+'?userID='+userID).then(res=>res.json()).then(data=>{
        if(data.code!=200){
          return;
        }
        this.updateBarData(data.results.userName, data.results.message);
      }).catch(e=>{console.log(e);});
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
    markMessage = (data, index) =>{
      fetch(config.server.markMessageRead,{method:"POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({id: data.id})
      }).then(res=>res.json()).then(data=>{
        if(data.code!=200){
          this.props.tips(data.msg);return;
        }
        this.state.mailMessage.splice(index,1);
        this.setState({mailMessage: this.state.mailMessage});
      }).catch(e=>{console.log(e);this.props.tips('网络出错了，请稍候再试')});
    }

    mailDialog(){
      return (<Dialog
        onClose={this.handleClose}
        aria-labelledby="customized-dialog-title"
        open={this.state.open} style={{marginTop:'1rem'}} className = "mailDialog"
      >
        <DialogTitle id="customized-dialog-title" onClose={this.handleClose}>
          未读消息
        </DialogTitle>
        <DialogContent style={{width: "90vw",height: "90vh",overflowY:"auto"}}>
          <ul style={{paddingRight:"2rem"}}>
          {this.state.mailMessage.map((mail, index)=>(
            <li style={{padding:".2rem 0",position: 'relative'}} className="mail-message" key={'mailLi'+index}>
            <span>{index+1}. </span>{mail.content.split('//%//')[0]} {(mail.content.split('//%//')[1]?(<i className="small text-blue">{mail.content.split('//%//')[1]}</i>):'')} <small style={{paddingLeft: '1rem'}}>{mail.time?new Date(mail.time).format('yyyy-MM-dd hh:mm:ss'):''}</small>
            <span className="text-red pointer" style={{marginLeft:'1rem',textAlign: "right"}} onClick={()=>{this.markMessage(mail, index)}}>已读 </span>
           </li>))}</ul>
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
                <IconButton fontSize="large" color="inherit"style = {{marginTop: '-3px'}} onClick={this.mailClick}>
                  <Badge badgeContent={mailMessage.length} color="secondary">
                    <MailIcon  />
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


