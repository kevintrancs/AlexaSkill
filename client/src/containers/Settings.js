import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({});
class Settings extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { classes, theme } = this.props;

    return <div>HOWDY NEED TO DO</div>;
  }
}
Settings.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withStyles(styles, { name: "Settings" })
)(Settings);
