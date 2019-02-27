import React, { Component } from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import SettingsIcon from "@material-ui/icons/Settings";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames";

const styles = theme => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    [theme.breakpoints.up(400 + theme.spacing.unit * 3)]: {
      width: 800,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 15,
    display: "flex",
    flexDirection: "column",
    padding: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 1}px ${theme
      .spacing.unit * 1}px`
  },
  headerDiv: {
    display: "flex",
    flexDirection: "row"
  },
  headerText: {
    paddingTop: "15px"
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  nonAvatar: {
    margin: theme.spacing.unit * 0.6
  },
  sectionHeader: {
    display: "flex",
    flexDirection: "row",
    margin: theme.spacing.unit
  },
  innerListItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  textField: {
    width: 300
  }
});

class Settings extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { classes, theme } = this.props;
    const { topics } = ["Jeff Bezos", "Spokane Chiefs", "Russia", "SpaceX"];
    const { providers } = [
      "Associated Press",
      "The Washingtin Post",
      "TMZ",
      "The Daily Mail"
    ];
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
                <Typography
                  component="h1"
                  variant="h5"
                  className={classes.headerText}
                >
                  Settings
                </Typography>
              </div>
            </ListItem>
            <Divider />
            <ListItem>
              <Typography variant="h6">Personal Settings</Typography>
            </ListItem>
            <List>
              <ListItem className={classes.innerListItem}>
                <div>
                  <Typography variant="h6">First Name</Typography>
                </div>
                <div>
                  <TextField
                    disabled
                    defaultValue="FirstNameHere"
                    className={classes.textField}
                  />
                  <Button color="primary"> EDIT </Button>
                </div>
              </ListItem>
              <ListItem className={classes.innerListItem}>
                <div>
                  <Typography variant="h6">Last Name</Typography>
                </div>
                <div>
                  <TextField
                    disabled
                    defaultValue="LastNameHere"
                    className={classes.textField}
                  />
                  <Button color="primary"> EDIT </Button>
                </div>
              </ListItem>
              <ListItem className={classes.innerListItem}>
                <div>
                  <Typography variant="h6">Location</Typography>
                </div>
                <div>
                  <TextField
                    disabled
                    defaultValue="JohnDoeCity, USA"
                    className={classes.textField}
                  />
                  <Button color="primary"> EDIT </Button>
                </div>
              </ListItem>
            </List>
            <Divider />
            <ListItem>
              <Typography variant="h6">Topic Subscriptions</Typography>
              <AddIcon className={classes.nonAvatar} />
            </ListItem>
            <ListItem>
              <List>
                {["Jeff Bezos", "Spokane Chiefs", "Russia", "SpaceX"].map(
                  (text, index) => (
                    <ListItem key={text} className={classes.innerListitem}>
                      <CloseIcon className={classes.nonAvatar} />
                      <Typography variant="h6">{text}</Typography>
                    </ListItem>
                  )
                )}
              </List>
            </ListItem>
            <Divider />
            <ListItem>
              <Typography variant="h6">Provider Subscriptions</Typography>
              <AddIcon className={classes.nonAvatar} />
            </ListItem>
            <ListItem>
              <List>
                {["Associated Press", "The Washingtin Post", "TMZ", "BBC"].map(
                  (text, index) => (
                    <ListItem key={text} className={classes.innerListitem}>
                      <CloseIcon className={classes.nonAvatar} />
                      <Typography variant="h6">{text}</Typography>
                    </ListItem>
                  )
                )}
              </List>
            </ListItem>
          </List>
        </Paper>
      </main>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  email: state.email
});

const mapDispatchToProps = {};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles, { name: "Settings" })
)(Settings);
