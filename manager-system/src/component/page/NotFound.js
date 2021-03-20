// 404
import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';


import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Snackbar from '@material-ui/core/Snackbar';
import config from '../config';



class NotFound extends React.Component {
  state = {

  };

  componentWillMount() {

  }




  tips = (msg) => {
    if(msg){
      this.setState({tipInfo:msg});
    }
    this.setState({tipsOpen: true});

    setTimeout(()=>{
      this.setState({tipsOpen: false});
    },4000);
  }


  render() {


    return (
        <Grid container>
          <Grid item xs = {12} className = "page404" style = {{background: 'url("404.png") -5vw -20vh / 100% no-repeat'}}>

          </Grid>
        </Grid>
    );
  }
}



export default NotFound;
