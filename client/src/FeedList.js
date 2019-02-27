import { compose } from "redux";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import React, { Component } from "react";
import { connect } from "react-redux";
import NewsCard from "./containers/NewsCard";
const drawerWidth = 240;

const styles = theme => ({
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

  addition_details: {
    paddingLeft: theme.spacing.unit
  }
});
class FeedList extends Component {
  render() {
    const { classes, theme } = this.props;
    console.log(this.props.items);
    return (
      <div>
        <List className={classNames(classes.layout)}>
          {this.props.items.map(function(item, index) {
            // Dumb way to do it, but ay works will fix sometime eventually
            return (
              <ListItem key={item.name}>
                <NewsCard item={item} />
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  items: state.items
});
const mapDispatchToProps = {};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles, { name: "FeedList" })
)(FeedList);
