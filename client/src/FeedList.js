// Todo: Clean up
import { compose } from "redux";
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
import CircularProgress from "@material-ui/core/CircularProgress";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Collapse from "@material-ui/core/Collapse";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import StarBorder from "@material-ui/icons/StarBorder";

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
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchInitFeed,
  fetchSerachFeed,
  fetchTopicFeed,
  closeDrawer,
  openDrawer,
  openList,
  closeList
} from "./actions/actions";
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
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  }
});
class FeedList extends Component {
  render() {
    const { classes, theme } = this.props;
    const { open, open_list } = this.props;
    return (
      <div>
        <List className={classNames(classes.layout)}>
          {this.props.items.map(function(item, index) {
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
                      <Typography component="h5" variant="h6">
                        <a href={item.url} target="_blank">
                          {x}
                        </a>
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        {y}
                      </Typography>
                    </CardContent>
                    <div className={classes.controls}>
                      <Typography
                        className={classes.addition_details}
                        variant="subtitle1"
                        color="primary"
                      >
                        {item.category}
                      </Typography>

                      <Typography
                        className={classes.addition_details}
                        variant="subtitle1"
                        color="secondary"
                      >
                        {item.provider}
                      </Typography>
                    </div>
                  </div>
                  <CardMedia
                    className={classes.cover}
                    image={
                      item.thumbnail !== " " ? item.thumbnail : "/clever.png"
                    }
                    title="Image"
                  />
                </Card>
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  loading: state.loading,
  open: state.open,
  items: state.items,
  open_list: state.open_list
});
const mapDispatchToProps = {
  getInit: fetchInitFeed,
  getSearch: fetchSerachFeed,
  getTopic: fetchTopicFeed,
  c: closeDrawer,
  o: openDrawer,
  cl: closeList,
  ol: openList
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles, { name: "FeedList" })
)(FeedList);
