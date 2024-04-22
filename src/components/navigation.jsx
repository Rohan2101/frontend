import React from "react";
import logo from "../ProjectLogo.png"; // Import the image

export const Navigation = (props) => {
  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          {/* Container for the logo and text */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} style={{ width: '80px', height: '60px', marginRight: '0px' }} />
            <a className="navbar-brand page-scroll" href="/">
              Ecoeats
            </a>{" "}
          </div>
        </div>

        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="/inventory" >
                Inventory
              </a>
            </li>
            <li>
              <a href="/recipes" className="page-scroll">
              Recipes
              </a>
            </li>

            <li>
              <a href="/information" className="page-scroll">
              Information
              </a>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
