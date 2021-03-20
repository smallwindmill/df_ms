// 总页面，配置路由
import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from '../serviceWorker';

import {BrowserRouter as Router, Match, Route, Switch } from 'react-router-dom';
// import AccountCircle from '@material-ui/icons/AccountCircle';


import MessageBar from './main/Messagebar';
import Menu from './main/Menu';
import Login from './Login';

import QueryUser from './page/QueryUser';
import QueryUserAndPower from './page/QueryUserAndPower';

import HandleTemplate from './page/HandleTemplate';
import HandleEquipment from './page/HandleEquipment';

import HandleIndent  from './page/HandleIndent';
// import {HandleIndent as AddIndent} from './HandleIndent';

import ExportProduceIndent from './page/ExportProduceIndent';
import QueryIndentStatus from './page/QueryIndentStatus';


import QueryProduceIndent from './page/QueryProduceIndent';

import QueryFactor from './page/QueryFactor';
import QueryWorkTime from './page/QueryWorkTime';
import QueryWorkTimeForProcedure from './page/QueryWorkTimeForProcedure';
import QueryWorkTimeForUser from './page/QueryWorkTimeForUser';
import QueryWorkTimeForEquipment from './page/QueryWorkTimeForEquipment';


import ProduceShowPage from './page/ProduceShowPage';

import DutyIndent from './page/DutyIndent';
import DutyIndentInfo from './page/DutyIndentInfo';

import recycleTemplate from './recycle/RecycleTemplate';
import recycleIndent from './recycle/RecycleIndent';

import Confirm  from './main/Confirm';

import WorkCalendar from './page/Calendar';
import NotFound from './page/NotFound';

import config from './config';

import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';


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
      this.autoLoginTime = 0;

      var bar = document.querySelectorAll('#processLoading')[0];
      setTimeout(()=>{
        document.querySelectorAll('#initLoading')[0].remove();
        bar.className = 'end';
      }, 1000)


      setTimeout(()=>{
        //bar.remove();
      }, 4000);

    }

    componentDidMount(){
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

        this.props.history.push('/produceMSF/login');this.loading(false);
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
            this.tips(data.msg);this.loading(false);
            return;
          }
          // this.tips("登陆成功");
          setTimeout(()=>{
            // localStorage.user = config.changeToStr(data.results);//不自动更新本地数据，避免修改信息后仍能正常访问
            this.changeLoginData(data.results);
            this.loading(false);
            setTimeout(()=>{this.judgeCalendar()}, 1500);
          }, 1000);
        }).catch(e=>{
          this.loading(false);
          this.tips('与服务器连接失败，登陆出错，请稍候再试');
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
      if(this.state.user.type == 3 || this.state.user.type == 4 ){
        return;
      }
      var today = new Date();
      // var after = new Date(new Date().getTime()+1000*60*60*24*7);
      var after = new Date(today.getFullYear()+'.'+(today.getMonth()+2));
      // console.log(after.getMonth(), today.getMonth());
      var base_time = (after-today)/(1000*60*60*24);
      // if(after.getMonth() > today.getMonth()){
      if( base_time < 7){
        var nextFun = () => {
          localStorage.judgeCal = 1;
          window.ReactHistory.push('/produceMSF/calendar');
        }

        base_time = base_time > 1?("不到"+Math.ceil(base_time)+"天"):("只有"+base_time*24+"小时")
        // console.log(today, after, after > today);
        this.confirm('提示', '距离'+after.format('yyyy-MM')+'月'+base_time+'了，是否立即设置工作日历？', true, nextFun, '已经设置了', '去设置' );
      }
    }

    confirm = (title, content, show, nextFun,cancelText, sureText) => {
      this.setState({confirmOpen: show, confirmTitle:title, confirmContent:content, sureFun: nextFun, cancelText:cancelText, sureText: sureText});
    }

    closeFun = () => {
      this.setState({confirmOpen: false});
    }

    changeLoginData = (user)=>{
      this.setState({user: user});
      this.refs.messageBar.updateBarData(user.userName);//初始消息不再由父组件更新
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
        var { user, loading, sureText, cancelText } = this.state;
        window.ReactHistory = this.props.history;


        return (
          <div>
            <Route path="/"  >
              <MessageBar  ref="messageBar" user={user} changeLoginData = {(data)=>this.changeLoginData(data)} tips={this.tips} />
            </Route>
            <div className="page-container">
              {!this.state.user.userName?(
                <Route path="/"  >
                  <Login changeLoginData = {(data)=>this.changeLoginData(data)} judgeCalendar = {this.judgeCalendar} loading={this.loading} tips={this.tips} />
                </Route>):
                (<Route path="/" >
                  <div id = "leftMenu">
                    <Menu menuConfig = {user}  />
                  </div>
                  <div id = "rightContent">
                    <Switch>
                        <Route path="/produceMSF/user" exact component={QueryUser} />
                        <Route path="/produceMSF/user/queryUser" component={QueryUser} />
                        <Route path="/produceMSF/user/queryUserAndPower" component={QueryUserAndPower}  />

                        <Route path="/produceMSF/template/" component={HandleTemplate} />
                        <Route path="/produceMSF/template/handleTemplate" component={HandleTemplate} />
                        <Route path="/produceMSF/equipment" component={HandleEquipment} />

                        <Route path="/produceMSF/handleIndent" exact component={AddIndent} />
                        <Route path="/produceMSF/handleIndent/addIndent" exact component={AddIndent} />
                        <Route path="/produceMSF/handleIndent/queryIndentStatus" component={QueryIndentStatus} />

                        <Route path="/produceMSF/handleIndent/exportProduceIndent" component={ExportProduceIndent} />



                        <Route path="/produceMSF/workTime" exact component={QueryFactor} />
                        <Route path="/produceMSF/workTime/queryFactor" component={QueryFactor} />
                        <Route path="/produceMSF/workTime/queryWorkTime" component={QueryWorkTime} />
                        <Route path="/produceMSF/workTime/queryProcedureWorkTime:type" component={QueryWorkTime} />
                        <Route path="/produceMSF/workTime/queryWorkTimeForProcedure" component={QueryWorkTimeForProcedure} />
                        <Route path="/produceMSF/workTime/queryWorkTimeForUser" component={QueryWorkTimeForUser} />
                        <Route path="/produceMSF/workTime/queryWorkTimeForEquipment" component={QueryWorkTimeForEquipment} />

                        <Route path="/produceMSF/produceIndent/queryProduceIndent" component={QueryProduceIndent} />
                        <Route path="/produceMSF/produceIndent/exportProduceIndent" component={ExportProduceIndent} />

                        <Route path="/produceMSF/produceShowPage" component={ProduceShowPage} />

                        <Route path="/produceMSF/dutyIndent" exact component={DutyIndent} />
                        <Route path="/produceMSF/dutyIndent/info" component={DutyIndentInfo} />
                        <Route path="/produceMSF/dutyIndent/info:id" component={DutyIndentInfo} />
                        <Route path="/produceMSF/indent/info:indent" component={DutyIndentInfo} />

                       {/* <Route path="/produceMSF/dutyIndent/info:id" component={DutyIndentInfo} />
                         <Route path="/produceMSF/dutyIndent/info:id" component={DutyIndentInfo} />*/}


                        <Route path="/produceMSF/recycle"  exact component={recycleTemplate} />
                        <Route path="/produceMSF/recycle/template"  component={recycleTemplate} />
                        <Route path="/produceMSF/recycle/indent"  component={recycleIndent} />

                        <Route path="/produceMSF/calendar"  ><WorkCalendar tips={this.tips} /></Route>

                        <Route path="/produceMSF/Way" exact ></Route>
                        <Route path="/produceMSF/"  component={NotFound} ></Route>

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

            <Confirm open = {this.state.confirmOpen} ifAutoClose ={()=>{}} title = {this.state.confirmTitle} content={this.state.confirmContent} sureText={sureText} cancelText={cancelText}  closeFun = {this.closeFun} sureFun = {this.state.sureFun} ifInfo={true}/>

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
