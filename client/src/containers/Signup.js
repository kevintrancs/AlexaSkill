import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { updateEmailWorker, updatePasswordWorker, loggingInWorker, loggedInWorker, updatePasswordConfirmWorker } from '../actions/actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import classNames from "classnames";
import {Auth} from 'aws-amplify';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 15,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class Signup extends Component {
    constructor(props){
        super(props);

        this.state = { 
            needConfirm: false,
            isLoading: false,
            confirmCode: "",
            newUser: null
        };
    }

    // Functions to continually update username/password entered thus far
    handleEmailChange = event => {
        if(event.target.value !== ""){
            this.props.putEmail(event.target.value);
        }
    }
    handlePasswordChange = event => {
        if(event.target.value !== ""){
            this.props.putPassword(event.target.value);
        }
    }
    handlePasswordConfirmChange = event => {
        if(event.target.value !== ""){
            this.props.putPasswordConfirm(event.target.value);
        }
    }
    handleConfirmCodeChange = event => {
        if(event.target.value !== ""){
            this.setState ({ confirmCode: ""+event.target.value});
        }
    }


    // Simple function to make sure passwords match
    checkPassword(pass1, pass2){
        return pass1 === pass2;
    }


    
    handleSignupSubmit = async event => {
        event.preventDefault();
        alert(this.props.password);
        alert(this.props.passwordConfirm);
        if(this.checkPassword(this.props.password, this.props.passwordConfirm)){
            try {
                this.setState ({ isLoading: true });
                const newUser = await Auth.signUp({
                    username: this.props.email,
                    password: this.props.password
                });
                this.setState ({ newUser });
                this.setState ({ isLoading: false });
                this.setState({ needConfirm: true});
            } catch (e) {
                alert(e.message);
            }
        } else {
            alert("Passwords do not match, sry :/");
        }
    }

    handleConfirmSubmit = async event => {
        event.preventDefault();
        try {
            this.setState({ isLoading: true });

            await Auth.confirmSignUp(this.props.email, this.state.confirmCode);
            this.props.loggingIn();
            await Auth.signIn(this.props.email, this.props.password);
            this.props.loggedIn();
            this.props.history.push('/');
        } catch (e) {
            alert(e.message);
        }
    }

    renderSignupForm() {
        const {classes, theme } = this.props;
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
                <form className={classes.form} onSubmit={this.handleSignupSubmit}>
                  <FormControl
                    margin="normal"
                    required fullWidth
                    onChange={this.handleEmailChange}>
                    <InputLabel htmlFor="email">Email Address</InputLabel>
                    <Input id="email" name="email" autoComplete="email" autoFocus />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth onChange={this.handlePasswordChange}>
                    <InputLabel htmlFor="password">Password</InputLabel>
                    <Input name="password" type="password" id="password" autoComplete="current-password" />
                  </FormControl>
                  <FormControl margin="normal" required fullWidth onChange={this.handlePasswordConfirmChange}>
                    <InputLabel htmlFor="password">Confirm Password</InputLabel>
                    <Input name="password" type="password" id="passwordConfirm" autoComplete="current-password" />
                  </FormControl>
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

    renderConfirmForm() {
        const {classes, theme} = this.props;
        return (
            <main className={classes.main}>
              <CssBaseline />
              <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Check your email for confirm code
                </Typography>
                <form className={classes.form} onSubmit={this.handleConfirmSubmit}>
                  <FormControl
                    margin="normal"
                    required fullWidth
                    onChange={this.handleConfirmCodeChange}>
                    <InputLabel htmlFor="email">Confirmation Code</InputLabel>
                    <Input id="email" name="confirm" autoComplete="email" autoFocus />
                  </FormControl>
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

    render() {
        return (
            <div>
                {this.state.needConfirm ? this.renderConfirmForm() : this.renderSignupForm() }
            </div>
        );
    }

}

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    email: state.email,
    password: state.password,
    passwordConfirm: state.passwordConfirm,
    isLoggedIn: state.loggedIn,
    isLoggingIn: state.loggingIn
});

const mapDispatchToProps = {
    putEmail: updateEmailWorker,
    putPassword: updatePasswordWorker,
    putPasswordConfirm: updatePasswordConfirmWorker,
    loggingIn: loggingInWorker,
    loggedIn: loggedInWorker
};

export default compose (
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withStyles(styles, { name: 'Signup' })
)(Signup);
