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
                      <p className="bullets" key={index}>{point}</p>
                    ))}
                  </div>
                )}

                <Link
                  to="/inventory"
                  className="btn btn-custom btn-lg page-scroll"
                >
                  Explore
                </Link>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
