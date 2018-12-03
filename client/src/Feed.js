import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
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
import Grid from "@material-ui/core/Grid";

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
    width: 250,
    padding: "4px"
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  }
});
class Feed extends Component {
  state = {
    open: true,
    items: []
  };

  componentDidMount() {
    this.getItems("US");
  }

  getSearch(event) {
    if (event.key === "Enter") {
      var value = event.target.value;
      if (value !== "") {
        var headers = {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
        };

        fetch("http://localhost:5000/api/search?field=" + value, headers)
          .then(results => results.json())
          .then(results => {
            console.log(results);
            this.setState({ items: results.found });
            console.log(this.state.items);
          });
      }
    }
  }

  parseHtmlEntities(str) {
    return str.name.replace(/&#([0-9]{1,3});/gi, function(match, numStr) {
      var num = parseInt(numStr, 10); // read num as normal number
      return String.fromCharCode(num);
    });
  }

  getItems(category) {
    var headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };
    fetch("http://localhost:5000/api/category?field=" + category, headers)
      .then(results => results.json())
      .then(results => {
        console.log(results);
        this.setState({ items: results.found });
        console.log(this.state.items);
      });
  }

  handleCategoryChange(category) {
    this.getItems(category);
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };
  render() {
    const { classes, theme } = this.props;
    const { open } = this.state;
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
      <div className={classes.root}>
        <CssBaseline />
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
            <Typography variant="h6" color="inherit" noWrap>
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
            <h3>Cool Logo Here</h3>
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
        <main
          className={classNames(classes.content, {
            [classes.contentShift]: open
          })}
        >
          <div className={classes.appBarSpacer} />
          <List className={classNames(classes.layout)}>
            {this.state.items.map(function(item, index) {
              // Dumb way to do it, but ay works will fix sometime eventually
              var x = item.name;
              var y = item.description;
              var i = document.createElement("div");
              var j = document.createElement("div");
              i.innerHTML = item.name;
              j.innerHTML = item.description;
              x = i.childNodes[0].nodeValue;
              y = j.childNodes[0].nodeValue;

              return (
                <ListItem key={item.name}>
                  <Card className={classes.card}>
                    <div className={classes.details}>
                      <CardContent className={classes.content}>
                        <Typography component="h5" variant="h5">
                          <a href={item.url} target="_blank">
                            {x}
                          </a>
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                          {y}
                        </Typography>
                      </CardContent>
                      <div className={classes.controls}>
                        <Typography variant="subtitle1" color="textSecondary">
                          Topic:
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                          {item.category}
                        </Typography>
                      </div>
                    </div>
                    <CardMedia
                      className={classes.cover}
                      image={item.thumbnail}
                      title="Live from space album cover"
                    />
                  </Card>
                </ListItem>
              );
            })}
          </List>
        </main>
      </div>
    );
  }
}
Feed.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Feed);
