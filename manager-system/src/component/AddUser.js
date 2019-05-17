import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});

const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
];

class AddUser extends React.Component {
  state = {
    name: 'Cat in the Hat',
    age: '',
    multiline: 'Controlled',
    currency: 'EUR',
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  render() {
    const { classes } = this.props;


    return (
      <form className={"absoluteCenter "+classes.container} noValidate autoComplete="off">
      <Grid container spacing={24}>
        <Grid item xs={12}>
        <TextField fullWidth
          label="用户工号"
          className={classes.textField}
          onChange={this.handleChange('name')}
          margin="normal"
        />
        </Grid>

        <Grid item xs={12}>
        <TextField fullWidth
          error
          label="用户姓名"
          defaultValue=""
          className={classes.textField}
          margin="normal"
        />
        </Grid>

        <Grid item xs={12}>
        <TextField fullWidth
          label="密码"
          className={classes.textField}
          type="password"
          autoComplete="current-password"
          margin="normal"
        />
        </Grid>

        <Grid item xs={12}>
          <Button variant="outlined" style={{marginRight: 1+"rem"}} color="primary" className={classes.button}>
          提交
          </Button>
          <Button variant="outlined" style={{marginRight: 1+"rem"}} color="secondary" className={classes.button}>
            重置
          </Button>
        </Grid>
        </Grid>

      </form>
    );
  }
}

AddUser.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(AddUser);
