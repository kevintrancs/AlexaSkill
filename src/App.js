import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

// Each logical "route" has two components, one for
// the sidebar and one for the main area. We want to
// render both of them in different places when the
// path matches the current URL.
const routes = [
  {
    path: "/",
    exact: true,
	interest1: '',
	interest2: '',
	interest3: '',
    sidebar: () => <div>home!</div>,
    main(){
		return(
		  <div class="homepage">
		    <h2>Welcome to CleverNews!</h2>
		    <h5>Enter up to 3 topics of interest to you</h5>
			<div class="interests">
			  <input type="text" className="input" placeholder="Interest 1" style={{width: "700px"}}/>
			  <input type="text" className="input" placeholder="Interest 2" style={{width: "700px"}}/>
			  <input type="text" className="input" placeholder="Interest 3" style={{width: "700px"}}/>
			  <div class="submit">
			    <button type="submit" class="btn" style={{alignSelf: "center"}}>Enter</button>
			  </div>
			</div>
		  </div>
		);
	}
  },
  {
    path: "/feed",
    sidebar: () => <div>feed!</div>,
    main(){
		return(
		  <div class="feedpage">
		    <h2>Feed</h2>
			<div class="search-bar">
		      <input type="text" className="input" placeholder="Search for News" style={{width: "700px"}}/>
			  <button type="submit" class="btn">Enter</button>
			</div>
			<div class="article">
			  <img
			   src="https://cdn.vox-cdn.com/thumbor/V8epjvchDyx4rEAa5Xa70M_bTFY=/0x0:2992x1913/1520x1013/filters:focal(1141x610:1619x1088):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/62347400/usa_today_11673677.0.jpg"
			   />
			   <a href="https://www.slipperstillfits.com/2018/11/16/18099489/10-observations-from-gonzagas-win-over-texas-a-m">
			   10 Observations from Gonzaga's win over Texas A&M</a> 
			   <text> Nov 16, 2018</text>
			   <input type="checkbox"/>
			 </div>
		  </div>
		);
	}
  },
  {
	  path: "/bookmarks",
	  sidebar: () => <div>bookmarks!</div>,
	  main: () => <h2>Bookmarks</h2>
  },
  {
	  path: "/history",
	  sidebar: () => <div>history!</div>,
	  main: () => <h2>History</h2>
  },	  
  {
    path: "/settings",
    sidebar: () => <div>settings!</div>,
    main: () => <h2>Settings</h2>
  }
];

function SidebarExample() {
  //function updateInterests() {
	  
  //}
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <div
          style={{
            padding: "10px",
            width: "20%",
            background: "#f0f0f0"
          }}
        >
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/feed">Feed</Link>
            </li>
			<li>
			  <Link to="/bookmarks">Bookmarks</Link>
			</li>
			<li>
			  <Link to="/history">History</Link>
			</li>
            <li>
              <a href="/settings">Settings</a>
            </li>
          </ul>

          {routes.map((route, index) => (
            // You can render a <Route> in as many places
            // as you want in your app. It will render along
            // with any other <Route>s that also match the URL.
            // So, a sidebar or breadcrumbs or anything else
            // that requires you to render multiple things
            // in multiple places at the same URL is nothing
            // more than multiple <Route>s.
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.sidebar}
            />
          ))}
        </div>

        <div style={{ flex: 1, padding: "10px" }}>
          {routes.map((route, index) => (
            // Render more <Route>s with the same paths as
            // above, but different components this time.
            <Route
              key={index}
              path={route.path}
              exact={route.exact}
              component={route.main}
            />
          ))}
        </div>
      </div>
    </Router>
  );
}

export default SidebarExample;