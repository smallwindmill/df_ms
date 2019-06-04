import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import App from './App';


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


