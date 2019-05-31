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

import recycleTemplate from './RecycleTemplate';
import recycleIndent from './RecycleIndent';

import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';

import WorkCalendar from './Calendar';

import config from './config';

var AddIndent = HandleIndent;


class ContentContainer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          user:{},
          loading: true
        }
    }

    componentWillMount() {
      this.judgeUser();
      window.loading = this.loading;
    }

    componentWillUnmount() {
      // 清楚自动重新登录定时器
      if(this.state.autoLoginTimer){
        clearTimeout(this.state.autoLoginTimer);
      }
    }

    // 自动登录
    judgeUser = () => {
      var userID = config.changeToJson(localStorage.user || '{}').userID;
      var pwd = config.changeToJson(localStorage.user || '{}').pass;

      if(!userID || !pwd){
        if(localStorage.user==undefined){
          this.tips('欢迎您，请登录系统', 5000);
        }else{
          this.tips('身份信息过期，请重新登录', 5000);
        }

        this.props.history.push('/login');this.loading(false);
      }else{
        this.loading(true);
        pwd = pwd.replace(/2a3/g, 1).replace(/\*%/,'' ).replace(/\%&/,'' );
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
          // this.tips("登陆成功");
          setTimeout(()=>{
            // localStorage.user = config.changeToStr(data.results);//不自动更新本地数据，避免修改信息后仍能正常访问
            this.changeLoginData(data.results);
            this.loading(false);
          }, 1000);
        }).catch(e=>{
          this.loading(false);
          this.tips('网络出错了，登陆失败，请稍候再试');
          // 出错过后重新登陆
          this.state.autoLoginTimer = setTimeout(this.judgeUser, 10000);
        });
      }
    }

    changeLoginData = (user)=>{
      this.setState({user: user});
      this.refs.messageBar.updateBarData(user.userName, user.messages);
    }



    loading = (show) => {
      this.setState({loading: show?true:false});
    }

    tips = (msg, time) => {
      if(msg){
        this.setState({tipInfo:msg});
      }
      this.setState({tipsOpen: true});

      setTimeout(()=>{
        this.setState({tipsOpen: false});
      },time || 4000);
    }

    render() {
        var props = this.props;
        var { user, loading } = this.state;
        window.ReactHistory = this.props.history;


        return (
          <div>
            <Route path="/"  >
              <MessageBar  ref="messageBar" changeLoginData = {(data)=>this.changeLoginData(data)} tips={this.tips} />
            </Route>
            <div className="page-container">
              {!this.state.user.userName?(
                <Route path="/"  >
                  <Login changeLoginData = {(data)=>this.changeLoginData(data)}  loading={this.loading} tips={this.tips} />
                </Route>):
                (<Route path="/" >
                  <div id = "leftMenu">
                    <Menu menuConfig = {user.power}  />
                  </div>
                  <div id = "rightContent">
                    <Switch>
                        <Route path="/user" exact component={QueryUser} />
                        <Route path="/user/addUser" component={AddUser} />
                        <Route path="/user/queryUser" component={QueryUser} />
                        <Route path="/user/queryUserAndPower" component={QueryUserAndPower}  />

                        <Route path="/templete/" component={HandleTemplate} />
                        <Route path="/templete/handleTemplate" component={HandleTemplate} />

                        <Route path="/handleIndent" exact component={AddIndent} />
                        <Route path="/handleIndent/addIndent" exact component={AddIndent} />
                        <Route path="/handleIndent/queryIndent" component={QueryIndent} />
                        <Route path="/handleIndent/queryIndentStatus" component={QueryIndentStatus} />

                        <Route path="/handleIndent/exportProduceIndent" component={ExportProduceIndent} />



                        <Route path="/workTime" exact component={QueryFactor} />
                        <Route path="/workTime/queryFactor" component={QueryFactor} />
                        <Route path="/workTime/queryWorkTime" component={QueryWorkTime} />
                        <Route path="/workTime/queryProcedureWorkTime:type" component={QueryWorkTime} />

                        <Route path="/produceIndent/queryProduceIndent" component={QueryProduceIndent} />
                        <Route path="/produceIndent/exportProduceIndent" component={ExportProduceIndent} />

                        <Route path="/produceShowPage" component={ProduceShowPage} />

                        <Route path="/dutyIndent" exact component={DutyIndent} />
                        <Route path="/dutyIndent/info" component={DutyIndentInfo} />
                        <Route path="/dutyIndent/info:id" component={DutyIndentInfo} />
                        <Route path="/indent/info:indent" component={DutyIndentInfo} />

                       {/* <Route path="/dutyIndent/info:id" component={DutyIndentInfo} />
                         <Route path="/dutyIndent/info:id" component={DutyIndentInfo} />*/}


                        <Route path="/recycle"  exact component={recycleTemplate} />
                        <Route path="/recycle/template"  component={recycleTemplate} />
                        <Route path="/recycle/indent"  component={recycleIndent} />

                        <Route path="/calendar"  ><WorkCalendar tips={this.tips} /></Route>

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

            {loading?(<div className = "backdrop" >
              <div className="absoluteCenter text-blue" >
                <CircularProgress size = {50} />
              </div>
            </div>):''}
          </div>
        )
    }
}

export default ContentContainer;
