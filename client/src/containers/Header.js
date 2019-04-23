import React, { Component } from "react";
import { withRouter } from "react-router";

import { compose } from "redux";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
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
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import { connect } from "react-redux";
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
  LocalHospital,
  FilterDrama
} from "@material-ui/icons";
import {
  fetchInitFeed,
  fetchSearchFeed,
  fetchTopicFeed,
  closeDrawer,
  openDrawer,
  loggedOutWorker,
  loggingOutWorker,
  openList,
  closeList,
  fetchRelatedArticles,
  fetchBookmarks,
  fetchLikes,
  fetchDislikes,
  fetchBookmarksFeed,
  fetchHistory
} from "../actions/actions";
import { article_id } from "./NewsCard";
import ReactGA from "react-ga";

ReactGA.initialize("UA-135499199-1", {
  gaOptions: {
    name: "HeaderTracker"
  }
});

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
    maxwidth: "30%",
    maxheight: "70%",
    width: "30%",
    height: "70%",
    marginRight: +drawerWidth / 5
  },
  addition_details: {
    paddingLeft: theme.spacing.unit
  },

  nested: {
    paddingLeft: theme.spacing.unit * 4
  }
});

class Header extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    selectedIndex: -1
  };

  getSearch(event) {
    if (event.key === "Enter") {
      this.props.getBookmarks(
        this.props.access,
        this.props.id,
        this.props.refresh
      );
      this.props.getLikes(this.props.access, this.props.id, this.props.refresh);
      this.props.getDislikes(
        this.props.access,
        this.props.id,
        this.props.refresh
      );
      var value = event.target.value;
      if (value !== "") {
        this.props.getSearch(value);
        ReactGA.event({
          category: "User",
          action: "Search",
          label: value
        });
      }
    }
  }

  handleCategoryChange(category, index) {
    this.props.getBookmarks(
      this.props.access,
      this.props.id,
      this.props.refresh
    );
    this.props.getLikes(this.props.access, this.props.id, this.props.refresh);
    this.props.getDislikes(
      this.props.access,
      this.props.id,
      this.props.refresh
    );
    this.setState({ selectedIndex: index });
    if (category === "Trending" || category === "Breaking") {
      this.props.getInit();
      ReactGA.event({
        category: "Category",
        action: "Trending/Breaking",
        value: index
      });
    } else if (category === "Bookmarks") {
      if (this.props.access !== "null" || this.props.access != null) {
        this.props.getBookmarks(
          this.props.access,
          this.props.id,
          this.props.refresh
        );
        this.props.getBookmarksFeed(
          this.props.access,
          this.props.id,
          this.props.refresh
        );
        console.log(this.props.bookmarks);
        ReactGA.event({
          category: "Bookmarks",
          action: "Go to bookmarks"
        });
      } else this.props.getInit();
    } else if (category === "History") {
      if (this.props.access !== "null" || this.props.access !== null) {
        this.props.getHistory(
          this.props.access,
          this.props.id,
          this.props.refresh
        );
      } else {
        this.props.getInit();
      }
    } else {
      this.props.getTopic(category);
      ReactGA.event({
        category: "Category",
        action: "Change category",
        label: category,
        value: index
      });
    }
  };
    // temp fix

  handleMlChange(id) {
    //this.setState({ selectedIndex: index });
    //let aid = this.props.storeArticleId
    console.log("article id ", article_id);
    console.log("id: ", id);
    this.props.getRelated(article_id);
    console.log("clicked ML tab");
  }

  handleDrawerOpen = () => {
    this.props.o();
    console.log("open triggered");
  };

  handleDrawerClose = () => {
    this.props.c();
    console.log("close triggered");
  };

  handleListOpen = () => {
    console.log(this.props.open_list);
    this.setState({ selectedIndex: 10 });

    if (this.props.open_list) {
      this.props.cl();
      console.log("list close triggered");
    } else {
      this.props.ol();
      console.log("list open triggered");
    }
  };

  // Temp log out we just clear local not actually logging out needed yet
  handleLogoutClick = async event => {
    localStorage.clear();
    this.props.loggingOut();
  };

  render(){
    const { classes, theme } = this.props;
    const { open, open_list } = this.props;
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
            <Typography
              variant="h6"
              color="inherit"
              noWrap
              component={Link}
              to="/"
            >
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
            {this.props.access === null || this.props.access === "null" ? (
              <div className="LoginButtons">
                <Button
                  className={"pull-right"}
                  color="inherit"
                  component={Link}
                  to="/login"
                >
                  Login!
                </Button>
                <Button
                  className={"pull-right"}
                  color="inherit"
                  component={Link}
                  to="/signup"
                >
                  Sign up!
                </Button>
              </div>
            ) : (
              <div>
                <Button onClick={this.handleLogoutClick} color="inherit">
                  Logout
                </Button>
                <Typography style={{ float: "left", paddingTop: "8px" }}>
                  {" "}
                  {this.props.email}{" "}
                </Typography>
              </div>
            )}
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
              "Bookmarks"
            ].map((text, index) => (
              <ListItem
                component={Link}
                to="/"
                button
                key={text}
                onClick={this.handleCategoryChange.bind(this, text, index)}
                selected={this.state.selectedIndex === index}
              >
                <ListItemIcon>{icons[index]}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
            <ListItem button key={"Settings"} component={Link} to="/settings">
              <ListItemIcon>{icons[icons.length - 1]}</ListItemIcon>
              <ListItemText primary={"Settings"} />
            </ListItem>
            <ListItem
              button
              key={"My News"}
              onClick={this.handleListOpen}
              selected={this.state.selectedIndex === 10}
            >
              <ListItemIcon>
                <FilterDrama />
              </ListItemIcon>
              <ListItemText primary="My News" />
              {open_list ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={open_list} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  button
                  className={classes.nested}
                  key={"ML1"}
                  onClick={this.handleMlChange.bind(this, article_id)}
                >
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText inset primary="ML 1" />
                </ListItem>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText inset primary="ML 2" />
                </ListItem>
                <ListItem button className={classes.nested}>
                  <ListItemIcon>
                    <StarBorder />
                  </ListItemIcon>
                  <ListItemText inset primary="ML 3" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </Drawer>
      </div>
    );
  }
}
Header.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  loading: state.loading,
  open: state.open,
  email: state.email,
  open_list: state.open_list,
  access: state.access,
  id: state.id,
  refresh: state.refresh,
  bookmarks: state.bookmarks
});

const mapDispatchToProps = {
  getInit: fetchInitFeed,
  getSearch: fetchSearchFeed,
  getTopic: fetchTopicFeed,
  getRelated: fetchRelatedArticles,
  c: closeDrawer,
  o: openDrawer,
  loggingOut: loggingOutWorker,
  loggedOut: loggedOutWorker,
  cl: closeList,
  ol: openList,
  getBookmarks: fetchBookmarks,
  getLikes: fetchLikes,
  getDislikes: fetchDislikes,
  getBookmarksFeed: fetchBookmarksFeed,
  getHistory: fetchHistory
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles, { name: "Header" })
)(Header);
