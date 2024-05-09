import React from "react";
 
export const knowledge = () => {
    return (
        <div>
        <div className="toolbar">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src="applogo.png" alt="App Logo" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
            <span style={{ color: 'green', fontWeight: 'bold' }}>EcoEats</span>
          </div>
          <div className="toolbardiv">
          <button onClick={() => console.log("Recipes clicked")}>Recipes</button>
          <button onClick={() => console.log("Information clicked")}>Information</button>
          <button onClick={() => console.log("Recycling Agencies Clicked")}>Recycling Agencies</button>
          <button onClick={() => console.log("Check My Knowledge Clicked")}>Check My Knowledge</button>
          </div>
          <div></div>
        </div>
            <div className="App">
        
              <header>Inventory</header>
        <div>
            <h1>
                GeeksforGeeks is a Computer Science portal
                for geeks.
            </h1>
        </div>
        </div>
        </div>
    );
};
 
export default knowledge;