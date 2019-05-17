import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from '../serviceWorker';

import {BrowserRouter as Router, Match, Route, Switch } from 'react-router-dom';
// import AccountCircle from '@material-ui/icons/AccountCircle';

import MessageBar from './Messagebar';
import Menu from './Menu';
import Login from './Login';

import AddUser from './AddUser';
import QueryUser from './QueryUser';
import QueryUserAndPower from './QueryUserAndPower';

import HandleTemplate from './HandleTemplate';

import HandleIndent  from './HandleIndent';
// import {HandleIndent as AddIndent} from './HandleIndent';

import QueryIndent from './QueryIndent';
import ExportProduceIndent from './ExportProduceIndent';
import QueryIndentStatus from './QueryIndentStatus';


import QueryProduceIndent from './QueryProduceIndent';

import QueryFactor from './QueryFactor';
import QueryWorkTime from './QueryWorkTime';

import ProduceShowPage from './ProduceShowPage';

import DutyIndent from './DutyIndent';
import DutyIndentInfo from './DutyIndentInfo';
import Snackbar from '@material-ui/core/Snackbar';

import config from './config';

var AddIndent = HandleIndent;


class ContentContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          user:{}
        }
    }

    componentWillMount() {
        var userID = config.changeToJson(localStorage.user).userID;
        var pwd = config.changeToJson(localStorage.user).pwd;

        if(!userID){
          this.props.history.push('/login');
        }else{
          // this.props.history.push('/user');
          fetch(config.server.login,{method:"POST",
              headers:{
                'Content-Type': 'application/json',
              },
              body:JSON.stringify({userID: userID, pwd: pwd})
          }).then(res=>res.json()).then(data=>{
            if(data.code!=200){
              this.tips(data.msg);
              return;
            }
            this.tips("登陆成功");
            setTimeout(()=>{
              this.changeLoginData({name: data.results.userName,  messages: data.results.messages});
            }, 1000);
          }).catch(e=>this.tips('网络出错了，请稍候再试'));

        }
        // this.setState({user:{name: localStorage.userName,  messageLength: localStorage.messageLength }})
    }

    changeLoginData = (user)=>{
      console.log(user);
      this.setState({user: user});
      this.refs.messageBar.updateBarData(user.messages);
    }

    tips = (msg) => {
      if(msg){
        this.setState({tipInfo:msg});
      }
      this.setState({tipsOpen: true});

      setTimeout(()=>{
        this.setState({tipsOpen: false});
      },1000);
    }

    render() {
        var props = this.props;
        window.ReactHistory = this.props.history;

        return (
          <div>
        <Route path="/"  >
          <MessageBar  user = {this.state.user} ref = "messageBar" changeLoginData = {(data)=>this.changeLoginData(data)} />
        </Route>
        <div className="page-container">
            {!this.state.user.name?(
              <Route path="/"  >
                <Login  changeLoginData = {(data)=>this.changeLoginData(data)} />
              </Route>):
              (<Route path="/" >
                <div id = "leftMenu">
                  <Route path="/"  component={Menu} />
                </div>
                <div id = "rightContent">
                  <Switch>
                      <Route path="/user" exact component={QueryUser} />
                      <Route path="/user/addUser" component={AddUser} />
                      <Route path="/user/queryUser" component={QueryUser} />
                      <Route path="/user/queryUserAndPower" component={QueryUserAndPower} />

                      <Route path="/templete/" component={HandleTemplate} />
                      <Route path="/templete/handleTemplate" component={HandleTemplate} />

                      <Route path="/handleIndent" exact component={AddIndent} />
                      <Route path="/handleIndent/addIndent" exact component={AddIndent} />
                      <Route path="/handleIndent/queryIndent" component={QueryIndent} />
                      <Route path="/handleIndent/queryIndentStatus" component={QueryIndentStatus} />

                      <Route path="/handleIndent/exportProduceIndent" component={ExportProduceIndent} />



                      <Route path="/workTime/queryFactor" component={QueryFactor} />
                      <Route path="/workTime/queryWorkTime" component={QueryWorkTime} />

                      <Route path="/produceIndent/queryProduceIndent" component={QueryProduceIndent} />
                      <Route path="/produceIndent/exportProduceIndent" component={ExportProduceIndent} />

                      <Route path="/produceShowPage" component={ProduceShowPage} />

                      <Route path="/dutyIndent" exact component={DutyIndent} />
                      <Route path="/dutyIndent/info" component={DutyIndentInfo} />
                      <Route path="/dutyIndent/info:id" component={DutyIndentInfo} />


                      <Route path="/"  component={QueryUser} />

                  </Switch>
                </div>
              </Route>)}
          </div>
          <Snackbar style={{marginTop:'70px'}}
          anchorOrigin={{horizontal:"center",vertical:"top"}}
          open={this.state.tipsOpen}
          ContentProps={{
            'className':'info'
          }}
          message={<span id="message-id" >{this.state.tipInfo}</span>}  />
          </div>
        )
    }
}

export default ContentContainer;



{/*serviceWorker.unregister();*/}
