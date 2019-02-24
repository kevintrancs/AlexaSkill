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
import Divider from '@material-ui/core/Divider';

import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from '@material-ui/core/TextField';
import SettingsIcon from '@material-ui/icons/Settings'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { updateEmailWorker, updatePasswordWorker, loggingInWorker, loggedInWorker } from '../actions/actions';
import { connect } from 'react-redux';
import { compose } from 'redux';
import classNames from "classnames";
import {Auth} from 'aws-amplify';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    [theme.breakpoints.up(400 + theme.spacing.unit * 3)]: {
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 15,
    display: 'flex',
    flexDirection: 'column',
    padding: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 1}px ${theme.spacing.unit * 1}px`,
  },
  headerDiv: {
    display: 'flex',
    flexDirection: 'row',
  },
  headerText: {
    paddingTop: '15px'
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  nonAvatar: {
    margin: theme.spacing.unit*.6,
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    margin: theme.spacing.unit,
  },
  innerListItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  textField: {
    width: 300
  }
});

class Login extends Component {
    constructor(props){
        super(props);
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

    // Function to log the user in when they hit the form submit button.
    // Sets loggingIn to true if we want to render some loading thing,
    // Logs in, then sets loggedIn to true and loggingIn to false, then
    // pushes the home page to the history for rendering
    handleSubmit = async event => {
        event.preventDefault();

        try {
          this.props.loggingIn();
          await Auth.signIn(this.props.email, this.props.password);
          alert("Logged In");
          this.props.loggedIn();
          this.props.history.push('/');
        } catch (e) {
          alert(e.message);
        }
    }

    render() {
        const {classes, theme} = this.props;
        const { topics } = [ "Jeff Bezos", "Spokane Chiefs", "Russia", "SpaceX"];
        const { providers } = ["Associated Press", "The Washingtin Post", "TMZ", "The Daily Mail"];
        return (
            <main className={classes.main}>
              <CssBaseline />
              <Paper className={classes.paper}>
                <List>
                  <ListItem>
                  <div className={classes.headerDiv}>
                    <Avatar className={classes.avatar}>
                      <SettingsIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5" className={classes.headerText}>
                      Settings
                    </Typography>
                  </div>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <Typography variant='h6'>
                      Personal Settings
                    </Typography>
                  </ListItem>
                  <List>
                    <ListItem className={classes.innerListItem}>
                      <div>
                        <Typography variant='h8'>
                          First Name
                        </Typography>
                      </div>
                      <div>
                        <TextField disabled defaultValue="FirstNameHere" className={classes.textField} />
                        <Button color='primary'> EDIT </Button>
                      </div>
                    </ListItem>
                    <ListItem className={classes.innerListItem}>
                      <div>
                        <Typography variant='h8'>
                          Last Name
                        </Typography>
                      </div>
                      <div>
                        <TextField disabled defaultValue="LastNameHere" className={classes.textField} />
                        <Button color='primary'> EDIT </Button>
                      </div>
                    </ListItem>
                    <ListItem className={classes.innerListItem}>
                      <div>
                        <Typography variant='h8'>
                          Location
                        </Typography>
                      </div>
                      <div>
                        <TextField disabled defaultValue="JohnDoeCity, USA" className={classes.textField} />
                        <Button color='primary'> EDIT </Button>
                      </div>
                    </ListItem>
                  </List>
                  <Divider />
                  <ListItem>
                    <Typography variant='h6'>
                      Topic Subscriptions
                    </Typography>
                    <AddIcon className={classes.nonAvatar}/>
                  </ListItem>
                  <ListItem>
                    <List>
                      {
                        ["Jeff Bezos", 
                        "Spokane Chiefs", 
                        "Russia", 
                        "SpaceX"].map((text, index) => (
                          <ListItem key={text} className={classes.innerListitem}>
                            <CloseIcon className={classes.nonAvatar}/>
                            <Typography variant='h8'>
                              {text}
                            </Typography>
                          </ListItem>
                        ))
                      }
                    </List>
                  </ListItem>
                  < Divider />
                  <ListItem>
                    <Typography variant='h6'>
                      Provider Subscriptions
                    </Typography>
                    <AddIcon className={classes.nonAvatar}/>
                  </ListItem>
                  <ListItem>
                  <List>
                      {
                        ["Associated Press", 
                        "The Washingtin Post", 
                        "TMZ", 
                        "BBC"].map((text, index) => (
                          <ListItem key={text} className={classes.innerListitem}>
                            <CloseIcon className={classes.nonAvatar}/>
                            <Typography variant='h8'>
                              {text}
                            </Typography>
                          </ListItem>
                        ))
                      }
                    </List>
                  </ListItem>
                </List>
            </Paper>
          </main>
          );
    }

}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    email: state.email,
    password: state.password,
    isLoggedIn: state.loggedIn,
    isLoggingIn: state.loggingIn
});

const mapDispatchToProps = {
    putEmail: updateEmailWorker,
    putPassword: updatePasswordWorker,
    loggingIn: loggingInWorker,
    loggedIn: loggedInWorker
};

export default compose (
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withStyles(styles, { name: 'Login' })
)(Login);
