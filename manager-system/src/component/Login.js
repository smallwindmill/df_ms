import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Snackbar from '@material-ui/core/Snackbar';

import config from './config';


const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  }
});

const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
];



class Login extends React.Component {

  constructor(props){
    super(props)
  }

  componentWillMount = () =>{
    // this.props.loading(true);
  }

  componentWillUnmount = () =>{

  }

  state = {
    age: '',
    multiline: 'Controlled',
    currency: 'EUR',
    tipsOpen: false
  }

  loginClick = () => {
    var { name, password } = this.state;
    if(!name){
      this.props.tips("请先填写用户工号");
      return;
    }

    if(!password){
      this.props.tips("请先填写用户密码");
      return;
    }

    this.props.loading(true);
    fetch(config.server.login,{method:"POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({userID: name, pwd: password})
    }).then(res=>res.json()).then(data=>{
      console.log(data);
      if(data.code!=200){
        this.props.tips(data.msg);this.props.loading(false);
        return;
      }

      setTimeout(()=>{
        this.props.changeLoginData(data.results);
        this.props.loading(false);

        delete data.results['power'];
        delete data.results['messages'];

        localStorage.user = config.changeToStr(data.results);//不自动更新本地数据，避免修改信息后仍能正常访问
          this.props.tips("登陆成功");
      }, 1000);
      window.ReactHistory.push('/user/queryUser');
    }).catch(e=>{this.props.loading(false);this.props.tips('网络出错了，请稍候再试')});



  }

  render() {
    const { classes } = this.props;
    const { tipsOpen } = this.state;
    return (<div>
      <form className={"absoluteCenter "+classes.container} noValidate autoComplete="off">
      <Grid container spacing={24}>
        <Grid item xs={12}>
        <TextField fullWidth
          label="用户工号"
          className={classes.textField}
          onChange={(e)=>{e.persist();this.setState({ name: e.target.value })}}
          margin="normal"
        />
        </Grid>


        <Grid item xs={12}>
        <TextField fullWidth
          label="密码"
          className={classes.textField}
          type="password"
          autoComplete="current-password"
          onChange={(e)=>{e.persist();this.setState({ password: e.target.value });}}
          margin="normal"
        />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained"  aria-label="Add" style={{marginRight: 1+"rem",borderRadius: "3px",overFlow:"hidden"}} color="primary" className={classes.button} onClick = {this.loginClick}>
          登录
          </Button>
        </Grid>
        </Grid>
      </form>

      <img className="loginBg" src = {'./bg.png'} />
      <img className="loginBgDir" src = {'./bg.png'} />
      <img className="loginBgCen" src = {'./bg.png'} />

    </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Login);
