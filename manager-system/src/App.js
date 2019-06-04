import React from 'react';
import './App.css';


import {BrowserRouter as Router, Route } from 'react-router-dom';

import ContentContainer from './component/ContentContainer';



class App extends React.Component {
  constructor(props){
    super(props);
  }

  componentWillMount() {

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
