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
import { Link } from 'react-router-dom'
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
      this.menus = [
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
            route: "templete",
            /* children:[{
                name: "添加模板"
            },{
                name: "查询模板"
            }] */
        },{
            name: "订单管理",
            route: 'handleIndent/addIndent',
            children:[{
                name: "上传文件来添加订单",
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
            route: 'workTime/queryFactor',
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
                name: "查询工时",
                route: 'workTime/queryWorkTime',
            }/*,{
                name: "根据月份查询工时",
                route: 'workTime/queryWorkTimeByMonth',
            }*/]
        },{
            name: "生产订单管理",
            route: 'produceIndent/queryProduceIndent',
            children:[{
                name: "生产订单查询"/*"根据订单号查询订单"*/,
                route: 'produceIndent/queryProduceIndent'
            }/*,{
                name: "根据货号查询订单",
                route: 'indent/queryIndentByProductNum'
            },{
                name: "根据订单号查询订单的详细生产情况",
                route: 'indent/queryIndentInfoByNum'
            }*/,{
                name: "导出订单",
                route: 'produceIndent/exportProduceIndent'
            }]
        },{
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
        }
      ];

      this.state = {
        open0: true,
        open1: false,
        open2: false,
        open3: false,
        open4: false,
        open5: false,
        open6: false
      };


    }

    componentDidMount() {

    }

    componentWillUnmount(){
        // clearInterval(this.timerID);
    }

    managerMenuData(datas) {
      var that = this;
      return datas.map((data, index) =>(
        <div key={index}>
           <ListItem button onClick={this.handleClick.bind(this, data.children?'open'+index:'')}>
                <Link to ={"/"+(data.route?data.route:'/')}>{data.name}</Link>
               {data.children ?(that.state["open"+index] ? <ExpandLess /> : <ExpandMore />):""}
           </ListItem>
           {data.children?(<Collapse in={this.state["open"+index]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding className="secondaryList">
               {that.managerMenuData(data.children)}
              </List>
           </Collapse>):''}
        </div>))
    }



    handleClick(stateC, e){
      var that = this;
      e.preventDefault();
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
        return  this.managerMenuData(this.menus);
    }
}

Menu.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Menu);


{/*serviceWorker.unregister();*/}
