import React, { Component } from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import {
  updateEmailWorker,
  updatePasswordWorker,
  fetchLogin
} from "../actions/actions";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 15,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

class Login extends Component {
  constructor(props) {
    super(props);
  }

  // Functions to continually update username/password entered thus far
  handleEmailChange = event => {
    if (event.target.value !== "") {
      this.props.putEmail(event.target.value);
    }
  };
  handlePasswordChange = event => {
    if (event.target.value !== "") {
      this.props.putPassword(event.target.value);
    }
  };

  // Function to log the user in when they hit the form submit button.
  // Sets loggingIn to true if we want to render some loading thing,
  // Logs in, then sets loggedIn to true and loggingIn to false, then
  // pushes the home page to the history for rendering
  handleSubmit = async event => {
    event.preventDefault();
    await this.props.getLogin(this.props.email, this.props.password);
    this.props.history.push("/");
  };

  render() {
    const { classes, theme } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit}>
            <FormControl
              margin="normal"
              required
              fullWidth
              onChange={this.handleEmailChange}
            >
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input id="email" name="email" autoComplete="email" autoFocus />
            </FormControl>
            <FormControl
              margin="normal"
              required
              fullWidth
              onChange={this.handlePasswordChange}
            >
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign in
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  email: state.email,
  password: state.password
});

const mapDispatchToProps = {
  putEmail: updateEmailWorker,
  putPassword: updatePasswordWorker,
  getLogin: fetchLogin
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles, { name: "Login" })
)(Login);
