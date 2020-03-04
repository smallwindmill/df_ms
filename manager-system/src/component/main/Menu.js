import React from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
// import InboxIcon from '@material-ui/icons/MoveToInbox';
// import DraftsIcon from '@material-ui/icons/Drafts';
// import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';


// import {BrowserRouter as Router, Match, Route, Switch } from 'react-router-dom';
import { Link } from 'react-router-dom';
// import { Router, Route } from 'react-router';



const styles = theme => ({
  root: {
    width: '20%',
    maxWidth: 360,
    backgroundColor: 'white',
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});


class Menu extends React.Component{
    constructor(props){
      super(props);

      let menus = [
        {
          name: "用户管理",
          route: "user",
          children:[{
                  name: "查询用户",
                  route: "user/queryUser"
              },{
                  name: "关联查询用户与对应权限",
                  route: "user/QueryUserAndPower"
              }]
        },{
            name: "模板管理",
            route: "template",
            /* children:[{
                name: "添加模板"
            },{
                name: "查询模板"
            }] */
        },{
            name: "设备管理",
            route: "equipment",
            /* children:[{
                name: "添加模板"
            },{
                name: "查询模板"
            }] */
        },{
            name: "订单管理",
            route: 'handleIndent',
            children:[{
                name: "添加订单",
                route: 'handleIndent/addIndent',
            }/*,{
                name: "查询订单",
                route: 'handleIndent/queryIndent',
            }*/,{
                name: "查询订单状态",
                route: 'handleIndent/queryIndentStatus',
            },{
                name: "导出生产信息",
                route: 'handleIndent/exportProduceIndent',
            }/*,{
                name: "导出所有订单生产信息",
                route: 'handleIndent/exportAllIndentInfo',
            }*/]
        },{
            name: "工时管理",
            route: 'workTime',
            children:[/*{
                name: "添加员工"
            },{
                name: "查询员工"
            },{
                name: "添加权数",
                route: 'workTime/addFactor',
            },*/{
                name: "查询权数",
                route: 'workTime/queryFactor',
            },{
                name: "订单工时",
                route: 'workTime/queryWorkTime',
            },{
                name: "流程工时",
                route: 'workTime/queryWorkTimeForProcedure',
            },{
                name: "员工工时",
                route: 'workTime/queryWorkTimeForUser',
            },{
                name: "设备工时",
                route: 'workTime/queryWorkTimeForEquipment',
            }/*,{
                name: "根据月份查询工时",
                route: 'workTime/queryWorkTimeByMonth',
            }*/]
        }/*,{
            name: "生产订单管理",
            route: 'produceIndent',
            children:[{
                name: "生产订单查询",
                route: 'produceIndent/queryProduceIndent'
            },{
                name: "根据货号查询订单",
                route: 'indent/queryIndentByProductNum'
            },{
                name: "根据订单号查询订单的详细生产情况",
                route: 'indent/queryIndentInfoByNum'
            },{
                name: "导出订单",
                route: 'produceIndent/exportProduceIndent'
            }]
        }*/,{
            name: "生产看板",
            route: "produceShowPage",
            /*children:[{
                name: "当前生产订单查询",
                route: "produceShowPage"
            }]*/
        },{
            name: "负责的订单操作（组长）",
            route: "dutyIndent",
            /*children:[{
                name: "查询负责的所有订单",
                route: "dutyIndent/listAllDutyIndent"
            },{
                name: "查询负责的未完成订单",
                route: "produceShowPage"
            }]*/
        },{
            name: "回收站",
            route: "recycle",
            children:[{
                name: "模板",
                route: "recycle/template"
            },{
                name: "设备",
                route: "recycle/equipment"
            },{
                name: "订单",
                route: "recycle/indent"
            }]
        },{
            name: "工作日历",
            route: "calendar"
        }
      ];

      this.state = {
        open: true,
        open0: false,
        open1: false,
        open2: false,
        open3: false,
        open4: false,
        open5: false,
        open6: false,
        menus: menus
      };


    }

    componentWillMount() {
      // console.log(this.props);
      this.changeMenuConfig();
    }

    componentDidMount() {
      // 如果没有记录，每次刷新页面进入第一，避免通过路由访问无权限的页面
      setTimeout(()=>{
        if(sessionStorage.path && sessionStorage.path.indexOf('login')==-1){
          window.ReactHistory.push(sessionStorage.path);
        }else{
          var ele = document.querySelectorAll('#leftMenu .nav-router')[0];
          if(ele) ele.click();
        }
      }, 500);


      window.onunload = function(e){
        e.returnValue = 'dfdf';
        var path = window.ReactHistory?window.ReactHistory.location.pathname:'';
        sessionStorage.path = path;

        alert(path);
        //var ele = document.querySelectorAll('#logout')[0];
        //if(ele) ele.click();
      }

    }

    componentWillUnmount(){
        // clearInterval(this.timerID);

    }

    changeMenuConfig = () =>{
      if(!this.props.menuConfig) return false;
      var userType = this.props.menuConfig.type;
      var menuConfig = this.props.menuConfig.power;
      // console.log('mmmmm===', menuConfig);
      // 匹配用户权限及功能模块展示
      this.state.menus[0].power = menuConfig.login;
      this.state.menus[1].power = menuConfig.handleTemplate;//模板
      this.state.menus[3].power = menuConfig.handleIndent;
      this.state.menus[4].power = menuConfig.handleWorkhour;
      this.state.menus[5].power = menuConfig.showpage;
      this.state.menus[6].power = menuConfig.captain;//组长

      if(userType == 1 || userType == 2){
        this.state.menus[2].power = true;
        this.state.menus[7].power = true;//回收站
        this.state.menus[8].power = true;//工作日历
      }else{
        this.state.menus[2].power = false;
        this.state.menus[7].power = false;//回收站
        this.state.menus[8].power = false;//工作日历
      }


      this.setState({menus: this.state.menus});
    }

    // 模块栏
    managerMenuData(datas) {
      var that = this;
      var path = window.ReactHistory?window.ReactHistory.location.pathname:'';
      return datas.map((data, index) =>(
        (data.power==0)?'':(<div key={index}>
                           <ListItem button className={new RegExp(data.route+'$').test(path)?'bg-secondary':''} onClick={this.handleClick.bind(this, data.children?'open'+index:'')}>
                                <Link to ={"/produceMSF/"+(data.route?data.route:'/')} className="nav-router">{data.name}</Link>
                               {data.children ?(that.state["open"+index] || new RegExp(data.route).test(path) ? <ExpandLess /> : <ExpandMore />):""}
                           </ListItem>
                              {data.children?(<Collapse in={this.state["open"+index] || new RegExp(data.route).test(path)} timeout="auto" unmountOnExit>
                              <List component="div" disablePadding className="secondaryList">
                               {that.managerMenuData(data.children)}
                              </List>
                           </Collapse>):''}
                        </div>)
        ))
    }



    handleClick(stateC, e){
      var that = this;
      e.preventDefault();
      // 选中样式切换
      /*var i_class = document.getElementsByClassName('bg-secondary')[0]?document.getElementsByClassName('bg-secondary')[0].className:false;

      if(i_class){
        document.getElementsByClassName('bg-secondary')[0].className = i_class.replace('bg-secondary', '');
      }
      e.target.parentNode.className += ' bg-secondary';*/

      switch(stateC) {
          case "open0":that.setState(state => ({ open0: !state.open0 }))
            break;
          case "open1":that.setState(state => ({ open1: !state.open1 }))
            break;
          case "open2":that.setState(state => ({ open2: !state.open2 }))
            break;
          case "open3":that.setState(state => ({ open3: !state.open3 }))
            break;
          case "open4":that.setState(state => ({ open4: !state.open4 }))
            break;
          case "open5":that.setState(state => ({ open5: !state.open5 }))
            break;
          case "open6":that.setState(state => ({ open6: !state.open6 }))
            break;
          default:let kk='';
      }
    }

    render() {
      // console.log(this.props);

      var { menus } = this.state;
      return  this.managerMenuData(menus);
    }
}

Menu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Menu);


{/*serviceWorker.unregister();*/}
