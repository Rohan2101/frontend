// landing.js
import React, { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { Services } from "./components/services";
import { Gallery } from "./components/gallery";
import { Testimonials } from "./components/testimonials";
import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./landing.css";

export const Landing = () => {
  const [landingPageData, setLandingPageData] = useState({});
  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  return (
    <div className="app">
      <div className="full-width-card" style={{ backgroundImage: "url('/foodwaste_bin.jpeg')" }}>
        <div className="overlay">
          <div className="headline-container">
            <h1>Stop Wasting Food</h1>
            <h1>Save Money</h1>
          </div>
          <div className="button-container">
            <a href="/inventory" className="get-started-button">Get Started</a>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

  
      //   <div className="grid-container">
      //     <div className="quarter" style={{ backgroundImage: "url('/inventory_landing.jpg')" }}>
      //       <h2>Manage Food Inventory</h2>
      //     </div>
      //     <div className="quarter" style={{ backgroundImage: "url('/recipe_landing.jpg')" }}>
      //       <h2>Search Recipes</h2>
      //     </div>
      //     <div className="quarter" style={{ backgroundImage: "url('/expiry_landing.jpg')" }}>
      //       <h2>Expiry Reminder</h2>
      //     </div>
      //     <div className="quarter" style={{ backgroundImage: "url('/preservation_landing.jpg')" }}>
      //       <h2>Food Preservation Tips</h2>
      //     </div>
      //   </div>
      // </div>

