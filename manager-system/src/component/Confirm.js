import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import HelpOutline from '@material-ui/icons/HelpOutline';
import Info from '@material-ui/icons/Info';

import Snackbar from '@material-ui/core/Snackbar';

class Confirm extends React.Component {
  constructor(props){
    super(props);
  }

  // 关闭方法由父组件传入
  render() {
    // console.log(this.props);
    const { open, title, content, closeFun, sureFun, cancelFun, ifAutoClose,ifInfo } = this.props;
    return (
      <div>
        <Dialog
          open={open}
          onClose={ifAutoClose?'':closeFun}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description" className = "myConfirm"
        >
          <DialogTitle id="alert-dialog-title">
            {ifInfo?<Info fontSize = "large"  color = "primary" style={{marginBottom:"-9px",marginRight:'3px'}}></Info>:<HelpOutline style={{marginBottom:"-9px",marginRight:'3px'}} fontSize = "large" color="error"></HelpOutline>}
            {title}</DialogTitle>
          <DialogContent style = {{minWidth: '300px'}}>
            <DialogContentText id="alert-dialog-description"  dangerouslySetInnerHTML={{__html: content}}>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeFun} color="primary">
              取消
            </Button>
            <Button onClick={()=>{closeFun();if(sureFun)sureFun()}} color="primary" autoFocus>
              确定
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Confirm;
