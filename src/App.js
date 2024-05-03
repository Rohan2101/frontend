import React, { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Contact } from "./components/contact";
import { Landing } from "./landing";
import { LoginPage } from "./LoginPage";
import SmoothScroll from "smooth-scroll";
import { Maininventory } from "./Pages/inventory";
import { Recipes } from "./Pages/Page/recipes";
import { Information } from "./Pages/Page/information";
import { Knowledge } from "./Pages/Page/knowledge";
import { Recycling } from "./Pages/Page/recycling";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is already logged in when component mounts
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    setLoggedIn(isLoggedIn);
  }, []);

  const handleLogin = (username, password) => {
    if (username === "admin" && password === "Random666#") {
      localStorage.setItem("loggedIn", "true"); // Store login state in localStorage
      setLoggedIn(true);
    } else {
      alert("Invalid username or password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedIn"); // Remove login state from localStorage
    setLoggedIn(false);
  };

  return (
    <Router>
      <Navigation loggedIn={loggedIn} onLogout={handleLogout} />
      <Routes>
        {!loggedIn && (
          <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
        )}
        {loggedIn && (
          <>
            <Route exact path="/" element={<Landing />} />
            <Route
              path="/inventory"
              element={
                <div style={{ width: "100%", height: "100%" }}>
                  <Maininventory />
                </div>
              }
            />
            <Route
              exact
              path="/recipes"
              element={
                <div style={{ width: "100%", height: "100%" }}>
                  <Recipes />
                </div>
              }
            />
            <Route
              exact
              path="/information"
              element={
                <div style={{ width: "100%", height: "100%" }}>
                  <Information />
                </div>
              }
            />
            <Route
              exact
              path="/knowledge"
              element={
                <div style={{ width: "100%", height: "100%" }}>
                  <Knowledge />
                </div>
              }
            />
            <Route
              exact
              path="/recycling"
              element={
                <div style={{ width: "100%", height: "100%" }}>
                  <Recycling />
                </div>
              }
            />
          </>
        )}
      </Routes>
      {loggedIn && <Contact />}
    </Router>
  );
}

export default App;

