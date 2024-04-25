import React from "react";
import { Link } from 'react-router-dom';

export const Header = (props) => {
  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
  <p>{props.data ? props.data.paragraph : "Loading"}</p>
{props.data && props.data.bulletPoints && (
  <div>
    {props.data.bulletPoints.map((point, index) => (
      <div key={index}>
        <p className="bullets">{point}</p>
        {/* Render a button after each bullet point */}
        {index === 0 && (
          <Link
            to="/inventory"
            className="btn btn-custom btn-lg page-scroll"
          >
            Explore Inventory
          </Link>
        )}
        {index === 1 && (
          <Link
            to="/inventory"
            className="btn btn-custom btn-lg page-scroll"
          >
            Learn More
          </Link>
        )}
        {index === 2 && (
          <Link
            to="/recipes"
            className="btn btn-custom btn-lg page-scroll"
          >
            Discover Recipes
          </Link>
        )}
        {/* Add more conditions for additional bullet points */}
      </div>
    ))}
  </div>
)}



              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
