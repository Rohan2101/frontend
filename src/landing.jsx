// landing.js
import React, { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
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
    <div className="landing-page"> {/* Apply the landing-page class */}
      {/* <Header data={landingPageData.Header} /> */}
      <div className="app">
        {/* Full-width Cards */}
        <div className="full-width-card" style={{ backgroundImage: "url('/foodwaste_bin.jpeg')" }}>
          <div className="headline-container">
            <h1>Fight Food Waste</h1>
            <p className="subheadline">Check Out Our Top Picks below</p>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid-container">
          <div className="quarter" style={{ backgroundImage: "url('/inventory_landing.jpg')" }}>
            <h2>1. Manage Inventory</h2>
          </div>
          <div className="quarter" style={{ backgroundImage: "url('/expiry_landing.jpg')" }}>
            <h2>2. Track Expiry</h2>
          </div>
          <div className="quarter" style={{ backgroundImage: "url('/recipe_landing.jpg')" }}>
            <h2>3. Search Recipes</h2>
          </div>
          <div className="quarter" style={{ backgroundImage: "url('/analysis_landing.jpg')" }}>
            <h2>4. Check Your Behavior</h2>
          </div>
        </div>
      </div>
      {/* Include other components like Features, About, Services, Gallery, Testimonials, Team, Contact if needed */}
    </div>
  );
};

export default Landing;