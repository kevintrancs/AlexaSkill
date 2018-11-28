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
    fetch("http://localhost:5000/api/category?field=Politics", headers)
      .then(results => results.json())
      .then(results => {
        this.setState({ items: results.found.Items });
      });
  }

  render() {
    return (
      <div class="feed">

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
    <Col xs="2" />
    <Col xs="8" sm="8">
      <Card className="carded">
        
        <CardBody className="carded">
          <img
            align="right"
            alt=""
            width="125px"
            height="125px"
            src={item.thumbnail}
          />
          <a href={item.url} target="_blank">
            <CardTitle className="outlink">{item.name}</CardTitle>{" "}
          </a>
          <CardText>{item.description}</CardText>
          <div class="card-buttons">
            <div class="left">
                <Button size="lg">
                    View More Like This
                </Button>{' '}
            </div>
            <div class="right">
                <Button size="lg">
                    <i class="far fa-bookmark"></i>
                </Button>
                <Button size="lg">
                    <i class="fa fa-angle-up"/>
                </Button>
                <Button size="lg">
                    <i class="fa fa-angle-down"/>
                </Button>
            </div>

          </div>

        </CardBody>
      </Card>
    </Col>
  </Row>
);

export default Feed;
