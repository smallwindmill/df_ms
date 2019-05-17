import React from 'react';
import './App.css';

import { withRouter } from 'react-router';
import {BrowserRouter as Router, Match, Route, Switch } from 'react-router-dom';


import Login from './component/Login';

import ContentContainer from './component/ContentContainer';


// function App() {



class App extends React.Component {
  constructor(props){
    super(props);
  }

  componentWillMount() {

  }

  state = {
   /* user:{name: localStorage.userName,  messageLength: localStorage.messageLength },
    classes:"fff gggg"*/
  }

  render() {
    return (
      <div className="App">
       <Router>
            <Route path="/"  component={ContentContainer} />
        </Router>
      </div>
    );
  }
}

export default App;
