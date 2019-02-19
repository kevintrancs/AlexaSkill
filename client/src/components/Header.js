import React, {Component} from 'react';
import { compose } from "redux";
import PropTypes from "prop-types";
import classNames from "classnames";
import {Link} from 'react-router-dom';


import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import { fade } from "@material-ui/core/styles/colorManipulator";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from '@material-ui/core/Button';
import {
  Report,
  TrendingUp,
  Business,
  EventSeat,
  Motorcycle,
  Event,
  History,
  Bookmark,
  Settings,
  LocalHospital
} from "@material-ui/icons";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { connect } from "react-redux";
import {
  fetchInitFeed,
  fetchSearchFeed,
  fetchTopicFeed,
  closeDrawer,
  openDrawer,
  loggedOutWorker,
  loggingOutWorker
} from "../actions/actions";
import { MenuItem } from '@material-ui/core';
import { Auth } from 'aws-amplify';
const drawerWidth = 240;

const styles = theme => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
    height: "100vh",
    overflow: "auto",
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit * 3,
      width: "auto"
    }
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: 200
    }
  },
  layout: {
    width: 1500,
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 1100,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  list: {
    minWidth: 1500,
    marginLeft: "auto"
  },
  appBarSpacer: theme.mixins.toolbar,
  card: {
    display: "flex",
    width: "90%",
    borderRadius: "2px",
    overflow: "hidden"
  },
  details: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "2px",
    overflow: "hidden"
  },
  content: {
    flex: "1 0 auto"
  },
  cover: {
    width: "30%",
    maxwidth: "30%",
    padding: "4px"
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  logo: {
    maxwidth: "10%",
    maxheight: "10%",
    width: "30%",
    height: "10%",
    marginRight: +drawerWidth / 5
  },
  addition_details: {
    paddingLeft: theme.spacing.unit
  }
});

class Header extends Component {
    constructor(props){
        super(props);
    }

    getSearch(event) {
        if(event.key === "Enter"){
            var value = event.target.value;
            if(value !== ""){
                this.props.getSearch(value);
            }
        }
    }

    
    handleCategoryChange(category) {
        if (category === "Trending" || category === "Breaking") {
            this.props.getInit();
        } else {
            this.props.getTopic(category);
        }
    }

    handleDrawerOpen = () => {
        this.props.o();
        console.log("open triggered");
    };

    handleDrawerClose = () => {
        this.props.c();
        console.log("close triggered");
    };


    // I'm handling the logout click in the header since there's no forms to
    // worry about, and it's fairly simply. Tgod for redux tbh
    handleLogoutClick = async event => {
      try {
        this.props.loggingOut();
        await Auth.signOut();
        alert("Logged out Successfully");
        this.props.loggedOut();
      } catch (e) {
        alert(e);
      }
    }

    render(){
        const {classes, theme } = this.props;
        const {open} = this.props;
        const icons = [
            <Report />,
            <TrendingUp />,
            <Business />,
            <EventSeat />,
            <Motorcycle />,
            <Event />,
            <LocalHospital />,
            <History />,
            <Bookmark />,
            <Settings />
        ];
        

        return (
        <div>
            <AppBar
          position="absolute"
          className={classNames(classes.appBar, {
            [classes.appBarShift]: open
          })}
        >
          <Toolbar disableGutters={!open}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              onClick={this.handleDrawerOpen}
              className={classNames(classes.menuButton, open && classes.hide)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" noWrap component={Link} to='/'>
              CleverNews
            </Typography>
            <div className={classes.search}>
              <div className={classes.searchIcon}>
                <SearchIcon />
              </div>
              <InputBase
                placeholder="Search…"
                onKeyPress={this.getSearch.bind(this)}
                classes={{
                  root: classes.inputRoot,
                  input: classes.inputInput
                }}
              />
            </div>
            <div>
              {" "}
              {this.props.loading ? (
                <CircularProgress
                  className={classes.progress}
                  color="secondary"
                />
              ) : (
                " "
              )}
            </div>
            {
              !this.props.loggedIn ? 
              <div className = "LoginButtons">
                <Button className={'pull-right'} color='inherit' component={Link} to='/login'>Login!</Button>
                <Button className={'pull-right'} color='inherit' component={Link} to='/signup'>Sign up!</Button>
              </div>
              :
              <div>
                <Button onClick={this.handleLogoutClick} color = 'inherit'>Logout</Button>
                <Typography> {this.props.email} </Typography>
              </div>
            }
          </Toolbar>
        </AppBar>
        <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
            paper: classes.drawerPaper
        }}
        >
        <div className={classes.drawerHeader}>
            <img className={classes.logo} src="/clever.png" />
            <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon />
            </IconButton>
        </div>
        <Divider />
        <List>
            {[
            "Breaking",
            "Trending",
            "Business",
            "Politics",
            "Sports",
            "Entertainment",
            "Health",
            "History",
            "Bookmarks",
            "Settings"
            ].map((text, index) => (
            <ListItem
                button
                key={text}
                onClick={this.handleCategoryChange.bind(this, text)}
            >
                <ListItemIcon>{icons[index]}</ListItemIcon>
                <ListItemText primary={text} />
            </ListItem>
            ))}
        </List>
        </Drawer>
        </div>
        )
    }
}

Header.PropTypes = {
    classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    loading: state.loading,
    open: state.open,
    email: state.email,
    loggedIn: state.loggedIn,
    loggingIn: state.loggingIn
});

const mapDispatchToProps = {
    getInit: fetchInitFeed,
    getSearch: fetchSearchFeed,
    getTopic: fetchTopicFeed,
    c: closeDrawer,
    o: openDrawer,
    loggingOut: loggingOutWorker,
    loggedOut: loggedOutWorker
};

export default compose(
    connect(
        mapStateToProps,
        mapDispatchToProps
    ),
    withStyles(styles, { name: 'Feed'})
)(Header);