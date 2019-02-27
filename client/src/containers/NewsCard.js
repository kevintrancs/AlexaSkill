import React, { Component } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import { compose } from "redux";
import { withStyles } from "@material-ui/core/styles";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import ThumbUpOutlinedIcon from "@material-ui/icons/ThumbUpOutlined";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownOutlinedIcon from "@material-ui/icons/ThumbDownOutlined";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined";
import StarIcon from "@material-ui/icons/Star";
import {
  fetchRelatedArticles
} from '../actions/actions'

import { fetchAddBookmarks } from "../actions/actions";
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
    marginLeft: -12,
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

  content: {
    flex: "1 0 auto"
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
  likeIcon: {
    display: "flex",
    alignItems: "right",
    justifyContent: "right",
    paddingLeft: theme.spacing.unit
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
    width: "95%",
    borderRadius: "2px",
    overflow: "hidden"
  },
  details: {
    display: "flex",
    flexDirection: "column",
    borderRadius: "2px",
    overflow: "hidden"
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

export var article_id = '';

class NewsCard extends Component {
  constructor(props) {
    super(props);
    // Tracking state of important clicked bools
    this.state = {
      liked: false,
      disliked: false,
      favorited: false
    };
  }

  likeButtonClicked = event => {
    if (!this.state.disliked) {
      this.setState({ liked: !this.state.liked });
    } else {
      this.setState({ liked: true, disliked: false });
    }
  };
  dislikeButtonClicked = event => {
    if (this.state.liked) {
      // If the article is liked, flip both
      this.setState({ disliked: true, liked: false });
    }
    // Otherwise, just flip disliked
    else {
      this.setState({ disliked: !this.state.disliked });
    }
  };
  favoriteButtonClicked(article) {
    // dis works
    if (!this.state.favorited) {
      this.props.newBookmark(
        this.props.access,
        this.props.id,
        this.props.refresh,
        article
      );
      console.log(article);
    }

    this.setState({ favorited: !this.state.favorited });
  }
  // Little function to add to a user's history. Replace alert
  // With whatever logic we need (supercedes redirect authority)
  articleClicked (e) {
    console.log("Link Clicked");
    //console.log(e)
    //this.props.store_id(e);
    article_id = e;
    console.log(article_id);
  };

  // Using props to pass on article information to each card
  // Doing this so we can track the liked/fav'd state of each card
  render() {
    const { classes, theme } = this.props;
    var item = this.props.item;
    var x = item.name;
    var y = item.description;
    var id = item.id;
    var i = document.createElement("div");
    var j = document.createElement("div");
    i.innerHTML = item.name;
    j.innerHTML = item.description;
    x = i.childNodes[0].nodeValue;
    y = j.childNodes[0].nodeValue;
    return (
      <Card className={classes.card}>
        <div className={classes.details}>
          <CardContent className={classes.content}>
            <Typography component="h5" variant="h6">
              <a href={item.url} target="_blank" onClick={this.articleClicked.bind(this, item.id)}>
                {x}
              </a>
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {y}
            </Typography>
          </CardContent>
          <div className={classes.controls}>
            <div>
              <Typography
                className={classes.addition_details}
                variant="subtitle1"
                color="primary"
                style={{ float: "left" }}
              >
                {item.category}
              </Typography>

              <Typography
                className={classes.addition_details}
                variant="subtitle1"
                color="secondary"
                style={{ float: "left" }}
              >
                {item.provider}
              </Typography>
            </div>
            <div>
              {this.state.liked ? (
                <ThumbUpIcon
                  className={classes.likeIcon}
                  onClick={this.likeButtonClicked}
                  style={{ float: "left" }}
                />
              ) : (
                <ThumbUpOutlinedIcon
                  className={classes.likeIcon}
                  onClick={this.likeButtonClicked}
                  style={{ float: "left" }}
                />
              )}
              {this.state.disliked ? (
                <ThumbDownIcon
                  className={classes.likeIcon}
                  onClick={this.dislikeButtonClicked}
                  style={{ float: "left" }}
                />
              ) : (
                <ThumbDownOutlinedIcon
                  className={classes.likeIcon}
                  onClick={this.dislikeButtonClicked}
                  style={{ float: "left" }}
                />
              )}
              {this.state.favorited ? (
                <StarIcon
                  className={classes.likeIcon}
                  onClick={this.favoriteButtonClicked.bind(this, id)}
                  style={{ float: "left" }}
                />
              ) : (
                <StarBorderOutlinedIcon
                  className={classes.likeIcon}
                  onClick={this.favoriteButtonClicked.bind(this, id)}
                  style={{ float: "left" }}
                />
              )}
            </div>
          </div>
        </div>
        <CardMedia
          className={classes.cover}
          image={item.thumbnail !== " " ? item.thumbnail : "/clever.png"}
          title="Image"
        />
      </Card>
    );
  }
}
const mapStateToProps = state => ({
  items: state.items,
  access: state.access,
  id: state.id,
  refresh: state.refresh
});
const mapDispatchToProps = {
  related: fetchRelatedArticles,
  newBookmark: fetchAddBookmarks
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles, { name: "NewsCard" })
)(NewsCard);
