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
import QueryWorkTimeForProcedure from './QueryWorkTimeForProcedure';
import QueryWorkTimeForUser from './QueryWorkTimeForUser';


import ProduceShowPage from './ProduceShowPage';

import DutyIndent from './DutyIndent';
import DutyIndentInfo from './DutyIndentInfo';

import recycleTemplate from './RecycleTemplate';
import recycleIndent from './RecycleIndent';

import Confirm  from './Confirm';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';

import WorkCalendar from './Calendar';
import NotFound from './NotFound';

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
      setTimeout(this.judgeCalendar, 4000);
      this.autoLoginTime = 0;
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
          this.autoLoginTime++;
          // 出错过后重新登陆
          if(this.autoLoginTime<=5){
            this.state.autoLoginTimer = setTimeout(this.judgeUser, 10000);
          }
        });
      }
    }

    judgeCalendar = () => {
      // 根据距离下月所剩时间， 提示主任设置工作日历
      // var today = new Date().format('yyyy-MM-dd');
      if(this.state.user.type!=1){
        return;
      }
      var today = new Date('2019-5-26');
      var after = new Date(new Date('2019-5-26').getTime()+1000*60*60*24*7);

      if(after < today){
        // this.tips();
        // this.setState()
        var nextFun = () => {
          window.ReactHistory.push('/calendar');
        }
        this.confirm('提示', '距离'+after.format('yyyy-MM')+'月不到一星期了，是否立即设置工作日历？', true, nextFun );
      }
    }

    confirm = (title, content, show, nextFun) => {
      this.setState({confirmOpen: show, confirmTitle:title, confirmContent:content, sureFun: nextFun});
    }

    closeFun = () => {
      this.setState({confirmOpen: false});
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
              <MessageBar  ref="messageBar" user={user} changeLoginData = {(data)=>this.changeLoginData(data)} tips={this.tips} />
            </Route>
            <div className="page-container">
              {!this.state.user.userName?(
                <Route path="/"  >
                  <Login changeLoginData = {(data)=>this.changeLoginData(data)}  loading={this.loading} tips={this.tips} />
                </Route>):
                (<Route path="/" >
                  <div id = "leftMenu">
                    <Menu menuConfig = {user}  />
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
                        <Route path="/workTime/queryWorkTimeForProcedure" component={QueryWorkTimeForProcedure} />
                        <Route path="/workTime/queryWorkTimeForUser" component={QueryWorkTimeForUser} />

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

                        <Route path="/"  ><NotFound  /></Route>

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

            <Confirm open = {this.state.confirmOpen} ifAutoClose ={()=>{}} title = {this.state.confirmTitle} content={this.state.confirmContent}  closeFun = {this.closeFun} sureFun = {this.state.sureFun} ifInfo={true}/>

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
