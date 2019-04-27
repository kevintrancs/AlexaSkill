import React, { Component } from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import { fetchCollabFilter } from '../../../actions/actions';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    //width: 600,
    //height: 550,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  gridHeader: {
    flexWrap: 'wrap'
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
  },
  list: {
    width: '100%',
    minWidth: 600,
    backgroundColor: theme.palette.background.paper
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
});

/**
 * The example data is structured as follows:
 *
 * import image from 'path/to/image.jpg';
 * [etc...]
 *
 * const tileData = [
 *   {
 *     img: image,
 *     title: 'Image',
 *     author: 'author',
 *   },
 *   {
 *     [etc...]
 *   },
 * ];
 */

function separateItems(item) {
  var result = {
    articleRead: item.name,
    otherArticles: item.articles
  }
  return result;
}


class SingleLineGridList extends Component {
  constructor(props) {
    super(props);
    // Tracking state of important clicked bools
    this.state = {
      liked: false,
      disliked: false,
      favorited: false
    };
  }

  componentDidMount() {
    this.props.getCollab();
  }



  render() {
    const { classes } = this.props;
    const section = this.props.items.map(separateItems);
  
    return (
      <div>
        <List style={{paddingTop: '100', paddingLeft: '300'}}>
        {section.map(item => (
          <ListItem key={item.articleRead}>
            <div className={classes.root}>
              <GridList className={classes.gridList} cols={2}>
                {item.otherArticles.map(tile => (
                  <GridListTile key={tile.id} cols={1}>
                    <img src={tile.thumbnail} alt={tile.name} />
                    <a href={tile.url} target="_blank">{tile.name}</a>
                    <GridListTileBar
                      title={tile.name}
                      subtitle={tile.description}
                      classes={{
                        root: classes.titleBar,
                        title: classes.title,
                      }}
                      actionIcon={
                        <IconButton>
                          <StarBorderIcon className={classes.title} />
                        </IconButton>
                      }
                    />
                  </GridListTile>
                ))}
              </GridList>
            </div>
          </ListItem>
        ))}
        </List>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  items: state.items
});
const mapDispatchToProps = {
  getCollab: fetchCollabFilter
};

SingleLineGridList.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles, { name: "SingleLineGridList" })
)(SingleLineGridList);
