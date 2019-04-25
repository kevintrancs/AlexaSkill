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
//import tileData from './tileData';

const styles = theme => ({
  root: {
    display: 'flex',
    width: '2500',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    flexWrap: 'nowrap',
    //width: 600,
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: 'translateZ(0)',
  },
  title: {
    color: theme.palette.primary.light,
  },
  titleBar: {
    background:
      'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
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
function getTileData(item) {
  var result = {
    id: item.id,
    img: item.thumbnail,
    title: item.name,
    description: item.description,
    provider: item.provider,
    category: item.category,
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

  favoriteButtonClicked(article, cat) {
    // dis works
    if (!this.state.favorited) {
      this.props.newBookmark(
        this.props.access,
        this.props.id,
        this.props.refresh,
        article
      );
      this.props.event(
        this.props.access,
        this.props.id,
        this.props.refresh,
        {
          article: article,
          favorited: 1,
          category: cat,
          liked: 0,
          disliked: 0,
          clicked: 0,
          searchVal: ''
        }
      );
    }
  }

  render() {
    const { classes } = this.props;
    const tileData = this.props.items.map(getTileData);
  
    return (
      <div className={classes.root}>
        <GridList className={classes.gridList} cellWidth={600} cols={2.5}>
          {tileData.map(tile => (
            <GridListTile key={tile.id} cols={.15}>
              <ListSubheader component="div">Because you read...</ListSubheader>
              <img src={tile.img} alt={tile.title} />
              <GridListTileBar
                title={tile.title}
                subtitle={tile.description}
                classes={{
                  root: classes.titleBar,
                  title: classes.title,
                }}
                actionIcon={
                  <IconButton>
                    <StarBorderIcon className={classes.title} onClick={this.favoriteButtonClicked.bind(this, tile.id, tile.category)} />
                  </IconButton>
                }
              />
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  items: state.items
});
const mapDispatchToProps = {};

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
