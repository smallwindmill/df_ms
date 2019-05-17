import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App';
import MessageBar from './component/Messagebar';
import Menu from './component/Menu';

import AddUser from './component/AddUser';
import QueryUser from './component/QueryUser';
import QueryUserAndPower from './component/QueryUserAndPower';


import * as serviceWorker from './serviceWorker';
// import { Router, Route, Link } from 'react-router';
import {BrowserRouter as Router, Match, Route, Switch } from 'react-router-dom';

import {createBrowserHistory} from 'history';


window.forceRender = () =>{
    ReactDOM.render(<App  />, document.getElementById('root'));
}

ReactDOM.render(<App  />, document.getElementById('root'));
// ReactDOM.render(<Router path=""  component={App} />, document.getElementById('root'));


/*var user = {name: "郑翟",  messageLength: "10" };
var classes = {button: "aaaaaaa"};

// 创建顶部通知栏
ReactDOM.render(<MessageBar user = {user}  classes = {classes} />, document.getElementById('messagebar'));*/

// 创建左侧菜单栏
// ReactDOM.render(<Menu  />, document.getElementById('leftMenu'));
/* ReactDOM.render(
<Router>
    <Route path="/"  component={Menu}/>
</Router>
, document.getElementById('leftMenu')); */


