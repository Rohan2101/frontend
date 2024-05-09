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
              <a href="/">
                <img src={logo} style={{ width: '80px', height: '60px', marginRight: '0px', borderRadius: '50%', padding: '2px', boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.5)', transition: 'box-shadow 0.3s ease', cursor: 'pointer' }} onMouseOver={(e) => { e.currentTarget.style.boxShadow = '0px 0px 20px rgba(0, 0.2, 0.3, 0.8)' }} onMouseOut={(e) => { e.currentTarget.style.boxShadow = '0px 0px 3px rgba(0, 0, 0, 0.5)' }}/>
              </a>
              <a className="navbar-brand page-scroll" style={{ padding: '25px' }} href="/">
              Ecopalette
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
                Reminder
              </a>
            </li>

            <li>
              <a href="/tips" className="page-scroll"> 
                Tips
              </a>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
