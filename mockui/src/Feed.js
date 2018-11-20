import React, { Component } from "react";
import "./App.css";
import {
  Row,
  Col,
  Card,
  CardTitle,
  CardBody,
  CardText,
  InputGroup,
  InputGroupAddon,
  Button,
  Input
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
    fetch("http://localhost:5000/api/category?field=US", headers)
      .then(results => results.json())
      .then(results => {
        this.setState({ items: results.found.Items });
      });
  }

  render() {
    return (
      <div>
        <InputGroup className="col-11 col-sm-5 center">
          <InputGroupAddon addonType="prepend">
            <Button>
              <i class="fa fa-search" />
            </Button>
          </InputGroupAddon>
          <Input placeholder="search" />
        </InputGroup>
        <ul className="listed">
          {this.state.items.map(function(item, index) {
            return <ContentItem item={item} key={index} />;
          })}
        </ul>
      </div>
    );
  }
}

const ContentItem = ({ item }) => (
  <Row className="ContentItem">
    <Col xs="3" />
    <Col xs="12" sm="6">
      <Card className="carded">
        <CardBody className="carded">
          <img
            align="left"
            alt=""
            width="100px"
            height="100px"
            src={item.thumbnail}
          />
          <a href={item.url} target="_blank">
            <CardTitle>{item.name}</CardTitle>{" "}
          </a>
          <CardText>{item.description}</CardText>
        </CardBody>
      </Card>
    </Col>
  </Row>
);

export default Feed;
