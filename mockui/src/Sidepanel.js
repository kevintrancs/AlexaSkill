import React, { Component } from "react";
import { bubble as Menu } from "react-burger-menu";

class Sidepanel extends Component {
  render() {
    return (
      <Menu stack>
        <a className="menu-item" href="/">
          <i class="fa fa-exclamation-triangle" />
          <span> Breaking</span>
        </a>

        <a className="menu-item" href="">
          <i class="fa fa-newspaper-o" />
          <span> Trending News</span>
        </a>

        <a className="menu-item" href="">
          <i class="fa fa-user" aria-hidden="true" />
          <span> Personal</span>
        </a>

        <a className="menu-item" href="">
          <i class="fa fa-building" aria-hidden="true" />
          <span> Business</span>
        </a>

        <a className="menu-item" href="">
          <i class="fa fa-snowflake-o" aria-hidden="true" />
          <span> Politics</span>
        </a>

        <a className="menu-item" href="">
          <i class="fa fa-futbol-o" aria-hidden="true" />
          <span> Sports</span>
        </a>

        <a className="menu-item" href="">
          <i class="fa fa-film" aria-hidden="true" />
          <span> Entertainment</span>
        </a>

        <a className="menu-item" href="">
          <i class="fa fa-history" aria-hidden="true" />
          <span> History</span>
        </a>

        <a className="menu-item" href="">
          <i class="fa fa-bookmark" aria-hidden="true" />
          <span> Bookmarks</span>
        </a>

        <a className="menu-item" href="">
          <i class="fa fa-cog" aria-hidden="true" />
          <span> Settings</span>
        </a>
      </Menu>
    );
  }
}

export default Sidepanel;
