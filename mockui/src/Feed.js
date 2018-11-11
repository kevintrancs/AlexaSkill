import React, { Component } from "react";
import "./App.css";
import {
  Row,
  Col,
  Card,
  CardTitle,
  CardBody,
  CardText,
  CardImg
} from "reactstrap";

class Feed extends Component {
  constructor() {
    super();
    this.state = {
      items: []
    };
  }
  componentDidMount() {
    this.getItems();
  }

  getItems() {
    var headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    };
    fetch("http://localhost:8000/api/test/?category=US", headers)
      .then(results => results.json())
      .then(results => {
        this.setState({ items: results.Items });
      });
  }

  render() {
    return (
      <ul>
        {this.state.items.map(function(item, index) {
          return <ContentItem item={item} key={index} />;
        })}
      </ul>
    );
  }
}

const ContentItem = ({ item }) => (
  <Row className="ContentItem">
    <Col xs="3" />
    <Col xs="12" sm="6">
      <Card>
        <CardBody>
          <img
            align="left"
            alt=""
            width="100px"
            height="100px"
            src={item.thumbnail}
          />
          <CardTitle>{item.name}</CardTitle>
          <CardText>{item.description}</CardText>
        </CardBody>
      </Card>
    </Col>
  </Row>
);

export default Feed;
